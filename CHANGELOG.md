# Changelog — BrainDrop

> Every significant change with date, what changed, why, and business impact.

---

## April 3, 2026 — v6 Platform Upgrade

### Classroom Mode
- Added multi-agent AI classroom with Teacher + 2 Classmates
- Grade 10: Sunita Ma'am, Aabha, Optimus Prime
- Grade 7: Rupa Ma'am, Buffy, BumbleBee
- Each agent uses a different AI provider for diverse perspectives
- Subject lock prevents agents from drifting off-topic
- **Impact:** Students experience collaborative learning, not just Q&A

### MagicBlocks (Interactive Simulations)
- AI generates self-contained HTML simulations rendered as sandboxed iframes
- Auto-detect when topics benefit from visualization + `/sim` command + button
- **Impact:** Physics, geometry, chemistry become hands-on and visual

### Assessment System
- Structured quiz engine with JSON MCQs and auto-grading (5 Qs per round)
- Flashcard decks with flip animation and mastery tracking
- Score History panel (🏆) aggregating results across all subjects
- **Impact:** Students get measurable feedback, not just AI conversation

### Analytics Dashboard
- Subject progress bars, 28-day activity heatmap, strengths/weaknesses
- AI usage breakdown
- **Impact:** Students and parents can track learning patterns

### Structured Courses
- 63 NCERT chapters across 5 Grade 10 subjects with sequential lessons
- Linear unlock: complete chapters to unlock next
- Certificate celebration on subject completion
- XP bonuses: 20/lesson, 50/chapter, 100/subject
- **Impact:** Transforms BrainDrop from chat tool to structured learning platform

### RAG Pipeline
- Client-side TF-IDF retrieval over NCERT content
- Replaces 50K char PDF dump with top 5 relevant chunks (~2500 chars)
- **Impact:** ~95% token reduction, faster responses, better accuracy

### API Security
- All 4 AI providers now route through Cloudflare Worker proxy
- Zero API keys exposed to browser
- Separate Worker (`braindrop-ai-proxy`) from Data Alchemist
- **Impact:** No key theft risk, safe for public deployment

### Auth Cleanup
- Removed intrusive email prompt gate
- Opened registration (removed 3-email whitelist)
- Made name AND email mandatory for guest login (spam prevention)
- Synced identity fields across all auth flows
- **Impact:** Any student can join, but with accountability

### Zero-Config UX
- Removed all API key input fields from Settings
- Settings now: just name + preferred AI engine
- **Impact:** Students open the app and start learning — zero friction

### NVIDIA Integration
- Added NVIDIA Llama 3.3 70B as primary AI provider (free tier)
- Fallback order: NVIDIA → Groq → Gemini → Claude
- **Impact:** Free providers handle most traffic, paid providers as backup

---

## Pre-April 2026 — v5 (Foundation)

### Cloudflare R2 Migration
- NCERT PDFs migrated from local `/books/` to Cloudflare R2 CDN
- Identity headers for R2-linked providers
- **Impact:** Faster PDF loading, global CDN delivery

### Multi-AI Foundation
- 7 AI engines: Claude, Gemini, GPT, Groq, DeepSeek, Mistral, Ollama
- Smart fallback chain with daily usage limits
- Per-subject chat memory (localStorage)
- **Impact:** Redundancy — if one AI is down, others take over

### Core Features
- Google Sign-in with guest bypass
- XP system, streaks, gamification
- Stats dashboard with CSV export
- CBSE exam pattern archive (2015–2024)
- 5 learning modes: Explain, Socratic, Quiz, Exam Prep, AI Tutor

---

*Last updated: April 3, 2026*
