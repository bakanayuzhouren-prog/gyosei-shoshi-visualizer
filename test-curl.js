import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import process from 'process';

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

const key = getApiKey();
if (!key) {
    console.error("No key found");
    process.exit(1);
}

// Windows curl format
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash?key=${key}`;
console.log("Testing URL with curl...");
try {
    // using curl directly
    execSync(`curl -v "${url}"`, { stdio: 'inherit' });
} catch (e) {
    console.log("Curl failed/finished with error code");
}
