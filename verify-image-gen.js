import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
// Manual env reading
function getApiKey() {
    try {
        const envPath = path.resolve(process.cwd(), ".env.local");
        const envContent = fs.readFileSync(envPath, "utf-8");
        const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
        if (match && match[1]) return match[1].trim();
    } catch (e) { }
    return process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
}

// Path to the user's uploaded image
const imagePath = "C:/Users/teras/.gemini/antigravity/brain/57134bbf-7c96-421f-8db3-034f0c5be78d/uploaded_image_1768559897487.jpg";

async function run() {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("No API Key found");
        return;
    }

    if (!fs.existsSync(imagePath)) {
        console.error("Image file not found at:", imagePath);
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-flash-lite-latest" // The working model
    });

    // Read image as base64
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    const prompt = `
    This is a handwritten note or text about Civil Law (Third Party Opposition).
    Please analyze it and generate a Mermaid diagram code.
    Return ONLY the mermaid code or the JSON structure as the app expects.
    `;

    console.log("Analyzing image...");

    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        console.log("\n--- Generated Response ---");
        console.log(result.response.text());
        console.log("--------------------------");
        console.log("✅ Image analysis successful!");

    } catch (e) {
        console.error("❌ Generation failed:", e.message);
    }
}

run();
