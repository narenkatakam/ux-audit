# UI States

Practical reference for designing and reviewing the four critical UI states: empty, loading, error, and success. Use this when building any screen, component, or flow that fetches data, accepts input, or completes an action. If a state isn't designed, it will design itself — and it will be wrong.

---

## Empty States

**Core idea:** An empty state is the first thing a new user sees. It's an onboarding surface, not a dead end.

- Every empty state needs three things: (1) what this space is for, (2) why it's empty, (3) how to fill it.
- Lead with a short headline (what), follow with one line of explanation (why), end with a primary CTA (how).
- Use a simple illustration or a muted icon (32-48px) above the headline — not a detailed graphic. The illustration sets tone; the copy does the work.
- Center the empty state vertically and horizontally within its container. Don't let it float to the top-left corner like a rendering artifact.
- Maintain the page's existing layout structure. Sidebar, header, nav — all stay. Only the content area shows the empty state.
- Copy guidance: be specific, not generic. "No projects yet" beats "Nothing here." "Create your first project to get started" beats "Get started."
- If the empty state is caused by a filter returning zero results, say so: "No results match your filters" + a "Clear filters" CTA. Don't show the same empty state as first-time-use.
- For list/table views: show the table headers even when empty. It tells the user what kind of data will appear here.

**Do:**

```jsx
<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
  <FolderOpen className="w-10 h-10 text-gray-400 mb-4" />
  <h3 className="text-lg font-semibold text-gray-900">No projects yet</h3>
  <p className="text-sm text-gray-500 mt-1 max-w-xs">
    Create a project to organize your work and collaborate with your team.
  </p>
  <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium
    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
    Create project
  </button>
</div>
```

**Don't:**

```jsx
{/* Generic message, no CTA, no structure, no guidance */}
<div className="p-4">
  <p className="text-gray-400">Nothing to show.</p>
</div>

{/* Or worse — literally nothing. A blank white rectangle. */}
<div className="min-h-[400px]" />
```

### Empty State Decision Table

| Context | Pattern | CTA? |
|---|---|---|
| First-time use (no data yet) | Illustration + headline + explanation + primary CTA | Yes — the main action |
| Filters returned zero results | "No results match your filters" + clear filters button | Yes — clear filters |
| Search returned no results | "No results for '[query]'" + suggestions or tips | Optional — suggest alternatives |
| Completed all tasks (inbox zero) | Celebratory message, muted. "You're all caught up." | No CTA or suggest secondary task |
| Permission denied / no access | Explain what they'd see + who to contact | No — link to request access |

**Review question:** If a brand-new user hits this screen before creating any data, do they know exactly what to do next — without reading documentation?

---

## Loading States

**Core idea:** Loading should feel fast. Perceived performance matters more than actual speed. A 400ms load with a skeleton feels instant. A 400ms load with a spinner replacing all content feels broken.

### Skeleton vs Spinner Decision Tree

Use this. No vibes-based decisions.

```
Is the content layout predictable?
├─ YES → Use skeleton screens
│   ├─ Cards with known structure → skeleton cards matching the card layout
│   ├─ List items → skeleton rows matching row height and spacing
│   └─ Text content → skeleton lines (vary widths: 100%, 75%, 60%)
│
└─ NO → Use a contained spinner
    ├─ Dynamic/unknown layout → spinner centered in the container
    ├─ Inline action (button click) → spinner inside the button, disable button
    └─ Full page with no layout hint → full-page spinner (last resort)
```

### Timing Rules

- **0-100ms:** Show nothing. The brain doesn't register this as a wait. Adding any loading indicator for sub-100ms loads makes the UI feel slower.
- **100-300ms:** Show skeleton or subtle indicator only if data is likely to take longer. For consistently fast loads, skip it.
- **300ms-2s:** Skeleton screens mandatory. This is the critical zone — long enough to notice, short enough that spinners feel heavy.
- **2s-10s:** Skeleton + progress indicator (determinate bar if you can estimate, indeterminate if you can't). Add a brief status message after 4s: "Loading your projects..."
- **10s+:** Something is wrong. Show a progress bar with status updates. Add a cancel option. At 30s, offer to retry.

### Layout Shift Prevention

Layout shift during loading is a P0 bug. Users click a button and it jumps — or worse, they click the wrong thing because the layout reflowed.

- Skeleton dimensions must match real content dimensions. A 48px-tall skeleton row that loads into a 64px-tall real row causes a 16px jump on every item.
- Reserve space for images with aspect-ratio containers (`aspect-video`, `aspect-square`, or explicit height).
- Never conditionally render a wrapper based on loading state. The wrapper stays; the content inside changes.
- Use `min-h-` to reserve container height when content length is unknown.

**Do:**

```jsx
// Skeleton preserves exact layout — no shift when data arrives
function ProjectCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
      <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

// Button loading — spinner replaces icon, button stays same size, disabled
<button
  disabled={isLoading}
  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg
    text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed min-w-[120px]"
>
  {isLoading ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : (
    <Save className="w-4 h-4" />
  )}
  {isLoading ? 'Saving...' : 'Save'}
</button>
```

**Don't:**

```jsx
{/* Spinner replaces ALL content — massive layout shift when data loads */}
{isLoading ? (
  <div className="flex justify-center py-20">
    <Spinner />
  </div>
) : (
  <div className="grid grid-cols-3 gap-4">
    {projects.map(p => <ProjectCard key={p.id} {...p} />)}
  </div>
)}

{/* Skeleton with wrong dimensions — 32px skeleton for 48px real content */}
<div className="h-8 bg-gray-200 rounded animate-pulse" />
{/* Real content is actually h-12. Every row shifts 16px. */}
```

### Partial Load Handling

Not everything loads at once. Handle it.

- Load the shell first (nav, sidebar, page header) — then fill in content areas independently.
- If a secondary section fails to load, show an inline error for that section only. Don't block the whole page.
- For paginated/infinite scroll: show skeleton rows at the bottom while the next page loads. Don't show a full-page spinner for page 2.
- Stagger skeleton appearance with a 50-100ms delay between groups to create a natural "reveal" feel. Don't animate all skeletons in perfect sync — it looks mechanical.

### Animation Values

Match SKILL.md motion guidance:

- Skeleton pulse: `animate-pulse` (Tailwind default: 2s ease-in-out, fine as-is)
- Spinner rotation: continuous, 600-800ms per revolution
- Content reveal (skeleton to real data): 150ms fade-in, `ease-out`
- Stagger between skeleton groups: 50-100ms offset

### Accessibility

- Add `aria-busy="true"` to the loading container. Remove it when content loads.
- Add `aria-live="polite"` to the container so screen readers announce when content appears.
- Skeleton elements should have `aria-hidden="true"` — they're visual placeholders, not content.
- For spinners: include `role="status"` and a visually hidden label: `<span className="sr-only">Loading...</span>`.

**Review question:** If the network is slow (3G), does the loading state feel intentionally designed — or does it look like the page is broken?

---

## Error States

**Core idea:** Every error message must answer two questions: "What happened?" and "How do I fix it?" If your error message doesn't answer both, it's not done.

### Error Display Decision Tree

```
Where did the error occur?
│
├─ Form field validation
│   └─ INLINE — red border + message directly below the field
│       Timing: on blur (not on every keystroke), revalidate on change
│
├─ Form submission failure
│   └─ INLINE BANNER — at the top of the form, scrolled into view
│       + highlight each invalid field with inline messages
│
├─ Background action (save, sync, API call)
│   └─ TOAST — bottom-right or top-center
│       Duration: persistent until dismissed (errors don't auto-dismiss)
│       + include retry action in the toast if applicable
│
├─ Section/component data fetch failure
│   └─ INLINE IN CONTAINER — replace the failed section's content
│       Keep the rest of the page functional
│
├─ Full page load failure
│   └─ FULL-PAGE ERROR — centered, with retry button
│       Include a way to navigate elsewhere (back, home)
│
└─ Destructive or irreversible failure
    └─ MODAL — blocks interaction, explains what happened
        Must include a clear next step (contact support, retry, etc.)
```

### Copy Patterns

Every error message follows this structure: **[What happened]** + **[How to fix it]**.

| Bad | Good |
|---|---|
| "Error" | "Couldn't save your changes. Check your connection and try again." |
| "Something went wrong" | "We couldn't load your projects. Our servers are having trouble — try refreshing in a minute." |
| "Invalid input" | "Email must include an @ symbol (e.g., you@example.com)." |
| "Request failed" | "Payment declined. Update your card details or try a different payment method." |
| "404" | "This page doesn't exist. It may have been moved or deleted." |
| "Forbidden" | "You don't have access to this workspace. Ask the owner to invite you." |

Rules:

- Never blame the user. "Invalid email" feels accusatory. "Please enter a valid email address" is neutral.
- Be specific about what's wrong. "Password must be at least 8 characters" not "Invalid password."
- Offer an escape. Every error state should have at least one action: retry, go back, contact support, try a different approach.
- Don't use technical jargon. "500 Internal Server Error" means nothing to users. Translate it.
- Use sentence case, not UPPERCASE. Errors are already alarming enough.

**Do:**

```jsx
{/* Inline field error — appears on blur, specific guidance */}
<div className="space-y-1.5">
  <label className="text-sm font-medium text-gray-700">Email</label>
  <input
    type="email"
    className="w-full border border-red-500 rounded-lg px-3 py-2
      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" className="text-sm text-red-600 flex items-center gap-1.5" role="alert">
    <AlertCircle className="w-4 h-4 flex-shrink-0" />
    Enter a valid email address (e.g., you@example.com)
  </p>
</div>

{/* Section load failure — contained, doesn't break the page */}
<div className="rounded-lg border border-gray-200 p-6 text-center">
  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
  <p className="text-sm font-medium text-gray-900">Couldn't load recent activity</p>
  <p className="text-sm text-gray-500 mt-1">Check your connection and try again.</p>
  <button
    onClick={retry}
    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700
      focus:outline-none focus:underline"
  >
    Retry
  </button>
</div>
```

**Don't:**

```jsx
{/* Generic, no guidance, no recovery path */}
<div className="bg-red-100 text-red-700 p-4 rounded">
  Something went wrong. Please try again.
</div>

{/* Technical error dumped to the user */}
<div className="text-red-500 text-xs font-mono">
  Error: ECONNREFUSED 127.0.0.1:5432 — connection refused
</div>

{/* Error toast that auto-dismisses in 3 seconds — user never sees it */}
toast.error("Save failed", { duration: 3000 })
```

### Error Toast Rules

- Error toasts must NOT auto-dismiss. The user might not be looking at the toast area. Persist until manually dismissed.
- Include a retry action in the toast when applicable.
- Max one error toast visible at a time. If multiple errors fire, queue them or consolidate: "3 items failed to save."
- Position: bottom-right for app-level errors (non-blocking). Top-center for form/page-level (needs attention).
- Toast width: 320-420px. Enough for a sentence and a button, not a paragraph.

### Accessibility

- Field errors: `aria-invalid="true"` on the input, `aria-describedby` pointing to the error message, `role="alert"` on the error text.
- Form-level errors: `role="alert"` on the banner. Focus the banner on appearance so screen readers announce it immediately.
- Toast errors: `role="alert"` or `aria-live="assertive"`. Screen readers must announce errors without user action.
- Never convey errors with color alone. Red border + red text + error icon. All three.

**Review question:** For every error state in the interface, can the user understand what went wrong and take at least one concrete action to recover — without contacting support?

---

## Success States

**Core idea:** Success confirmation should be brief, confident, and guide the user to what comes next. Don't celebrate a form submission like a moon landing.

### Confirmation Patterns

| Action type | Pattern | Duration |
|---|---|---|
| Inline save (auto-save, field update) | Subtle text: "Saved" or checkmark next to field | Show 2s, then fade (150ms, ease-in) |
| Form submission | Inline success message or redirect to the result | Persistent until user navigates |
| Background action (export, invite sent) | Toast: bottom-right, auto-dismiss after 4-5s | 4-5s with close button |
| Multi-step flow completion | Dedicated success screen with next steps | Persistent |
| Destructive action completed | Inline confirmation + undo option (if reversible) | Persistent until undo window closes |

### Next-Action Guidance

After success, don't leave the user in a dead end. Always suggest what to do next.

- After creating something: show the created item, or navigate to it.
- After submitting a form: confirm receipt + set expectations ("We'll email you within 24 hours").
- After completing a flow: suggest the logical next step ("Your project is ready. Invite your team to get started.").
- After deleting something: confirm what was deleted + provide undo if possible. Return to the parent list.

**Do:**

```jsx
{/* Inline save confirmation — minimal, fades out */}
<div className="flex items-center gap-2">
  <button onClick={save} className="text-sm font-medium text-blue-600">
    Save
  </button>
  {saved && (
    <span
      className="text-sm text-green-600 flex items-center gap-1
        animate-in fade-in duration-150"
    >
      <Check className="w-3.5 h-3.5" />
      Saved
    </span>
  )}
</div>

{/* Multi-step completion — clear success + next action */}
<div className="flex flex-col items-center text-center py-12 px-4">
  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
    <Check className="w-6 h-6 text-green-600" />
  </div>
  <h2 className="text-xl font-semibold text-gray-900">Project created</h2>
  <p className="text-sm text-gray-500 mt-2 max-w-sm">
    Your project is ready. Invite your team or start adding tasks.
  </p>
  <div className="flex gap-3 mt-6">
    <a
      href="/project/123"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium
        hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Go to project
    </a>
    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm
      font-medium hover:bg-gray-50">
      Invite team
    </button>
  </div>
</div>
```

**Don't:**

```jsx
{/* Over-the-top celebration for a routine action */}
<div className="text-center py-20">
  <h1 className="text-4xl font-bold text-green-500">🎉 Success! 🎉</h1>
  <p className="text-xl mt-4">Your settings have been saved!</p>
  <Confetti />
</div>

{/* Success state with no next action — dead end */}
<div className="bg-green-100 p-4 rounded text-green-800">
  Done.
</div>
```

### Success Animation Values

Keep celebrations proportional to the significance of the action.

- Checkmark icon entrance: scale from 0 to 1, 200ms, `ease-out`. A single clean pop.
- Inline "Saved" text: fade-in 150ms `ease-out`, hold 2s, fade-out 150ms `ease-in`.
- Toast entrance: translate-y from 16px + fade-in, 200ms, `ease-out`.
- Toast exit (auto-dismiss): fade-out 150ms, `ease-in`.
- Full success screen: content fades in, 200ms `ease-out`. No bouncing, no confetti, no particle effects.
- Respect `prefers-reduced-motion`: reduce all animations to simple opacity fade.

### Accessibility

- Success messages: `role="status"` and `aria-live="polite"` so screen readers announce them without interrupting the user's current task.
- If the success state changes the page context (redirect, new content), manage focus: move it to the new content or the success heading.
- Toast success messages: `role="status"`. Not `role="alert"` — success is informational, not urgent.
- Undo actions must be keyboard accessible and clearly labeled.

**Review question:** After every successful action, does the user know (1) that it worked, (2) what changed, and (3) what to do next?

---

## Cross-Cutting Concerns

These apply across all four states.

### State Transitions

States don't exist in isolation. The transitions between them matter.

- **Empty to Loading:** When the user triggers data creation, transition directly — don't flash the empty state after they've clicked the CTA.
- **Loading to Content:** Fade content in (150ms, `ease-out`). Don't pop it in instantly — the jarring shift breaks flow.
- **Loading to Error:** Replace skeleton with error in-place. Same container, same position. No layout jump.
- **Loading to Empty:** If a fetch returns zero items, show the empty state in the content area. Don't show skeletons forever.
- **Error to Loading (retry):** Show skeleton/spinner again immediately on retry. Don't leave the error visible while the retry is in-flight.
- **Content to Error (background failure):** Use a toast or inline banner. Don't rip away content the user is looking at.

### Responsive Behavior

- Empty state illustrations: hide or shrink below `sm` breakpoint. The CTA and copy matter more on small screens.
- Error toasts on mobile: full-width, bottom-positioned. Don't use bottom-right positioning — it's too small to tap.
- Success screens: single column on mobile. Don't side-by-side the CTA buttons — stack them.
- Skeleton widths should adapt to container width, not use fixed pixel values.

### Dark Mode

- Skeleton color: use `bg-gray-700` (dark) instead of `bg-gray-200` (light). Match the surface elevation level from `color-systems.md`.
- Error red: use desaturated variant (`red-400` / `#FCA5A5`) on dark backgrounds. `red-600` on `#121212` vibrates.
- Success green: same treatment — `green-400` over `green-600`.
- Empty state illustrations: ensure they have enough contrast against dark surfaces. Gray-on-darker-gray disappears.

---

## Anti-Patterns

Flag any of these during review. Each one signals a state that wasn't designed.

- **Blank white rectangle.** No data loaded and no empty state designed. The user sees nothing and learns nothing. This is never acceptable.
- **Spinner replacing all content.** The entire page is replaced with a centered spinner. Layout shifts massively when content arrives. Use skeletons instead.
- **Error auto-dismissing toast.** Error toasts that vanish after 3 seconds. The user was looking elsewhere and never saw it. Errors must persist until dismissed.
- **"Something went wrong."** A generic error with no explanation and no recovery path. Every error must say what happened and how to fix it.
- **Success dead end.** "Done." with no next step. The user created something — now what? Always suggest the next action.
- **Loading state forever.** No timeout on the loading state. The API call failed silently and the user stares at skeletons until they give up. Set a timeout (10-15s) and transition to an error state.
- **Identical empty states everywhere.** Every section shows the same "No data" message. Empty states should be contextual — tell the user what belongs here and how to create it.
- **Flash of wrong state.** Page loads, shows empty state for 200ms, then shows content. Add a minimum delay before showing the empty state (300ms) — if data arrives first, skip it entirely.
- **Disabled button with no explanation.** The submit button is grayed out but there's no indication of what's preventing submission. Always show why an action is blocked.
- **Error state that clears form data.** User fills out a long form, submission fails, and the form resets. Preserve all user input through error states. Always.

---

## Testing Checklist

Run this before shipping any screen or component. Every box should be checked.

### Empty States
- [ ] First-time-use empty state has a headline, explanation, and CTA
- [ ] Filter/search-no-results empty state is distinct from first-time-use
- [ ] Empty state maintains page layout (nav, sidebar, headers remain)
- [ ] Empty state CTA is keyboard focusable and screen-reader announced
- [ ] Empty state is centered in its container, not top-left aligned

### Loading States
- [ ] Skeleton dimensions match real content dimensions (no layout shift)
- [ ] Images have aspect-ratio containers reserving space before load
- [ ] Loading container has `aria-busy="true"` during load
- [ ] Skeleton elements have `aria-hidden="true"`
- [ ] Loading state has a timeout — transitions to error after 10-15s
- [ ] Button loading state disables the button and preserves button dimensions
- [ ] Sub-100ms loads show no loading indicator
- [ ] `prefers-reduced-motion` disables skeleton animation

### Error States
- [ ] Every error message answers "what happened" + "how to fix it"
- [ ] Field errors use `aria-invalid` + `aria-describedby` + `role="alert"`
- [ ] Error toasts do NOT auto-dismiss
- [ ] Error state provides at least one recovery action (retry, go back, contact support)
- [ ] Errors use color + icon + text — never color alone
- [ ] Form data is preserved through submission errors
- [ ] Section errors don't break the rest of the page

### Success States
- [ ] Success message confirms the action and suggests next steps
- [ ] Inline confirmations fade out after 2-3s (not instant, not permanent)
- [ ] Success toasts auto-dismiss after 4-5s with a close button
- [ ] Success messages use `role="status"` and `aria-live="polite"`
- [ ] Undo option is available for destructive actions (where reversible)
- [ ] No emoji or confetti for routine actions

### Cross-Cutting
- [ ] All state transitions are smooth — no layout jumps between states
- [ ] States work on mobile viewports (tested at 375px width)
- [ ] States work in dark mode with appropriate color adjustments
- [ ] `prefers-reduced-motion` is respected for all state transition animations
- [ ] No state shows raw technical errors (stack traces, HTTP codes, connection strings)
