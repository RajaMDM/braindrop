# Roadmap — BrainDrop

> Where the project is heading, what's blocked and why, and what triggers the next phase.

---

## Current State (April 2026)
BrainDrop v6 is live with: Classroom mode, MagicBlocks, Assessment system, Analytics, Structured courses, RAG pipeline, 4 AI providers (NVIDIA, Groq, Gemini, Claude), zero-config UX.

Live: https://rajamdm.github.io/braindrop

---

## Completed (This Session)
- [x] Classroom Mode (multi-agent, grade-specific characters)
- [x] MagicBlocks (AI-generated interactive simulations)
- [x] Assessment System (quiz engine, flashcards, score history)
- [x] Analytics Dashboard (progress bars, heatmap, strengths/weaknesses)
- [x] Structured Courses (63 NCERT chapters, unlock mechanics, certificates)
- [x] RAG Pipeline (client-side TF-IDF retrieval)
- [x] API Security (all providers proxied via Cloudflare Worker)
- [x] Auth Cleanup (open registration, mandatory email)
- [x] Zero-Config UX (no API key setup needed)
- [x] NVIDIA provider integration
- [x] Separate Worker from Data Alchemist

---

## Near-Term (Next Sprint)

### Upload Remaining NCERT PDFs
- **What:** Upload all Grade 10 and Grade 7 NCERT PDFs to Cloudflare R2
- **Why:** RAG pipeline is ready but only has partial content
- **Blocked by:** Manual PDF preparation (OCR quality varies)
- **Trigger:** Content ready to upload

### Google OAuth Production Config
- **What:** Configure Google OAuth Client ID for production domain
- **Why:** Currently using dev credentials, may hit quota limits
- **Effort:** ~30 minutes in Google Cloud Console
- **Trigger:** When user base grows beyond family/friends

### Grade 7 Course Content
- **What:** Add COURSES data for Grade 7 (currently only Grade 10 has chapters)
- **Why:** Grade 7 students exist in the app but see flat topic chips, not course view
- **Effort:** Data entry — define chapters and lessons for 5 subjects

---

## Medium-Term (Next Month)

### Cloud Sync (Cross-Device Progress)
- **What:** Store user progress in Cloudflare KV or D1 instead of localStorage
- **Why:** Students who switch devices lose all progress
- **Cost:** Cloudflare KV free tier: 100K reads/day, 1K writes/day
- **Trigger:** When students/parents request cross-device access
- **Prerequisite:** The Worker already has KV binding (`USERS_KV`) from Data Alchemist setup

### Timed Mock Tests
- **What:** Add countdown timer for quiz mode, simulating real board exam conditions
- **Why:** Students need practice under time pressure
- **Effort:** Medium — timer UI + time tracking + score adjustment

### Semantic RAG (Embedding-Based)
- **What:** Replace TF-IDF with vector embeddings for better content retrieval
- **Why:** TF-IDF misses conceptually related content with different wording
- **Options:** Cloudflare AI embeddings (free), Gemini embeddings, or local ONNX model
- **Trigger:** When students report AI answers missing relevant textbook content

### Custom Domain
- **What:** braindrop.app or similar
- **Cost:** ~$12/year domain + free Cloudflare DNS/CDN
- **Trigger:** When the project needs a professional identity

---

## Long-Term (3-6 Months)

### Multi-Grade Expansion
- **What:** Add content for Grades 6-9, not just 7 and 10
- **Why:** Cover the full CBSE middle/high school range
- **Effort:** Primarily data entry (chapter/lesson definitions)

### Teacher Dashboard
- **What:** Admin view for teachers to see student progress, assign topics, view class analytics
- **Why:** Makes BrainDrop usable in actual classroom settings
- **Requires:** Backend (user accounts, database)
- **Cost:** Cloudflare D1 (free tier) + Workers

### Parent Portal
- **What:** Parents can see their child's study activity, scores, weak areas
- **Why:** Parents want visibility into study habits
- **Requires:** User accounts + family linking

### Mobile App (PWA)
- **What:** Make BrainDrop installable as a Progressive Web App
- **Why:** Better mobile experience, offline access, push notifications
- **Effort:** Add manifest.json + service worker (straightforward for static SPA)

### AI-Adaptive Learning Path
- **What:** AI recommends next topics based on performance and weak areas
- **Why:** Not all students need the same sequence
- **Effort:** High — requires ML model or sophisticated heuristic

---

## Decision Triggers

| When this happens... | Do this... |
|---------------------|------------|
| File exceeds 2000 lines | Split into separate CSS/JS files |
| Users report cross-device issues | Add cloud sync via KV |
| TF-IDF accuracy drops | Upgrade to embedding-based RAG |
| 100+ students active | Get custom domain + production OAuth |
| Teachers want to use it in class | Build teacher dashboard |
| App feels slow on phones | Add PWA with service worker |

---

*Last updated: April 3, 2026*
