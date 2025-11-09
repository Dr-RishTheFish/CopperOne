import { ChatMessage, PennyResponse, ModelId } from "../types/penny";

const SYSTEM_PROMPT = `You are "Penny", a friendly, kid-safe banking tutor for a family banking app.

Audience: kids and teens; keep language simple, positive, and respectful.

Safety: never request sensitive data (SSNs, card #, passwords, PINs, DOB, address).

Scope: explain money basics, budgeting, spending, saving, allowances, chores, goals.

Tone: brief, concrete, encouraging; use short sentences and simple words.

Structure your answer STRICTLY as a single JSON object with keys:
{
  "reply": string,
  "keyPoints": string[],
  "examples": string[],
  "relatedTopics": string[],
  "actionSuggestions": string[],
  "blocked": boolean
}

No code fences. No extra text outside the JSON. If a topic is unsafe, set "blocked": true and steer to safe money lessons.`;

const OLLAMA_BASE_URL = process.env.REACT_APP_OLLAMA_URL || "http://localhost:11434";
const DEFAULT_MODEL = "llama3.2:3b";

const MODEL_MAP: Record<ModelId, string> = {
  "Llama-3.2-3B-Instruct-q4f32_1-MLC": "llama3.2:3b",
  "Phi-3-mini-4k-instruct-q4f32_1-MLC": "phi3:mini",
};

export function sanitizeInput(text: string): string {
  let sanitized = text;
  
  // Redact card numbers
  sanitized = sanitized.replace(/\b\d{12,19}\b/g, "[possible card number]");
  sanitized = sanitized.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[possible card number]");
  
  // Redact SSN pattern
  sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[possible SSN]");
  
  // Redact 4-digit PINs (but not years or times)
  sanitized = sanitized.replace(/\b\d{4}\b/g, (match, offset, string) => {
    const before = string.substring(Math.max(0, offset - 10), offset);
    const after = string.substring(offset + match.length, Math.min(string.length, offset + match.length + 10));
    const context = (before + match + after).toLowerCase();
    
    if (context.match(/\b(19|20)\d{2}\b/) || context.match(/\d{1,2}:\d{2}/)) {
      return match;
    }
    return "[possible PIN]";
  });
  
  return sanitized;
}

function parsePennyResponse(text: string): PennyResponse {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      if (typeof parsed.reply === "string") {
        return {
          reply: parsed.reply || "I'm here to help with money questions!",
          keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
          examples: Array.isArray(parsed.examples) ? parsed.examples : [],
          relatedTopics: Array.isArray(parsed.relatedTopics) ? parsed.relatedTopics : [],
          actionSuggestions: Array.isArray(parsed.actionSuggestions) ? parsed.actionSuggestions : [],
          blocked: parsed.blocked === true,
        };
      }
    }
  } catch (e) {
    console.warn("Failed to parse JSON response:", e);
  }
  
  return {
    reply: text.trim() || "I'm here to help with money questions!",
    keyPoints: [],
    examples: [],
    relatedTopics: [],
    actionSuggestions: [],
    blocked: false,
  };
}

export async function checkOllamaConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch (error) {
    console.error("Ollama connection check failed:", error);
    return false;
  }
}

export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) {
      throw new Error("Failed to fetch models");
    }
    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  } catch (error) {
    console.error("Failed to get models:", error);
    return [];
  }
}

export async function pennyChat(
  messages: ChatMessage[],
  modelId: ModelId = "Llama-3.2-3B-Instruct-q4f32_1-MLC",
  kidAge?: number
): Promise<PennyResponse> {
  const sanitizedMessages = messages.map((msg) => {
    if (msg.role === "user") {
      return {
        ...msg,
        content: sanitizeInput(msg.content),
      };
    }
    return msg;
  });
  
  const ollamaModel = MODEL_MAP[modelId] || DEFAULT_MODEL;
  
  const ollamaMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...sanitizedMessages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];
  
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages: ollamaMessages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.95,
          num_predict: 1024,
        },
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    const responseText = data.message?.content || "";
    
    return parsePennyResponse(responseText);
  } catch (error: any) {
    console.error("Chat generation error:", error);
    
    if (error.message?.includes("fetch") || error.message?.includes("network")) {
      throw new Error("Cannot connect to Ollama. Make sure Ollama is running on your computer.");
    }
    
    return {
      reply: "I'm having trouble right now. Please try again!",
      keyPoints: [],
      examples: [],
      relatedTopics: [],
      actionSuggestions: [],
      blocked: false,
    };
  }
}

export async function initPennyLLM(): Promise<void> {
  const isAvailable = await checkOllamaConnection();
  if (!isAvailable) {
    throw new Error("Ollama is not running. Please start Ollama on your computer.");
  }
}

export async function disposePennyLLM(): Promise<void> {
  // Nothing to dispose for Ollama
}
