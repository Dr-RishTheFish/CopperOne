import { useState, useCallback, useEffect, useRef } from "react";
import { ChatMessage, PennyResponse, ModelId } from "../types/penny";
import { initPennyLLM, pennyChat, disposePennyLLM, checkOllamaConnection } from "../ai/pennyLLM";

const MODEL_STORAGE_KEY = "penny_selected_model";
const DEFAULT_MODEL: ModelId = "Llama-3.2-3B-Instruct-q4f32_1-MLC";

export interface UsePennyChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isInitializing: boolean;
  progress: string;
  error: string | null;
  sendMessage: (input: string) => Promise<void>;
  clearMessages: () => void;
  selectedModel: ModelId;
  setSelectedModel: (model: ModelId) => Promise<void>;
  useCPU: boolean;
  setUseCPU: (use: boolean) => void;
  webGPUAvailable: boolean;
}

export function usePennyChat(): UsePennyChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: JSON.stringify({
        reply: "Hi! I'm Penny, your local money helper! 🪙 Ask me anything about saving, spending, or earning money!",
        keyPoints: [],
        examples: [],
        relatedTopics: [],
        actionSuggestions: [],
        blocked: false,
      }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [progress, setProgress] = useState("Checking Ollama connection...");
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModelState] = useState<ModelId>(() => {
    const stored = localStorage.getItem(MODEL_STORAGE_KEY);
    return (stored as ModelId) || DEFAULT_MODEL;
  });
  const [useCPU, setUseCPU] = useState(false);
  const [webGPUAvailable] = useState(true);
  
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    
    const initialize = async () => {
      try {
        setIsInitializing(true);
        setProgress("Connecting to Ollama...");
        setError(null);
        
        const isAvailable = await checkOllamaConnection();
        if (!isAvailable) {
          throw new Error("Ollama is not running. Please start Ollama on your computer.");
        }
        
        await initPennyLLM();
        
        initializedRef.current = true;
        setIsInitializing(false);
        setProgress("");
      } catch (err: any) {
        console.error("Initialization error:", err);
        setError(err.message || "Failed to connect to Ollama");
        setIsInitializing(false);
        setProgress("");
      }
    };
    
    initialize();
    
    return () => {
      disposePennyLLM().catch(console.error);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    async (input: string) => {
      if (!input.trim() || isLoading || isInitializing) return;
      
      const userMessage: ChatMessage = {
        role: "user",
        content: input.trim(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);
      
      try {
        if (!initializedRef.current) {
          const isAvailable = await checkOllamaConnection();
          if (!isAvailable) {
            throw new Error("Ollama connection lost. Please make sure Ollama is running.");
          }
          initializedRef.current = true;
        }
        
        const history = messages.slice(-10);
        const fullHistory = [...history, userMessage];
        
        const response: PennyResponse = await pennyChat(fullHistory, selectedModel);
        
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: JSON.stringify(response),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err: any) {
        console.error("Chat error:", err);
        setError(err.message || "Failed to generate response");
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: JSON.stringify({
            reply: err.message?.includes("Ollama") 
              ? "I can't connect to Ollama. Please make sure Ollama is running on your computer! 🪙"
              : "I'm having trouble right now. Please try again! 🪙",
            keyPoints: [],
            examples: [],
            relatedTopics: [],
            actionSuggestions: [],
            blocked: false,
          }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, isInitializing, selectedModel]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content: JSON.stringify({
          reply: "Hi! I'm Penny, your local money helper! 🪙 Ask me anything about saving, spending, or earning money!",
          keyPoints: [],
          examples: [],
          relatedTopics: [],
          actionSuggestions: [],
          blocked: false,
        }),
      },
    ]);
  }, []);

  const setSelectedModel = useCallback(
    async (model: ModelId) => {
      if (model === selectedModel) return;
      
      try {
        setIsInitializing(true);
        setProgress("Switching model...");
        setError(null);
        
        const isAvailable = await checkOllamaConnection();
        if (!isAvailable) {
          throw new Error("Ollama is not running. Please start Ollama on your computer.");
        }
        
        setSelectedModelState(model);
        localStorage.setItem(MODEL_STORAGE_KEY, model);
        setIsInitializing(false);
        setProgress("");
      } catch (err: any) {
        console.error("Model switch error:", err);
        setError(err.message || "Failed to switch model");
        setIsInitializing(false);
      }
    },
    [selectedModel]
  );

  return {
    messages,
    isLoading,
    isInitializing,
    progress,
    error,
    sendMessage,
    clearMessages,
    selectedModel,
    setSelectedModel,
    useCPU,
    setUseCPU,
    webGPUAvailable,
  };
}
