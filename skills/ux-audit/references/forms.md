# Forms

Practical reference for building and reviewing form interfaces. Use this when generating, auditing, or reviewing any form — login, settings, multi-step wizard, checkout, or data entry.

---

## Labels and Field Layout

**Core idea:** Every field needs a visible label above it. Placeholder text is not a label. If you get nothing else right, get this right.

- Labels go **above** the field, left-aligned. Not inline, not floating, not inside-only.
- Font: `text-sm font-medium` (14px, medium weight). Consistent across all fields.
- Spacing: 4px gap between label and input (`space-y-1`). 16-24px gap between field groups (`space-y-4` or `space-y-6`).
- Placeholder text is for **format hints only** — "e.g., you@company.com" — not for the label itself. It disappears on focus, fails contrast, and is unreliable for screen readers.
- Required indicator: asterisk after the label text, `aria-hidden="true"` on the asterisk so screen readers use the `aria-required` attribute instead.
- Optional fields: mark them "(optional)" rather than marking every required field. Most fields in a form should be required — if they're not, ask why they exist.

**Do:**
```jsx
<div className="space-y-1">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email address <span aria-hidden="true" className="text-red-500">*</span>
  </label>
  <input
    id="email"
    type="email"
    aria-required="true"
    placeholder="you@company.com"
    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base
      focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  />
</div>
```

**Don't:**
```jsx
{/* Placeholder as the only label — disappears on focus, fails a11y */}
<input
  type="email"
  placeholder="Email address"
  className="w-full border rounded px-3 py-2"
/>

{/* Floating label — clever, but reduces tap target area,
    causes layout shift, and confuses screen readers */}
<div className="relative">
  <input className="peer pt-6 pb-2 px-3" placeholder=" " />
  <label className="absolute top-2 left-3 text-xs peer-placeholder-shown:top-4
    peer-placeholder-shown:text-base transition-all">
    Email
  </label>
</div>
```

**Review question:** If every placeholder disappeared right now, could the user still identify every field?

---

## Validation

**Core idea:** Validate on blur, not on keystroke. Show errors next to the field, not in a banner at the top. Timing matters more than styling.

### When to validate

| Trigger | Use for | Avoid for |
|---|---|---|
| On blur (field loses focus) | Required checks, format validation, length limits | Fields the user hasn't touched yet |
| On submit | Final validation pass, server-side checks | The only validation — users shouldn't wait until submit to learn about errors |
| On keystroke (debounced) | Character counters, password strength meters | Error messages — showing "Invalid email" after typing "j" is hostile |
| On change | Toggles, selects, radio groups (immediate feedback makes sense) | Text inputs — every character triggers a re-render and potential error flash |

### Error message placement

- Error message goes **directly below the field**, not in a summary banner at the top.
- Associate with `aria-describedby` pointing to the error element's ID.
- Use `role="alert"` on the error container so screen readers announce it immediately.
- Error text: `text-sm text-red-600` (14px, red-600). Prefix with a brief description of what's wrong and how to fix it.
- The field border turns red on error: `border-red-500`. The label stays its default color.

### Error message content

- **Bad:** "Invalid input" / "This field is required" / "Error"
- **Good:** "Enter a valid email address (e.g., you@company.com)" / "Project name is required" / "Password must be at least 8 characters"
- Always tell the user what to do, not just what went wrong.

**Do:**
```jsx
function EmailField({ value, onChange, error }) {
  return (
    <div className="space-y-1">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email address
      </label>
      <input
        id="email"
        type="email"
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? "email-error" : undefined}
        className={`w-full rounded-lg border px-4 py-3 text-base
          focus:ring-2 focus:outline-none
          ${error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
      />
      {error && (
        <p id="email-error" role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
```

**Don't:**
```jsx
{/* Error banner at top — user has to scroll up, find the field, fix it, scroll back */}
<div className="bg-red-100 border border-red-400 text-red-700 p-4 mb-6 rounded">
  <ul>
    <li>Email is invalid</li>
    <li>Password is too short</li>
    <li>Name is required</li>
  </ul>
</div>

{/* Validation on every keystroke — "Invalid email" flashes after typing "j" */}
<input
  type="email"
  onChange={(e) => {
    setEmail(e.target.value);
    if (!isValidEmail(e.target.value)) setError("Invalid email");
  }}
/>
```

**Review question:** Does every error message tell the user exactly what to fix, and does it appear next to the field that needs fixing?

---

## Field States

**Core idea:** Every form field has four visual states. If any state is missing, the form is incomplete.

### The four required states

| State | Border | Background | Text | Ring |
|---|---|---|---|---|
| Default | `border-gray-300` | `bg-white` | `text-gray-900` | none |
| Focus | `border-blue-500` | `bg-white` | `text-gray-900` | `ring-2 ring-blue-500` |
| Error | `border-red-500` | `bg-white` | `text-gray-900` | `ring-2 ring-red-500` on focus |
| Disabled | `border-gray-200` | `bg-gray-50` | `text-gray-400` | none, `cursor-not-allowed` |

- Focus rings are mandatory. `focus:ring-2 focus:ring-blue-500 focus:outline-none` as the baseline.
- Disabled fields: use `disabled` attribute (not just visual styling). This removes them from tab order and prevents interaction. Add `cursor-not-allowed` for visual clarity.
- Read-only vs disabled: use `readOnly` when the value is meaningful but not editable (e.g., auto-calculated total). Use `disabled` when the field is irrelevant in the current context.
- Input height: `py-3` (12px vertical padding) for a comfortable 44-48px total height. Don't go below `py-2.5` (40px total).

```jsx
{/* All four states in one component */}
<input
  id="name"
  type="text"
  disabled={isDisabled}
  className={`w-full rounded-lg border px-4 py-3 text-base transition-colors
    focus:ring-2 focus:outline-none
    ${isDisabled
      ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
      : hasError
        ? "border-red-500 bg-white text-gray-900 focus:ring-red-500"
        : "border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
    }`}
/>
```

**Review question:** Tab through every field in the form. Can you clearly see which field is focused, which has an error, and which is disabled?

---

## Field Grouping

**Core idea:** Related fields belong together visually. Use proximity and `<fieldset>` — not borders and boxes. Max 5-7 fields visible at once before the form feels overwhelming.

- Group related fields with `<fieldset>` and `<legend>`. This gives screen readers a group label.
- Visual grouping uses **spacing**, not borders. 24-32px between groups (`space-y-6` or `space-y-8`), 16px between fields within a group (`space-y-4`).
- If a form has more than 7 visible fields, either group them into sections with clear headings or split into steps.
- Side-by-side fields (first/last name, city/state/zip) use `grid grid-cols-2 gap-4` on desktop, stack to single column on mobile.
- Don't nest fieldsets. One level of grouping is enough.

**Do:**
```jsx
<form className="space-y-8">
  {/* Group 1: Personal info */}
  <fieldset className="space-y-4">
    <legend className="text-base font-semibold text-gray-900">
      Personal information
    </legend>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
          First name
        </label>
        <input id="first-name" type="text" className="w-full rounded-lg border border-gray-300 px-4 py-3" />
      </div>
      <div className="space-y-1">
        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
          Last name
        </label>
        <input id="last-name" type="text" className="w-full rounded-lg border border-gray-300 px-4 py-3" />
      </div>
    </div>
    <div className="space-y-1">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email address
      </label>
      <input id="email" type="email" className="w-full rounded-lg border border-gray-300 px-4 py-3" />
    </div>
  </fieldset>

  {/* Group 2: Account settings — separated by spacing, not a border */}
  <fieldset className="space-y-4">
    <legend className="text-base font-semibold text-gray-900">
      Account settings
    </legend>
    {/* ... fields ... */}
  </fieldset>
</form>
```

**Don't:**
```jsx
{/* 12 fields in a flat list with no grouping, no fieldsets, no visual separation */}
<form className="space-y-4">
  <input placeholder="First name" />
  <input placeholder="Last name" />
  <input placeholder="Email" />
  <input placeholder="Phone" />
  <input placeholder="Street" />
  <input placeholder="City" />
  <input placeholder="State" />
  <input placeholder="Zip" />
  <input placeholder="Company" />
  <input placeholder="Role" />
  <input placeholder="Department" />
  <input placeholder="Manager" />
  <button>Submit</button>
</form>
```

**Review question:** Can you glance at the form and immediately see how many groups there are and what each group is about?

---

## Multi-Step Forms

**Core idea:** Multi-step forms need three things: a progress indicator showing where you are, a back button that preserves state, and draft auto-save. Miss any of these and users will abandon.

### Progress indicator

- Show step count and current position: "Step 2 of 4" or a visual stepper.
- Label each step with its purpose, not just a number. "Shipping" is meaningful; "Step 2" is not.
- Completed steps should be visually distinct (checkmark, filled circle) and clickable for navigation back.
- Use `aria-current="step"` on the active step for screen readers.

### Navigation

- **Back button:** always available (except on step 1). Preserves all entered data.
- **Forward/next button:** right-aligned, primary style. Label it with the next action ("Continue to payment") not just "Next."
- Don't auto-advance steps. Let the user click "Continue" explicitly.
- Validate the current step before allowing forward navigation. Don't let the user reach step 4 with errors on step 2.

### State preservation

- Store form state in React state / context / URL params — not just in uncontrolled inputs that get destroyed on step change.
- For long forms: auto-save drafts to localStorage or server. Debounce at 1-2 seconds.
- On page reload, restore the last saved state and return the user to their current step.

**Do:**
```jsx
function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = [
    { label: "Account", component: AccountStep },
    { label: "Profile", component: ProfileStep },
    { label: "Preferences", component: PreferencesStep },
    { label: "Review", component: ReviewStep },
  ];

  return (
    <div className="space-y-8">
      {/* Progress stepper */}
      <nav aria-label="Form progress">
        <ol className="flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s.label} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                aria-current={i === step ? "step" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
                  ${i < step
                    ? "bg-blue-600 text-white cursor-pointer"
                    : i === step
                      ? "border-2 border-blue-600 text-blue-600"
                      : "border-2 border-gray-300 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {i < step ? "✓" : i + 1}
              </button>
              <span className={`text-sm ${i === step ? "font-medium text-gray-900" : "text-gray-500"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`h-px w-8 ${i < step ? "bg-blue-600" : "bg-gray-300"}`} />
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Current step */}
      {React.createElement(steps[step].component, {
        data: formData,
        onChange: (updates) => setFormData({ ...formData, ...updates }),
      })}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
        )}
        <button
          onClick={() => setStep(step + 1)}
          className="ml-auto rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white
            hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          {step < steps.length - 1 ? `Continue to ${steps[step + 1].label}` : "Submit"}
        </button>
      </div>
    </div>
  );
}
```

**Don't:**
```jsx
{/* No progress indicator, no back button, state lost between steps */}
{step === 1 && <StepOne onNext={() => setStep(2)} />}
{step === 2 && <StepTwo onNext={() => setStep(3)} />}
{/* User can't go back. Data from step 1 is gone. No idea how many steps remain. */}
```

**Review question:** If the user refreshes on step 3 of 4, do they lose everything? Can they go back to step 1 without losing step 3's data?

---

## Auto-Save

**Core idea:** For any form that takes more than 30 seconds to fill out, auto-save the draft. Show the user it's saved. Losing 5 minutes of work to an accidental tab close is inexcusable.

- Debounce saves at 1-2 seconds after the last change. Don't save on every keystroke.
- Show a save status indicator: "Saving..." / "Saved" / "Save failed — retrying."
- Position the status near the form header or action buttons — somewhere the user can glance at without searching.
- Use `localStorage` for client-side drafts, server-side for critical forms (checkout, applications).
- Clear saved drafts on successful submission.

```jsx
function useDraftSave(formId, data) {
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error

  useEffect(() => {
    setStatus("saving");
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(`draft-${formId}`, JSON.stringify(data));
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, 1500);
    return () => clearTimeout(timeout);
  }, [formId, data]);

  return status;
}

function SaveStatus({ status }) {
  return (
    <span className="text-sm text-gray-500" aria-live="polite">
      {status === "saving" && "Saving draft..."}
      {status === "saved" && "Draft saved"}
      {status === "error" && "Could not save draft"}
    </span>
  );
}
```

**Review question:** If the user closes the tab and comes back, is their work still there?

---

## Form-Specific Accessibility

**Core idea:** Forms are where accessibility breaks most often. Semantic HTML gets you 80% there. The remaining 20% is `aria-describedby`, `aria-invalid`, and `role="alert"`.

This section extends `references/accessibility.md` with form-specific patterns.

### Required attributes per field

Every form field in production needs these:

| Attribute | Purpose | Example |
|---|---|---|
| `id` | Links to `<label>` via `htmlFor` | `id="email"` |
| `aria-required="true"` | Announces required status to screen readers | Use alongside visible asterisk |
| `aria-invalid="true"` | Set when field has a validation error | Toggle based on error state |
| `aria-describedby` | Points to error message and/or help text | `aria-describedby="email-error email-hint"` |
| `autocomplete` | Enables browser autofill | `autocomplete="email"`, `autocomplete="given-name"` |

### Live error announcements

When an error appears after blur or submit, screen readers need to announce it. Two approaches:

1. **`role="alert"` on the error element** — announced immediately when it enters the DOM. Use this for inline errors that appear on blur.
2. **`aria-live="assertive"` on a container** — announced when content inside changes. Use this for error summaries that update dynamically.

Don't use both on the same element. Pick one.

```jsx
{/* role="alert" — announced when this element renders */}
{error && (
  <p id="email-error" role="alert" className="text-sm text-red-600 mt-1">
    {error}
  </p>
)}
```

### Help text pattern

When a field needs a hint (format, constraints, context), place it below the input and link it with `aria-describedby`. Screen readers will announce it after the label.

```jsx
<div className="space-y-1">
  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
    URL slug
  </label>
  <input
    id="slug"
    type="text"
    aria-describedby="slug-hint slug-error"
    className="w-full rounded-lg border border-gray-300 px-4 py-3"
  />
  <p id="slug-hint" className="text-sm text-gray-500">
    Lowercase letters, numbers, and hyphens only.
  </p>
  {error && (
    <p id="slug-error" role="alert" className="text-sm text-red-600">
      {error}
    </p>
  )}
</div>
```

Multiple `aria-describedby` values are space-separated. The hint is always announced; the error is announced only when present.

### Autocomplete values

Use the correct `autocomplete` attribute to enable browser autofill. Users who fill out forms constantly rely on this. Omitting it is leaving free usability on the table.

| Field | `autocomplete` value |
|---|---|
| Full name | `name` |
| First name | `given-name` |
| Last name | `family-name` |
| Email | `email` |
| Phone | `tel` |
| Street address | `street-address` |
| City | `address-level2` |
| State / Province | `address-level1` |
| Zip / Postal code | `postal-code` |
| Country | `country-name` |
| Credit card number | `cc-number` |
| Expiry | `cc-exp` |
| New password | `new-password` |
| Current password | `current-password` |

**Review question:** With a screen reader on, does every field announce its label, required status, help text, and error message in that order?

---

## Touch and Mobile Considerations

**Core idea:** Half your users are filling this form on a phone. Design for thumbs, not cursors.

- Input height: minimum 44px (`py-3` with `text-base`). 48px is better for mobile-primary apps.
- Tap target spacing: 8px minimum between adjacent interactive elements. On mobile, prefer stacked layouts over side-by-side fields to prevent mis-taps.
- Use the right `inputMode` and `type` to trigger the correct mobile keyboard:

| Data | `type` | `inputMode` | Keyboard shown |
|---|---|---|---|
| Email | `email` | — | Email layout with @ |
| Phone | `tel` | — | Numeric dialpad |
| Number (quantity) | `text` | `numeric` | Number pad |
| URL | `url` | — | URL layout with / and .com |
| Search | `search` | — | Search layout with done/go |
| Currency | `text` | `decimal` | Number pad with decimal |

- Don't use `type="number"` for phone numbers, credit cards, or zip codes — it adds increment arrows and strips leading zeros. Use `type="text"` with `inputMode="numeric"` and `pattern="[0-9]*"`.
- Auto-capitalize: `autoCapitalize="words"` for names, `autoCapitalize="none"` for emails and usernames.
- On mobile, a long form should scroll naturally. Don't put forms in fixed-height containers that require internal scrolling.

**Review question:** Fill out this form on a phone. Is every field easy to tap, does the right keyboard appear, and can you complete it without zooming?

---

## Common Anti-Patterns

Flag these during review. Each one degrades form usability.

- **Placeholder as label.** Disappears on focus. Fails contrast. Not reliably announced by screen readers. Every few months someone rediscovers this anti-pattern and calls it "clean design."
- **Error summary at the top with no inline errors.** User reads "3 errors found," then has to hunt through a 10-field form to find them. Errors belong next to the field.
- **Validation on every keystroke.** "Invalid email" appears after typing "j." Validation before the user has finished typing is punishment, not guidance.
- **Disabled submit button with no explanation.** The form looks complete, the button is gray, and the user has no idea why. Either show inline errors explaining what's missing or keep the button enabled and validate on click.
- **Auto-advancing focus between split fields.** Phone number split into 3 inputs that auto-tab: breaks keyboard users, confuses screen readers, prevents pasting. Use one field with a mask if formatting matters.
- **Clearing the form on validation error.** The user filled out 8 fields. One failed validation. You cleared all of them. This is grounds for closing the tab.
- **Multi-step with no back button.** User realizes they entered the wrong email on step 1 but they're on step 3. Now they have to start over.
- **No loading state on submit.** User clicks "Submit," nothing happens for 2 seconds, they click again, now there are duplicate submissions. Disable the button and show a spinner after click.
- **Login forms without `autocomplete`.** The browser could fill this in 1 second. Instead the user types their email for the 400th time because you omitted `autocomplete="email"`.

---

## Validation Timing Decision Tree

Use this to decide when to validate a specific field type.

```
Is this a field the user is currently typing in?
├── Yes
│   ├── Is it a character counter or strength meter?
│   │   ├── Yes → Show on keystroke (debounced 100ms)
│   │   └── No → Wait for blur
│   └── Is the user correcting a previously-shown error?
│       ├── Yes → Validate on keystroke (debounced 300ms) to clear the error promptly
│       └── No → Wait for blur
└── No (field already blurred or form submitted)
    ├── Does it require server-side validation (e.g., username availability)?
    │   ├── Yes → Validate on blur with loading indicator
    │   └── No → Validate on blur, instant
    └── Is this a form submission?
        └── Yes → Validate all fields, focus the first error field
```

---

## Testing Checklist

Run this before shipping any form.

- [ ] **Every field has a visible `<label>`** linked via `htmlFor`/`id`. No placeholder-only fields.
- [ ] **Required fields** are marked visually (asterisk) and programmatically (`aria-required`).
- [ ] **Validation fires on blur**, not on keystroke (except character counters and error correction).
- [ ] **Error messages appear inline** next to the field, associated with `aria-describedby`.
- [ ] **Error messages are actionable** — they say what to fix, not just "Invalid."
- [ ] **All four field states** are visually distinct: default, focus, error, disabled.
- [ ] **Focus ring** is visible on every interactive element (`ring-2`, 3:1+ contrast).
- [ ] **Touch targets** are at least 44x44px. Tested on a real phone.
- [ ] **Mobile keyboards** are correct — email fields show @, phone fields show dialpad.
- [ ] **`autocomplete` attributes** are set on every applicable field.
- [ ] **Tab order** matches visual order. No positive `tabindex` values.
- [ ] **Multi-step forms** have: progress indicator, back button, state preservation.
- [ ] **Long forms** auto-save drafts with a visible status indicator.
- [ ] **Submit button** shows loading state and prevents double submission.
- [ ] **On validation failure**, focus moves to the first errored field.
- [ ] **Screen reader test**: VoiceOver/NVDA announces label, required status, help text, and error for every field.
- [ ] **Spacing** follows the scale: 4px label-to-input, 16px between fields, 24-32px between groups.
