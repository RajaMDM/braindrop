# Contributing to BrainDrop

Thank you for considering a contribution. BrainDrop is a free study tool for school students; every contribution makes it work better for them.

## Quick links

- **Live demo:** https://rajamdm.github.io/braindrop
- **Issues:** [GitHub Issues](https://github.com/RajaMDM/braindrop/issues)
- **Design system:** [DESIGN.md](DESIGN.md) — read before any visual change
- **Roadmap:** [ROADMAP.md](ROADMAP.md)

## What kind of contributions help most right now

| Need | Effort | What to do |
|---|---|---|
| **Grade 7 chapter content** | ~2 hrs per subject | Copy the Grade 10 structure in `src/data/courses.js` and fill in NCERT chapters/lessons for Grade 7 subjects. |
| **NCERT PDFs** | Manual upload | Grade 10 has gaps; Grade 7 has no PDFs yet. Coordination needed via issue. |
| **Bug reports from real students on phones** | Minutes | Most students study on Android phones with patchy connectivity. If something breaks for you on a phone, file an issue with screenshots. |
| **Hindi translation** | Big | Microcopy lives in JSX inline strings. We'd need an extraction pass first. Open an issue to discuss approach before starting. |
| **Screenshots for the README** | 10 min | The README has none. Take screenshots from the live site at multiple viewports and submit a PR. |
| **Accessibility audits** | Variable | Especially welcome — keyboard navigation, screen reader behavior, color contrast under different conditions. |

## Local development

```bash
git clone https://github.com/RajaMDM/braindrop.git
cd braindrop
npm install
npm run dev
```

Then open http://localhost:5173/braindrop/.

The Cloudflare Worker proxy at `braindrop-ai-proxy.raja-cloudmdm.workers.dev` handles all AI calls in dev too. You do **not** need API keys locally.

### Build

```bash
npm run build
```

Output is written to `dist/`. GitHub Actions handles production deploys on push to `main`.

## The design system constraint

**Every visual change must defend against [DESIGN.md](DESIGN.md).**

Quiet Competence is the design system. It defines:
- Type stack: Fraunces (display), Geist (body), Geist Mono (numerics)
- Single accent color (deep teal `#0d4d4a` light / lifted teal `#2dd4bf` dark)
- 4px spacing scale
- Soft three-level shadows
- Single Apple-spring easing
- Microcopy voice rules (direct, not chatty; no "champ", no exclamation marks on routine UI)

If your PR introduces a new font, a new color, a new spacing token, or microcopy that violates the voice rules, the PR will need an updated `DESIGN.md` decision-log entry explaining why the system needs to grow.

This isn't bureaucracy. It's how the app stays coherent across surfaces.

## Code style

- **No new dependencies** without discussion. The bundle is already 320 KB; every package added is a tax on student data plans.
- **Inline styles + CSS variables** — that's the existing pattern. Don't introduce CSS modules, styled-components, or Tailwind classes in components without a strong case.
- **Components stay functional + hooks-based.** No class components.
- **Comments for the *why*, not the *what*** — the code already says what it does. Add a comment when there's a hidden constraint, a workaround, or behavior that would surprise a reader.
- **Mobile first.** Most students are on phones. Test at 360px before submitting.

## Commit messages

Conventional Commits style. Examples:

```
feat(course): add Grade 7 Mathematics chapters
fix(quiz): preserve answer state across rerenders
chore(deps): bump framer-motion to 11.4
docs(readme): add architecture diagram
design(system): add semantic color for "in-progress" lesson state
```

Body and footer are optional but appreciated for non-trivial changes. Reference the issue number if there is one.

## Pull request flow

1. **Open an issue first** for any non-trivial change. We want to align on scope before you spend time. The exceptions are: typo fixes, README improvements, and screenshot submissions — those can go straight to a PR.
2. **Fork, branch, and submit.** Branch names like `feat/grade7-math`, `fix/quiz-rerender-bug`, `docs/architecture-diagram`.
3. **Keep PRs focused.** One conceptual change per PR. If you find yourself writing "and also fixed X" in the description, split it.
4. **Test on a phone** before submitting if your change is visual or interactive.
5. **Update relevant docs.** PROJECT_HISTORY for narrative changes; TECH_MEMORY for architecture decisions; CHANGELOG for anything user-facing; DEFENSE_BRIEF if your change involves a "why X over Y" choice.

## Brand and content rules

- **Never use real brand names** in sample data, UI copy, or test fixtures. BrainDrop is brand-aware; references in code or docs must use fictitious names unless explicitly tagged as production integrations.
- **Never break the guest access path.** A student should be able to use BrainDrop without signing up.
- **No ads. No paywalls. No upselling.** This is a non-negotiable part of the project's identity.
- **No hardcoded API keys** in source. The Cloudflare Worker proxy holds the real keys server-side.

## Reporting bugs

A good bug report has:

1. **What you tried** — exact click path
2. **What you expected**
3. **What happened** — error messages, screenshots
4. **Browser + device** — Chrome on Pixel 7, Safari on iPhone 12, etc.
5. **Whether it's reproducible** — every time, intermittent, only on first load, etc.

If you can include the contents of the browser DevTools Console (errors, warnings), that's gold.

## Suggesting features

Open an issue with the `enhancement` label. Frame the suggestion as:

- **The student problem** you're solving
- **What you'd build**
- **What's the simplest version** that would deliver value (we ship MVPs first)
- **What this would NOT do** — explicit non-goals help reviewers

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By submitting a contribution, you agree that your contribution will be licensed under the [MIT License](LICENSE) of this repository.

## Questions?

File an issue with the `question` label, or reach out to Raja directly via the email on the GitHub profile.
