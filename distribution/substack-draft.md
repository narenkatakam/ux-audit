# Substack Article — UX Audit Launch

> **Publish:** Same day as X thread, or day after
> **Title options (pick one):**
> 1. "I Gave My AI a Design Eye — Here's What Changed"
> 2. "The Missing Skill: Teaching AI Coding Assistants About Design"
> 3. "12 Design Principles That Changed How My AI Builds UI"

---

## I Gave My AI a Design Eye — Here's What Changed

There's a moment every developer using AI assistants hits.

You describe what you want. The AI generates it. It compiles. It works. And then you look at it and think: *this looks like it was built by someone who's never used the thing they're building.*

Because it was.

AI coding assistants are trained on code, not on design. They know how to make a button — they don't know why that button should be red, why it should say "Delete report" instead of "Yes", or why the modal needs a focus trap.

I spent two weeks fixing this.

### The Skill

UX Audit is a skill file — a set of instructions you drop into your AI assistant's context. It works with Claude Code, Cursor, Codex, and Windsurf. No library to install, no framework to learn. One file that rewires how the AI thinks about interfaces.

Inside:

- **12 core design principles** — from "one primary CTA per screen" to "WCAG 2.1 AA minimum on all text." Each principle comes with do/don't code examples you can copy-paste.
- **13 deep-dive reference docs** — accessibility, responsive design, typography, color systems, forms, UI states, overlays, psychology, navigation, data visualization, and more.
- **7 component checklists** — building a table? A modal? A dashboard? Start with a 12-14 item checklist that tells you exactly what to check before shipping.
- **Two modes** — Guide (tell it what you're building, get back design-informed code) and Review (share existing UI, get a structured P0/P1/P2 audit).

### Before and After

Here's a delete confirmation without the skill:

```html
<dialog>
  <p>Are you sure you want to delete?</p>
  <button>Yes</button>
  <button>No</button>
</dialog>
```

No specifics. No consequence framing. "Yes/No" labels that tell the user nothing. Can't tell what they're losing.

With the skill:

```html
<dialog role="dialog" aria-modal="true" aria-labelledby="delete-title"
  class="max-w-md rounded-xl p-6 shadow-lg">
  <h2 id="delete-title" class="text-lg font-semibold">
    Delete "Q4 Report"?
  </h2>
  <p class="text-sm text-gray-600 mt-2">
    This will permanently delete the report and 12 comments.
    This can't be undone.
  </p>
  <div class="flex justify-end gap-3 mt-6">
    <button class="px-4 py-2 rounded-lg border text-gray-700
      hover:bg-gray-50 focus:ring-2 focus:ring-offset-2">
      Cancel
    </button>
    <button class="px-4 py-2 rounded-lg bg-red-600 text-white
      hover:bg-red-700 focus:ring-2 focus:ring-red-500">
      Delete report
    </button>
  </div>
</dialog>
```

Names what's being deleted. States the consequence. Action-specific button labels. Accessible markup. Focus styles. Destructive action is visually distinct.

Same AI. Same prompt complexity. Completely different output.

### The Philosophy

This isn't about making things pretty. Prettiness is a side effect.

The skill encodes a system: every interaction answers three questions. *Did it work? What changed? What's next?* Every button communicates intent. Every error message prevents the next mistake. Every loading state preserves layout so the user's eyes don't jump.

Five rules are non-negotiable:
1. No emoji as UI icons (inconsistent rendering, no semantics)
2. One icon family per project (mixed styles = visual noise)
3. Minimize copy (if layout communicates it, words are redundant)
4. WCAG 2.1 AA contrast minimum (accessibility is a standard, not a feature)
5. No decoration without purpose (every effect must help the user understand something)

These aren't preferences. They're the floor.

### The Origin

I forked [oiloil-ui-ux-guide](https://github.com/oil-oil/oiloil-ui-ux-guide) — a Chinese-language UI/UX skill with strong bones. Good core principles, a smart help-text layering system, Norman-inspired psychology references. But it was missing accessibility, responsive design, typography, color systems, forms, UI states, overlays, and any kind of structured review workflow.

I rewrote it in English and expanded it from 800 to 5,000+ lines. Every rule traces back to a user outcome, not a style preference.

### Try It

Install in 30 seconds:

```bash
curl -sSL https://raw.githubusercontent.com/narenkatakam/ux-audit/main/install.sh | bash
```

Or just clone it:

```bash
git clone https://github.com/narenkatakam/ux-audit.git
```

It's Apache 2.0 licensed. Free forever.

If you're building UI with AI assistance — and at this point, who isn't — this is the missing layer between "it works" and "it's well-designed."

→ [github.com/narenkatakam/ux-audit](https://github.com/narenkatakam/ux-audit)

---

*Building in public. This is the kind of thing I'll be writing about here — the intersection of product thinking, design systems, and AI tooling. Subscribe if that's your thing.*
