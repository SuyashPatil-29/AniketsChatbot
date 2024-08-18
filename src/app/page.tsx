'use client';
import { type CoreMessage } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { continueConversation } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
import { Send, User, Bot } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const IntroParagraph = () => (
  <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm mb-4">
    <h2 className="text-2xl font-bold mb-2"> Smart BOT</h2>
    <p className="text-gray-600">
      We have built a chatbot using the OpenAI API, enabling it to understand and respond to user inputs in a conversational manner. This chatbot leverages the power of advanced language models to provide intelligent, context-aware responses, making it suitable for a wide range of applications such as customer support, virtual assistants, and interactive learning. By integrating the OpenAI API, our chatbot can handle various tasks, from answering questions to engaging in more complex dialogues, offering a dynamic and user-friendly experience.
    </p>
  </div>
);

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    setShowIntro(false);
    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: 'user' },
    ];
    setMessages(newMessages);
    setInput('');
    const result = await continueConversation(newMessages);
    for await (const content of readStreamableValue(result.message)) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: content!.toString(),
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow overflow-auto p-4">
        {showIntro && (
          <div className="flex justify-center items-start min-h-full">
            <IntroParagraph />
          </div>
        )}
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start space-x-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <div
                className={`p-3 rounded-lg ${m.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
                  } max-w-[70%] break-words`}
              >
                <p className="whitespace-pre-wrap">{m.content as string}</p>
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your question..."
              className="w-full px-4 py-2 pr-12 text-gray-700 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full hover:bg-gray-800 focus:outline-none disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
