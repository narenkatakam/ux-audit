---
name: ux-audit
description: >
  Production-grade UX audit and design guidance skill. Transforms vague design feedback into
  actionable, implementable recommendations. Two modes: `guide` (principles + do/don't rules
  for modern interfaces) and `review` (structured audit with prioritized fixes). Covers
  task-first UX, information architecture, CRAP visual hierarchy, accessibility, responsive
  design, typography, color systems, cognitive psychology, and interaction patterns.
  Enforces a modern minimal aesthetic — clean, spacious, typography-led — with zero tolerance
  for emoji-as-icons, decoration-first design, or AI-generated visual excess.
---

# UX Audit — Design Guidance & Review (Modern Minimal)

A skill for AI coding assistants that turns abstract design feedback into code you can ship.

Two modes:

- `guide` — compact principles and concrete do/don't rules for building modern, clean interfaces.
- `review` — structured audit of existing UI (screenshot / mock / HTML / PR) with prioritized, implementable fixes.

Keep outputs concise. Bullets over paragraphs. Specific over generic.

---

## Workflow

### 1) Guide workflow

1. Identify the surface: marketing page / dashboard / settings / creation flow / list-detail / form / mobile screen.
2. Identify the primary user task and primary CTA.
3. Apply system-level guiding principles first — these are the mental model and interaction logic layer (`references/system-principles.md`).
4. Apply core principles below — start from UX, then refine with CRAP visual hierarchy.
5. Apply domain-specific guidance as needed:
   - Icons: `references/icons.md`
   - Accessibility: `references/accessibility.md`
   - Responsive: `references/responsive-design.md`
   - Typography: `references/typography.md`
   - Color: `references/color-systems.md`
   - Navigation: `references/navigation.md`
   - Data visualization: `references/data-visualization.md`
   - Forms: `references/forms.md`
   - UI states (empty, loading, error, success): `references/ui-states.md`
   - Overlays (modals, drawers, popovers, bottom sheets): `references/overlays.md`

### 2) Review workflow

1. State assumptions (platform, target user, primary task).
2. List findings as `P0 / P1 / P2` (blocker / important / polish) with short evidence.
3. For each major issue, label the diagnosis: execution vs evaluation gulf; slip vs mistake (see `references/psychology.md`).
4. Propose fixes that are implementable (layout, hierarchy, components, copy, states).
5. Check accessibility compliance against `references/accessibility.md`.
6. End with a short checklist to verify changes.

Use `references/review-template.md` for a stable output format.

---

## Non-Negotiables (hard rules)

These are binary. No exceptions.

- **No emoji as icons** — no emoji as UI decoration, status indicators, section markers, or button labels. Replace with a proper icon from a consistent set.
- **One icon family** — use a single consistent icon set across the product. No mixing outlined/filled/3D/emoji styles.
- **Minimize copy by default** — add explanatory text only when it prevents errors, reduces ambiguity, or builds trust. Text is the last resort, not the default.
- **Accessible by default** — WCAG 2.1 AA is the floor, not an aspiration. Color contrast, keyboard navigation, screen reader support, and focus management are non-negotiable.
- **No decoration without purpose** — every visual effect (gradient, shadow, blur, glow, animation) must answer: "what does this help the user understand?" No answer = remove it.

---

## System-Level Guiding Principles

Apply these as first-order constraints before choosing components or page patterns.
Full definitions and review questions: `references/system-principles.md`.

Key principles: concept constancy / primary task focus / UI copy source discipline / state perceptibility / help text layering (L0-L3) / feedback loop closure / prevention + recoverability / progressive complexity / action perceptibility / cognitive load budget / evolution with semantic continuity.

---

## Core Principles

### A) Task-First UX

The thing about any interface is that it exists to serve a task. Not to look good. Not to impress stakeholders. To help someone do something.

- Make the primary task obvious in <3 seconds.
- Allow exactly one primary CTA per screen/section.
- Optimize the happy path; hide advanced controls behind progressive disclosure.
- Remove anything that doesn't serve the user's current goal.

**Do:**
```html
<section class="space-y-4">
  <h1 class="text-2xl font-semibold">Create new project</h1>
  <input class="w-full border rounded-lg px-4 py-3" placeholder="Project name" />
  <button class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">Create project</button>
  <details class="text-sm text-gray-500"><summary>Advanced settings</summary>...</details>
</section>
```

**Don't:**
```html
<!-- Two competing CTAs, advanced options visible by default, no clear hierarchy -->
<section>
  <button class="bg-blue-600 text-white px-4 py-2">Create project</button>
  <button class="bg-green-600 text-white px-4 py-2">Import from template</button>
  <div class="grid grid-cols-3 gap-4"><!-- 12 settings fields visible immediately --></div>
</section>
```

Review question: If someone lands here cold, can they figure out what to do in 3 seconds?

### B) Information Architecture (grouping + findability)

- Group by user mental model (goal / object / time / status), not by backend data structure.
- Use clear section titles; keep navigation patterns stable across similar screens.
- When item count grows: add search/filter/sort early, not late.
- Card sort your IA against real user language, not your internal nomenclature.

**Do:**
```html
<!-- Grouped by user goal: "What I need to do" vs "What I've done" -->
<section>
  <h2>Pending reviews</h2>
  <!-- items needing action -->
</section>
<section>
  <h2>Completed</h2>
  <!-- finished items -->
</section>
```

**Don't:**
```html
<!-- Grouped by database table: users see "type_a" and "type_b" which mean nothing to them -->
<section><h2>Type A records</h2>...</section>
<section><h2>Type B records</h2>...</section>
```

Review question: Does the grouping match how users think about this, or how the database stores it?

### C) Feedback and System Status

- Cover all states: loading, empty, error, success, permission. Full checklist in `references/review-template.md` (Universal States gate).
- After any action, answer three questions: "Did it work?" + "What changed?" + "What can I do next?"
- Prefer inline, contextual feedback over global toasts (except for cross-page actions).
- Loading states must prevent layout jumps — use skeletons, not spinners that collapse content.

**Do:**
```jsx
// Skeleton preserves layout while loading
<div class="space-y-3">
  <div class="h-6 w-48 bg-gray-200 rounded animate-pulse" />
  <div class="h-4 w-full bg-gray-200 rounded animate-pulse" />
  <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
</div>

// Inline success feedback after action
<button onClick={save}>Save</button>
{saved && <span class="text-green-600 text-sm ml-2">Saved</span>}
```

**Don't:**
```jsx
// Spinner replaces all content — layout jumps when data arrives
{loading ? <Spinner /> : <Content />}

// Toast for same-page action with no inline confirmation
toast.success("Settings updated!") // user's eyes are on the form, not the toast
```

Review question: At any moment, can the user tell what the system is doing and what they should do next?

### D) Consistency and Predictability

- Same interaction = same component + same wording + same placement.
- Use a small, stable set of component variants; avoid one-off styles.
- Consistency across screens matters more than pixel-perfection on any single screen.

**Do:**
```html
<!-- Same delete pattern everywhere: red outline button, same wording -->
<button class="border border-red-300 text-red-600 px-4 py-2 rounded-lg">Delete project</button>
<button class="border border-red-300 text-red-600 px-4 py-2 rounded-lg">Delete workspace</button>
```

**Don't:**
```html
<!-- Three different patterns for the same action across pages -->
<button class="bg-red-600 text-white">Delete</button>      <!-- page A: filled -->
<button class="text-red-500 underline">Remove</button>      <!-- page B: link style -->
<a href="#" class="text-sm text-gray-500">🗑 Trash</a>      <!-- page C: emoji + different word -->
```

Review question: If someone learns this pattern on page A, will it transfer to page B without relearning?

### E) Affordance + Signifiers (make actions obvious)

- Clickable things must look clickable: button/link styling + hover/focus + cursor change. On web, custom clickable elements need `cursor: pointer` and visible focus styles.
- Primary actions need a label; icon-only is reserved for universally-known actions (search, close, settings).
- Show constraints before submit (format, units, required), not only after errors.
- For deeper theory: `references/psychology.md`.

**Do:**
```html
<button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer">
  Save changes
</button>
<input type="email" placeholder="you@example.com"
  class="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" />
<p class="text-xs text-gray-500 mt-1">We'll never share your email.</p>
```

**Don't:**
```html
<!-- Clickable div with no visual affordance, no focus style, no cursor change -->
<div onclick="save()">Save changes</div>

<!-- Constraints shown only after submit error -->
<input type="text" placeholder="Password" />
<!-- after submit: "Password must be 8+ chars with a number" — tell them BEFORE -->
```

Review question: Without any help text or tooltips, can users predict what is actionable and what will happen?

### F) Error Prevention and Recovery

- Prevent errors with constraints, defaults, and inline validation.
- Make destructive actions reversible when possible; otherwise require deliberate confirmation.
- Error messages must be actionable: what happened + how to fix it. Never just "Something went wrong."
- Frame destructive confirmations around what will be lost, not the action itself.

**Do:**
```html
<!-- Inline validation prevents errors before submit -->
<label class="block text-sm font-medium">Email</label>
<input type="email" class="border rounded-lg px-4 py-2 border-red-500" value="bad-email" />
<p class="text-red-600 text-sm mt-1">Enter a valid email address (e.g., you@example.com)</p>

<!-- Destructive confirmation framed around what's lost -->
<dialog>
  <p class="font-semibold">Delete "Q4 Report"?</p>
  <p class="text-sm text-gray-600">This will permanently delete the report and 12 comments. This can't be undone.</p>
  <button class="bg-red-600 text-white">Delete report</button>
  <button class="border">Cancel</button>
</dialog>
```

**Don't:**
```html
<!-- Generic error with no guidance -->
<div class="bg-red-100 p-4">Something went wrong. Please try again.</div>

<!-- Confirmation that describes the action, not the consequence -->
<dialog>
  <p>Are you sure you want to delete?</p>
  <button>Yes</button> <button>No</button>
</dialog>
```

Review question: Is the path designed to be easy to do right and safe to recover when wrong?

### G) Cognitive Load Control

- Reduce choices: sensible defaults, presets, and progressive disclosure.
- Break long tasks into steps only when it genuinely reduces thinking (not just to look "enterprise").
- Keep visual noise low: fewer borders, fewer colors, fewer competing highlights.
- Don't force users to remember information across screens — carry context forward.

**Do:**
```html
<!-- Sensible defaults reduce decisions -->
<label>Timezone</label>
<select><option selected>Europe/Amsterdam (detected)</option>...</select>

<!-- Context carried forward: selected plan shown on checkout -->
<div class="bg-gray-50 rounded-lg p-4 mb-6">
  <p class="text-sm text-gray-500">Selected plan</p>
  <p class="font-medium">Pro — $29/mo</p>
</div>
```

**Don't:**
```html
<!-- 15 options with no defaults, no recommended choice -->
<fieldset>
  <legend>Choose your plan</legend>
  <label><input type="radio" /> Starter</label>
  <label><input type="radio" /> Basic</label>
  <label><input type="radio" /> Basic Plus</label>
  <label><input type="radio" /> Standard</label>
  <!-- ... 11 more options with no visual hierarchy -->
</fieldset>
```

Review question: As information grows, does comprehension cost stay stable?

### H) CRAP (visual hierarchy + layout)

- **Contrast** — emphasize the few things that matter (CTA, current state, key numbers). If everything is bold, nothing is.
- **Repetition** — tokens, components, and spacing follow a scale. Avoid "almost the same" styles — they create cognitive noise.
- **Alignment** — align to a clear grid. Fix 2px drift. Align baselines where text matters.
- **Proximity** — tight within a group, loose between groups. Spacing is the primary grouping tool, not borders.

**Do:**
```html
<!-- Clear hierarchy: one bold CTA, muted secondary, grouped by proximity -->
<div class="space-y-6">
  <div class="space-y-1">                          <!-- tight: label + input are one group -->
    <label class="text-sm font-medium">Project name</label>
    <input class="border rounded-lg px-4 py-2 w-full" />
  </div>
  <div class="space-y-1">
    <label class="text-sm font-medium">Description</label>
    <textarea class="border rounded-lg px-4 py-2 w-full"></textarea>
  </div>
  <div class="flex gap-3 pt-4">                    <!-- loose: buttons separated from form -->
    <button class="bg-blue-600 text-white px-6 py-2 rounded-lg">Create</button>
    <button class="text-gray-500">Cancel</button>
  </div>
</div>
```

**Don't:**
```html
<!-- Everything competes: two bold buttons, borders everywhere, no proximity grouping -->
<div class="border p-4">
  <label class="font-bold text-lg">Project name</label>
  <input class="border-2 border-blue-500 rounded p-2 w-full" />
  <label class="font-bold text-lg mt-2">Description</label>
  <textarea class="border-2 border-blue-500 rounded p-2 w-full"></textarea>
  <button class="bg-blue-600 text-white font-bold px-4 py-2 mt-2">Create</button>
  <button class="bg-gray-600 text-white font-bold px-4 py-2 mt-2">Cancel</button>
</div>
```

Review question: Close your eyes, open them — is the first thing you see the most important thing on the page?

### I) Accessibility

Accessibility is not a feature. It's a quality standard. Like structural integrity in a building — you don't "add" it later.

- WCAG 2.1 AA is the minimum. Test against it.
- Color must never be the only way to convey information.
- All interactive elements must be keyboard accessible with visible focus indicators.
- Screen reader users must get equivalent information and functionality.
- Full guidance: `references/accessibility.md`.

**Do:**
```html
<!-- Status uses color + icon + text -->
<span class="flex items-center gap-1.5 text-red-600">
  <svg class="w-4 h-4"><!-- X icon --></svg>
  Failed
</span>

<!-- Focus visible, skip link, semantic structure -->
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
  bg-white px-4 py-2 rounded shadow">Skip to content</a>
<main id="main" tabindex="-1">...</main>
```

**Don't:**
```html
<!-- Color is the only indicator — invisible to color-blind users -->
<span style="color: red">●</span>  <!-- what does red dot mean? -->
<span style="color: green">●</span>

<!-- Non-semantic div with click handler, no keyboard support, no role -->
<div onclick="submit()" style="background: blue; color: white; padding: 8px">Submit</div>
```

Review question: Can a user who can't see color, can't use a mouse, or can't see at all still complete the primary task?

### J) Responsive Design

- Design for the smallest screen first, then enhance for larger ones.
- Content hierarchy should be preserved across breakpoints, not just reflowed.
- Touch targets: minimum 44x44 CSS px (web) / 48x48 dp (mobile).
- Full guidance: `references/responsive-design.md`.

**Do:**
```html
<!-- Mobile-first: single column, stacks naturally, enhances at breakpoints -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="p-6">...</div>
  <div class="p-6">...</div>
  <div class="p-6">...</div>
</div>

<!-- Touch-friendly: 44px min tap target with adequate spacing -->
<button class="min-h-[44px] min-w-[44px] px-4 py-3">Action</button>
```

**Don't:**
```html
<!-- Fixed desktop width, breaks on mobile -->
<div style="width: 1200px; display: flex; gap: 24px">...</div>

<!-- Tiny tap targets, no spacing between interactive elements -->
<div class="flex gap-1">
  <button class="text-xs px-1 py-0.5">Edit</button>
  <button class="text-xs px-1 py-0.5">Delete</button>
  <button class="text-xs px-1 py-0.5">Share</button>
</div>
```

Review question: Does the interface work on a phone held in one hand, a tablet in landscape, and a wide desktop monitor?

### K) Typography

Typography is the backbone of visual hierarchy. Get it right and everything else falls into place.

- Use a type scale — not arbitrary font sizes.
- Limit to 2 typefaces maximum (one for headings, one for body — or one for everything).
- Line length: 45-75 characters for body text. Wider than that and reading comprehension drops.
- Full guidance: `references/typography.md`.

**Do:**
```html
<!-- Clear scale: 30/20/16/14. One font. Constrained line length -->
<article class="max-w-prose">             <!-- max-w-prose = ~65ch -->
  <h1 class="text-3xl font-semibold leading-tight">Page title</h1>
  <h2 class="text-xl font-medium text-gray-700 mt-6">Section heading</h2>
  <p class="text-base leading-relaxed text-gray-600 mt-2">Body text...</p>
  <span class="text-sm text-gray-400">Caption or metadata</span>
</article>
```

**Don't:**
```html
<!-- Arbitrary sizes, no scale, full-width body text, multiple fonts -->
<h1 style="font-size: 28px; font-family: Playfair Display">Title</h1>
<h2 style="font-size: 19px; font-family: Roboto">Subtitle</h2>
<p style="font-size: 15px; font-family: Open Sans; width: 100%">
  Body text running edge to edge across a 1440px monitor...
</p>
```

Review question: Can you identify the hierarchy (title > subtitle > body > caption) just from the typography?

### L) Color Systems

- Keep the palette small and intentional. One accent color for primary actions and key states.
- Use semantic color tokens, not raw hex values — this makes theming and dark mode possible.
- Test all color combinations for WCAG AA contrast (4.5:1 for text, 3:1 for large text and UI components).
- Full guidance: `references/color-systems.md`.

**Do:**
```css
/* Semantic tokens — change theme by swapping values, not rewriting components */
:root {
  --color-text-primary: #1a1a1a;
  --color-bg-primary: #ffffff;
  --color-action-primary: #2563eb;
  --color-error: #dc2626;
}
```
```html
<button class="bg-[var(--color-action-primary)] text-white">Primary action</button>
```

**Don't:**
```html
<!-- Raw hex scattered everywhere — theming impossible, dark mode nightmare -->
<button style="background: #2563eb; color: #fff">Save</button>
<button style="background: #3b82f6; color: #fff">Submit</button>  <!-- slightly different blue, why? -->
<p style="color: #6b7280">Muted text</p>
<p style="color: #9ca3af">Also muted text but different gray</p>
```

Review question: If you printed this screen in grayscale, would the hierarchy still be clear?

---

## Spacing and Layout Discipline

Use this when implementing or reviewing layouts. Short set of rules, strictly enforced.

- **Rule 1 — One spacing scale:**
  - Base unit: 4px.
  - Allowed set: 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80.
  - Off-scale values need a clear, documented reason.

- **Rule 2 — Repetition first:**
  - Same component type keeps the same internal spacing (cards, list rows, form groups, section blocks).
  - Components with the same visual role must not have different spacing patterns.

- **Rule 3 — Alignment + grouping:**
  - Align to one grid and fix 1-2px drift.
  - Tight spacing within a group, looser spacing between groups.
  - Spacing is the primary grouping tool. If you need a border to show grouping, your spacing is wrong.

- **Rule 4 — No decorative nesting:**
  - Extra wrappers must add real function (grouping, state, scroll, affordance).
  - If a wrapper only adds border/background, remove it and group with spacing instead.

- **Quick review pass:**
  - Any off-scale spacing values?
  - Any baseline/edge misalignment?
  - Any wrapper layer removable without losing meaning?

---

## Modern Minimal Style Guidance

Restraint is the design tool. These are concrete rules, not vibes.

### Surface treatment
- **Shadows**: max `0 1px 3px rgba(0,0,0,0.1)` for cards, `0 4px 12px rgba(0,0,0,0.08)` for elevated overlays. No blur > 16px. No colored shadows.
- **Borders**: 1px, `opacity 0.1–0.15` of foreground color. No borders > 1px except active/focus states.
- **Border radius**: pick one scale and stick to it. Recommended: 6px (small), 8px (medium), 12px (large). Never mix rounded and sharp on the same page.
- **Backgrounds**: max 2 background tones per page (e.g., white + gray-50). No gradients on surfaces — flat only. Gradient is allowed on one hero element or one CTA, not both.

### Color restraint
- **Max 2 colors per component** — one foreground/background pair + one accent for interactive state. Third color only for destructive/warning.
- **One accent color** for primary actions and key states across the entire product. Secondary accent only if functionally distinct (e.g., success vs primary).
- **Grays do the heavy lifting** — hierarchy comes from weight and shade, not from adding more colors.

### Whitespace
- **Whitespace:content ratio** — aim for roughly 40-50% whitespace on content-heavy pages, 50-60% on landing/hero pages.
- **Section spacing** — minimum 48px between major sections, 24px between related groups. If content feels dense, add space before adding borders.
- **Let content breathe** — dense information is not the same as useful information.

### Copy
- Short, direct labels. Every word must earn its place.
- Helper text only when it prevents errors or builds trust.
- No marketing copy in functional UI. Save it for landing pages.

### Quick check
- [ ] No shadow blur > 16px anywhere
- [ ] Max 2 background tones on this page
- [ ] No component uses more than 2 colors + 1 accent
- [ ] Whitespace between sections is >= 48px
- [ ] Every gradient has a functional purpose (not "it looks nice")

---

## Motion and Animation Guidance

- Motion explains **hierarchy** (what is a layer/panel) and **state change** (what just happened). Not decoration.
- Default motion vocabulary: fade > small translate+fade > tiny scale+fade for overlays. Avoid bouncy, elastic, or "showy" motion.
- Keep the canvas/content area stable. Panels and overlays can move; the work surface must not float.
- Same component type uses the same motion pattern. Consistency over creativity.
- Avoid layout jumps. Use placeholders/skeletons to keep layout stable while loading.
- Interaction feedback (hover/pressed) must feel immediate. Never make users wait for an animation to complete before they can proceed.

Red flags:
- Continuous decorative motion (breathing backgrounds, floating cards)
- Large bouncy/elastic overshoot that steals attention
- Big page-level transitions for routine navigation
- Multiple simultaneous animations competing for attention

Quick check:
- [ ] Every animation serves a purpose: hierarchy (layers), state change (feedback), or spatial orientation.
- [ ] No decorative motion: no breathing backgrounds, floating elements, or bouncing icons.
- [ ] Duration: micro-interactions 100-200ms. Panel/page transitions 200-350ms. Nothing longer than 500ms without a reason.
- [ ] Easing: ease-out for entrances, ease-in for exits, ease-in-out for position changes. No linear motion for UI elements.
- [ ] `prefers-reduced-motion` is respected.
- [ ] No animation blocks interaction.
- [ ] Same component type uses the same motion pattern throughout the product.
- [ ] No more than one animation playing at a time in the user's focal area.

---

## Anti-AI Self-Check (run after generating any UI)

Before finalizing generated UI, verify these items. Violating any one is a mandatory fix.

- **Gradient restraint** — gradients must convey meaning (progress, depth, state distinction). Purely decorative gradients: at most one per page. If background, buttons, and borders all use gradients simultaneously, that is overuse. Pick one and flatten the rest.
- **No emoji as UI** — re-check: no emoji slipped in as section icons, status indicators, or button labels. This is already a non-negotiable. Double-check.
- **Copy necessity** — for every piece of text, ask: if I remove this, can the user still understand through layout, icons, and position alone? If yes, remove it.
- **Decoration justification** — every purely visual effect (blur, glow, animated entrance, layered shadows) must answer: "what does this help the user understand?" No answer = remove.
- **Contrast check** — run a quick contrast check on all text/background combinations. WCAG AA minimum.
- **Touch target check** — all interactive elements meet minimum 44x44 CSS px.
- **Keyboard test** — tab through the entire interface. Can you reach and activate every interactive element? Is focus visible?

---

## References

- System-level guiding principles: `references/system-principles.md`
- Psychology (Norman's design foundations, HCI laws, cognitive biases, interaction flow, attention): `references/psychology.md`
- Accessibility (WCAG, keyboard, screen readers, color, forms, media): `references/accessibility.md`
- Responsive design (breakpoints, mobile-first, touch, fluid layouts): `references/responsive-design.md`
- Typography (type scale, pairing, line height, measure, hierarchy): `references/typography.md`
- Color systems (palettes, semantic tokens, contrast, dark mode): `references/color-systems.md`
- Navigation patterns (nav structures, wayfinding, mobile nav): `references/navigation.md`
- Data visualization (chart selection, data-ink ratio, dashboard design): `references/data-visualization.md`
- Icon rules and "intuitive refined" guidance: `references/icons.md`
- Forms (validation, multi-step, field patterns, form a11y): `references/forms.md`
- UI states (empty, loading, error, success — patterns, decision trees, copy guidance): `references/ui-states.md`
- Overlays (modals, drawers, popovers, bottom sheets — sizing, focus traps, z-index, decision tree): `references/overlays.md`
- Review output template, verification gates, and surface-specific checklists: `references/review-template.md`
