/**
 * @file VoiceToTextPanel.tsx
 * @description Voice-to-text transcription and analysis for client interactions
 */

'use client';

import { Card } from '@/app/components/ui';
import { useState, useRef } from 'react';
import { formatCroreToUSD } from '@/lib/utils/currency';

interface VoiceNote {
    id: string;
    title: string;
    duration: number; // seconds
    recordedAt: string; // ISO date string
    transcriptStatus: 'processing' | 'completed' | 'failed';
    transcript?: string;
    language: 'en' | 'hi' | 'mr';
    linkedClients: string[];
    detectedTopics: string[];
    aiSummary?: string;
    actionItems?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
}

const mockVoiceNotes: VoiceNote[] = [
    {
        id: 'vn-1',
        title: 'Meeting with Faisal Al-Nuaimi - IPO Discussion',
        duration: 245,
        recordedAt: '',
        transcriptStatus: 'completed',
        transcript: 'Good morning Faisal, congratulations on the IPO filing. I wanted to discuss your post-IPO wealth management strategy. Based on our analysis, you\'ll have approximately AED 180M in liquid assets after the lock-in period expires. I recommend a diversified approach with 40% in PMS, 30% in alternative investments, and 30% in fixed income. We should also discuss tax optimization strategies. What are your thoughts on this allocation?',
        language: 'en',
        linkedClients: ['Faisal Al-Nuaimi'],
        detectedTopics: ['IPO', 'Wealth Management', 'PMS', 'Alternative Investments', 'Tax Optimization'],
        aiSummary: `Discussed post-IPO wealth management strategy with Faisal Al-Nuaimi. Proposed diversified allocation: 40% PMS, 30% alternative investments, 30% fixed income. Estimated liquid assets: ${formatCroreToUSD(180)}. Client interested in tax optimization strategies.`,
        actionItems: [
            `Prepare detailed PMS proposal for ${formatCroreToUSD(72)} allocation`,
            'Schedule meeting with tax consultant',
            'Send alternative investment opportunities deck',
            'Follow up in 3 days for decision'
        ],
        sentiment: 'positive'
    },
    {
        id: 'vn-2',
        title: 'Call with Noor Al-Muhairi - Alternative Investments',
        duration: 180,
        recordedAt: '',
        transcriptStatus: 'completed',
        transcript: 'Hi Noor, thank you for taking my call. I wanted to discuss the alternative investment opportunities we talked about last week. We have three PE funds that match your risk profile - Wamda Capital Growth Fund, MEVP Fund III, and Dubai Angel Investors Fund II. The minimum ticket size is $5 million per fund. These funds have historically delivered 22-28% IRR. Would you like me to send detailed information packs?',
        language: 'en',
        linkedClients: ['Noor Al-Muhairi'],
        detectedTopics: ['Alternative Investments', 'PE Funds', 'Risk Profile', 'IRR'],
        aiSummary: `Discussed alternative investment opportunities with Noor Al-Muhairi. Presented 3 PE funds: Wamda Capital, MEVP, Dubai Angel Investors. Minimum ticket: $5 Million per fund. Historical IRR: 22-28%. Client requested detailed information packs.`,
        actionItems: [
            'Send PE fund information packs to Noor',
            'Prepare comparison analysis of 3 funds',
            'Schedule follow-up call in 5 days',
            'Coordinate with fund managers for Q&A session'
        ],
        sentiment: 'positive'
    },
    {
        id: 'vn-3',
        title: 'Re-engagement Call - Tariq Al-Hakim',
        duration: 120,
        recordedAt: '',
        transcriptStatus: 'completed',
        transcript: 'Hello Tariq, I hope you\'re doing well. I noticed we haven\'t connected in a while and wanted to check in. I saw your LinkedIn post about structured products - we have some new offerings that might interest you. Our new equity-linked structured notes offer 12-15% returns with capital protection. Would you be open to a quick coffee meeting next week to discuss?',
        language: 'en',
        linkedClients: ['Tariq Al-Hakim'],
        detectedTopics: ['Re-engagement', 'Structured Products', 'Equity-Linked Notes', 'Capital Protection'],
        aiSummary: 'Re-engagement call with Tariq Al-Hakim after 32-day gap. Discussed new structured product offerings. Equity-linked notes with 12-15% returns and capital protection. Client open to coffee meeting next week.',
        actionItems: [
            'Schedule coffee meeting for next week',
            'Prepare structured products presentation',
            'Send calendar invite with 3 time slot options',
            'Follow up with email summarizing discussion'
        ],
        sentiment: 'neutral'
    },
    {
        id: 'vn-4',
        title: 'Regional Conversation - Hassan Al-Rashid',
        duration: 195,
        recordedAt: '',
        transcriptStatus: 'completed',
        transcript: 'Hello Hassan, your portfolio has performed strongly this quarter with 6.5% returns. I wanted to share alternative investment opportunities. Allocating to PE and VC funds could target 20-25% returns over the cycle. Would you like to discuss this further?',
        language: 'en',
        linkedClients: ['Hassan Al-Rashid'],
        detectedTopics: ['Portfolio Performance', 'Alternative Investments', 'PE/VC Funds', 'Returns'],
        aiSummary: 'Conversation with Hassan Al-Rashid. Discussed strong portfolio performance (6.5% quarterly returns). Introduced alternative investments opportunity (PE/VC funds with 20-25% potential returns). Client interested in further discussion.',
        actionItems: [
            'Prepare tailored alternative investments presentation',
            'Schedule in-person meeting',
            'Send portfolio performance report',
            'Coordinate with fund managers for follow-up'
        ],
        sentiment: 'positive'
    },
    {
        id: 'vn-5',
        title: 'Processing...',
        duration: 0,
        recordedAt: '',
        transcriptStatus: 'processing',
        language: 'en',
        linkedClients: [],
        detectedTopics: []
    }
];

export default function VoiceToTextPanel() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [selectedNote, setSelectedNote] = useState<VoiceNote | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'mr'>('en');
    const recordingInterval = useRef<NodeJS.Timeout | null>(null);

    const startRecording = () => {
        setIsRecording(true);
        setRecordingDuration(0);
        recordingInterval.current = setInterval(() => {
            setRecordingDuration(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (recordingInterval.current) {
            clearInterval(recordingInterval.current);
        }
        // In real implementation, this would upload and process the audio
        alert(`Recording stopped. Duration: ${recordingDuration}s. Processing with AI transcription...`);
        setRecordingDuration(0);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getSentimentColor = (sentiment?: string) => {
        switch (sentiment) {
            case 'positive': return 'text-[#28A745] bg-[#E8F5E9]';
            case 'neutral': return 'text-[#5A6C7D] bg-[#F8F9FA]';
            case 'negative': return 'text-[#DC3545] bg-[#FFF3F3]';
            default: return 'text-[#5A6C7D] bg-[#F8F9FA]';
        }
    };

    const getSentimentIcon = (sentiment?: string) => {
        switch (sentiment) {
            case 'positive': return '😊';
            case 'neutral': return '😐';
            case 'negative': return '😟';
            default: return '🤖';
        }
    };

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'hi', label: 'Arabic', flag: '🇦🇪' },
        { code: 'mr', label: 'French', flag: '🇫🇷' }
    ];

    return (
        <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                        🎤 Voice-to-Text Intelligence
                    </h3>
                    <p className="text-sm text-[#5A6C7D] mt-1">
                        AI-powered transcription with automatic client linking and action item extraction
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8E99A4]">
                    <div className="w-2 h-2 bg-[#28A745] rounded-full animate-pulse" />
                    <span>Multilingual Support</span>
                </div>
            </div>

            {/* Recording Section */}
            <div className="bg-gradient-to-r from-[#1A1332] to-[#2A2447] rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-white font-semibold mb-1">Record New Voice Note</h4>
                        <p className="text-sm text-gray-300">
                            Automatically transcribed and analyzed with AI
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => setSelectedLanguage(lang.code as 'en' | 'hi' | 'mr')}
                                className={`
                                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${selectedLanguage === lang.code
                                        ? 'bg-[#E85D54] text-white'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }
                                `}
                            >
                                <span className="mr-1">{lang.flag}</span>
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!isRecording ? (
                        <button
                            onClick={startRecording}
                            className="flex items-center gap-2 px-6 py-3 bg-[#E85D54] text-white rounded-lg font-medium hover:bg-[#D14D44] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                            </svg>
                            Start Recording
                        </button>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-white font-mono text-2xl">
                                    {formatDuration(recordingDuration)}
                                </span>
                            </div>
                            <button
                                onClick={stopRecording}
                                className="px-6 py-3 bg-white text-[#1A1332] rounded-lg font-medium hover:bg-gray-100 transition-colors"
                            >
                                Stop & Process
                            </button>
                        </>
                    )}
                    <div className="flex-1" />
                    <div className="text-white text-sm">
                        <p className="text-gray-300 mb-1">Features:</p>
                        <ul className="space-y-1 text-xs">
                            <li>✓ Auto client detection</li>
                            <li>✓ Action item extraction</li>
                            <li>✓ Sentiment analysis</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Voice Notes List */}
            <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-[#1A1A2E]">Recent Voice Notes</h4>
                {mockVoiceNotes.map(note => (
                    <div
                        key={note.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => note.transcriptStatus === 'completed' && setSelectedNote(note)}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <h5 className="font-semibold text-[#1A1A2E] mb-1">{note.title}</h5>
                                <div className="flex items-center gap-3 text-xs text-[#8E99A4]">
                                    <span>{new Date(note.recordedAt).toLocaleDateString()} {new Date(note.recordedAt).toLocaleTimeString()}</span>
                                    {note.duration > 0 && <span>• {formatDuration(note.duration)}</span>}
                                    <span>• {languages.find(l => l.code === note.language)?.label}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {note.sentiment && (
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getSentimentColor(note.sentiment)}`}>
                                        {getSentimentIcon(note.sentiment)} {note.sentiment}
                                    </span>
                                )}
                                {note.transcriptStatus === 'processing' && (
                                    <span className="px-3 py-1 bg-[#FFF4E6] text-[#FFC107] rounded text-xs font-semibold">
                                        Processing...
                                    </span>
                                )}
                                {note.transcriptStatus === 'completed' && (
                                    <span className="px-3 py-1 bg-[#E8F5E9] text-[#28A745] rounded text-xs font-semibold">
                                        ✓ Ready
                                    </span>
                                )}
                            </div>
                        </div>

                        {note.linkedClients.length > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-[#8E99A4]">Clients:</span>
                                {note.linkedClients.map((client, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-[#F8F9FA] text-[#1A1A2E] rounded text-xs">
                                        {client}
                                    </span>
                                ))}
                            </div>
                        )}

                        {note.detectedTopics.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {note.detectedTopics.map((topic, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-[#E8F5E9] text-[#28A745] rounded text-xs">
                                        #{topic}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Detailed View Modal */}
            {selectedNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                                    {selectedNote.title}
                                </h3>
                                <p className="text-sm text-[#5A6C7D] mt-1">
                                    {new Date(selectedNote.recordedAt).toLocaleDateString()} • {formatDuration(selectedNote.duration)} • {languages.find(l => l.code === selectedNote.language)?.label}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedNote(null)}
                                className="text-[#5A6C7D] hover:text-[#1A1A2E] text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* AI Summary */}
                            {selectedNote.aiSummary && (
                                <div className="bg-[#F8F9FA] p-4 rounded-lg">
                                    <h4 className="font-semibold text-[#1A1A2E] mb-2">🤖 AI Summary</h4>
                                    <p className="text-sm text-[#5A6C7D] leading-relaxed">
                                        {selectedNote.aiSummary}
                                    </p>
                                </div>
                            )}

                            {/* Transcript */}
                            {selectedNote.transcript && (
                                <div>
                                    <h4 className="font-semibold text-[#1A1A2E] mb-2">📝 Full Transcript</h4>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <p className="text-sm text-[#1A1A2E] leading-relaxed">
                                            {selectedNote.transcript}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Items */}
                            {selectedNote.actionItems && selectedNote.actionItems.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-[#1A1A2E] mb-3">✅ Extracted Action Items</h4>
                                    <ul className="space-y-2">
                                        {selectedNote.actionItems.map((action, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-[#1A1A2E]">
                                                <input type="checkbox" className="mt-1" />
                                                <span>{action}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h5 className="text-xs font-semibold text-[#8E99A4] uppercase mb-2">Linked Clients</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedNote.linkedClients.map((client, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-[#F8F9FA] text-[#1A1A2E] rounded text-sm">
                                                {client}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-xs font-semibold text-[#8E99A4] uppercase mb-2">Detected Topics</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedNote.detectedTopics.map((topic, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-[#E8F5E9] text-[#28A745] rounded text-sm">
                                                #{topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button className="px-6 py-3 bg-[#E85D54] text-white rounded-lg font-medium hover:bg-[#D14D44] transition-colors">
                                    Create Follow-ups
                                </button>
                                <button className="px-6 py-3 bg-[#1A1332] text-white rounded-lg font-medium hover:bg-[#2A2447] transition-colors">
                                    Add to CRM
                                </button>
                                <button className="px-6 py-3 border border-gray-300 text-[#5A6C7D] rounded-lg font-medium hover:bg-[#F8F9FA] transition-colors">
                                    Export Transcript
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Stats */}
            <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#1A1A2E]">{mockVoiceNotes.filter(n => n.transcriptStatus === 'completed').length}</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Transcribed Notes</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#E85D54]">12</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Action Items</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#28A745]">8</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Clients Linked</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#1A1332]">3</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Languages</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
