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
- NCERT PDF textbooks hosted on Cloudflare R2 for instant access (Grade 10 subjects configured; Grade 7 PDFs are pending upload).

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
63 NCERT chapters across all 5 Grade 10 subjects (Grade 10 only — Grade 7 has flat topic lists but no structured chapter data yet), each with sequential lessons. Linear unlock system — complete chapters to unlock the next. Certificate celebration on subject completion. XP bonuses at lesson, chapter, and subject milestones.

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

## April 28, 2026 — First Formal Design System ("Quiet Competence")

**Why this happened.** Twenty-four hours after shipping the F-themed chapter detail page, the founder reviewed the broader app and concluded the rest of BrainDrop "looks substandard, like a school project." The dark synthwave aesthetic from v6 worked when BrainDrop was four AI engines and a chat box, but no longer fit the multi-modal study companion the product had grown into. The decision: stop iterating surface-by-surface and establish a formal design system that every future surface can defend against.

**The exploration.** /design-consultation was invoked with Apple Education + Notion + Linear/Vercel as brand references and "I can see myself getting better" as the emotional anchor — chosen over alternative anchors like "treats me like I'm smart" or "calm place to study." Three voices proposed independently (Claude main, an indie-studio Claude subagent in the background, and an attempted Codex consult that wasn't installed locally). The subagent independently arrived at the same emotional thesis ("older than they expected to feel") and contributed two genuinely novel ideas that were adopted: no streak counter on the home screen (sparkline one tap deeper) and a typographic Study Receipt replacing celebration screens.

**What shipped.** DESIGN.md committed to repo root as the source of truth. CLAUDE.md updated to require future skills to read it before any visual decision. Visual preview page generated in `~/.gstack/projects/RajaMDM-braindrop/designs/design-system-20260428/preview.html` showing the system applied to four real BrainDrop surfaces (chapter detail, study receipt, AI tutor chat, progress dashboard) in both light and dark themes. The system: Fraunces variable serif for display, Geist for body and UI, Geist Mono for numerics; deep teal `#0d4d4a` as the only accent (lifted to `#2dd4bf` in dark mode); 4px spacing scale; soft shadows in three levels; one easing curve and four duration tokens. The four deliberate "risks" — no streak counter, serif display in kid-EdTech, one accent only, and typographic Study Receipts — are where BrainDrop earns its face vs. category convention.

**The F resolution.** Yesterday's F-themed chapter detail design (cream paper, Caveat handwriting, doodled red stars, yellow highlighter sweeps) was approved at a moment when no system existed. Today's system retires F's decorative layer while preserving its information architecture (mastery ring, 4 stat cards, lesson rows with mini progress charts, next-up CTA). The codebase still runs the old F components — converting them to the Quiet Competence tokens is a separate engineering pass.

---

## April 2026 — Course/Chapter Design Refresh (v7)

**Why this happened.** The chapter detail experience had been the same since the original v6 release: tightly packed dark synthwave tiles where clicking a chapter expanded an inline lesson list. Functionally complete, but visually it treated students like users of an app rather than students of a chapter. With Grade 10 boards as the primary use case, the surface where students live the longest deserved its own design language.

**The exploration.** Five distinct design directions were generated through a /design-shotgun visual brainstorm — Editorial Magazine, Mission Control Dashboard, Student Notebook, Brutalist Big Type, and Aurora Glassmorphism. Two resonated: the dashboard for its information density and motivating data, and the notebook for its warmth and disarming voice. A sixth fusion direction ("Variant F — Warm Dashboard") was generated to combine the dashboard's data backbone with the notebook's friendlier voice, dropping the parts that felt cold or noisy. F was approved on first showing.

**What shipped.** A theme-scoped re-skin of the course/chapter surface. Cream paper background, white cards, Inter for legibility, Caveat handwriting only at four narrative moments (kicker, section header, "next up" label, footer). The previous inline lesson-expansion UX was replaced by a dedicated ChapterDetailView with a hero, four stat cards (Mastery, Lessons, Status, XP earned), an animated mastery ring, a "next up" Resume card, and a clean lesson list with mini progress bars and red doodled stars on completed lessons. The active lesson gets a yellow highlighter shadow. Chat, classroom, and AI surfaces remain on the original dark synthwave — the warm theme is scoped to course-detail surfaces only, used as a wayfinding cue for "you're entering study mode."

---

## Current State (April 2026)

### What Students See
1. Open BrainDrop → Sign in (Google or name+email) → Choose subject → Start learning
2. 7 learning modes: Explain, Socratic, Quiz, Flashcard, Exam Prep, AI Tutor, Classroom
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

*Last updated: April 28, 2026*
