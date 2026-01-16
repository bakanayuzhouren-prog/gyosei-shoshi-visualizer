import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";
import { DiagramResponse } from "../types";

// Schema definition for structured output
const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    title: {
      type: SchemaType.STRING,
      description: "A concise title in Japanese (日本語のタイトル).",
    },
    summary: {
      type: SchemaType.STRING,
      description: "A brief, easy-to-understand summary in Japanese (日本語で2-3文の要約).",
    },
    mermaidCode: {
      type: SchemaType.STRING,
      description: "Valid Mermaid.js code. Node labels MUST be in Japanese.",
    },
    keyPoints: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          point: { type: SchemaType.STRING, description: "The main keyword or concept in Japanese (日本語のキーワード)." },
          explanation: { type: SchemaType.STRING, description: "A short explanation in Japanese (日本語の解説)." },
        },
        required: ["point", "explanation"],
      },
    },
  },
  required: ["title", "summary", "mermaidCode", "keyPoints"],
};

const generateWithRetry = async (model: any, parts: any[], retries = 3, delay = 2000): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(parts);
    } catch (error: any) {
      const isQuotaError = error.message?.includes("429") || error.message?.includes("Quota exceeded");
      const isServerOverload = error.message?.includes("503");

      if (i < retries - 1 && (isQuotaError || isServerOverload)) {
        console.warn(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
};

export const generateDiagram = async (
  text: string,
  imageBase64?: string
): Promise<DiagramResponse> => {
  // Try to get API key from various sources, prioritizing VITE_ prefix
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_API_KEY ||
    process.env.API_KEY ||
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please set VITE_GEMINI_API_KEY in Vercel environment variables.");
  }

  // Initialize GoogleGenerativeAI with the API key string properly
  const genAI = new GoogleGenerativeAI(apiKey);

  const systemInstruction = `
    You are an expert tutor for the Japanese Administrative Scrivener (Gyosei Shoshi) Exam.
    Your goal is to take legal texts, study notes, or case studies and convert them into clear, visual diagrams (Mermaid.js) and structured summaries IN JAPANESE.
    
    GUIDELINES:
    1. **LANGUAGE**: 
       - Title, Summary, Explanations, and **Node Labels** MUST be in JAPANESE.
       - **Node IDs** and Mermaid syntax keywords MUST be in ENGLISH (ASCII).
    2. Focus on relationships (Plaintiff vs. Defendant, Government Agency vs. Citizen).
    3. Simplify complex legal phrasing into exam-relevant keywords.
    4. For the Mermaid diagram:
       - Use 'graph TD' (Top-Down) for hierarchies or processes.
       - Use 'sequenceDiagram' for time-based administrative procedures (e.g., permit application steps).
       - Use 'stateDiagram-v2' for status changes (e.g., valid -> void -> cancelled).
       - **CRITICAL**: Use ONLY Roman alphabets and numbers for Node IDs (e.g., A, B1, NodeX). NO Japanese or spaces in IDs.
       - Correct: node1["行政庁"] --> node2["処分"]
       - Incorrect: 行政庁 --> 処分
       - **AVOID using 'subgraph'**. It causes errors. Use simple connections only.
       - Style the nodes to be readable.
    5. If the input is an image of handwriting, transcribe the intent accurately before generating the diagram.
    6. Output CLEAN Mermaid code.
  `;

  try {
    const parts: any[] = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      });
      parts.push({
        text: text ? `Analyze this image of notes and the following text: ${text}` : "Analyze this image of notes.",
      });
    } else {
      parts.push({ text });
    }

    // Use gemini-flash-latest to likely target the most stable current flash model
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      },
    });

    const result = await generateWithRetry(model, parts);
    const responseText = result.response.text();

    if (responseText) {
      const parsedResponse = JSON.parse(responseText) as DiagramResponse;

      // Safety: Remove markdown code block syntax if the AI included it despite instructions
      if (parsedResponse.mermaidCode) {
        parsedResponse.mermaidCode = parsedResponse.mermaidCode
          .replace(/```mermaid/g, '')
          .replace(/```/g, '')
          .trim();
      }

      return parsedResponse;
    } else {
      throw new Error("No response text generated.");
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    if (error.message?.includes("429") || error.message?.includes("Quota exceeded")) {
      throw new Error("Gemini APIの利用制限に達しました。自動再試行も失敗しました。数分待ってから再度お試しください。");
    }

    if (error.message?.includes("503")) {
      throw new Error("Gemini APIが一時的に混雑しています。自動再試行も失敗しました。しばらくしてから再度お試しください。");
    }

    throw error;
  }
};