# Changelog — BrainDrop

> Every significant change with date, what changed, why, and business impact.

---

## April 28, 2026 — DESIGN.md Established ("Quiet Competence")

### First formal design system
- Created DESIGN.md at repo root as source of truth for all visual decisions
- Updated CLAUDE.md to require future skills to read DESIGN.md before designing
- System: "Quiet Competence" — editorial calm × data-as-aesthetic
- **Anchor:** "I can see myself getting better"
- **Type stack:** Fraunces (display) + Geist (body) + Geist Mono (numerics) — all free
- **Accent:** deep teal `#0d4d4a` light / `#2dd4bf` dark — ONE color only
- **Themes:** light + dark, both first-class
- **Spacing:** 4px base scale
- **Motion:** single Apple-spring easing curve, four duration tokens
- **Impact:** every future design-shotgun, design-review, and component decision now has a rulebook to defend against. Surfaces stop drifting.

### Four deliberate risks (where BrainDrop earns its face)
- No streak counter on home screen (sparkline one tap deeper)
- Fraunces serif display in kid-EdTech category (departure from sans-serif convention)
- One accent color only (restraint as flex)
- Typographic Study Receipt replaces celebration screens
- **Impact:** anti-Duolingo posture. Treats students as serious readers, not players.

### F resolution
- F's information architecture survives (mastery ring, 4 stat cards, lesson rows with mini-charts, next-up CTA)
- F's decorative layer retires (cream paper, Caveat handwriting, doodled stars, yellow highlighter sweep, rotated angles)
- Component migration to new tokens is a separate engineering pass
- **Impact:** F was a one-surface win at a moment when no system existed; now a system exists and F gets re-rendered to fit it

### Visual preview
- Preview page at `~/.gstack/projects/RajaMDM-braindrop/designs/design-system-20260428/preview.html`
- Shows the system applied to 4 real surfaces (chapter detail, study receipt, AI tutor, progress dashboard) in both themes
- **Impact:** any future stakeholder review (parents, beta students, Raja's daughters) can see the brand without reading code

---

## April 28, 2026 — v7 Course/Chapter Design Refresh

### Variant F — "Warm Dashboard" theme on chapter detail
- New `ChapterDetailView.jsx` replaces inline lesson expansion with a dedicated page
- Hero with kicker ("chapter four"), highlighted-word title, plain-English subtitle
- Four stat cards: Mastery %, Lessons (X/Y), Status (Locked/New/In progress/Done), XP earned
- Animated mastery ring (SVG, framer-motion)
- "Next up" Resume card auto-targets the first incomplete lesson
- Lesson rows with mini progress bars, yellow highlighter shadow on the active row, red doodled stars on completed lessons
- Friendly footer microcopy ("2 down, 2 to go → finish this chapter, earn the badge")
- **Impact:** Chapter detail finally has its own design language; warmer voice without losing data density

### Theme scoping (`.theme-paper`)
- New CSS variable namespace `--p-*` for the warm cream palette
- Scoped to course/chapter surfaces only via wrapper class
- Chat, classroom, modals, and AI surfaces remain on the original dark synthwave
- **Impact:** Theme switch becomes a wayfinding cue ("you're entering study mode") without forcing a brand-wide change

### Inline lesson expansion removed
- `ChapterCard.jsx` no longer expands AnimatePresence with an inline lesson list
- `selectChapter(chId)` now navigates to `ChapterDetailView` via `activeChapter` state
- `CourseView.jsx` conditionally renders detail or list based on `activeChapter`
- **Impact:** One source of truth for chapter content; eliminates the visual paradigm mismatch between the inline tile and the full-page expansion

### New fonts
- Caveat (handwriting, used in 4 narrative spots)
- Inter (replaces Fredoka for course-surface body and headings)
- Both added to existing Google Fonts link in `index.html`
- **Impact:** Type system supports a separate visual register without removing any existing fonts

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
- 63 NCERT chapters across 5 Grade 10 subjects with sequential lessons (Grade 10 only — Grade 7 has flat topic lists, no structured chapters yet)
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
- 7 learning modes: Explain, Socratic, Quiz, Flashcard, Exam Prep, AI Tutor, Classroom

---

*Last updated: April 3, 2026*
