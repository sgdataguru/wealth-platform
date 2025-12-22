# [22] Login Page for Cockpit - Implementation Plan

## Project Context
**Technical Stack**: Next.js 16 (App Router), React 19, TypeScript 5, TailwindCSS 4
**Backend**: Mock Auth (MVP), Supabase Auth (Future)
**Infrastructure**: Render (Hosting)
**Design System**: Nuvama Wealth Aesthetic (Premium UHNW)

---

## User Story

**As a** Relationship Manager,  
**I want** to log in to the Cockpit via a secure, visually stunning interface with a live shooting stars background,  
**So that** I feel the premium nature of the UHNW platform immediately upon entry while ensuring my workspace is secure.

---

## Pre-conditions

- ✅ Next.js 16 project initialized with App Router
- ✅ TailwindCSS configured with custom design tokens
- ✅ TypeScript configured with strict mode
- ✅ Design system colors and typography defined
- ⬜ Demo credentials for MVP testing

---

## Business Requirements

### BR-1: Premium First Impression
**Metric**: User engagement on login page
**Success Criteria**: < 3 second load time with animations

### BR-2: Secure Authentication
**Metric**: Zero unauthorized access
**Success Criteria**: Valid credential validation, session management

### BR-3: Seamless Entry to Cockpit
**Metric**: Login-to-dashboard time
**Success Criteria**: < 2 seconds from successful login to dashboard render

---

## Technical Specifications

### Authentication Flow
- **MVP**: Demo credentials (hardcoded for demo)
- **Production**: Supabase Auth integration
- **Session**: localStorage for demo, JWT for production

### Demo Credentials
```
Email: demo@nuvama.com
Password: cockpit2025
```

### Security Requirements (Production)
- JWT (short-lived) + refresh tokens
- HTTP-only cookies
- Input sanitization
- Rate limiting on login attempts

---

## Design Specifications

### Visual Layout

```
[Full Screen Background - Shooting Stars Animation]
│
├── [Centered Glass Card Container]
│   ├── Logo (Nuvama Wealth)
│   ├── Welcome Text
│   ├── Email Input
│   ├── Password Input (with toggle)
│   ├── Remember Me Checkbox
│   ├── Sign In Button (Gold Gradient)
│   └── Forgot Password Link
│
└── [Footer - Copyright]
```

### Color Palette
```css
--bg-deep-blue: #0A1628;
--bg-black: #000000;
--primary-gold: #C9A227;
--primary-gold-light: #D4AF37;
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--text-white: #FFFFFF;
--text-muted: #8E99A4;
--error-red: #EF4444;
```

### Typography
- **Logo/Heading**: Playfair Display, Bold
- **Body/Inputs**: Inter, Regular/Medium
- **Button**: Inter, Semibold

### Responsive Breakpoints
- **Mobile**: < 640px - Full width card, smaller padding
- **Tablet**: 640px - 1024px - Centered card, medium padding
- **Desktop**: > 1024px - Centered card, large padding

---

## Component Architecture

```
app/
├── login/
│   └── page.tsx                    # Login page
├── components/
│   └── ui/
│       └── ShootingStars.tsx       # Background animation
└── lib/
    └── auth/
        └── demo-auth.ts            # Demo authentication
```

---

## Implementation Status

**OVERALL STATUS:** ⬜ NOT STARTED

### Phase 1: Foundation
- [ ] Create `/login` route
- [ ] Implement shooting stars background
- [ ] Create glass card container

### Phase 2: Form Implementation
- [ ] Email input with validation
- [ ] Password input with show/hide toggle
- [ ] Remember me checkbox
- [ ] Sign in button with loading state

### Phase 3: Authentication
- [ ] Demo auth service
- [ ] Form validation
- [ ] Error handling
- [ ] Redirect to cockpit on success

### Phase 4: Polish
- [ ] Animations and transitions
- [ ] Responsive design
- [ ] Accessibility

---

## Acceptance Criteria

### Functional
- [ ] User can enter email and password
- [ ] Password visibility toggle works
- [ ] Form validates inputs before submit
- [ ] Demo credentials authenticate successfully
- [ ] Invalid credentials show error message
- [ ] Successful login redirects to `/rm/morning-cockpit`

### Non-Functional
- [ ] Page loads in < 3 seconds
- [ ] Animations run at 60fps
- [ ] Fully responsive
- [ ] Keyboard accessible

---

## Testing

### Demo Credentials
```
Email: demo@nuvama.com
Password: cockpit2025
```

### Test Cases
1. Valid login → Redirect to cockpit
2. Invalid email → Show validation error
3. Invalid password → Show "Invalid credentials" error
4. Empty fields → Show required field errors

