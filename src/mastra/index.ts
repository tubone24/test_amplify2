import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Mastra } from "@mastra/core";
import { createAssistantAgent } from "./agents/assistantAgent";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, "..", "..", ".env");
const envResult = dotenv.config({ path: envPath });

let mastraInstance: Mastra | null = null;

export const getMastra = async () => {
  if (!mastraInstance) {
    const assistantAgent = await createAssistantAgent();
    mastraInstance = new Mastra({
      agents: { assistantAgent },
    });
  }
  return mastraInstance;
};
