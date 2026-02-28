# UI/UX Agent Skill — Agent Instructions

This repository uses `AGENTS.md` as the shared instruction entry point for multi-agent tools (Codex, Claude Code, Cursor, Windsurf).

## Scope

- Applies to the whole repository.
- Used when maintaining `skills/ui-ux-agent-skill/SKILL.md`, `README.md`, `docs/`, and reference files.

## Repository Goals

- Keep this skill practical, concise, and reusable across different products and stacks.
- Ensure outputs are implementable — specific enough to code against, not generic slogans.
- Maintain a product-thinking lens: every rule should trace back to a user outcome.

## Content Rules

- Default language is English.
- Keep the term "Skill" in docs and UI copy unless a request explicitly asks otherwise.
- Do not leak internal style constraints into end-user product copy.
- Prefer user-task framing and state/result framing in UI examples.
- Avoid overfitting guidance to one specific product, page type, or business domain.

## UX Rules to Preserve

- Prioritize task-first UX and clear primary action hierarchy.
- Layer help text (always visible only when necessary; detailed guidance on demand).
- Make key states perceivable with low-noise signals (structure first, labels second).
- Keep spacing/repetition/alignment consistent; enforce the 4px base unit scale.
- No emoji as UI icons; use a consistent icon set.
- Accessibility (WCAG 2.1 AA) is a non-negotiable baseline, not a feature.

## Editing Rules

- Keep updates small and coherent; avoid broad rewrites without clear value.
- When changing `skills/ui-ux-agent-skill/SKILL.md`, ensure `README.md` and `docs/` stay aligned.
- If adding a new rule, include one concrete example or acceptance check.
- New reference documents should follow the existing pattern: core idea, practical rules, review question.

## Attribution

This skill is a fork of [oil-oil/oiloil-ui-ux-guide](https://github.com/oil-oil/oiloil-ui-ux-guide), expanded with accessibility, responsive design, typography, color systems, navigation, and data visualization guidance. Original work licensed under Apache 2.0.
