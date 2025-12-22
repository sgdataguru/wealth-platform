# [22] Login Page for Cockpit

## 🎯 Overview

**Feature**: Secure & Immersive Login Experience  
**Goal**: Create a premium entry point to the Morning Cockpit that reflects the "Universe of Opportunities" theme through an immersive shooting stars background.

## 👤 User Story
>
> **As a** Relationship Manager,  
> **I want** to log in to the Cockpit via a secure, visually stunning interface with a live shooting stars background,  
> **So that** I feel the premium nature of the UHNW platform immediately upon entry while ensuring my workspace is secure.

## ✅ Acceptance Criteria

### Visual Design & Aesthetics

- [ ] **Background**: Live, animated "Shooting Stars" effect on a deep space gradient (Deep Blue `#0A1628` → Black).
- [ ] **Glassmorphism**: Login form container should use a glass effect (blur + translucency) to float above the stars.
- [ ] **Branding**: Prominent "Nuvama Wealth" or "UHNW Cockpit" logo in Gold/White.
- [ ] **Typography**: Use `Playfair Display` for headings and `Inter` for input fields.
- [ ] **Animations**: Smooth fade-in of the form upon page load.

### Functional Requirements

- [ ] **Input Fields**:
  - Email/Username (with validation)
  - Password (with show/hide toggle)
- [ ] **Actions**:
  - "Sign In" button (Gradient Gold/Primary)
  - "Forgot Password" link
  - "Remember Me" checkbox
- [ ] **Feedback**:
  - Loading spinner on submit
  - Error messages for invalid credentials
- [ ] **Responsiveness**: Fully responsive on Mobile, Tablet, and Desktop.

### Technical Specs

- **Animation**: CSS Animations or Canvas based (lightweight) for shooting stars.
- **Route**: `/login`
- **Auth Integration**: Connect to Supabase Auth.

## 🖼️ Wireframe Concept

*(To be implemented)*

- **Background**: Infinite deep blue void with occasional shooting stars crossing diagonally.
- **Center**: Frosted glass card containing the logo and form.

---
**Priority**: High (Entry Point)
**Design Theme**: "Cosmic Premium"
