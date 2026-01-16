import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

async function run() {
    // Get API Key
    let apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        try {
            const envPath = path.resolve(process.cwd(), ".env.local");
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, "utf-8");
                const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
                if (match && match[1]) apiKey = match[1].trim();
            }
        } catch (e) { }
    }

    if (!apiKey) {
        console.error("No API Key found");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // There isn't a direct "genAI.listModels()" on the main class in the Node SDK cleanly exposed sometimes,
    // but checking the documentation or trying a known method implies using the ModelManager if accessible,
    // or we can just try to execute a raw fetch if needed, BUT current SDK usually doesn't expose listModels on the top level client easily.
    // However, recent versions DO have it on the GoogleGenerativeAI instance properties possibly?
    // Actually, it's usually via `genAI.getGenerativeModel` directly.

    // Let's try to fetch via REST API to be 100% sure what the server sees.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    console.log("Fetching models from:", url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log("No models returned or error:", data);
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

run();
