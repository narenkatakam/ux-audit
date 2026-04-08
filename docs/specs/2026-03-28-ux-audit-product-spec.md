# UX Audit Product — Spec

## Meta
- **Scale:** Medium
- **Date:** 2026-03-28
- **Single Metric:** ≥2 of 3 public X audits generate a DM or public reply requesting an audit
- **Core (P0):** The audit report — specific, actionable, prioritized, feedable back to AI coding tools

---

## The 5 Locks

### L1: Pain
Vibecoders ship functional apps that look amateur. They know something's off but lack the design eye to diagnose it. They waste hours tweaking visuals without a framework. The pain is credibility ("I can't show this") and wasted time ("I keep fiddling and it's still off").

### L2: Evidence
Observed frustration on X threads (replies to "built this with one prompt" posts) and YouTube (view counts on vibecoding design fix content). Adjacent market validated by $5k design agencies serving the same pain. **Gap:** Nobody paying for an automated audit yet — thin slice tests this.

### L3: Cost of Inaction
Time-bound window. Vibecoding pain is acute now. In 12-18 months, AI tools improve their design output or the market fills with solutions. The UX Audit skill's depth is a genuine edge, but only if deployed while the pain is fresh. Waiting doesn't lose to a competitor — it loses to the market moving past the moment.

### L4: Smallest Proof
Find 3 vibe-coded apps posted on X. Run the UX Audit skill on each. Post the report publicly (thread or reply). Measure inbound: DMs, "do mine" requests. Zero friends, zero hypothetical money. Pure demand signal from strangers.

### L5: Done State
≥2 of 3 posts generate a DM or public reply requesting their own audit. Engagement (likes, retweets) doesn't count.

---

## Priority Rings

```
        +-----------------------------+
        |      P2: Edge               |  -- discovery, branding, scale
        |  +-----------------------+  |
        |  |  P1: Critical         |  |  -- delivery format, X posting,
        |  |                       |  |     distribution mechanics
        |  |  +-----------------+  |  |
        |  |  |  P0: The Report |  |  |  -- specific, actionable,
        |  |  |                 |  |  |     prioritized, feedable
        |  |  +-----------------+  |  |     back to AI coding tools
        |  +-----------------------+  |
        +-----------------------------+
```

- **P0 -- The Report:** Diagnostic quality, prioritized fixes (P0/P1/P2), specific enough to feed back into a vibecoding tool as a fix roadmap
- **P1 -- Delivery & Distribution:** How the report gets generated, how it's posted on X, the format that makes it shareable and readable in a thread
- **P2 -- Scale mechanics:** Pricing, Stripe, landing page, automation, discovery pipeline

---

## Claims

### P0 -- Core (The Report)

- [ ] **P0.1** Claim: The report identifies at least 5 specific UX issues per audited app, each tied to a named principle (e.g., "CRAP: Contrast", "Cognitive Load", "Affordance").
  - Inversion: Report produces fewer than 5 issues, or issues are generic ("improve the layout") without principle attribution.

- [ ] **P0.2** Claim: Every issue in the report includes a concrete fix instruction specific enough that a vibecoder can paste it into their AI coding tool and get a working improvement.
  - Inversion: Fix instructions are vague ("use better spacing") rather than actionable ("increase padding between card elements from 8px to 24px, group related actions within 8px").

- [ ] **P0.3** Claim: Issues are prioritized into P0/P1/P2 rings where P0 = "this is why it looks amateur", P1 = "this hurts but it's survivable", P2 = "polish when the rest is fixed."
  - Inversion: All issues presented as equal priority, or prioritization doesn't match what a trained designer would rank.

- [ ] **P0.4** Claim: A vibecoder who reads the report can explain what's wrong with their app to a non-designer in under 2 minutes, using the report's language.
  - Inversion: Report uses jargon the vibecoder doesn't understand, or findings are too abstract to articulate simply.

- [ ] **P0.5** Claim: The report produces different, specific findings for different apps -- not a template with swapped screenshots.
  - Inversion: Two different apps receive substantially overlapping findings (>60% same issues, same wording).

### P1 -- Critical (Delivery & Distribution)

- [ ] **P1.1** Claim: The full audit (from screenshot/URL input to finished report) completes in under 5 minutes.
  - Inversion: Generation takes longer than 5 minutes, making it impractical for batch auditing or live demos.

- [ ] **P1.2** Claim: The report is formatted as a self-contained artifact (HTML or PDF) shareable as a single link or file attachment.
  - Inversion: Report requires special tools to view, or is only readable inside a terminal/IDE.

- [ ] **P1.3** Claim: The report renders cleanly as an X thread -- each major finding fits in one tweet-length block with a visual.
  - Inversion: Findings are too long for thread format, or lose clarity when broken into tweet-sized pieces.

- [ ] **P1.4** Claim: The report includes at least one before/after visual or annotated screenshot per P0 finding.
  - Inversion: Report is text-only with no visual evidence of the issues found.

### P2 -- Edge (Scale)

- [ ] **P2.1** Claim: A non-technical user can trigger an audit by providing only a URL -- no setup, no local tools, no CLI.
  - Inversion: Audit requires installing dependencies, running terminal commands, or providing screenshots manually.

- [ ] **P2.2** Claim: The system can audit 10 different apps in a day without manual intervention per audit.
  - Inversion: Each audit requires bespoke prompt engineering or manual screenshot capture.

---

## Golden Examples

| # | Input | Expected Output | Ring | Type |
|---|-------|-----------------|------|------|
| 1 | Screenshot of a vibe-coded SaaS dashboard with inconsistent spacing, 3 font sizes that don't follow a scale, emoji used as status indicators, and a primary CTA that blends into the background | Report identifies: (1) P0: CTA has insufficient contrast -- change to solid accent color, min 4.5:1 ratio. (2) P0: Emoji as status icons -- replace with consistent icon set (Lucide/Phosphor). (3) P0: No visual hierarchy -- establish 3-level type scale (24/16/14). (4) P1: Spacing is off-grid -- normalize to 8px base unit. (5) P1: Card grouping relies on borders, not proximity -- remove borders, use 24px gap between groups, 8px within. Each fix includes paste-ready instruction for AI coding tool. | P0 | Happy path |
| 2 | Screenshot of a beautifully designed, well-structured landing page (e.g., Linear, Vercel) with no significant UX issues | Report identifies 0-1 minor P2 issues and explicitly states "This app demonstrates strong design fundamentals. No critical issues found." Does NOT manufacture problems to fill a template. | P0 | Boundary |
| 3 | Screenshot of a mobile app with 8px touch targets, white text on yellow background, no loading states, and a 15-field form on one screen | Report leads with accessibility P0s: (1) Touch targets below 44px minimum -- WCAG failure. (2) Contrast ratio ~1.5:1 on CTA -- WCAG AA requires 4.5:1. (3) Cognitive overload -- break 15-field form into 3-4 steps or use progressive disclosure. Prioritization puts accessibility before aesthetics. | P0 | Critical path |
| 4 | Two different vibe-coded apps: a todo app and an e-commerce checkout -- both generated by the same AI tool with similar visual patterns | Reports for each app surface DIFFERENT primary findings. Todo app: missing empty state, no feedback on task completion. E-commerce: form validation absent, trust signals missing, destructive "clear cart" has no confirmation. Less than 40% overlap in findings. | P0 | Differentiation (tests P0.5) |
| 5 | A screenshot of an app that's visually clean but has invisible UX failures: clickable elements that don't look clickable, no error states, navigation that changes pattern between screens | Report catches the invisible failures -- not just visual issues. Identifies: affordance gaps (no hover/cursor states), missing error handling, inconsistent navigation pattern. Doesn't get fooled by surface-level aesthetics. | P1 | Adversarial |

---

## Eval Criteria

| Dimension | Method | Threshold | Ring |
|-----------|--------|-----------|------|
| **Specificity** | Human eval -- can you paste each fix instruction into an AI coding tool and get a working change? | >=80% of fix instructions are paste-ready | P0 |
| **Differentiation** | Deterministic -- compare findings across 3 different app audits, measure text overlap | <40% overlap in findings between any two reports | P0 |
| **Prioritization accuracy** | LLM-as-Judge -- does a design-expert prompt agree with P0/P1/P2 ranking? | >=75% agreement on P0 classification | P0 |
| **Completeness** | Human eval -- did the report miss any obvious issues a trained designer would catch? | <=1 missed P0 issue per audit | P1 |
| **Readability** | Human eval -- can a non-designer understand every finding without Googling? | 5 out of 5 findings understandable to a vibecoder with no design background | P1 |
| **Generation time** | Deterministic -- wall clock from input to finished report | <5 minutes | P1 |
| **Thread-ability** | Human eval -- does each major finding fit in a tweet-length block while remaining clear? | >=4 of 5 P0 findings work as standalone tweet-length blocks | P2 |

---

## Thin Slice

- **What it builds:** A single UX audit report for one real vibe-coded app found on X. Generated using the existing ux-audit skill + adapted report generation from klaar-ai. Output as a shareable HTML file.
- **What it tests:** The riskiest assumption -- that an AI-generated audit report is specific and actionable enough that a stranger finds it valuable. Not "interesting" -- valuable enough to request one for themselves.
- **Pass condition:** Post the audit as an X thread. >=1 DM or public reply requesting their own audit within 72 hours. (This is the thin slice of the thin slice -- one post, not three. If one post generates demand, scale to the full L5 test of 3 posts.)

---

## Pre-Mortem

| # | Kill Risk | Likelihood | Early Warning | Mitigation |
|---|-----------|-----------|---------------|------------|
| 1 | **Report feels generic** -- findings read like "improve contrast, fix spacing" regardless of input. Vibecoders see it as ChatGPT filler. | 35% | First test audit looks similar to a second test audit. Overlap >60%. | Ground every finding in the specific app's screenshot. Include annotated visuals. P0.5 claim is the safeguard -- test differentiation explicitly before posting. |
| 2 | **X algorithm buries the thread** -- great report, zero distribution. Nobody sees it. | 40% | First post gets <500 impressions after 24 hours. | Tag the original app creator. Post during peak hours (US morning). Quote-tweet the original "look what I built" post. If organic fails, DM the creator directly with the report as a gift. |
| 3 | **Vibecoders don't care about UX** -- they shipped something that works, "looks fine to me." Pain isn't acute enough to act on. | 20% | Responses are "cool but I'm happy with how it looks" or no engagement at all on the fixes. | Target vibecoders who already expressed frustration ("I know the design sucks but..."). These are the self-aware ones. Avoid the "looks fine to me" crowd entirely. |
| 4 | **Report generation is too manual** -- each audit requires 30+ minutes of prompt engineering and manual screenshot work, making 3 posts in a week unsustainable. | 25% | First audit takes >1 hour end to end. | Scope the thin slice to accept screenshot input only (no automated URL capture). Klaar-ai report code reduces generation overhead. If still >30 min, the P1.1 claim fails and we know before posting. |
| 5 | **ThoughtWorks IP/moonlighting conflict** -- launching a paid product without filing the Outside Activity form creates employment risk. | 15% but high severity | TW HR reaches out, or Naren self-audits and realizes form isn't filed. | File the Outside Activity form BEFORE the first paid audit. The thin slice (free public audits) carries zero IP risk -- it's personal content. Paid product requires the form. Binary gate. |

---

## Implementation Notes (captured during spec, not part of the contract)

1. **Discovery mechanism:** How to efficiently find vibe-coded apps on X -- needs a search strategy or monitoring approach.
2. **Report generation:** Reuse klaar-ai's report generation code, adapt for UX Audit output format.
3. **TW Outside Activity form:** File on Monday 2026-03-31 before any paid work. Thin slice (free audits) is safe to run immediately.
