# Security Policy

BrainDrop is a study tool used by school students. Security issues — especially anything that could expose student data, leak API credentials, or run untrusted code in their browsers — are taken seriously.

## Supported versions

| Version | Supported |
|---|---|
| `main` (latest deploy at https://rajamdm.github.io/braindrop) | ✅ Active |
| Older tags / branches | ❌ Not supported — fixes only land on `main` |

This is a single-developer project. There is no LTS, no patch backporting, no formal release cadence. Fixes ship on `main` and deploy automatically via GitHub Pages.

## Reporting a vulnerability

**Do not file a public GitHub issue for security vulnerabilities.** Use one of the private channels below:

### Preferred: GitHub Private Vulnerability Reporting

[Open a private security advisory](https://github.com/RajaMDM/braindrop/security/advisories/new). This is GitHub's built-in private channel — it's encrypted, traceable, and lets us collaborate on a fix in a private fork before public disclosure.

### Alternative: Email

If you'd rather email, send to **raja.cloudmdm@gmail.com** with subject `[BrainDrop Security]`. Include:

- A description of the vulnerability
- Steps to reproduce (or a proof-of-concept if it's safe to share)
- The affected URL or file
- Your assessment of impact (data exposure, credential leak, code execution, etc.)
- Whether you've discussed this publicly anywhere

You should expect an acknowledgment within **3 business days**. A meaningful triage response (severity classification + tentative timeline) within **7 business days**. If you don't hear back in that window, please ping again — the email is a personal address and could end up in spam.

## What's in scope

This repository covers:

- **The React frontend** (`src/`, deployed at `rajamdm.github.io/braindrop`) — XSS, CSRF, prompt injection vectors, localStorage abuse, sandbox escape from MagicBlock iframes, exposed credentials, supply-chain compromise via dependencies
- **The Cloudflare Worker proxy** (`cloudflare-worker-proxy.js`, deployed at `braindrop-ai-proxy.raja-cloudmdm.workers.dev`) — auth bypass, key leak, rate-limiting bypass, request smuggling, header injection
- **Build and deploy pipeline** (`.github/workflows/`) — workflow injection, secret leakage, supply-chain attacks via Actions

## What's NOT in scope

- **AI provider behavior itself** — if Claude, Gemini, Groq, or NVIDIA generates inappropriate, biased, or factually incorrect output, that's a model issue. Report it to the provider directly. We can mitigate via prompt engineering but can't fix the underlying model.
- **NCERT PDF content** — we re-host PDFs published by India's National Council of Educational Research and Training. If there's an issue with the content itself, that's NCERT's, not ours.
- **The legacy `index.legacy.html`** — a vestigial pre-React file kept for historical reference. Not deployed, not loaded by any active surface. Issues here will be acknowledged but only fixed by deletion.
- **Bugs that aren't security issues** — file those as regular [GitHub issues](https://github.com/RajaMDM/braindrop/issues/new/choose).
- **Social engineering of the maintainer** — out of repo scope.

## Specific threat areas to know about

These are areas where I've actively thought about security; reports against them are especially welcome.

### LLM prompt injection

Students paste textbook excerpts, problem text, and freeform questions into chat. If injected content can manipulate the AI into leaking system prompts, generating off-topic content, or producing unsafe HTML for MagicBlocks, that's in scope.

### MagicBlock iframe sandbox

MagicBlocks render AI-generated HTML in `<iframe sandbox>` elements. Reports of sandbox escape, unauthorized parent-frame access, or postMessage abuse are high priority.

### localStorage data exposure

Student progress, chat memory, and identity (name + email) are in localStorage. The risks are: a malicious browser extension reading it, a successful XSS exfiltrating it, or a shared device leaking it to the next user. Mitigations welcome.

### Cloudflare Worker auth

The proxy uses a simple `X-User-Email` header for usage tracking. There's no real auth. If you can abuse the proxy to drain quota, exfiltrate provider responses, or pivot to other Cloudflare resources, that's in scope.

### Dependency supply chain

The build relies on `vite`, `react`, `framer-motion`, `katex`, `canvas-confetti`, `tailwindcss`. Reports about compromised versions, typosquats, or unsafe transitive deps are welcome — open a private advisory.

## Disclosure policy

**Coordinated disclosure preferred.**

I'll work with you on a fix in a private fork. Once the fix is deployed to production (`main` is auto-deployed within ~2 minutes of merge), we can disclose publicly:

- Standard disclosure window: **30 days** from the date you report it
- Critical issues that put student data at risk: faster — typically same-day fix, public disclosure within 7 days

I'll credit you in:

- The CHANGELOG.md entry for the fix
- The GitHub Security Advisory (if one is filed)
- The commit message of the fix

If you'd prefer not to be credited, just say so in your report.

## Out-of-band considerations

A few worth flagging because the project is small and free:

- **No bug bounty program.** I appreciate disclosure but can't pay. Public credit + a sincere thank-you is what's on offer.
- **No NDA, no legal release.** I trust researchers to act in good faith. The promise from my side is that I won't pursue legal action against good-faith research. The promise from your side, implicit in choosing to report rather than exploit, is that you won't weaponize what you find.
- **The maintainer is one person.** If a critical issue lands while I'm on a flight or asleep, response will be delayed. Email + GitHub advisory both notify me; use both for genuine emergencies.

## Privacy

If a vulnerability could affect student data, the disclosure should also note:

- Approximate number of users affected (if estimable)
- Whether the data was actually exposed or just exposable
- Whether logs exist that could reveal who accessed what

I'll make a best-effort decision about whether to notify affected users based on severity and confirmability.

## Hall of fame

Contributors who report valid vulnerabilities will be listed here unless they prefer not to be:

*(empty — be the first)*

---

*Last updated: 2026-04-28*
