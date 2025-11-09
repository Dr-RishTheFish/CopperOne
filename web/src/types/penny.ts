// Shared types for Penny chat

export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface PennyResponse {
  reply: string;
  keyPoints: string[];
  examples: string[];
  relatedTopics: string[];
  actionSuggestions: string[];
  blocked?: boolean;
}

export type ModelId = 
  | "Llama-3.2-3B-Instruct-q4f32_1-MLC"
  | "Phi-3-mini-4k-instruct-q4f32_1-MLC";

