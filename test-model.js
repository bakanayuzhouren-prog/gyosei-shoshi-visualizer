import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // Note: listModels is not directly available on genAI instance in some versions,
        // but let's try to get a model and inspect or use a known endpoint if needed.
        // Actually, for the node SDK, usually it's genAI.getGenerativeModel... 
        // but looking at documentation, there might not be a direct listModels method exposed plainly in the simplest way
        // without using the specific ModelManager or similar if available.
        // However, let's try a simple generation with a very basic model to see if AUTH works,
        // and print the error which might contain available models if it fails.

        // Better yet, let's try to use the model that IS supported.
        // If 'gemini-1.5-flash' fails, maybe 'gemini-pro' works?

        console.log("Testing with gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash:", result.response.text());

    } catch (error: any) {
        console.error("Error details:", error.message);
        if (error.response) {
            console.error("Response:", JSON.stringify(error.response, null, 2));
        }
    }
}

listModels();
