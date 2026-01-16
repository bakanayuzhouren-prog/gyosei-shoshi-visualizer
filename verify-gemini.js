import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

function getApiKey() {
    try {
        const envPath = path.resolve(process.cwd(), ".env.local");
        const envContent = fs.readFileSync(envPath, "utf-8");
        const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
        if (match && match[1]) {
            return match[1].trim();
        }
        return null;
    } catch (err) {
        return null;
    }
}

const modelsToTest = [
    "gemini-flash-latest"
];

async function testConnection() {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("❌ API Key not found");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of modelsToTest) {
        console.log(`Testing model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            console.log(`✅ Success with ${modelName}! Response: ${result.response.text()}`);
            return; // Stop on first success
        } catch (error) {
            console.error(`❌ Failed with ${modelName}: ${error.message} `);
        }
    }
    console.log("All models failed.");
}

testConnection();
