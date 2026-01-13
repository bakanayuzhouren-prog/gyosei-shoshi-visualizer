import { GoogleGenAI, Type, Schema } from "@google/genai";
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
  // Always use process.env.API_KEY directly in constructor
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

    // Use gemini-3-flash-preview for both text and multimodal inputs.
    // This model supports responseSchema which is required for our structured output.
    // gemini-2.5-flash-image does not support responseSchema.
    const modelName = "gemini-3-flash-preview";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, 
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as DiagramResponse;
    } else {
      throw new Error("No response text generated.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};