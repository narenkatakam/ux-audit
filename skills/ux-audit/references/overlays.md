# Overlays

Rules for modals, drawers, popovers, and bottom sheets. Use this when building or reviewing any UI layer that floats above the main content. Overlays interrupt flow — use the lightest-weight overlay that solves the problem.

---

## The Overlay Hierarchy

**Core idea:** Not every interaction deserves a modal. Pick the least disruptive overlay that gets the job done.

| Overlay | Weight | Use when | Dismissal |
|---------|--------|----------|-----------|
| Tooltip | Lightest | Brief label or hint on hover/focus | Auto on mouse leave / blur |
| Popover | Light | Small interactive content (menu, picker, mini-form) | Click outside, Escape |
| Bottom sheet | Medium | Mobile selection, filters, short flows | Swipe down, tap scrim, Escape |
| Drawer | Medium-heavy | Extended content, settings, detail panels | Click scrim, Escape, close button |
| Modal | Heaviest | Decisions that require focus — confirmations, creation flows, destructive actions | Click scrim, Escape, explicit close |

- **Default to inline.** Before reaching for an overlay, ask: can this live on the page? Inline is always less disruptive.
- **Never stack overlays.** No modal-on-modal. No drawer opening a popover opening a tooltip. If you need depth, rethink the flow. The only exception: a confirmation modal triggered from within a drawer (and even that should be rare).
- **Z-index scale:** popover `z-10`, drawer `z-20`, modal `z-30`, toast `z-40`. Document it. Stick to it. Ad-hoc z-index values are how you end up with `z-[9999]` scattered through your codebase.

**Review question:** Could this overlay be replaced with inline content, a section expand, or page navigation instead?

---

## Modals

**Core idea:** A modal is a conversation stopper. It demands the user's full attention. Use it only when the task genuinely requires isolation from the page behind it.

### When to use
- Destructive confirmations ("Delete this project?")
- Short creation flows (new item, quick edit)
- Decision points that block further progress
- Content that loses meaning without focus (previews, comparisons)

### When NOT to use
- Settings or preferences (use a page or drawer)
- Long forms with many fields (use a page)
- Informational content the user might want to reference alongside the page (use a drawer or inline)
- Success messages (use inline feedback or a toast)

### Sizing

| Purpose | Max width | Example |
|---------|-----------|---------|
| Confirmation | 480px | "Delete this workspace?" |
| Short form | 640px | "Create new project" (2-4 fields) |
| Complex content | 800px | Preview, comparison, multi-step |

- Height: content-driven, max 85vh. If content exceeds that, the body scrolls — not the page behind it.
- On mobile (<640px): full-width with 16px horizontal margin, bottom-aligned or centered.

### Anatomy

```jsx
{/* Do: proper modal with scrim, sizing, close button, trapped focus */}
<div
  className="fixed inset-0 z-30 flex items-center justify-center"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  {/* Scrim */}
  <div
    className="absolute inset-0 bg-black/50"
    onClick={onClose}
    aria-hidden="true"
  />
  {/* Panel */}
  <div className="relative bg-white rounded-xl shadow-lg w-full max-w-[480px] mx-4 p-6
    animate-in fade-in zoom-in-95 duration-150">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      aria-label="Close"
    >
      <XIcon className="w-5 h-5" />
    </button>
    <h2 id="modal-title" className="text-lg font-semibold">
      Delete "Q4 Report"?
    </h2>
    <p className="text-sm text-gray-600 mt-2">
      This will permanently delete the report and 12 comments. This cannot be undone.
    </p>
    <div className="flex justify-end gap-3 mt-6">
      <button className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50">
        Cancel
      </button>
      <button className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">
        Delete report
      </button>
    </div>
  </div>
</div>
```

```jsx
{/* Don't: no scrim, no role, no aria, no focus trap, no Escape handler */}
<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
  bg-white shadow-xl p-8 rounded-lg z-[9999]">
  <h2>Are you sure?</h2>
  <button>Yes</button>
  <button>No</button>
</div>
```

### Behavior rules
- **Focus trap is mandatory.** Tab must cycle within the modal. No tab-out to the page behind.
- **Escape always dismisses.** No exceptions unless the modal contains unsaved changes — then warn first.
- **Scrim click dismisses** — except for destructive confirmations where accidental dismissal could lose user intent. In that case, scrim click does nothing; the user must choose an explicit action.
- **Return focus to trigger.** When the modal closes, focus returns to the element that opened it. Not the top of the page. Not nowhere.
- **Scroll lock on body.** `overflow: hidden` on `<body>` while modal is open. No background scrolling.
- **Animation:** fade + subtle scale-up on enter (150-200ms, ease-out). Fade out on exit (100-150ms, ease-in). No bounce. No slide.

**Review question:** If this modal were removed and the action lived inline on the page, would anything break? If not, remove the modal.

---

## Drawers

**Core idea:** A drawer is a panel that slides in from the edge. It keeps the user anchored to the page while showing extended content alongside it.

### Side drawers (left or right)
- **Width:** 320-400px on desktop. Full-width on mobile (<640px).
- **Direction:** right-side is the convention for detail/edit panels. Left-side for navigation (but prefer a persistent sidebar for nav — drawers for nav feel mobile-ported).
- **Use for:** detail views, settings, filters, edit forms, help panels.

### Bottom drawers
- **Mobile only.** On desktop, use a side drawer or modal instead.
- **Use for:** selection lists, filter panels, share menus, quick actions.
- **Behavior:** identical to bottom sheets (see section below). The terms are interchangeable on mobile.

### Persistent vs temporary
- **Temporary** (default): has a scrim, dismisses on scrim click or Escape. User opened it to do something specific and will close it.
- **Persistent**: no scrim, page content reflows to accommodate the drawer. Used for inspector panels, chat sidebars, master-detail layouts. The drawer is part of the workflow, not an interruption.

```jsx
{/* Do: side drawer with scrim, slide animation, proper width, close button */}
<div className="fixed inset-0 z-20" role="dialog" aria-modal="true">
  {/* Scrim */}
  <div
    className="absolute inset-0 bg-black/40"
    onClick={onClose}
    aria-hidden="true"
  />
  {/* Panel */}
  <div className="absolute right-0 top-0 h-full w-full max-w-[400px] bg-white shadow-xl
    animate-in slide-in-from-right duration-300 ease-out">
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">Project details</h2>
      <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
        <XIcon className="w-5 h-5" />
      </button>
    </div>
    <div className="p-4 overflow-y-auto h-[calc(100%-57px)]">
      {/* Drawer content */}
    </div>
  </div>
</div>
```

```jsx
{/* Don't: drawer with no max-width (fills the screen), no scrim, no close mechanism */}
<div className="fixed right-0 top-0 h-full w-full bg-white shadow-lg z-50 p-6">
  <h2>Details</h2>
  {/* content but no way to close */}
</div>
```

### Behavior rules
- **Slide-in animation:** 200-300ms, ease-out on enter. Slide-out on exit, 150-200ms, ease-in.
- **Focus trap** for temporary drawers (same rules as modals). Persistent drawers don't trap focus.
- **Escape always dismisses** temporary drawers.
- **Scroll lock on body** for temporary drawers on mobile. On desktop, body scrolling can remain if the drawer doesn't cover the full viewport.
- **Return focus to trigger** on close.

**Review question:** Is this content truly secondary/supplemental, or does it deserve its own page? If the user needs to cross-reference it with the main content, a drawer is right. If it's the primary task, give it a page.

---

## Popovers

**Core idea:** A popover is a small, contextual surface anchored to a trigger element. It shows secondary content without leaving the current context. Think: dropdown menus, date pickers, color pickers, user cards.

### Sizing and positioning
- **Max width:** 280px. If you need more, you need a drawer or modal, not a popover.
- **Max height:** 320px, then scroll internally.
- **Positioning:** anchor to the trigger element. Prefer bottom placement, flip to top if not enough viewport space. Libraries like Floating UI handle this — don't hand-roll positioning.
- **Arrow:** optional but helpful for clarity. Place it pointing at the trigger. Skip it if the popover is visually adjacent to the trigger with no gap.
- **Offset:** 8px gap between trigger and popover edge. No gap = the popover looks attached. Too much gap = unclear association.

### Trigger: click vs hover
- **Prefer click trigger.** Hover is invisible on touch devices, triggers accidentally on desktop, and has no equivalent on mobile. Click is universal.
- **Hover is acceptable for:** tooltips (non-interactive, text-only hints) and preview cards (user avatars, link previews) where the content is supplemental and dismissal is trivial.
- **Never put interactive content in a hover-triggered popover.** The user can't reliably reach it on touch devices.

```jsx
{/* Do: click-triggered popover with Floating UI, Escape dismissal, contained content */}
import { useFloating, offset, flip, shift } from '@floating-ui/react';

function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-end',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  return (
    <>
      <button
        ref={refs.setReference}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Avatar user={user} className="w-8 h-8" />
      </button>
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-10 w-56 bg-white rounded-lg shadow-lg border p-1
            animate-in fade-in duration-100"
          role="menu"
        >
          <a href="/profile" role="menuitem" className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
            Profile
          </a>
          <a href="/settings" role="menuitem" className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
            Settings
          </a>
          <hr className="my-1" />
          <button role="menuitem" className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 text-red-600">
            Sign out
          </button>
        </div>
      )}
    </>
  );
}
```

```jsx
{/* Don't: hover-triggered popover with interactive content, no positioning library */}
<div
  onMouseEnter={() => setOpen(true)}
  onMouseLeave={() => setOpen(false)}
>
  <button>Menu</button>
  {open && (
    <div className="absolute top-full left-0 bg-white shadow p-4" style={{ zIndex: 100 }}>
      <button onClick={doThing}>Action 1</button>
      <button onClick={doOther}>Action 2</button>
    </div>
  )}
</div>
```

### Behavior rules
- **Click outside dismisses.** Always.
- **Escape dismisses.** Always.
- **Animation:** fade-in, 100-150ms, ease-out. No slide, no scale. Popovers appear — they don't announce themselves.
- **One popover at a time.** Opening a new popover closes the previous one. No popover stacking.
- **Return focus to trigger** on close.
- **No scroll lock on body.** Popovers are lightweight — the page stays interactive.

**Review question:** Does this popover contain more than 5-6 items or require scrolling? If yes, consider a drawer or a dedicated page section.

---

## Bottom Sheets

**Core idea:** A bottom sheet is the mobile-native overlay. It slides up from the bottom edge, feels natural to thumb reach, and supports partial-height states. Desktop has no need for them — use a modal or drawer instead.

### When to use (mobile only)
- Selection lists (sort options, filters, share targets)
- Short forms (2-3 fields max)
- Confirmation dialogs on mobile
- Quick action menus

### Anatomy

- **Handle affordance:** a 40x4px rounded bar, centered, at the top of the sheet. `bg-gray-300 rounded-full`. This signals "draggable" — without it, users don't know they can swipe.
- **Snap points:** 50% viewport height (default open) and 100% (expanded). Some sheets only need one height — don't add snap points for the sake of it.
- **Scrim:** same as modals. `bg-black/50`. Tap to dismiss.

```jsx
{/* Do: bottom sheet with handle, snap points, proper mobile sizing */}
<div className="fixed inset-0 z-30 md:hidden" role="dialog" aria-modal="true">
  {/* Scrim */}
  <div
    className="absolute inset-0 bg-black/50"
    onClick={onClose}
    aria-hidden="true"
  />
  {/* Sheet */}
  <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl
    max-h-[85vh] animate-in slide-in-from-bottom duration-300 ease-out">
    {/* Handle */}
    <div className="flex justify-center pt-3 pb-2">
      <div className="w-10 h-1 rounded-full bg-gray-300" />
    </div>
    {/* Content */}
    <div className="px-4 pb-6 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Sort by</h2>
      <ul className="space-y-1">
        <li>
          <button className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 text-sm">
            Most recent
          </button>
        </li>
        <li>
          <button className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 text-sm">
            Alphabetical
          </button>
        </li>
        <li>
          <button className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 text-sm">
            Most popular
          </button>
        </li>
      </ul>
    </div>
  </div>
</div>
```

```jsx
{/* Don't: bottom sheet on desktop, no handle, no scrim, fixed height that clips content */}
<div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg h-[300px] p-4">
  <h2>Options</h2>
  <button>Option A</button>
  <button>Option B</button>
</div>
```

### Behavior rules
- **Swipe down to dismiss.** The handle affordance sets this expectation. Implement it.
- **Tap scrim to dismiss.** Same as modals.
- **Escape dismisses** (for keyboard/external keyboard users on tablets).
- **Animation:** slide up from bottom, 250-350ms, ease-out. Slide down on dismiss, 200ms, ease-in.
- **Scroll lock on body.** The sheet scrolls internally; the page behind does not.
- **Safe area insets.** On iOS, respect `env(safe-area-inset-bottom)` so the sheet content doesn't hide behind the home indicator.

**Review question:** Is this bottom sheet being used on desktop? If yes, replace it with a modal or popover. Bottom sheets are a mobile pattern.

---

## Decision Tree: Which Overlay?

Use this to pick the right overlay. Start at the top, follow the first condition that matches.

```
Is the content brief, non-interactive, and contextual?
  YES → Tooltip (hover/focus triggered, text only)
  NO  ↓

Is the content interactive but small (menu, picker, 1-3 actions)?
  YES → Popover (click triggered, anchored to trigger, max 280px)
  NO  ↓

Is the user on mobile?
  YES → Is it a quick selection or short action list?
          YES → Bottom sheet (slide up, handle, snap points)
          NO  → Is it extended content or editing?
                  YES → Full-screen page or drawer
                  NO  → Modal (centered, max 85vh)
  NO  ↓

Does the user need to reference the page content alongside this?
  YES → Drawer (side panel, 320-400px, keeps page visible)
  NO  ↓

Does this require focused attention or a decision?
  YES → Modal (scrim, centered, focus trapped)
  NO  ↓

Can this just live on the page?
  YES → Don't use an overlay. Put it inline.
```

---

## Shared Requirements (All Overlays)

Every overlay — modal, drawer, popover, bottom sheet — must implement these. No exceptions.

| Requirement | Implementation |
|-------------|---------------|
| Focus trap | Tab cycles within the overlay (modals, drawers, bottom sheets). Use `focus-trap-react` or equivalent. |
| Escape dismissal | `onKeyDown` handler for `Escape` key. Always. |
| Scroll lock | `overflow: hidden` on `<body>` while modal/drawer/bottom sheet is open. Not for popovers. |
| Return focus | On close, focus returns to the element that triggered the overlay. |
| `role="dialog"` | Modals, drawers, and bottom sheets. Add `aria-modal="true"`. |
| `aria-labelledby` | Point to the overlay's heading element. |
| Scrim | Semi-transparent backdrop for modals, drawers, bottom sheets. `bg-black/40` to `bg-black/50`. |
| `prefers-reduced-motion` | Replace slide/scale animations with simple fade or instant display. |

---

## Z-Index Scale

One scale. Documented once. Used everywhere.

| Layer | z-index | Tailwind class |
|-------|---------|----------------|
| Sticky headers/nav | `z-[5]` | `z-[5]` |
| Popover / Dropdown | `z-10` | `z-10` |
| Drawer | `z-20` | `z-20` |
| Modal | `z-30` | `z-30` |
| Toast / Notification | `z-40` | `z-40` |

- If you need a value outside this scale, the answer is almost always "don't." Fix the stacking context instead.
- Avoid `z-[9999]`. If you have it in your codebase, you have a stacking context bug, not a z-index problem.

---

## Animation Reference

Match these to the motion guidance in SKILL.md. Overlays explain hierarchy and state — motion makes the relationship between overlay and page legible.

| Overlay | Enter | Exit | Duration | Easing |
|---------|-------|------|----------|--------|
| Modal | Fade + scale from 95% to 100% | Fade out | 150-200ms | ease-out (enter), ease-in (exit) |
| Drawer | Slide in from edge | Slide out to edge | 200-300ms | ease-out (enter), ease-in (exit) |
| Popover | Fade in | Fade out | 100-150ms | ease-out |
| Bottom sheet | Slide up from bottom | Slide down | 250-350ms | ease-out (enter), ease-in (exit) |

- **No bounce, spring, or elastic easing.** Overlays appear and disappear — they don't perform.
- **No animation longer than 350ms.** If the user is waiting for your drawer to finish sliding, it's too slow.
- **Respect `prefers-reduced-motion`.** Reduce all overlay animations to a simple fade or remove them entirely.

```css
@media (prefers-reduced-motion: reduce) {
  .overlay-enter { animation: fade-in 100ms ease-out; }
  .overlay-exit  { animation: fade-out 75ms ease-in; }
}
```

---

## Anti-Patterns

Flag these during review. Every one is a sign of overlay misuse.

- **Modal-on-modal.** A confirmation dialog inside a form modal inside a drawer. If your overlay needs its own overlay, the information architecture is broken. Flatten the flow.
- **Modals for settings or preferences.** Settings are not urgent. They don't need to hijack focus. Use a page or a persistent drawer.
- **Bottom sheets on desktop.** A bottom sheet on a 1440px monitor looks like a broken modal. Use the desktop-appropriate pattern.
- **Hover-triggered popovers with interactive content.** Mobile users can't hover. If the popover has buttons, links, or form fields, use click trigger.
- **Missing focus trap.** If a user can Tab out of a modal and interact with the page behind it, the modal is broken. Ship it with `focus-trap-react` or `@headlessui/react` Dialog, or don't ship it.
- **No Escape handling.** Every overlay must close on Escape. "But the user might accidentally press Escape" is not a valid objection. That's what the user intended.
- **Scrim-less modals.** A modal without a scrim looks like a floating card. The user doesn't know the page behind is inert. Always add a scrim.
- **Body scroll leak.** The page behind scrolls while a modal is open. This is disorienting and makes the modal feel broken. Lock the body scroll.
- **Forgotten focus return.** User opens a modal from a button in a list, closes the modal, and focus jumps to the top of the page. They lose their place. Return focus to the trigger.
- **Ad-hoc z-index values.** `z-[50]`, `z-[100]`, `z-[9999]` scattered through components. Use the scale. Fix stacking contexts. Stop the arms race.
- **Drawers wider than 400px on desktop.** A 600px drawer eats more than a third of a standard viewport. At that point, give the content its own page.
- **Overlays for success feedback.** "Project created successfully!" does not need a modal. Use an inline message or a toast. Don't block the user from proceeding just to show them a green checkmark.

---

## Testing Checklist

Run this before shipping any overlay. If it doesn't pass all of these, it's not done.

- [ ] **Focus trap:** Tab key cycles within the overlay. Focus cannot escape to the page behind (modals, drawers, bottom sheets).
- [ ] **Escape dismissal:** Pressing Escape closes the overlay from any focused element inside it.
- [ ] **Scrim click dismissal:** Clicking the backdrop closes the overlay (except destructive confirmations).
- [ ] **Return focus:** After closing, focus returns to the element that opened the overlay.
- [ ] **Scroll lock:** Body does not scroll while a modal, drawer, or bottom sheet is open.
- [ ] **`role="dialog"` and `aria-modal="true"`:** Present on modals, drawers, and bottom sheets.
- [ ] **`aria-labelledby`:** Points to the overlay's heading.
- [ ] **Keyboard navigation:** All interactive elements inside the overlay are reachable and operable via keyboard.
- [ ] **Screen reader announcement:** Opening the overlay announces its title. Closing it announces return to the page.
- [ ] **`prefers-reduced-motion`:** Animations are reduced to fade or removed entirely.
- [ ] **Mobile test:** Overlay is usable on a 375px viewport. Touch targets are 44x44px minimum.
- [ ] **No stacking:** No overlay opens another overlay (except a single confirmation from within a drawer).
- [ ] **Z-index audit:** Overlay uses the documented z-index scale. No ad-hoc values.
- [ ] **Animation timing:** Enter/exit animations match the reference table. Nothing exceeds 350ms.
- [ ] **Body scroll restoration:** After the overlay closes, body scroll position is preserved (not reset to top).
