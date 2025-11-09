import React, { useState, useEffect, useRef } from 'react';
import { Send, Settings, X, Loader2 } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import PennyBubble from '../components/PennyBubble';
import PennyCharacter from '../components/PennyCharacter';
import { usePennyChat } from '../hooks/usePennyChat';
import { ModelId } from '../types/penny';

const Penny: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    isLoading,
    isInitializing,
    progress,
    error,
    sendMessage,
    clearMessages,
    selectedModel,
    setSelectedModel,
  } = usePennyChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || isInitializing) return;
    
    const text = inputText.trim();
    setInputText('');
    await sendMessage(text);
  };

  const handleModelChange = async (model: ModelId) => {
    await setSelectedModel(model);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800">Copper One</span>
            </div>
            <span className="text-sm text-gray-500">by Capital One</span>
          </div>
          
          <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <PennyCharacter size={48} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Penny (Ollama)</h1>
                  <p className="text-white text-opacity-90 text-sm">Your AI money helper</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress/Status */}
        {(isInitializing || progress) && (
          <div className="px-4 mb-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <p className="text-sm text-blue-800">{progress || 'Initializing...'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-4 mb-2">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 mb-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <PennyBubble key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <PennyCharacter size={32} />
                </div>
                <div className="flex-1 rounded-lg p-4 bg-gray-50 rounded-tl-none">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <p className="text-gray-500 text-sm">Penny is thinking...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="px-4 pb-4">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Penny a question..."
              disabled={isLoading || isInitializing}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || isInitializing || !inputText.trim()}
              className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Settings Drawer */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full max-w-md mx-auto max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Model Selection */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Model</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="model"
                      value="Llama-3.2-3B-Instruct-q4f32_1-MLC"
                      checked={selectedModel === 'Llama-3.2-3B-Instruct-q4f32_1-MLC'}
                      onChange={() => handleModelChange('Llama-3.2-3B-Instruct-q4f32_1-MLC')}
                      className="text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Llama 3.2 3B</p>
                      <p className="text-xs text-gray-500">Ollama model: llama3.2:3b</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="model"
                      value="Phi-3-mini-4k-instruct-q4f32_1-MLC"
                      checked={selectedModel === 'Phi-3-mini-4k-instruct-q4f32_1-MLC'}
                      onChange={() => handleModelChange('Phi-3-mini-4k-instruct-q4f32_1-MLC')}
                      className="text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Phi-3 Mini</p>
                      <p className="text-xs text-gray-500">Ollama model: phi3:mini</p>
                    </div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Make sure the selected model is installed in Ollama. Run: <code className="bg-gray-100 px-1 rounded">ollama pull llama3.2:3b</code> or <code className="bg-gray-100 px-1 rounded">ollama pull phi3:mini</code>
                </p>
              </div>

              {/* Ollama Info */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">About</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    Penny uses Ollama running on your computer. Make sure Ollama is installed and running.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Default URL: <code className="bg-blue-100 px-1 rounded">http://localhost:11434</code>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={clearMessages}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Clear Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Penny;
