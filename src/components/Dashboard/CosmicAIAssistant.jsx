import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, Loader2 } from 'lucide-react';
import apiClient from '../../services/api';

const CosmicAIAssistant = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await apiClient.askCosmicAI(question.trim());
      setResponse(result.data?.response || result.response || 'No response received');
    } catch (err) {
      setError(err.message || 'Something went wrong with the Cosmic AI Assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setResponse('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-md mx-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Cosmic AI Assistant</h3>
              <p className="text-xs text-white/60">Your curious mission companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Question Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Ask me about space, astronomy, or cosmic phenomena! 
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What's the difference between a star and a planet?"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                rows={3}
                maxLength={500}
                disabled={isLoading}
              />
              <div className="text-xs text-white/40 mt-1 text-right">
                {question.length}/500
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!question.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Ask AI
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-white/10 text-white/80 rounded-xl hover:bg-white/20 transition-colors"
              >
                Clear
              </button>
            </div>
          </form>

          {/* Response Area */}
          {(response || error || isLoading) && (
            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white/80">Cosmic AI Response</span>
              </div>
              
              {isLoading && (
                <div className="flex items-center gap-2 text-white/60">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Exploring the cosmos for answers...</span>
                </div>
              )}
              
              {error && (
                <div className="text-red-400 text-sm">
                  <span className="font-medium">Error:</span> {error}
                </div>
              )}
              
              {response && (
                <div className="text-white/90 text-sm leading-relaxed">
                  {response}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 rounded-b-2xl">
          <p className="text-xs text-white/40 text-center">
            Powered by OpenAI • Keep your questions cosmic! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default CosmicAIAssistant;