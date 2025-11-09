import React from 'react';
import { ChatMessage, PennyResponse } from '../types/penny';
import { Lightbulb, Target, Sparkles } from 'lucide-react';
import PennyCharacter from './PennyCharacter';

interface PennyBubbleProps {
  message: ChatMessage;
}

const PennyBubble: React.FC<PennyBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  let pennyData: PennyResponse | null = null;
  if (!isUser) {
    try {
      pennyData = JSON.parse(message.content) as PennyResponse;
    } catch (e) {
      pennyData = {
        reply: message.content,
        keyPoints: [],
        examples: [],
        relatedTopics: [],
        actionSuggestions: [],
        blocked: false,
      };
    }
  }

  if (isUser) {
    return (
      <div className="flex items-start gap-3 mb-4 flex-row-reverse">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
        </div>
        <div className="flex-1 rounded-lg p-4 bg-blue-100 rounded-tr-none">
          <p className="text-gray-700 text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  if (!pennyData) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
          <PennyCharacter size={32} />
        </div>
      </div>
      <div className="flex-1 rounded-lg p-4 bg-gray-50 rounded-tl-none">
        {/* Blocked warning */}
        {pennyData.blocked && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700 font-medium">
              ⚠️ Topic not allowed. Try a safe money lesson!
            </p>
          </div>
        )}
        
        {/* Main reply */}
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          <span className="font-bold text-amber-700">Penny:</span> {pennyData.reply}
        </p>

        {/* Structured sections */}
        {(pennyData.keyPoints.length > 0 ||
          pennyData.examples.length > 0 ||
          pennyData.relatedTopics.length > 0 ||
          pennyData.actionSuggestions.length > 0) && (
          <div className="mt-4 space-y-3 border-t border-gray-200 pt-3">
            {/* Key Points */}
            {pennyData.keyPoints.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h4 className="font-semibold text-xs text-gray-800 uppercase tracking-wide">
                    Key Points
                  </h4>
                </div>
                <ul className="space-y-1 ml-6">
                  {pennyData.keyPoints.map((point, index) => (
                    <li key={index} className="text-xs text-gray-600 list-disc">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Examples */}
            {pennyData.examples.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-xs text-gray-800 uppercase tracking-wide">
                    Examples
                  </h4>
                </div>
                <ul className="space-y-1 ml-6">
                  {pennyData.examples.map((example, index) => (
                    <li key={index} className="text-xs text-gray-600 list-disc">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Suggestions */}
            {pennyData.actionSuggestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h4 className="font-semibold text-xs text-gray-800 uppercase tracking-wide">
                    Try This
                  </h4>
                </div>
                <ul className="space-y-1 ml-6">
                  {pennyData.actionSuggestions.map((action, index) => (
                    <li key={index} className="text-xs text-gray-600 list-disc">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Topics */}
            {pennyData.relatedTopics.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Related topics:</p>
                <div className="flex flex-wrap gap-1">
                  {pennyData.relatedTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PennyBubble;

