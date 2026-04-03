# BrainDrop — Project Instructions

## What This Is
BrainDrop is a free, open-source AI-powered CBSE study companion for students.
Live at: rajamdm.github.io/braindrop
Built for my daughters (Alishba and Inaayah) and open to every student everywhere.

## Architecture
- Single-file SPA (`index.html`, ~1470 lines) deployed to GitHub Pages.
- All AI calls route through Cloudflare Worker proxy (`braindrop-ai-proxy`) — zero keys in browser.
- NCERT PDFs hosted on Cloudflare R2 CDN.
- User data stored in browser localStorage (no backend database yet).
- No build toolchain — runs directly in browser.

## Key Features (v6 — Current)
- 4 AI engines: NVIDIA (Llama 3.3 70B), Groq (Llama 3.3), Gemini (2.5 Flash), Claude (Haiku 4.5).
- 7 learning modes: Explain, Socratic, Quiz, Flashcard, Exam Prep, AI Tutor, Classroom.
- Multi-agent Classroom: grade-specific Teacher + 2 Classmates with distinct personalities.
- MagicBlocks: AI-generated interactive HTML simulations (sandboxed iframes).
- Structured Courses: 63 NCERT chapters (Grade 10 only) with progress tracking, unlock mechanics, certificates. Grade 7 has flat topic lists only — no structured chapter data yet.
- Assessment: auto-graded MCQ quiz engine, flashcard decks with mastery tracking, score history.
- Analytics Dashboard: subject progress, activity heatmap, strengths/weaknesses, AI usage.
- RAG Pipeline: client-side TF-IDF retrieval over NCERT content (~95% token reduction).
- Google Sign-in + mandatory name/email guest login.
- XP system, streaks, gamification.
- CBSE exam pattern archive: 2015–2024.

## Pending Work
- Upload remaining NCERT PDFs to Cloudflare R2.
- Configure Google OAuth Client ID for production.
- Add Grade 7 course content (chapters/lessons).

## Access Model
Open registration — anyone can sign in via Google or guest (name + email required).
All AI features are free — no API keys needed from users.
API keys are managed server-side in Cloudflare Worker secrets.

## Infrastructure
- **Frontend:** GitHub Pages (static hosting, no custom domain yet).
- **API Proxy:** Cloudflare Worker (`braindrop-ai-proxy.raja-cloudmdm.workers.dev`).
- **PDF CDN:** Cloudflare R2 (`pub-43d99302f45b4dc39117bd0f283acb00.r2.dev`).
- **CRITICAL:** `braindrop-ai-proxy` is SEPARATE from `braindrop-proxy` (Data Alchemist). Never merge or overwrite.
- Must work on mobile browsers (students primarily use phones).

## Code Conventions
- Vanilla HTML/CSS/JS. No framework, no build step.
- Inline styles acceptable. CSS variables defined in `:root`.
- All AI providers follow the same interface pattern in `callProvider()` and `callProviderWithSys()`.
- Structured content uses tag extraction in `md()`: `<quiz-data>`, `<flashcard-data>`, `<magic-block>`.
- Error handling must include user-friendly messages — audience is school students.

## What NOT To Do
- Never hardcode API keys or secrets in source.
- Never break the guest access path — content must be usable without sign-in.
- Never use real brand names in sample data or UI copy.
- Never deploy to `braindrop-proxy` Worker — that's Data Alchemist's.
- Never add providers to the UI that don't have actual keys in the Worker.
- Never introduce backend dependencies without discussing migration path and cost.
