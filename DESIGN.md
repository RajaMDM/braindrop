# Design System — BrainDrop

> "Quiet Competence" — a study tool that respects students intellectually.
> The hush of a well-organized desk at 6:47am.
>
> This document is the source of truth for every visual and UI decision in
> BrainDrop. Read it before designing or modifying any surface. Do not deviate
> without explicit user approval.

---

## Product Context

- **What this is:** A free, open-source AI-powered CBSE study companion.
- **Who it's for:** Indian school students, primarily Grade 10 (~15 yr olds) prepping for board exams; also Grade 7 (~12 yr olds). Mobile-primary — students live on phones.
- **Space/industry:** Ed-tech / CBSE board prep / AI tutoring.
- **Project type:** Multi-modal web app (chat, structured courses, AI tutor, multi-agent classroom, assessments, analytics) deployed to GitHub Pages.
- **Built by:** Raja Shahnawaz Soni for his daughters Alishba and Inaayah, opened to every student.

## The Memorable Thing

Every design decision in this system serves one anchor:

> **"I can see myself getting better."**

Not "I'm having fun." Not "I won today." Not "I beat my friend." The brand position is **intrinsic motivation, expressed as quiet pride**. A 14-year-old should open BrainDrop and feel older than they expected — like this is a tool a senior at IIT would use, not an app for kids.

## Aesthetic Direction

**Direction:** Editorial Calm × Data-as-Aesthetic. Notion's restraint × Linear's data discipline × Apple HIG's *deference* (UI gets out of the way, content does the work).

**Decoration level:** Minimal-to-Intentional. Type and whitespace do most of the work. Subtle 1px borders, soft shadows in three levels, no gradients-as-decoration. **The data viz IS the decoration.**

**Mood:** Confident, grown-up, focused. Not festive. Not childish. Not corporate. Reads as a serious tool, not an app trying to be your friend.

**What this looks like in concrete terms:**
- A 14-year-old opens it and the first screen is mostly empty paper, with their name set in a serif and one line of data: *"Chapter 4 of 14 — Light & Reflection. 38 minutes since you last opened this."*
- No mascot. No streak fireworks. No "Hi champion!"
- The reaction is *quiet pride* — "this is for me, and it thinks I'm capable."

**Reference register:** Notion (warm minimalism, serif-forward), Linear (data primary), Apple Education HIG (deference, clarity).

**Anti-references — what we deliberately are NOT:** Duolingo (mascots, hearts, festivity), Khan Kids (cartoon palette), Brainly (ad-heavy chrome), generic SaaS (3-column feature grids, purple gradients, bouncy CTAs).

---

## Typography

Three fonts. One voice per font. No exceptions without architect's brief.

| Role | Font | Why |
|---|---|---|
| **Display / Hero** | **Fraunces** (variable serif, optical sizing, soft axis) | Treats students as readers, not players. Carries weight where weight matters: chapter titles, hero kickers, section headers, brand moments. Ages from 12 to 18 without changing register. Free via Google Fonts. |
| **Body + UI** | **Geist** (Vercel's free sans, Notion-adjacent rhythm) | Disappears so content can speak. Has tabular-nums baked in. Replaces both Fredoka (current, cartoony) and Inter (overused). Three weights only: 400 / 500 / 600. Free via Google Fonts. |
| **Numerics + data** | **Geist Mono** | Tabular figures align in progress columns, timers, charts, receipts. Gives streaks, scores, exam countdowns the unfussy precision of a terminal log, not a slot machine. Free via Google Fonts. |

**Banned:** Inter, Roboto, Helvetica, Arial, Open Sans, Poppins, Montserrat, Space Grotesk, Lobster, Comic Sans, Papyrus, system-ui as primary, any handwriting font (Caveat — F's font — is retired). Fredoka (current) is replaced by Geist.

**Loading:** Single Google Fonts `<link>` with `display=swap` in `index.html`.

**Type scale (modular, ratio 1.18):**
| Token | Size | Line height | Use |
|---|---|---|---|
| `text-2xs` | 11px / 0.6875rem | 1.4 | Mono labels, kicker eyebrows, table column headers |
| `text-xs` | 12px / 0.75rem | 1.45 | Caption, breadcrumb, metadata |
| `text-sm` | 13px / 0.8125rem | 1.5 | Secondary body, lesson row meta |
| `text-base` | 15px / 0.9375rem | 1.55 | Default body |
| `text-md` | 17px / 1.0625rem | 1.55 | Lede paragraph, hero sub |
| `text-lg` | 20px / 1.25rem | 1.4 | Card titles, h3 |
| `text-xl` | 24px / 1.5rem | 1.3 | h2 (Geist) or section serif heads |
| `text-2xl` | 32px / 2rem | 1.1 | Chapter title (Fraunces, opsz~36) |
| `text-3xl` | 40px / 2.5rem | 1.05 | Course hero (Fraunces, opsz~48) |
| `text-display` | clamp(48px, 7vw, 84px) | 1.02 | Brand hero (Fraunces italic, opsz~96) |

**Usage rules:**
- Fraunces appears at most 2 places per screen (one display + maybe one card head). More than that = typographic noise.
- Numerics in any data context use `font-family: 'Geist Mono'` and `font-feature-settings: 'tnum'` for tabular alignment.
- Italic Fraunces is reserved for *brand voice moments* (kickers, hero, principle quotes), not body emphasis. Body emphasis uses Geist medium (500).

---

## Color

**Approach:** Restrained. **One** accent only. Every other surface is neutral so the accent means something when it appears.

### Light mode (default)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#fafaf9` | Page background — barely off-white, warm 2% bias |
| `--surface` | `#ffffff` | Card / panel background |
| `--subtle` | `#f4f4f1` | Hover states, secondary backgrounds, code blocks |
| `--border` | `#e7e5e1` | Default 1px borders |
| `--border-strong` | `#d6d3cc` | Inputs, prominent borders |
| `--text` | `#1c1917` | Primary text — deep ink, never pure black |
| `--text-muted` | `#57534e` | Secondary text, captions |
| `--text-tert` | `#a8a29e` | Tertiary, metadata, monospace labels |
| `--accent` | `#0d4d4a` | The one accent — deep teal, color of dark green chalkboard slate |
| `--accent-hover` | `#0a3a37` | Accent on hover/pressed |
| `--accent-fg` | `#ffffff` | Foreground when on accent |
| `--accent-soft` | `#ddeae8` | Accent halo (focus rings, soft fills) |
| `--success` | `#15803d` | Muted forest — confirmations, completion |
| `--warning` | `#b45309` | Warm amber — used sparingly |
| `--error` | `#b91c1c` | Muted brick — destructive, blocking errors |

### Dark mode (full citizen, not afterthought)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0c0c0a` | Page bg — near-black with 2% warm bias, never pure `#000` |
| `--surface` | `#171716` | Card / panel |
| `--subtle` | `#252523` | Hover, secondary surface |
| `--border` | `#2e2e2b` | Default border |
| `--border-strong` | `#3d3d39` | Input border |
| `--text` | `#fafaf9` | Primary text |
| `--text-muted` | `#a8a29e` | Secondary |
| `--text-tert` | `#78716c` | Tertiary |
| `--accent` | `#2dd4bf` | Lifted teal for OLED legibility |
| `--accent-hover` | `#5eead4` | Accent on hover |
| `--accent-fg` | `#0c0c0a` | Foreground on accent |
| `--accent-soft` | `rgba(45,212,191,.12)` | Soft halo |
| `--success` | `#4ade80` | |
| `--warning` | `#fbbf24` | |
| `--error` | `#f87171` | |

### Color usage rules

1. **One accent.** Teal (light) / lifted teal (dark) is the only chromatic voice. Charts use teal + neutrals (with luminance steps), never multi-hue rainbows.
2. **Semantic color is reserved for status, never decoration.** Success/warning/error never appear unless they communicate an actual semantic.
3. **No gradients as accents.** No purple-to-pink CTAs. No ambient mesh gradients. Soft shadows + clean fills.
4. **Theme parity.** Every surface must work in both light and dark. Dark mode is not an afterthought — it's where late-night studying happens.
5. **AA contrast minimum.** Body text on background: 4.5:1 minimum. Large text: 3:1.

---

## Spacing

**Base unit:** 4px. Universal scale, no exceptions.

| Token | px | rem | Use |
|---|---|---|---|
| `--s-2` | 2px | 0.125rem | Internal pixel-tight gaps (border insets) |
| `--s-4` | 4px | 0.25rem | Icon-to-text gap |
| `--s-8` | 8px | 0.5rem | Tight stacks, button row gap |
| `--s-12` | 12px | 0.75rem | Card internal padding (compact) |
| `--s-16` | 16px | 1rem | Default card padding |
| `--s-24` | 24px | 1.5rem | Section internal spacing |
| `--s-32` | 32px | 2rem | Section bottom margin (default) |
| `--s-48` | 48px | 3rem | Major section spacing |
| `--s-64` | 64px | 4rem | Hero top/bottom |
| `--s-96` | 96px | 6rem | Page-level top breathing room |
| `--s-128` | 128px | 8rem | Marketing hero only |

**Density:** Comfortable. Not Notion-spacious (we work on phones), not GitHub-cramped. Aim for `--s-16` or `--s-24` between unrelated content blocks.

---

## Layout

**Approach:** Hybrid — grid-disciplined for app surfaces, creative-editorial for marketing/hero moments.

| Surface type | Approach | Max content width |
|---|---|---|
| Reading-heavy (chapter detail, lesson, AI tutor) | Single column, ample whitespace | 720px |
| Dashboard (course overview, analytics, progress) | Grid (2- or 4-up cards) | 1200px |
| Hero / marketing / sign-in | Editorial — asymmetric, breathing | 880px |
| Modal / dialog | Centered card | 480px |

**Border radius (hierarchical, not uniform):**
| Token | px | Use |
|---|---|---|
| `--r-sm` | 6px | Small components — chips, tag pills, small buttons |
| `--r-md` | 10px | Default — buttons, inputs, lesson rows |
| `--r-lg` | 14px | Cards, larger panels |
| `--r-full` | 9999px | Avatars, status pills, full-round buttons |

**Shadow (3 soft levels, never harsh, never colored):**
| Token | Definition | Use |
|---|---|---|
| `--shadow-subtle` | `0 1px 2px rgba(0,0,0,.04)` | Inputs, hover lifts |
| `--shadow-medium` | `0 4px 12px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)` | Cards, dropdowns, popovers |
| `--shadow-elevated` | `0 12px 32px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.04)` | Modals, fixed action bars |

Dark mode shadows scale up: opacity ~0.5–0.6 instead of 0.04–0.08.

---

## Motion

**Approach:** Intentional. Subtle entrance animations, meaningful state transitions. No scroll-driven choreography. No page-load celebrations.

**Easing curve (single, app-wide):**
```css
--ease: cubic-bezier(0.32, 0.72, 0, 1);
```
Apple's spring-decay. Used for entrance, exit, and state transitions. Reuse this curve everywhere — multiple eases is the school-project tell.

**Duration tokens:**
| Token | Duration | Use |
|---|---|---|
| `--d-micro` | 150ms | Hover state, button press, icon swap |
| `--d-short` | 250ms | Card lift, dropdown open, theme toggle |
| `--d-medium` | 400ms | Modal entrance, mastery ring fill |
| `--d-long` | 600ms | Page transition (rare), data viz reveal |

**Reduce-motion:** Respect `@media (prefers-reduced-motion: reduce)` system-wide. Disable transforms, scale animations to opacity-only, kill scroll animations.

---

## Brand Voice (microcopy)

Direct, not chatty. Treats students as the older version of themselves they're growing into.

| Don't write | Write instead |
|---|---|
| "Let's go!" | "Resume" |
| "Halfway there, champ!" | "2 of 4 done" |
| "Great job!" | (nothing — show the data) |
| "You crushed it!" | (the Study Receipt does the talking) |
| "Hi friend! 👋" | "Welcome back" |
| "Oops!" | "Couldn't reach AI. Trying a backup." |
| "Awesome streak!" | "5d" (in monospace) |

Microcopy banned: emoji as decoration, "champ", "rockstar", "ninja", "guru", "AI-powered" (everyone says this), exclamation marks on routine UI text.

---

## The Four Deliberate Risks

The brand isn't built from safe choices. These four departures from kid-EdTech convention are where BrainDrop earns its face.

### Risk 1: No streak counter on the home screen

Streaks live one tap deeper, rendered as a 30-day sparkline, not a flame number. The kid who missed yesterday doesn't open the app to a guilt-trip.

- **Buys:** Dignity. Anti-Duolingo posture. Aligns with "quiet pride."
- **Costs:** Measurably lower 7-day retention vs. Duolingo loops. We commit to intrinsic motivation as the engine.

### Risk 2: Fraunces serif as display font

Almost no kid-EdTech app uses serif. Treats students as readers. Ages from 12 to 18 without re-skin.

- **Buys:** Instant differentiation. "Serious tool" register from the first frame.
- **Costs:** Some teens may initially read serif as "old-fashioned." Fraunces's optical sizing mitigates — it's contemporary, not academic.

### Risk 3: One accent color only — deep teal

Most ed-tech uses 4–6 colors for "fun." We use one for "earned."

- **Buys:** When teal lands on a percentage, a checkmark, a chart line, it carries meaning. Restraint is a flex.
- **Costs:** Less visual variety. Charts use teal + neutrals (luminance steps), not multi-hue rainbows.

### Risk 4: Typographic Study Receipt

After every session, a printable-looking monospaced summary: timestamp, chapter, problems attempted, accuracy delta, time-to-first-correct. No confetti. No "Great job!" The data is the reward.

- **Buys:** The Linear/Vercel "I'm operating at a higher level" feeling, perfectly mapped to "I can see myself getting better."
- **Costs:** Some parents expect cheerful UX. Onboarding should name this choice explicitly.

---

## What this means for the existing codebase

The codebase currently runs on a **dark synthwave palette** (`#0b0b14` bg, neon `#b44aff` purple, `#00f5d4` cyan) with **Fredoka body** + **Space Mono numerics** + (on the chapter detail surface only) **Inter + Caveat handwriting** under the `.theme-paper` scope.

**What survives:**
- F's information architecture on chapter detail (mastery ring, 4 stat cards, lesson rows with mini progress bars, next-up CTA, friendly footer microcopy intent — though the *words* tighten per the voice rules).
- The chapter detail / course list routing pattern (CourseView splits on `activeChapter`).

**What gets retired:**
- `--bg #0b0b14` synthwave dark → replaced by Quiet Competence dark (`#0c0c0a` warm-near-black).
- Neon palette (`#b44aff` purple, `#00f5d4` cyan, `#fee440` yellow, `#39ff14` green, `#ff1744` red) → replaced by deep teal accent + neutrals.
- Fredoka font (current body) → replaced by Geist.
- Caveat handwriting (F's narrative font) → replaced by Fraunces italic.
- F's cream paper (`#fbf6e8`) → replaced by `#fafaf9` (cooler off-white).
- F's doodled red stars on completed lessons → replaced by deep teal filled circles.
- F's yellow highlighter sweep on titles → replaced by 1.5px solid teal underline on the key word.
- F's rotated angles (-0.5°, etc.) → all grid-aligned, no rotation.

**Migration path (separate work, not in this commit):**
1. Update CSS variables in `src/styles/index.css` — replace the `:root` synthwave palette with Quiet Competence light tokens; replace `.theme-paper` with `.theme-dark` for the dark variant; load new fonts in `index.html`.
2. Re-skin existing surfaces in waves: course/chapter detail (refactor F's React components in place, drop the `.theme-paper` scoped vars in favor of root tokens), then chat hero, then classroom, then assessments, then analytics.
3. Build the **Study Receipt** component from scratch — it's a new surface this design system introduces.
4. Audit microcopy across the app and tighten per the voice rules.

---

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-28 | DESIGN.md created — Quiet Competence system | First formal design system. /design-consultation with Apple/Notion + Linear/Vercel as references. Anchor: "I can see myself getting better." Resolves the F (cream-and-handwriting) vs. broader-brand tension by retiring F's decorative layer while preserving its information architecture. |
| 2026-04-28 | Geist over Inter | Skill blacklist forbids Inter as overused. Geist is the practical free analog with the same visual rhythm and tabular-nums support. |
| 2026-04-28 | Fraunces over Söhne | Subagent proposed Söhne (paid, ~$890/yr license). Non-starter for a free open-source GitHub Pages app. Fraunces is free, has variable optical sizing, fits the "serious tool" register. |
| 2026-04-28 | Deep teal `#0d4d4a` over marker-orange | Subagent proposed `#FF5A1F` saturated marker-orange (visually F-adjacent). Teal earns the "achievement / chalkboard" register; orange skews festive. The brief is "not Duolingo-sparkly." |
| 2026-04-28 | No streak counter on home (one tap deeper, 30-day sparkline) | Borrowed from indie-studio subagent proposal. Aligns with "quiet pride" anchor. Trades retention loops for dignity. |
| 2026-04-28 | Typographic Study Receipt replaces celebration screens | Borrowed from indie-studio subagent proposal. Maps "Linear / Vercel feeling" to "I see myself getting better." |
