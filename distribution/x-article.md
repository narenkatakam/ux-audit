# Your AI Writes Code. It Has No Idea How to Design. This UX Skill Fixes That.

*The first in a series on teaching AI systems to make decisions humans care about.*

---

Your AI generates UI that compiles. It also generates UI that looks like nobody who cares about design touched it. That's not a capability gap — it's a context gap. Here's the file that closes it.

---

Every button is the same weight. Labels say "Yes" and "No" instead of telling you what's about to happen. No loading state, no empty state, no error state. The spacing feels wrong but you can't say why.

The AI isn't bad at code. It's untrained in design. It knows syntax. It doesn't know intent. It can build a modal — it just doesn't know why that modal needs a focus trap, why the destructive button should be red, or why "Delete report" is better than "Yes."

That distinction matters. If the problem is a training gap and not a capability gap, it's fixable. You just need to give the AI the right context.

So I built a file.

---

**[IMAGE: Rendered before/after — delete confirmation side by side, dark background]**

Here's a delete confirmation. Left: what AI generates without design context. Right: with it.

Without the skill: *"Are you sure? Yes / No."* No specifics. The user has no idea what they're about to lose.

With it: the name of what's being deleted. The consequence stated plainly — "This will permanently delete the report and 12 comments. This can't be undone." Action-specific labels. Cancel vs. Delete report. Accessible markup. Focus management. The destructive action is visually distinct.

Same AI. Same prompt complexity. The only thing that changed was context.

After this install, your AI generates accessible markup, state management, destructive action warnings, and consequence copy by default — without you asking for any of it. Design review feedback drops. Rework drops. The output looks like a different product.

---

**[IMAGE: Quick-reference table from SKILL.md open in VS Code — showing the scope]**

I started with an existing Chinese-language UI/UX skill — [oiloil-ui-ux-guide](https://github.com/oil-oil/oiloil-ui-ux-guide) — strong bones, but no accessibility, no responsive design, no typography system, and inaccessible to English-language tooling. Two weeks of rebuilding later: 800 lines became 5,000+. Every rule traces back to a user outcome, not a style preference. If it can't answer "what does this help the user do?", it doesn't belong.

Let me show you three of the twelve principles:

**Task-First UX.** One primary CTA per screen, identifiable in 3 seconds. Most AI-generated interfaces have three equally weighted buttons. This single rule fixes 40% of the problem. The user should never have to scan the entire screen to find what they came here to do.

**Error Prevention.** Don't just catch errors — prevent them. Confirm destructive actions. Name what will be lost. Show the consequences before the user commits. The delete confirmation above is this principle in action. The AI now generates confirmation dialogs that tell you exactly what's about to happen, every time.

**Feedback & System Status.** Every action should answer three questions: Did it work? What changed? What's next? Skeleton loaders instead of spinners. Inline success confirmations instead of page redirects. Progress indicators that tell you how far along you are, not just that something is happening.

These three are from a set of twelve. The skill also covers information architecture, consistency, affordance, cognitive load, visual hierarchy, accessibility, responsive design, typography, and colour systems — each with do/don't code examples.

---

The skill runs in two modes.

**Guide mode:** Tell it what you're building — "a settings page for a SaaS dashboard" — and it returns tailored design principles with specific, implementable rules. Settings grouped by user mental model. Help text layered by severity. Accessible toggles. Inline validation. The component checklist for your surface type.

**Review mode:** Share existing UI — a screenshot, some HTML, a PR — and it returns a structured P0/P1/P2 audit. Root-cause diagnosis. Implementable fixes, not vague suggestions. A verification checklist so you know when you're done.

**[IMAGE: Review mode output — P0/P1/P2 findings in Claude Code or Cursor]**

Seven component checklists (buttons, cards, tables, forms, modals, navigation, dashboards) and thirteen deep-dive reference documents for when you need depth. The whole system is designed so you never have to read all of it — point the AI at what you're building and let it pull what's relevant.

---

Five rules are non-negotiable:

1. No emoji as UI icons — inconsistent rendering, no semantics
2. One icon family per project — mixed styles are visual noise
3. Minimize copy — if layout communicates it, words are redundant
4. WCAG 2.1 AA contrast minimum — accessibility is a standard, not a feature
5. No decoration without purpose — every gradient, shadow, and animation must help the user understand something

These aren't preferences. They're the floor. Everything above is taste. But the floor has to be solid.

---

Here's what it does in 60 seconds. Paste these five rules into any AI assistant right now — Claude, ChatGPT, Cursor, Copilot — and ask it to build any UI component:

```
1. No emoji as UI icons — use a proper icon set
2. One primary CTA per screen, identifiable in 3 seconds
3. Cover all states: loading, empty, error, success
4. WCAG 2.1 AA contrast minimum on all text
5. Spacing: 4px base unit, tight within groups, loose between
```

That's 5 of 12 principles. The full skill installs in one command:

```bash
curl -sSL https://raw.githubusercontent.com/narenkatakam/ux-audit/main/install.sh | bash
```

Works with Claude Code, Cursor, Codex, and Windsurf. Apache 2.0. Free forever.

[github.com/narenkatakam/ux-audit](https://github.com/narenkatakam/ux-audit)

The skill is free. I'm building a structured audit kit for teams — component checklists, severity scoring, a full design review workflow you can run without a designer in the room. If that's useful, follow along.

---

If you try the 5-rule test and the output surprises you — I want to see it. Drop it in the replies.

Same AI. Same prompts. Better taste.

---

## Posting Notes (not part of the article)

- **Format:** X Premium long-form article
- **Cover image:** Midjourney hero (prompt #3 or #4 from midjourney-prompts.md)
- **Inline images:** 3 total — before/after render, SKILL.md screenshot, review mode screenshot
- **Post time:** Monday–Thursday, 3 PM CET (9 AM US East Coast)
- **Follow-up tweet (post same day):** "I wrote about teaching AI coding assistants to think about design. One skill file, 12 principles, open source. [article link]"
- **Substack:** Publish adapted version same day or next day
- **LinkedIn:** Following Monday morning, adapted from linkedin-post.md
