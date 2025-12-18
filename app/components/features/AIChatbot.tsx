/**
 * @file AIChatbot.tsx
 * @description Floating AI chatbot component
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '@/types';
import Button from '../ui/Button';

const quickQuestions = [
  'Top signals today',
  'Follow-ups pending',
  'IPO pipeline',
];

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I can help you find prospects, analyze signals, and answer questions about your UHNW client base. What would you like to know?',
    timestamp: new Date(),
  },
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on current signals, I found relevant prospects matching your query "${input}". Here are some insights:

1. **Rajesh Kumar** (Score: 92)
   IPO filing detected - High priority
   
2. **Anita Patel** (Score: 87)
   Recent funding round announced

Would you like me to provide more details on any of these prospects?`,
        timestamp: new Date(),
        links: [
          { label: 'View Rajesh Kumar', href: '/prospects/1' },
          { label: 'View Anita Patel', href: '/prospects/2' },
        ],
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    handleSend();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#C9A227] to-[#D4AF37] rounded-full shadow-lg flex items-center justify-center text-[#1A1A2E] hover:shadow-xl transition-all duration-300 hover:scale-105 z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0A1628] rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#C9A227] to-[#D4AF37] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-[#1A1A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-white font-medium">AI Intelligence Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[#1E3A5F] text-white'
                      : 'bg-[#F8F9FA] text-[#1A1A2E]'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.links && message.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          className="text-xs text-[#C9A227] hover:underline"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#F8F9FA] px-4 py-3 rounded-lg">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#5A6C7D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#5A6C7D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#5A6C7D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-4 py-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider mb-2">
              Quick Questions
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => {
                    setInput(question);
                  }}
                  className="px-3 py-1.5 text-xs bg-[#F8F9FA] text-[#5A6C7D] rounded-full hover:bg-[#1E3A5F] hover:text-white transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-lg text-[#1A1A2E] placeholder-[#8E99A4] focus:outline-none focus:border-[#1E3A5F] transition-colors"
              />
              <Button variant="primary" size="sm" onClick={handleSend} disabled={isLoading}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
