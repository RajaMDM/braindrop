# Technical Memory — BrainDrop

> Technical decisions, architecture rationale, patterns, known gotchas, and past
> bugs fixed. Written for future-me and Claude.

---

## Architecture

### Single-File SPA
The entire app is one `index.html` (~1470 lines) with inline CSS and JS. No build toolchain, no bundler, no framework.

**Why:** Students primarily use phones. Zero npm install, zero webpack, zero server. Just a URL.
**Trade-off:** File is getting large. Split into CSS/JS files if it exceeds ~2000 lines.

### Cloudflare Workers Proxy
All AI calls route through `braindrop-ai-proxy.raja-cloudmdm.workers.dev`. Keys stay server-side. This is a **separate worker** from Data Alchemist (`braindrop-proxy`) — never overwrite the old one.

**Deploy:** `npx wrangler deploy` from project root.
**Secrets:** `npx wrangler secret put <NAME>`.
**Health:** `curl .../health` shows which providers have keys.

### Provider Architecture
Table-driven config in the Worker. Adding a provider = ~8 lines. All use the same pattern: browser → Worker → upstream API. Worker handles CORS, key injection, error wrapping.

**Active providers (April 2026):** NVIDIA, Groq, Gemini, Claude.
**Fallback order:** `PROVIDER_ORDER = ['nvidia','groq','gemini','openai','deepseek','mistral','claude','ollama']` — only providers with `'PROXY'` state key are tried.

---

## Key Technical Decisions

### RAG Pipeline (Client-Side TF-IDF)
Chunks NCERT PDFs into ~500 char segments, builds TF-IDF index, retrieves top 5 relevant chunks per query. ~95% token reduction vs the old 50K char dump.

**Limitation:** Keyword-based, not semantic. Upgrade path: embedding API + cosine similarity.

### Classroom Multi-Agent
3 sequential API calls per interaction (teacher + 2 classmates). Classmates use free-tier providers. Subject lock in every prompt prevents drift. Grade-specific characters in `CLASSROOM_AGENTS_BY_GRADE`.

### Structured Content Tags
`md()` parser extracts `<quiz-data>`, `<flashcard-data>`, `<magic-block>` tags before markdown processing. Each renders as interactive UI (quiz cards, flip cards, sandboxed iframes).

### MagicBlocks Security
AI-generated HTML rendered via iframe `srcdoc` with `sandbox="allow-scripts"`. No network, no forms, no parent DOM access.

### Course Progress
Stored in `bd_mem_${grade}_${subject}` → `profile.courseProgress[chapterId]`. Lessons auto-complete via `_pendingLesson` flag after AI interaction.

### Memory Context Injection (`getMemoryContext()`)
`getMemoryContext()` is called at the start of every AI system prompt build. It reads the current subject's localStorage memory and injects:
- Topics already covered (last 50)
- Weak areas identified from past sessions
- Recent quiz scores (last 5 rounds, correct/incorrect counts)
- Last studied date
- Last 12 messages of chat history (truncated to 200 chars each)

The resulting context string is appended to every system prompt so the AI has full continuity — it knows what the student already covered, where they struggle, and what was said earlier in the session. This is not just "memory" — it is live personalization at every call.

### `EP` Object — Exam Patterns
`EP` is a hardcoded object defined in `index.html` (not loaded from an external source). It covers all 5 Grade 10 CBSE subjects and contains:
- `hot`: high-frequency topics with approximate frequency % and mark range
- `tr`: common student traps/mistakes for that subject

`EP` is referenced in `Exam Prep` mode: the system prompt for `examprep` instructs the AI to use board patterns from the last 10 years, cheat sheets, and traps — `EP` provides the structured source data for this. It is embedded in code, not in a config file; changes require editing `index.html` directly.

### Classroom Character Personalities (Full Dialogue Specs)
The `CLASSROOM_AGENTS_BY_GRADE` object in `index.html` contains full personality dialogue specs — not just names. These specs are injected verbatim into each agent's system prompt during classroom interactions:

**Grade 10:**
- `Sunita Ma'am` (teacher): warm, structured, connects concepts to real life and exam patterns
- `Aabha` (classmate1): studious, asks thoughtful questions, wants to understand the "why"
- `Optimus Prime` (classmate2): bold, dramatic, makes wild analogies (quadratic equations = battle strategies), says "Autobots, let's learn!" and "That formula is our weapon!"

**Grade 7:**
- `Rupa Ma'am` (teacher): gentle, encouraging, uses stories and fun examples for younger students
- `Buffy` (classmate1): energetic, playful, asks "silly" questions, uses food/game comparisons
- `BumbleBee` (classmate2): shy at first, buzzes with excitement when something clicks, says "Bzzt! I get it now!" and "Wait wait wait..."

These personality strings are load-bearing: they define agent tone and distinctiveness. If they are shortened or genericized, classroom mode loses its differentiation.

### `ALLOWED_EMAILS` Whitelist
`CONFIG.ALLOWED_EMAILS` is an array defined at the top of `index.html`. Currently set to `[]` (empty = open access for all). When populated with email addresses, only those Google accounts or guest emails are allowed to proceed past sign-in. Used for restricting access during testing or for school deployments. To lock the app down, add emails to this array and redeploy.

### Model Versions Pinned in `cloudflare-worker-proxy.js`
Exact model versions are pinned in the `PROVIDERS` object inside the browser-side call logic in `index.html` (in `callProvider()` and `callProviderWithSys()`), not in the Cloudflare Worker. Current pinned versions (as of April 2026):
- Claude: `claude-haiku-4-5-20251001`
- Gemini: `gemini-2.5-flash`
- Groq: `llama-3.3-70b-versatile`
- NVIDIA: `meta/llama-3.3-70b-instruct`

To bump a model version, edit the hardcoded model string in the relevant `case` block inside `callProvider()` and `callProviderWithSys()` in `index.html`. The Worker itself is model-agnostic — it passes through whatever body the browser sends.

### Grade 7 PDFs — Not Yet Configured
The `BOOKS` object in `index.html` only has entries for Grade 10 (mathematics, science, english, social-science). Grade 7 has no entries in `BOOKS`, so the RAG pipeline will not load any PDF for Grade 7 students. Grade 7 PDFs need to be uploaded to Cloudflare R2 and a `7: { ... }` block added to `BOOKS` before RAG works for that grade.

---

## localStorage Keys

| Key | Contents |
|-----|----------|
| `bd2` | App state, AI prefs, XP, streak, usage |
| `bd_user` | User profile {email, name, picture, method} |
| `userEmail` | Email for X-User-Email header |
| `bd_mem_${g}_${s}` | Learning memory, chat history, course progress |
| `bd_logs` | Activity log (max 500) |

---

## Known Gotchas

1. Old users may have stale `'PROXY'` values for providers no longer configured. Defaults in Z must match Worker reality.
2. AI sometimes wraps quiz JSON in markdown code blocks. The parser handles this gracefully.
3. Flashcard state (`_fcState`) is in-memory only — lost on refresh.
4. RAG index rebuilds per subject switch (~100ms, synchronous).
5. Classroom history (16 msg window) fills in ~5 exchanges with 3 agents.
6. Google Sign-In needs HTTPS. Guest login works everywhere.

## Past Bugs Fixed

| Bug | Cause | Fix |
|-----|-------|-----|
| Subject mixing in classroom | No subject lock in prompts | Explicit subject lock instruction |
| All AI engines failed | Expired keys + missing Worker endpoints | Separate Worker, refreshed keys |
| Identity divergence | Two different email sources | Synced in all auth flows |
| 50K token waste | Full PDF in system prompt | RAG pipeline |
| Data Alchemist disruption risk | Shared Worker name | Separate `braindrop-ai-proxy` Worker |

---

## Course/Chapter Design System (April 2026)

### Theme Scoping — `.theme-paper` namespace
The course/chapter surfaces use a warm cream theme that does NOT apply globally. The dark synthwave (`--bg`, `--np`, etc.) remains the default for chat, classroom, modals, and AI surfaces. The warm theme is wrapped in a `.theme-paper` class scope inside `CourseView.jsx`, with all variables namespaced as `--p-*` (`--p-paper`, `--p-card`, `--p-ink`, etc.) defined in `src/styles/index.css`.

**Why scoped, not global:** F was approved as a chapter-detail design, not a brand overhaul. Going global would touch chat, classroom, MagicBlocks, modals — much larger blast radius, separate decision. The scoped approach is fully reversible — to make it global later, drop the `.theme-paper` wrapper and promote `--p-*` to `:root`.

**Two helper utility classes:** `.font-hand` (Caveat) and `.font-mono-p` (Space Mono / JetBrains Mono fallback). Both safe to use globally; they only set font-family, no theme assumptions.

### F Design Tokens
| Token | Value | Purpose |
|---|---|---|
| `--p-paper` | `#fbf6e8` | Warm cream background |
| `--p-paper2` | `#f3edd9` | Slightly deeper paper for empty/locked states |
| `--p-card` | `#ffffff` | White card surface |
| `--p-line` | `#e6dcc0` | Soft cream-tinted border |
| `--p-line2` | `#d6c89f` | Stronger border for emphasis |
| `--p-ink` | `#1f2c4a` | Primary deep-ink text |
| `--p-ink2` | `#3a496f` | Secondary ink |
| `--p-pencil` | `#7d7460` | Tertiary muted (metadata) |
| `--p-hl` | `#fde366` | Yellow highlighter (active state) |
| `--p-red` | `#c0392b` | Doodled stars, footer arrow accents |
| `--p-green` | `#2c8a4a` | Completed lesson, mastery ring at 100% |
| `--p-blue` | `#3b6cc4` | Active mastery ring, kicker labels |

### ChapterCard inline expansion REMOVED
Previously, clicking a chapter in `ChapterCard.jsx` expanded an inline `AnimatePresence` lesson list within the same card. F replaces this with a dedicated `ChapterDetailView.jsx` rendered at the top of `CourseView` when `activeChapter` is set.

**Why:** Two views fighting for the same job (chapter content) led to duplicated lesson-completion logic and visual paradigm mismatch (F is page-level, expansion was inline). One source of truth is cleaner.

**Side effect:** `useCourseProgress.selectChapter(chId)` still toggles `activeChapter` between `chId` and `null`, but `null` now means "show the chapter list" and `chId` means "show the detail page for that chapter." The semantics didn't change; only the rendering did.

### Quiz scores NOT TRACKED — schema gap
The F mockup originally had a "Quiz avg" stat card. Implementation could not honour that because `memory.profile.courseProgress[chapterId]` only tracks `{ completed: [], started, done }` — no per-chapter or per-lesson quiz scores. The shipped stat card replaces "Quiz avg" with "Status" (Locked / New / In progress / Done), which is real data.

**To wire quiz tracking:** add `quizScores: { [chapterId]: { [lessonName]: number[] } }` to the memory schema. Then update the assessment engine to push results into this map after grading. Then update `ChapterDetailView`'s `Stat` row to compute and show the per-chapter average.

### Caveat font scope
Caveat is used in **exactly four places** to prevent visual fatigue across 63 chapters:
1. Chapter kicker ("chapter four")
2. Section header ("What's in here", "Chapters")
3. "next up →" label inside the progress card
4. Footer microcopy ("2 down, 2 to go")

Body, lesson titles, stat values, and metadata all use Inter or Space Mono. The handwriting carries narrative warmth, never load-bearing data.

---

*Last updated: April 28, 2026*
