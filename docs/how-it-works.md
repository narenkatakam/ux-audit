# How It Works

Two modes. One skill.

---

## Guide Mode

Tell it what you're building. Get back design principles tailored to your surface type — with specific, implementable rules.

**Example prompt:**

```
Use the ui-ux-agent-skill in guide mode.
I'm building a settings page for a SaaS dashboard.
Users need to manage notification preferences, API keys, and team roles.
```

**What you get back:**

> **Surface:** Settings / Preferences (web dashboard)
> **Primary task:** Configure account settings
> **Primary CTA:** Save changes
>
> **Applicable principles:**
>
> - **Task-first UX** — Group settings by user mental model (Account, Security, Notifications, Integrations), not by data type. The most-changed settings go first.
> - **Progressive complexity** — Show common settings by default. API keys and webhook config behind an "Advanced" or "Developer" section.
> - **Error prevention** — Inline validation on API key format. Confirm before revoking team member access. Show what will happen: "This will remove Alex's access to all projects."
> - **Help text layering** — L0: clear toggle labels. L1: one-line explanation under high-risk settings (e.g., "Disabling this will stop all email notifications"). L2: "Learn more" link for complex topics. No paragraphs of instructions.
> - **Accessibility** — All toggles need visible labels (not just on/off). Contrast ratio on muted helper text must meet 4.5:1. Tab order follows visual layout.

### Prompt variations

```
# Specific surface
"I'm building a checkout flow for a subscription product. Apply the ui-ux-agent-skill."

# Specific domain focus
"Check the accessibility of this form component against the ui-ux-agent-skill."

# During code generation
"Generate a settings page. Follow the ui-ux-agent-skill principles."
```

---

## Review Mode

Share a screenshot, mock, HTML, or PR. Get back a structured audit with prioritized fixes.

**Example prompt:**

```
Use the ui-ux-agent-skill in review mode.
Review this screenshot of our onboarding flow.
The primary user task is creating their first project.
```

**What you get back:**

> ### P0 — No feedback after "Create Project" button click
>
> **Diagnosis:** Feedback gap / Gulf of Evaluation
>
> **Evidence:** Clicking "Create Project" produces no visible response. Button doesn't change state, no loading indicator, no success message.
>
> **Impact:** All users. They don't know if the project was created. They'll click again (duplicate) or leave (abandoned).
>
> **Fix:**
> 1. Add loading state to button (disabled + spinner) on click
> 2. On success: redirect to the new project with a brief "Project created" confirmation
> 3. On failure: inline error below the form with retry guidance
>
> ---
>
> ### P1 — Form asks for 8 fields upfront
>
> **Diagnosis:** Cognitive overload
>
> **Evidence:** Project creation requires: name, description, team, visibility, template, color, icon, and tags — all on one screen.
>
> **Fix:** Only require name. Default everything else. Let users customize after creation. The fastest path to value is an empty project, not a perfectly configured one.

---

## What to Expect

| Mode | Input | Output |
|---|---|---|
| **Guide** | Description of what you're building | Tailored principles, do/don't rules, component recommendations, accessibility requirements |
| **Review** | Screenshot, HTML, PR, or component code | P0/P1/P2 prioritized findings, root-cause diagnosis, implementable fixes, verification checklist |
