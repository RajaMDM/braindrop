# Project History — BrainDrop

> Business-readable narrative of what was built, why, and how it evolved.

---

## Overview
BrainDrop is a free, open-source AI-powered study companion for CBSE students. It started as a personal project to help my daughters Alishba and Inaayah with their studies, and evolved into a full learning platform open to every student everywhere.

Live at: https://rajamdm.github.io/braindrop
Repository: https://github.com/RajaMDM/braindrop
Built by: Raja Shahnawaz Soni

---

## Timeline

### Phase 1 — Concept & Early Versions (v1–v4)
The initial idea: give my daughters an AI tutor that understands the CBSE curriculum. Early versions were basic chat interfaces with a single AI engine. Each iteration added capabilities — multiple AI providers, subject-specific context, and session memory.

### Phase 2 — BrainDrop v5 (Stable Foundation)
Major overhaul that made BrainDrop usable by anyone:
- Expanded to multiple AI engines with smart fallback chain.
- Added Google Sign-in with guest bypass — no student gets locked out.
- Per-subject chat memory persisting across sessions via localStorage.
- XP system and gamification mechanics to keep students engaged.
- Stats dashboard with CSV export for tracking study patterns.
- CBSE exam pattern archive covering 2015–2024.
- NCERT PDF textbooks hosted on Cloudflare R2 for instant access.

### Phase 3 — Platform Upgrade (v6, April 2026)
Massive feature expansion in a single session, transforming BrainDrop from a chat tool into a full learning platform:

**Classroom Mode (OpenMAIC-inspired)**
Introduced a multi-agent AI classroom where students learn through simulated classroom discussions. Grade-specific characters make it feel alive:
- Grade 10: Sunita Ma'am (teacher), Aabha (studious classmate), Optimus Prime (bold, dramatic classmate who makes wild analogies)
- Grade 7: Rupa Ma'am (gentle teacher), Buffy (playful classmate), BumbleBee (shy-then-excited classmate)
- Each agent uses a different AI provider, creating diverse perspectives.
- Subject lock ensures agents never drift off-topic.

**MagicBlocks (Interactive Simulations)**
AI-generated interactive HTML simulations rendered as sandboxed iframes directly in chat. Physics experiments, geometry visualizers, chemistry reactions, graph plotters — all self-contained with no external dependencies. Students can also type `/sim` to request simulations on demand.

**Assessment System**
- Structured Quiz Engine: AI generates JSON-formatted MCQs. The app auto-grades with green/red highlighting, explanations, and score summaries. Results saved to learning profile.
- Flashcard Decks: AI generates flashcard sets with flip animation and mastery tracking. "Got it" / "Need practice" progression with XP rewards.
- Score History Panel: Aggregates quiz results across all subjects with accuracy tracking.

**Analytics Dashboard**
Visual progress tracking with subject progress bars, 28-day activity heatmap, strengths/weak areas tags, and AI usage breakdown.

**Structured Courses (NCERT Chapters)**
63 NCERT chapters across all 5 Grade 10 subjects, each with sequential lessons. Linear unlock system — complete chapters to unlock the next. Certificate celebration on subject completion. XP bonuses at lesson, chapter, and subject milestones.

**RAG Pipeline**
Client-side TF-IDF retrieval replaces the brute-force 50K char PDF dump. NCERT text is chunked into ~500 char segments, indexed, and the top 5 most relevant chunks are retrieved per query. ~95% reduction in token usage with better answer relevance.

**API Security Overhaul**
All AI providers now route through a dedicated Cloudflare Worker proxy (`braindrop-ai-proxy`). Zero API keys exposed to the browser. Separate worker from Data Alchemist to avoid disruption.

**Auth Cleanup**
Removed the intrusive email prompt gate. Opened registration (removed whitelist). Made name and email mandatory for guest login. Synced identity across all auth flows.

**Zero-Config UX**
Removed all API key input fields from Settings. Users just open BrainDrop and start learning — no setup, no keys, no friction.

**NVIDIA Integration**
Added NVIDIA (Llama 3.3 70B) as an AI provider via their OpenAI-compatible API. Free tier, positioned as primary provider alongside Groq, Gemini, and Claude.

---

## Current State (April 2026)

### What Students See
1. Open BrainDrop → Sign in (Google or name+email) → Choose subject → Start learning
2. 8 learning modes: Explain, Socratic, Quiz, Flashcards, Exam Prep, AI Tutor, Classroom
3. NCERT chapters with progress tracking and unlock mechanics
4. Interactive simulations generated on-the-fly
5. Score history and analytics dashboard

### Technical Stack
- Frontend: Single-file SPA (index.html, ~1470 lines), vanilla HTML/CSS/JS
- AI Providers: NVIDIA, Groq, Gemini, Claude (4 active, all proxied)
- Infrastructure: GitHub Pages (frontend), Cloudflare Workers (API proxy), Cloudflare R2 (PDF hosting)
- Storage: Browser localStorage (user data, progress, memory)
- PDFs: NCERT textbooks via Cloudflare R2 CDN

### What's Next
See ROADMAP.md for planned features.

---

*Last updated: April 3, 2026*
