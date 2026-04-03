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

*Last updated: April 3, 2026*
