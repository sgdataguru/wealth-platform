/**
 * @file FloatingChatbot.tsx
 * @description Floating AI assistant chatbot for RMs and Executives
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import type { UserRole } from '@/types';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface FloatingChatbotProps {
    userRole?: UserRole;
}

export default function FloatingChatbot({ userRole = 'rm' }: FloatingChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const openChat = () => {
        const greeting = userRole === 'executive'
            ? `Hello! I'm your AI assistant for Kairos Capital's Executive Dashboard. I can help you with AUM insights, liquidity triggers, team performance, and strategic analysis. What would you like to know?`
            : `Hi! I'm your AI assistant for relationship management. I can help you with client insights, lead scoring, portfolio recommendations, and action items. How can I assist you today?`;

        setMessages(prev => (prev.length === 0 ? [{
            id: '1',
            role: 'assistant',
            content: greeting,
            timestamp: new Date(),
        }] : prev));
        setIsOpen(true);
    };

    const getMockResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        // Role-specific responses
        if (userRole === 'executive') {
            if (lowerMessage.includes('aum') || lowerMessage.includes('growth')) {
                return "Based on current data, your AUM stands at ₹4.6 L Cr with a 2.8% MoM growth and 19.2% YoY. The Northern region is performing particularly well with Delhi NCR contributing ₹95,000 Cr. Would you like a detailed breakdown by region or product?";
            }
            if (lowerMessage.includes('liquidity') || lowerMessage.includes('trigger')) {
                return "There are currently 5 high-priority liquidity triggers in the next 90 days, totaling ₹1,240 Cr. The most imminent is Sanjay Malhotra's ESOP vesting (₹62 Cr in 15 days, 92% probability). Priya Sharma is assigned. Would you like me to pull up the full pipeline?";
            }
            if (lowerMessage.includes('team') || lowerMessage.includes('rm')) {
                return "Your top performing RM is Priya Sharma with ₹850 Cr AUM and 24.5% growth. The team average productivity is 78/100. Northern region has 298 RMs managing 35,000 clients. Need details on a specific RM or region?";
            }
            if (lowerMessage.includes('target') || lowerMessage.includes('goal')) {
                return "Current AUM is ₹4.6 L Cr against the target of ₹5.2 L Cr (88.5% achievement). To reach the target, you need ₹60,000 Cr more. At current growth rate, you're on track to achieve by Q2. Want to see a detailed gap analysis?";
            }
        } else {
            // RM responses
            if (lowerMessage.includes('lead') || lowerMessage.includes('prospect')) {
                return "You have 24 active leads with an average score of 72/100. Your top prospect is Arjun Reddy (₹95 Cr net worth, aggressive profile). He's showing strong interest in Alternative Investments. I recommend scheduling a meeting within the next week. Would you like me to draft talking points?";
            }
            if (lowerMessage.includes('client') || lowerMessage.includes('portfolio')) {
                return "You're managing 65 clients with ₹850 Cr total AUM. Ramesh Gupta's lock-in expires in 26 days (₹45 Cr liquidity event). I suggest preparing a diversification proposal with Structured Products and Alternative Investments. Need help with the proposal?";
            }
            if (lowerMessage.includes('score') || lowerMessage.includes('scoring')) {
                return "Lead scoring is based on 5 factors: Financial Profile (30%), Engagement Level (25%), Propensity to Convert (20%), Revenue Potential (15%), and Strategic Value (10%). Your highest-scored lead is currently at 92/100. Want to see the detailed breakdown?";
            }
            if (lowerMessage.includes('task') || lowerMessage.includes('followup')) {
                return "You have 3 pending follow-ups: 1) Call Deepak Verma about MF redemption (due today), 2) Send proposal to Tech Innovations (due Dec 22), 3) Portfolio review for Arjun (due Dec 25). Which would you like to prioritize?";
            }
        }

        // Generic responses
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
            return userRole === 'executive'
                ? "I can help you with: AUM analysis, liquidity triggers, team performance, regional breakdowns, product mix, churn risk, target tracking, and strategic insights. Just ask!"
                : "I can help you with: lead management, client portfolios, liquidity events, task tracking, product recommendations, scoring details, and action planning. What do you need?";
        }

        // Default response
        return "I understand you're asking about that. While I'm a demo assistant with limited knowledge, in production I would connect to your CRM and analytics systems to provide detailed, real-time answers. Could you rephrase your question or ask about AUM, leads, clients, or team performance?";
    };

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            const response = getMockResponse(input);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 1000 + Math.random() * 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={openChat}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#E85D54] to-[#F06E66] rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center z-50 group"
                    aria-label="Open AI Assistant"
                >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#1A1332] to-[#2A2447] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#E85D54] rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold">Kairos Capital AI Assistant</h3>
                                <p className="text-xs text-gray-300">{userRole === 'executive' ? 'Executive Support' : 'RM Support'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.role === 'user'
                                            ? 'bg-[#E85D54] text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                                        }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E85D54] text-sm"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="px-4 py-3 bg-[#E85D54] text-white rounded-xl hover:bg-[#D64D44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
