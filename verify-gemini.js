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

async function testConnection() {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("❌ API Key not found");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Use the standard model name
    const modelName = "gemini-1.5-flash";
    console.log(`Testing model: ${modelName}...`);

    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log(`✅ Success! Response: ${result.response.text()}`);
    } catch (error) {
        console.error(`❌ Failed: ${error.message}`);
        if (error.response) {
            console.error("Details:", JSON.stringify(error.response, null, 2));
        }
    }
}

testConnection();
