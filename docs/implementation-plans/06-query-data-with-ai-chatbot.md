# 06 - Query Data with AI Chatbot - Implementation Plan

## Project Context

**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS, Radix UI
**Backend**: Supabase (PostgreSQL), Neo4j Aura (Graph DB), OpenAI GPT-4, Azure Speech API
**Infrastructure**: Vercel (Frontend), Supabase (Backend), OpenAI & Azure (AI Services)

---

## User Story

**As a** Relationship Manager,
**I want** to ask natural language questions to an AI chatbot about liquidity events and prospects,
**so that** I can quickly get answers without navigating through complex filters or reports.

---

## Pre-conditions

- Supabase database is set up with `clients`, `signals`, and `chat_sessions` tables
- Neo4j graph database is configured with relationship data
- OpenAI API key is configured
- Azure Speech API is set up for multilingual support
- User is authenticated as an RM
- RM has assigned clients and signals in the database
- Chat component can be rendered as a floating widget accessible from any page

---

## Business Requirements

- **Natural Language Interface**: RMs can ask questions in conversational language without learning query syntax
  - *Success Metric*: 90%+ of queries successfully parsed and responded to
  
- **Multilingual Support**: Chatbot supports English, Hindi, and Marathi (regional languages)
  - *Success Metric*: Language detection accuracy >95%, response quality maintained across languages
  
- **Accurate Data Retrieval**: Responses are based on real-time data from PostgreSQL and Neo4j
  - *Success Metric*: Data accuracy 100%, response time <2 seconds for complex queries
  
- **Contextual Follow-up Suggestions**: After each response, suggest relevant next questions
  - *Success Metric*: 40%+ of users click on suggested follow-ups
  
- **Session Persistence**: Chat history is maintained within the session
  - *Success Metric*: Chat history persists for the entire user session without loss

---

## Technical Specifications

### Integration Points

- **OpenAI GPT-4**: Natural language understanding and generation
- **Neo4j Cypher**: Graph database queries for relationships and intro paths
- **Supabase PostgreSQL**: Structured data queries for clients, signals, metrics
- **Azure Speech API**: Language detection and translation (optional)
- **Vercel AI SDK**: Streaming responses for real-time chat experience

### Security Requirements

- JWT token validation for all chat API requests
- Rate limiting: 30 chat messages per minute per user
- Input sanitization to prevent prompt injection attacks
- Chat history encrypted at rest in Supabase
- No PII exposed in OpenAI requests (use IDs only, resolve names server-side)

### Data Flow

```
User Input → Language Detection → Context Enrichment → 
Query Classification → Data Retrieval (SQL/Cypher) → 
Response Generation (GPT-4) → Streaming Response → 
Follow-up Suggestions → Chat History Storage
```

---

## Design Specifications

### Visual Layout & Components

**Floating Chat Widget**:

```
┌─────────────────────────────────────┐
│  AI Assistant 🤖          [Lang] [×]│
├─────────────────────────────────────┤
│                                     │
│  [Chat Message Bubbles]             │
│  • User message (right-aligned)     │
│  • AI response (left-aligned)       │
│  • Signal/Client cards (inline)     │
│                                     │
├─────────────────────────────────────┤
│  [Suggested Questions - Pills]      │
├─────────────────────────────────────┤
│  [Input Field] [Send Button]        │
└─────────────────────────────────────┘
```

**Component Hierarchy**:

```tsx
<AIChatbot>
  <ChatHeader>
    <LanguageSelector />
    <MinimizeButton />
    <CloseButton />
  </ChatHeader>
  <ChatMessages>
    <ChatMessage type="user" />
    <ChatMessage type="assistant">
      <ClientCard /> {/* Inline result cards */}
      <SignalCard />
    </ChatMessage>
  </ChatMessages>
  <ChatSuggestions>
    <SuggestionPill />
  </ChatSuggestions>
  <ChatInput>
    <VoiceInputButton /> {/* Optional - future */}
    <TextInput />
    <SendButton />
  </ChatInput>
</AIChatbot>
```

### Design System Compliance

**Color Palette**:

```css
/* Chat Widget Colors */
--chat-bg: #FFFFFF;                 /* Chat background */
--chat-header: #0A1628;             /* Deep navy header */
--chat-user-msg: #1E3A5F;           /* Royal blue - user messages */
--chat-ai-msg: #F8F9FA;             /* Light gray - AI messages */
--chat-border: #E1E5EB;             /* Subtle borders */
--chat-suggestion: #C9A227;         /* Gold - suggestion pills */
--chat-input-bg: #F8F9FA;           /* Input background */
```

**Typography**:

```css
/* Chat Typography */
--chat-font: 'Inter', sans-serif;
--chat-text-sm: 0.875rem;   /* 14px - message text */
--chat-text-xs: 0.75rem;    /* 12px - timestamps */
--chat-text-base: 1rem;     /* 16px - input */
```

### Responsive Behavior

**Desktop (1024px+)**:

- Floating widget: 400px width × 600px height
- Position: Fixed bottom-right corner
- Can be minimized to icon

**Tablet (768px - 1023px)**:

- Width: 360px × 550px height
- Same floating behavior

**Mobile (<768px)**:

- Full-screen overlay when opened
- Slide up from bottom animation

### Interaction Patterns

**Message States**:

```typescript
interface MessageStates {
  sending: 'opacity-70 cursor-wait';
  sent: 'opacity-100';
  streaming: 'border-l-4 border-blue-600 animate-pulse';
  error: 'bg-red-50 border-red-500';
}
```

**Input Validation**:

```typescript
interface ChatInputValidation {
  minLength: 1;
  maxLength: 500;
  rateLimitPerMinute: 30;
  emptyState: 'border-gray-300';
  focusState: 'border-blue-600 ring-2 ring-blue-200';
}
```

---

## Technical Architecture

### Component Structure

```
app/(dashboard)/
├── layout.tsx                          # Includes floating chatbot
└── components/
    └── features/
        └── chat/
            ├── AIChatbot.tsx           # Main chatbot container
            ├── ChatHeader.tsx          # Header with controls
            ├── ChatMessages.tsx        # Message list container
            ├── ChatMessage.tsx         # Individual message
            ├── ChatInput.tsx           # Input field + send
            ├── ChatSuggestions.tsx     # Follow-up questions
            ├── LanguageSelector.tsx    # Language dropdown
            ├── InlineClientCard.tsx    # Client preview in chat
            ├── InlineSignalCard.tsx    # Signal preview in chat
            └── hooks/
                ├── useChat.ts          # Chat state & streaming
                ├── useChatHistory.ts   # Session persistence
                └── useChatSuggestions.ts # Follow-up generation
```

### State Management Architecture

**Chat State Interface**:

```typescript
interface ChatState {
  // Session
  sessionId: string | null;
  language: 'en' | 'hi' | 'mr';
  
  // Messages
  messages: ChatMessage[];
  isStreaming: boolean;
  
  // UI State
  isOpen: boolean;
  isMinimized: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Suggestions
  suggestions: string[];
  
  // Input
  inputValue: string;
  isSubmitting: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  language: string;
  metadata?: {
    clientIds?: string[];
    signalIds?: string[];
    queryType?: QueryType;
  };
}

type QueryType = 
  | 'client_search'
  | 'signal_search'
  | 'relationship_query'
  | 'metrics_query'
  | 'general_question';
```

**Chat Actions**:

```typescript
interface ChatActions {
  // Session Management
  initSession: () => Promise<void>;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  
  // Messaging
  sendMessage: (message: string) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  
  // UI Actions
  toggleOpen: () => void;
  toggleMinimize: () => void;
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  
  // Suggestions
  loadSuggestions: (context: string) => Promise<void>;
  selectSuggestion: (suggestion: string) => void;
}
```

### API Integration Schema

**Chat API Endpoint** (`/api/chat/route.ts`):

```typescript
// Request
interface ChatRequest {
  message: string;
  sessionId?: string;
  language?: 'en' | 'hi' | 'mr';
  context?: {
    currentPage?: string;
    selectedClientId?: string;
  };
}

// Response (Streaming)
interface ChatStreamChunk {
  type: 'token' | 'metadata' | 'done';
  content?: string;
  metadata?: {
    queryType: QueryType;
    dataRetrieved: boolean;
    clientIds?: string[];
    signalIds?: string[];
    suggestions?: string[];
  };
}
```

**Chat History API** (`/api/chat/history/route.ts`):

```typescript
// GET Request
interface GetHistoryRequest {
  sessionId?: string;
  limit?: number;
}

// Response
interface ChatHistoryResponse {
  sessionId: string;
  messages: ChatMessage[];
  language: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Implementation Requirements

### Core Components

#### 1. `AIChatbot.tsx` - Main chatbot container

- Floating widget with open/close/minimize states
- Manages global chat state
- Handles session initialization
- Responsive positioning and sizing

#### 2. `ChatMessages.tsx` - Message display area

- Auto-scroll to latest message
- Virtual scrolling for long conversations
- Message grouping by timestamp
- Typing indicator during streaming

#### 3. `ChatInput.tsx` - Input field with validation

- Character count (max 500)
- Rate limiting feedback
- Enter to send, Shift+Enter for new line
- Loading state during submission

#### 4. `ChatSuggestions.tsx` - Contextual follow-ups

- Display 3-5 suggested questions
- Click to populate input
- Auto-generate based on last response

#### 5. `LanguageSelector.tsx` - Language switcher

- Dropdown with EN/HI/MR options
- Persists selection to user preferences
- Real-time translation (future enhancement)

### Custom Hooks

#### `useChat()` - Main chat logic

```typescript
export function useChat() {
  const [state, setState] = useState<ChatState>(initialState);
  
  const sendMessage = async (message: string) => {
    // 1. Validate input
    // 2. Add user message to state
    // 3. Call streaming API
    // 4. Process stream chunks
    // 5. Update messages with AI response
    // 6. Load suggestions
    // 7. Save to session history
  };
  
  return { state, sendMessage, /* ... */ };
}
```

#### `useChatHistory()` - Session persistence

```typescript
export function useChatHistory(sessionId: string | null) {
  const loadHistory = async () => {
    // Fetch from /api/chat/history
    // Populate messages
  };
  
  const saveMessage = async (message: ChatMessage) => {
    // Auto-save to Supabase
  };
  
  return { loadHistory, saveMessage };
}
```

#### `useChatSuggestions()` - Follow-up generation

```typescript
export function useChatSuggestions(lastMessage: ChatMessage | null) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    if (lastMessage) {
      generateSuggestions(lastMessage);
    }
  }, [lastMessage]);
  
  return { suggestions };
}
```

### Utility Functions

#### `lib/openai/chat-prompts.ts` - System prompts

```typescript
export const CHAT_SYSTEM_PROMPT = `
You are an AI assistant for Relationship Managers at Kairos Capital.
You help RMs query information about UHNW clients, liquidity events, and signals.

Your responses should:
1. Be concise and actionable
2. Reference specific clients/signals by name
3. Suggest next steps
4. Use financial terminology appropriately

Available data sources:
- Clients (name, wealth, products, lead score)
- Signals (IPO, M&A, funding events)
- Relationships (network connections, intro paths)
- Metrics (AUM, wallet share, performance)
`;

export const MULTILINGUAL_INSTRUCTIONS = {
  hi: 'Respond in Hindi (Devanagari script)',
  mr: 'Respond in Marathi (Devanagari script)',
  en: 'Respond in English'
};
```

#### `services/chatService.ts` - Business logic

```typescript
export async function processChatQuery(
  message: string,
  context: ChatContext,
  rmId: string
) {
  // 1. Classify query type
  const queryType = await classifyQuery(message);
  
  // 2. Extract entities (client names, dates, etc.)
  const entities = await extractEntities(message);
  
  // 3. Execute appropriate data retrieval
  const data = await fetchRelevantData(queryType, entities, rmId);
  
  // 4. Generate response with OpenAI
  const response = await generateResponse(message, data, context);
  
  // 5. Generate follow-up suggestions
  const suggestions = await generateSuggestions(queryType, response);
  
  return { response, suggestions, metadata: { queryType, entities } };
}
```

#### `lib/openai/query-classifier.ts` - Query classification

```typescript
export async function classifyQuery(message: string): Promise<QueryType> {
  const classification = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Classify the user's query into one of:
        - client_search (finding clients)
        - signal_search (finding liquidity events)
        - relationship_query (network/intro paths)
        - metrics_query (performance/AUM data)
        - general_question`
      },
      { role: 'user', content: message }
    ],
    temperature: 0.3
  });
  
  return classification.choices[0].message.content as QueryType;
}
```

#### `lib/neo4j/chat-queries.ts` - Graph queries for chatbot

```typescript
export async function findIntroPathForChat(
  targetPersonName: string,
  rmId: string
): Promise<IntroPath[]> {
  const query = `
    MATCH (rm:RM {id: $rmId})
    MATCH (target:Person)
    WHERE target.name CONTAINS $targetName
    MATCH path = shortestPath((rm)-[:KNOWS*1..3]-(target))
    RETURN path, length(path) as hops
    ORDER BY hops ASC
    LIMIT 3
  `;
  
  const result = await neo4jSession.run(query, { rmId, targetName });
  return result.records.map(parsePath);
}
```

---

## Acceptance Criteria

### Functional Requirements

#### Core Feature Functionality

✅ **AC 1.1**: Chatbot is accessible from main interface

- Floating chat icon visible on all dashboard pages
- Opens/closes with smooth animation
- Minimizes to icon when not in use

✅ **AC 1.2**: Natural language query understanding

- Example: "Which clients may experience liquidity events in the next 30 days?"
- Correctly identifies query intent
- Returns relevant list of clients with upcoming signals

✅ **AC 1.3**: Accurate data retrieval

- Queries PostgreSQL for client/signal data
- Queries Neo4j for relationship data
- Results are current (no stale cache)
- Returns "No results found" when appropriate

✅ **AC 1.4**: Inline result display

- Client names are clickable → navigate to client detail
- Signal cards show key info (type, timeline, severity)
- Results formatted as cards, not just text

✅ **AC 1.5**: Chat history persistence

- Messages persist within session
- History loads when reopening chat
- Clears only on logout or manual clear

✅ **AC 1.6**: Multilingual support

- Language selector with EN/HI/MR
- Detects input language (optional)
- Responds in selected language
- Maintains quality across languages

✅ **AC 1.7**: Contextual follow-up suggestions

- Shows 3-5 relevant follow-up questions
- Suggestions change based on last response
- Clicking suggestion populates input

### Non-Functional Requirements

#### Performance

- ⚡ Chat widget loads in <500ms
- ⚡ First token from AI in <1 second
- ⚡ Full response streamed in <3 seconds (avg)
- ⚡ Data queries complete in <500ms

#### Accessibility

- ♿ Keyboard navigation (Tab, Enter, Esc)
- ♿ Screen reader announces new messages
- ♿ ARIA labels on all interactive elements
- ♿ Color contrast meets WCAG AA

#### Security

- 🔒 Rate limiting prevents abuse (30 msgs/min)
- 🔒 Input sanitization prevents injection
- 🔒 No PII sent to OpenAI (use IDs only)
- 🔒 Chat history encrypted at rest

---

## Modified Files

### New Files

```
app/
├── api/
│   └── chat/
│       ├── route.ts                    ⬜ NEW - Streaming chat endpoint
│       └── history/
│           └── route.ts                ⬜ NEW - Get/save chat history

components/
└── features/
    └── chat/
        ├── AIChatbot.tsx               ⬜ NEW - Main chatbot component
        ├── ChatHeader.tsx              ⬜ NEW - Header with controls
        ├── ChatMessages.tsx            ⬜ NEW - Message list
        ├── ChatMessage.tsx             ⬜ NEW - Individual message bubble
        ├── ChatInput.tsx               ⬜ NEW - Input + send
        ├── ChatSuggestions.tsx         ⬜ NEW - Follow-up pills
        ├── LanguageSelector.tsx        ⬜ NEW - Language switcher
        ├── InlineClientCard.tsx        ⬜ NEW - Client preview
        ├── InlineSignalCard.tsx        ⬜ NEW - Signal preview
        └── hooks/
            ├── useChat.ts              ⬜ NEW - Main chat hook
            ├── useChatHistory.ts       ⬜ NEW - History persistence
            └── useChatSuggestions.ts   ⬜ NEW - Suggestions

lib/
├── openai/
│   ├── chat-prompts.ts                 ⬜ NEW - System prompts
│   └── query-classifier.ts             ⬜ NEW - Query classification
└── neo4j/
    └── chat-queries.ts                 ⬜ NEW - Graph queries for chat

services/
└── chatService.ts                      ⬜ NEW - Chat business logic

types/
└── chat.ts                             ⬜ NEW - Chat type definitions

constants/
└── chatConstants.ts                    ⬜ NEW - Chat config
```

### Modified Files

```
app/(dashboard)/
└── layout.tsx                          ✏️ MODIFY - Add floating chatbot

lib/openai/
└── client.ts                           ✏️ MODIFY - Add streaming config

lib/supabase/
└── client.ts                           ✏️ MODIFY - Add chat_sessions queries

types/
└── index.ts                            ✏️ MODIFY - Export chat types
```

---

## Implementation Status

**OVERALL STATUS**: ⬜ NOT STARTED

### Phase 1: Foundation & Setup

- ⬜ Create chat type definitions
- ⬜ Set up OpenAI client with streaming
- ⬜ Create chat_sessions table in Supabase (if not exists)
- ⬜ Set up API route structure

### Phase 2: Core Chat Implementation

- ⬜ Build AIChatbot container component
- ⬜ Implement ChatMessages with streaming support
- ⬜ Create ChatInput with validation
- ⬜ Build useChat hook for state management
- ⬜ Implement /api/chat streaming endpoint
- ⬜ Add basic query classification

### Phase 3: Data Integration

- ⬜ Integrate PostgreSQL queries (clients, signals)
- ⬜ Integrate Neo4j queries (relationships)
- ⬜ Build chatService for orchestration
- ⬜ Add inline result cards (ClientCard, SignalCard)
- ⬜ Implement entity extraction

### Phase 4: Enhanced Features

- ⬜ Add multilingual support (language selector)
- ⬜ Implement contextual suggestions
- ⬜ Build chat history persistence
- ⬜ Add rate limiting
- ⬜ Implement error handling and retry

### Phase 5: Polish & Testing

- ⬜ Add animations and transitions
- ⬜ Implement accessibility features
- ⬜ Mobile responsive design
- ⬜ Performance optimization
- ⬜ End-to-end testing

---

## Dependencies

### Internal Dependencies

- ✅ Supabase authentication (already implemented)
- ✅ Supabase database schema (clients, signals tables)
- ✅ Neo4j graph database setup
- ⬜ Design system components (Button, Input, Card)
- ⬜ Client and Signal type definitions

### External Dependencies

- OpenAI API (`gpt-4-turbo-preview`)
- Vercel AI SDK (`ai` package)
- Azure Speech API (for multilingual - optional)
- Radix UI primitives (Dropdown, Dialog)

### NPM Packages

```bash
npm install ai openai @azure/cognitiveservices-speech
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog
```

---

## Risk Assessment

### Technical Risks

#### **Risk 1: OpenAI API Latency**

- **Impact**: High - Slow responses hurt UX
- **Mitigation**:
  - Use streaming responses
  - Show typing indicator immediately
  - Set 10s timeout, fallback to error message
- **Contingency**: Cache common queries, use GPT-3.5-turbo for faster responses

#### **Risk 2: Query Classification Accuracy**

- **Impact**: Medium - Wrong data sources queried
- **Mitigation**:
  - Fine-tune classification prompts
  - Add user feedback loop ("Was this helpful?")
  - Log misclassifications for improvement
- **Contingency**: Provide "Refine query" suggestions

#### **Risk 3: Multilingual Quality**

- **Impact**: Medium - Poor Hindi/Marathi responses
- **Mitigation**:
  - Test extensively with native speakers
  - Use GPT-4 which has better multilingual support
  - Provide language-specific system prompts
- **Contingency**: Start EN-only, add languages in v2

#### **Risk 4: Rate Limiting Costs**

- **Impact**: Medium - High OpenAI API costs
- **Mitigation**:
  - Implement strict rate limiting (30/min)
  - Cache repetitive queries
  - Monitor usage per RM
- **Contingency**: Set monthly budget caps, throttle heavy users

### Business Risks

#### **Risk 1: User Adoption**

- **Impact**: High - Feature unused if not discoverable
- **Mitigation**:
  - Prominent floating widget
  - Onboarding tutorial
  - Sample questions on first open
- **Contingency**: Add trigger prompts ("Need help? Ask AI")

#### **Risk 2: Data Privacy Concerns**

- **Impact**: High - RMs hesitant to use due to data fears
- **Mitigation**:
  - Clear privacy policy in chat header
  - Never send PII to OpenAI
  - Data encryption compliance
- **Contingency**: Add "Private mode" that doesn't store history

---

## Testing Strategy

### Unit Tests (Jest)

**Test File**: `components/features/chat/ChatInput.test.tsx`

```typescript
describe('ChatInput', () => {
  it('should validate max length (500 chars)', () => {
    const { getByRole } = render(<ChatInput />);
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a'.repeat(501) } });
    expect(screen.getByText(/too long/i)).toBeInTheDocument();
  });
  
  it('should disable send button when empty', () => {
    const { getByRole } = render(<ChatInput />);
    expect(getByRole('button', { name: /send/i })).toBeDisabled();
  });
  
  it('should call onSend when Enter pressed', () => {
    const onSend = jest.fn();
    const { getByRole } = render(<ChatInput onSend={onSend} />);
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledWith('test message');
  });
});
```

**Test File**: `hooks/useChat.test.ts`

```typescript
describe('useChat', () => {
  it('should add user message to state when sending', async () => {
    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.sendMessage('test');
    });
    expect(result.current.messages).toContainEqual(
      expect.objectContaining({ role: 'user', content: 'test' })
    );
  });
  
  it('should handle streaming response', async () => {
    const mockStream = mockStreamingResponse();
    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.sendMessage('test');
    });
    expect(result.current.messages).toContainEqual(
      expect.objectContaining({ role: 'assistant' })
    );
  });
});
```

### Integration Tests (React Testing Library)

**Test File**: `components/features/chat/AIChatbot.integration.test.tsx`

```typescript
describe('AIChatbot Integration', () => {
  it('should complete full chat workflow', async () => {
    // Mock API responses
    mockChatAPI({ response: 'Here are 3 clients...' });
    
    const { getByRole, getByText } = render(<AIChatbot />);
    
    // Open chat
    fireEvent.click(getByRole('button', { name: /open chat/i }));
    
    // Type message
    const input = getByRole('textbox');
    fireEvent.change(input, { 
      target: { value: 'Which clients have IPO signals?' } 
    });
    
    // Send message
    fireEvent.click(getByRole('button', { name: /send/i }));
    
    // Wait for response
    await waitFor(() => {
      expect(getByText(/Here are 3 clients/i)).toBeInTheDocument();
    });
    
    // Check suggestions rendered
    expect(getByText(/Tell me more about/i)).toBeInTheDocument();
  });
  
  it('should handle API failures gracefully', async () => {
    mockChatAPI({ error: 'Network error' });
    
    const { getByRole, getByText } = render(<AIChatbot />);
    fireEvent.click(getByRole('button', { name: /open chat/i }));
    
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### API Tests (Next.js API Testing)

**Test File**: `app/api/chat/route.test.ts`

```typescript
describe('POST /api/chat', () => {
  it('should return streaming response', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        message: 'Show me top clients',
        sessionId: 'test-session'
      })
    });
    
    const response = await POST(req);
    expect(response.headers.get('content-type')).toContain('text/event-stream');
    
    // Read stream
    const reader = response.body?.getReader();
    const chunks = [];
    while (true) {
      const { done, value } = await reader?.read();
      if (done) break;
      chunks.push(value);
    }
    
    expect(chunks.length).toBeGreaterThan(0);
  });
  
  it('should enforce rate limiting', async () => {
    // Send 31 requests rapidly
    const requests = Array(31).fill(null).map(() => 
      fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'test' })
      })
    );
    
    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.status === 429);
    expect(rateLimited).toBe(true);
  });
});
```

### E2E Tests (Playwright)

**Test File**: `e2e/chat-flow.spec.ts`

```typescript
test.describe('AI Chatbot E2E', () => {
  test('complete chat interaction flow', async ({ page }) => {
    // Login as RM
    await page.goto('/login');
    await page.fill('input[name="email"]', 'rm@test.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Navigate to dashboard
    await page.waitForURL('/dashboard');
    
    // Open chat
    await page.click('[data-testid="chat-toggle"]');
    await expect(page.locator('[data-testid="chat-widget"]')).toBeVisible();
    
    // Send message
    await page.fill('[data-testid="chat-input"]', 
      'Which clients may have liquidity events in the next 30 days?');
    await page.click('[data-testid="chat-send"]');
    
    // Wait for response
    await expect(page.locator('[data-testid="chat-message-assistant"]'))
      .toBeVisible({ timeout: 5000 });
    
    // Check for client cards
    await expect(page.locator('[data-testid="inline-client-card"]').first())
      .toBeVisible();
    
    // Click suggestion
    await page.click('[data-testid="chat-suggestion"]');
    await expect(page.locator('[data-testid="chat-input"]'))
      .not.toBeEmpty();
    
    // Verify history persists
    await page.click('[data-testid="chat-minimize"]');
    await page.click('[data-testid="chat-toggle"]');
    await expect(page.locator('[data-testid="chat-message-user"]'))
      .toHaveCount(2); // Original + suggestion
  });
  
  test('multilingual support', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('[data-testid="chat-toggle"]');
    
    // Switch language
    await page.click('[data-testid="language-selector"]');
    await page.click('[data-testid="language-option-hi"]');
    
    // Send message in Hindi
    await page.fill('[data-testid="chat-input"]', 
      'कौन से ग्राहकों के पास लिक्विडिटी इवेंट्स हो सकते हैं?');
    await page.click('[data-testid="chat-send"]');
    
    // Verify response in Hindi
    const response = await page.locator('[data-testid="chat-message-assistant"]');
    await expect(response).toContainText(/ग्राहक/);
  });
});
```

**How to Run Tests**:

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test
```

---

## Performance Considerations

### Bundle Optimization

- **Code splitting**: Lazy load chatbot on first interaction

  ```typescript
  const AIChatbot = lazy(() => import('@/components/features/chat/AIChatbot'));
  ```

- **Tree shaking**: Import only used Radix UI components
- **Compression**: Use streaming responses to reduce payload size

### Runtime Performance

- **Memoization**: Use `useMemo` for expensive suggestion generation

  ```typescript
  const suggestions = useMemo(() => 
    generateSuggestions(lastMessage), 
    [lastMessage]
  );
  ```

- **Virtual scrolling**: Use `react-window` for long chat histories (>100 messages)
- **Debouncing**: Debounce typing indicator updates (300ms)

### Caching Strategy

- **Session cache**: Store chat session in memory during session
- **Query cache**: Cache common queries for 5 minutes (e.g., "top clients")
- **API response cache**: Use SWR for chat history (stale-while-revalidate)

---

## Deployment Plan

### Development Phase

1. **Feature branch**: `feature/06-ai-chatbot`
2. **Environment**: Development with test OpenAI key
3. **Testing**: All unit/integration tests pass
4. **Code review**: PR with detailed description

### Staging Phase

1. **Deploy to staging**: Merge to `develop` branch
2. **UAT**: 3-5 RMs test chatbot with real data
3. **Performance test**: Load test with 50 concurrent users
4. **Security scan**: Verify no PII leakage

### Production Phase

1. **Feature flag**: Enable for 10% of RMs (canary)
2. **Monitor metrics**:
   - Response times (p50, p95, p99)
   - Error rates
   - OpenAI API costs
3. **Gradual rollout**: 10% → 25% → 50% → 100% over 2 weeks
4. **Rollback plan**: Feature flag disable in <5 minutes

---

## Monitoring & Analytics

### Performance Metrics

- **API Response Time**: Track p50, p95, p99 latencies
- **Streaming Start Time**: Measure time to first token
- **Query Success Rate**: % of queries returning valid data
- **Error Rate**: Failed queries / total queries

### Business Metrics

- **Adoption Rate**: % of RMs using chatbot weekly
- **Queries Per Session**: Average messages per RM
- **Suggestion Click Rate**: % of suggestions clicked
- **Query Types**: Distribution of client/signal/relationship queries

### Technical Metrics

- **OpenAI Token Usage**: Track tokens per query (cost monitoring)
- **Database Query Performance**: SQL/Cypher query times
- **Rate Limit Hits**: # of rate-limited requests
- **Client-side Errors**: JS exceptions in chat component

**Monitoring Tools**:

- Vercel Analytics (frontend performance)
- Supabase Dashboard (database metrics)
- OpenAI Usage Dashboard (API costs)
- Sentry (error tracking)

---

## Documentation Requirements

### Technical Documentation

- **API Integration Guide**: How to query chatbot API
- **System Prompts**: Document all OpenAI prompts used
- **Query Classification**: Decision tree for query types
- **Troubleshooting**: Common issues and fixes

### User Documentation

- **Feature Usage Guide**: "How to use AI Chatbot"
- **Sample Questions**: 20+ example queries by category
- **Language Switching**: How to change chat language
- **FAQ**: Common questions about privacy, accuracy

---

## Post-Launch Review

### Success Criteria

- ✅ 70%+ of RMs use chatbot at least once per week
- ✅ Average response time <2 seconds (p95)
- ✅ Query success rate >85%
- ✅ OpenAI API costs <$500/month for 30 RMs
- ✅ User satisfaction score >4.0/5.0

### Retrospective Items

- **Lessons Learned**: What went well, what didn't
- **Process Improvements**: Better testing, faster deployment
- **Technical Debt**: Identified issues to address
  - Example: Refactor query classification for better accuracy
  - Example: Add caching layer for repeated queries

### Future Enhancements

- Voice input support (whisper API integration)
- Real-time data refresh during chat
- Export chat transcript feature
- AI-suggested proactive insights ("Did you know...")
- Custom saved queries/templates

---

## Appendix

### Example Queries

**Client Search**:

- "Which clients may experience liquidity events in the next 30 days?"
- "Show me clients in the fintech sector with high lead scores"
- "Who are my top 5 clients by AUM?"

**Signal Search**:

- "Any recent IPO filings?"
- "Show me M&A signals from this week"
- "Critical signals for my clients"

**Relationship Queries**:

- "How can I get introduced to Amit Sharma?"
- "Who in my network knows founders in edtech?"
- "Show me warm intro paths to XYZ Corp"

**Metrics Queries**:

- "What's my total AUM this month?"
- "How many follow-ups do I have pending?"
- "My performance vs team average"

---

### OpenAI Prompt Examples

**System Prompt**:

```
You are an AI assistant for Relationship Managers at Kairos Capital, 
helping them manage Ultra High Net Worth (UHNW) clients.

Your role is to:
1. Answer questions about clients, liquidity events, and signals
2. Provide actionable insights based on data
3. Suggest next steps for client engagement
4. Be concise, professional, and wealth-focused

Available data:
- Client profiles (name, wealth, products, lead score, health status)
- Liquidity signals (IPO, M&A, funding rounds, promoter activity)
- Network relationships (connections, intro paths, influencers)
- Performance metrics (AUM, wallet share, conversions)

When responding:
- Reference specific clients by name when relevant
- Include signal severity and timeline
- Suggest follow-up actions
- Format responses with bullet points for readability
- Never hallucinate data - only use provided information
```

**Query Classification Prompt**:

```
Classify the user's query into ONE of these categories:

1. client_search - Finding/filtering clients (e.g., "top clients", "clients in Mumbai")
2. signal_search - Finding liquidity events (e.g., "IPO signals", "M&A this week")
3. relationship_query - Network/intro paths (e.g., "introduce me to X", "who knows Y")
4. metrics_query - Performance/AUM data (e.g., "my AUM", "pending follow-ups")
5. general_question - Other questions about system or advice

Return ONLY the category name, nothing else.

Query: "{user_query}"
Category:
```

---

## Sign-off

**Created by**: AI Implementation Planner
**Date**: 2025-12-19
**Version**: 1.0
**Status**: Ready for Review

**Approval Required From**:

- [ ] Product Manager (business requirements)
- [ ] Tech Lead (architecture review)
- [ ] Security Lead (data privacy sign-off)
- [ ] RM Representatives (user acceptance)

---
