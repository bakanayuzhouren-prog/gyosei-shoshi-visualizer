import { GoogleGenAI, Schema, Type } from "@google/generative-ai";
import { DiagramResponse } from "../types";

// Schema definition for structured output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise title for the legal concept or case study.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief, easy-to-understand summary of the concept (approx. 2-3 sentences).",
    },
    mermaidCode: {
      type: Type.STRING,
      description: "Valid Mermaid.js code (graph TD, sequenceDiagram, or stateDiagram-v2) that visualizes the relationship, process, or logic. Do NOT include ```mermaid tags.",
    },
    keyPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          point: { type: Type.STRING, description: "The main keyword or concept." },
          explanation: { type: Type.STRING, description: "A short explanation of why this point matters for the exam." },
        },
        required: ["point", "explanation"],
      },
    },
  },
  required: ["title", "summary", "mermaidCode", "keyPoints"],
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

  // Initialize GoogleGenAI with the API key string properly
  const genAI = new GoogleGenAI(apiKey);

  const systemInstruction = `
    You are an expert tutor for the Japanese Administrative Scrivener (Gyosei Shoshi) Exam.
    Your goal is to take legal texts, study notes, or case studies and convert them into clear, visual diagrams (Mermaid.js) and structured summaries.
    
    GUIDELINES:
    1. Focus on relationships (Plaintiff vs. Defendant, Government Agency vs. Citizen).
    2. Simplify complex legal phrasing into exam-relevant keywords.
    3. For the Mermaid diagram:
       - Use 'graph TD' (Top-Down) for hierarchies or processes.
       - Use 'sequenceDiagram' for time-based administrative procedures (e.g., permit application steps).
       - Use 'stateDiagram-v2' for status changes (e.g., valid -> void -> cancelled).
       - Ensure standard ASCII characters are used for node IDs to prevent syntax errors, but use Japanese for labels (e.g., A["申請者"]).
       - Style the nodes to be readable.
    4. If the input is an image of handwriting, transcribe the intent accurately before generating the diagram.
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

    // Use gemini-1.5-flash for stability and quota limits
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      },
    });

    const result = await model.generateContent(parts);
    const responseText = result.response.text();

    if (responseText) {
      return JSON.parse(responseText) as DiagramResponse;
    } else {
      throw new Error("No response text generated.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};