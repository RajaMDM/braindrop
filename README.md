<div align="center">

# BrainDrop

**A free, AI-powered CBSE study companion for school students.**
Built for two daughters; opened to every student everywhere.

[**Try it live → rajamdm.github.io/braindrop**](https://rajamdm.github.io/braindrop)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Made for students](https://img.shields.io/badge/made%20for-students-0d4d4a.svg)](https://rajamdm.github.io/braindrop)
[![Live](https://img.shields.io/badge/status-live-2dd4bf.svg)](https://rajamdm.github.io/braindrop)
[![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite-2dd4bf.svg)](https://vitejs.dev)
[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-181717.svg?logo=github)](https://pages.github.com)
[![CBSE](https://img.shields.io/badge/curriculum-NCERT%20%2F%20CBSE-orange.svg)](https://ncert.nic.in)

</div>

---

## What this is

BrainDrop is a study tool for Indian school students prepping for CBSE board exams. Open the URL, sign in with Google or a name + email, pick a subject, and start learning. No keys, no setup, no ads, no paywall.

Behind the scenes it routes through four large language models (NVIDIA Llama 3.3 70B, Groq Llama 3.3, Google Gemini 2.5 Flash, Anthropic Claude Haiku 4.5), retrieves NCERT textbook content via a client-side RAG pipeline, and generates interactive HTML simulations on the fly. There is no server, no database, no signup friction. All AI calls go through a Cloudflare Worker proxy so no API keys ever touch the browser.

It started as a tool for two daughters preparing for Grade 10 boards. It now ships to anyone who needs it.

## Why it exists

Existing ed-tech for Indian students mostly falls into two camps: ad-heavy free tools that distract more than they teach, or expensive subscription apps families can't all afford. BrainDrop is the version a parent who happens to ship software builds for their own kids — then opens to everyone else's.

The design system, [Quiet Competence](DESIGN.md), is deliberately the opposite of the gamified-celebration aesthetic that defines the category. No mascots. No streak fireworks. No "Hi champion!" The premise is that a 14-year-old prepping for boards deserves a serious tool, not an app trying to entertain them.

## Features

### Learning

- **7 learning modes:** Explain, Socratic, Quiz, Flashcard, Exam Prep, AI Tutor, Classroom
- **Multi-agent Classroom** — a grade-specific Teacher and two Classmates with distinct personalities, modeled on Tsinghua University's OpenMAIC research
- **MagicBlocks** — AI-generated interactive HTML simulations rendered in sandboxed iframes
- **Structured Courses** — 63 NCERT chapters for Grade 10 with progress tracking, unlock mechanics, and completion certificates
- **Past papers** — CBSE exam pattern archive 2015–2024

### AI

- Four providers in failover order: NVIDIA → Groq → Gemini → Claude
- Client-side TF-IDF RAG over NCERT content (~95% reduction in token usage vs. dumping the whole PDF)
- Provider-agnostic prompt interface; swap models without changing app logic

### Assessment & Progress

- Auto-graded MCQ quiz engine with scoring history
- Flashcard decks with mastery tracking
- Analytics dashboard: subject progress, activity heatmap, strengths/weaknesses, AI usage breakdown
- XP system, streaks, gamification — implemented with [deliberate restraint](DESIGN.md#the-four-deliberate-risks) (no streak counter on home; sparkline one tap deeper)

### Access

- Google sign-in or name + email guest login
- All features free, all the time
- Works on mobile browsers (where most students actually study)

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 19 + Vite | Fast dev loop, no build wrangling |
| Styling | CSS variables + inline styles | Single source of truth ([DESIGN.md](DESIGN.md)); no framework lock-in |
| Routing | None (single SPA) | Simpler than React Router for this scope |
| State | React Context + custom hooks | localStorage-backed; ready to swap to KV when cloud sync lands |
| Animation | framer-motion | Reused across components |
| Math | KaTeX | Server-rendered formula support |
| AI proxy | Cloudflare Worker | Zero API keys in the browser |
| PDF storage | Cloudflare R2 | NCERT textbooks via CDN |
| Hosting | GitHub Pages | Free, fast, no infra |
| CI/CD | GitHub Actions | Build + deploy on push to `main` |

## Quick start

```bash
git clone https://github.com/RajaMDM/braindrop.git
cd braindrop
npm install
npm run dev
```

Then open http://localhost:5173/braindrop/.

The Cloudflare Worker proxy at `braindrop-ai-proxy.raja-cloudmdm.workers.dev` handles all AI calls in dev too — no local environment variables needed.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. The repository is configured for GitHub Pages, so a push to `main` triggers an automatic deploy via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Browser (student device)                   │
│                                                               │
│   React SPA  ──►  Cloudflare Worker  ──►  AI Provider APIs    │
│       │              (proxy + auth)        NVIDIA / Groq /    │
│       │                                    Gemini / Claude    │
│       ▼                                                       │
│   localStorage  ◄──────  Cloudflare R2 (NCERT PDFs)           │
│   (progress, memory)     CDN-cached                           │
└──────────────────────────────────────────────────────────────┘
```

Everything runs on the student's device except the worker proxy and PDF CDN. No backend database, no server-rendered pages, no user accounts in the cloud (yet — see [ROADMAP.md](ROADMAP.md) for the cloud-sync plan).

## Project structure

```
braindrop/
├── DESIGN.md            # design system source of truth
├── PROJECT_HISTORY.md   # narrative of what was built and why
├── TECH_MEMORY.md       # technical decisions and gotchas
├── DEFENSE_BRIEF.md     # rationale for every major choice
├── CHANGELOG.md         # dated entries with business impact
├── ROADMAP.md           # near / medium / long-term plans
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── assessment/  # quiz engine, flashcards, scoring
│   │   ├── auth/        # sign-in, character picker
│   │   ├── chat/        # AI conversation surfaces
│   │   ├── course/      # structured course view, chapters
│   │   ├── interactive/ # MagicBlocks
│   │   ├── layout/      # header, sidebar, bottom nav, XP bar
│   │   ├── modals/      # settings, stats, scores, analytics
│   │   ├── modes/       # mode tabs
│   │   └── shared/      # markdown renderer, topic chip
│   ├── context/         # AppContext, AuthContext
│   ├── hooks/           # useCourseProgress, useMemory, useXP, useCharacter
│   ├── data/            # courses, characters, providers, exam patterns
│   ├── styles/          # index.css (design tokens)
│   └── utils/
│
├── cloudflare-worker-proxy.js   # AI proxy (deployed separately)
├── wrangler.toml                # Worker config
└── .github/workflows/deploy.yml # GH Pages deploy
```

## Documentation

The repo carries its own paper trail. Read these in order if you want context:

- **[PROJECT_HISTORY.md](PROJECT_HISTORY.md)** — the chronological narrative
- **[ROADMAP.md](ROADMAP.md)** — what's planned, what's blocked, decision triggers
- **[DESIGN.md](DESIGN.md)** — the Quiet Competence design system (always read before any visual change)
- **[TECH_MEMORY.md](TECH_MEMORY.md)** — architecture decisions, schema gotchas, past bugs and their fixes
- **[DEFENSE_BRIEF.md](DEFENSE_BRIEF.md)** — talking points for every "why X over Y?" question
- **[CHANGELOG.md](CHANGELOG.md)** — dated entries with business impact

## Contributing

Pull requests welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first — it covers local setup, the design system constraint (every visual change must defend against [DESIGN.md](DESIGN.md)), commit message style, and how to file good bug reports.

The kinds of contributions most useful right now:

- **Grade 7 chapter content** — `src/data/courses.js` only has Grade 10. The structure is the same; copy and fill in.
- **NCERT PDF uploads** — Grade 10 still has gaps and Grade 7 hasn't started. See [ROADMAP.md](ROADMAP.md).
- **Bug reports from real student usage** — the app is live. If something is confusing or broken on a phone, file an issue.
- **Translation** — Hindi support is on the wishlist. Microcopy is in JSX inline strings; happy to discuss extraction.
- **Screenshots** — the README has none. Submit screenshots from the live site.

## Acknowledgments

- **NCERT** for publishing textbook content in PDF form
- **Tsinghua University** — the OpenMAIC research informed the multi-agent Classroom design (700+ students tested, JCST 2026)
- **Cloudflare** — Workers + R2 + Pages make this hostable for free
- **Anthropic, Google, Meta, NVIDIA** — for the language models that power every conversation
- The four AI providers themselves operate under their respective terms of service

## Use, citation, and attribution

The code is [MIT](LICENSE)-licensed — fork it, modify it, ship your own version.

### When you use this in your work

If you reuse BrainDrop's code, the multi-agent classroom approach, the Quiet Competence design system, or substantial portions of the prompts in academic, commercial, or derivative work, please cite or credit it. GitHub displays a "Cite this repository" button in the sidebar of this repo (powered by [`CITATION.cff`](CITATION.cff)) — clicking it gives you a ready-to-paste BibTeX or APA reference.

### What I ask of derivatives

- **Keep the license notice.** MIT requires it; please honor it.
- **Visible credit in derivative apps.** A link or sentence like *"Built on BrainDrop by Raja Shahnawaz Soni"* in your About / Settings / Footer is the right thing to do, even though MIT doesn't strictly require it.
- **Don't use the BrainDrop name** for your derivative. Pick your own name. Avoiding "BrainDrop-fork" / "BrainDrop-pro" / etc. prevents confusion for students who look for the original.
- **If you ship something built on this for kids,** send me a link — I'd love to see it.

### What this project doesn't ask

- No commercial license fee.
- No revenue share.
- No "request permission" gate.

The license is permissive on purpose. The asks above are norms, not legal claims.

## License

[MIT](LICENSE) — fork it, modify it, ship your own version. If you build something for students with it, send a link.

## Built by

[**Raja Shahnawaz Soni**](https://github.com/RajaMDM) — a data management leader who builds working tools for the things he wants to exist.

Other things shipped: The Data Alchemist, SYNAPTIQ, QualIQ, NumerX. BrainDrop is the one built for Alishba and Inaayah; opened because every student deserves what a parent who ships software would give their own kids.

If this helps you or your kid, a star on the repo is the only payment wanted.
