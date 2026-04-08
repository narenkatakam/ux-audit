# UX Audit — Orientation
> Last updated: 2026-03-27

## What This Is

A Claude Code skill that turns Naren's UX expertise into a deployable agent. Gives any developer a structured, opinionated UX review of their interface — 12 principles, a review template, and growing reference docs. Phase 1-2 complete (1,581 lines of reference material added). Phase 3 is next.

**Installed globally at:** `~/.agents/skills/ux-audit`
**GitHub:** `narenkatakam/ux-audit`

## Quick Start

```bash
cd ~/personal-ventures/experiments/ui-ux-agent-skill

# Install / update globally
bash install.sh

# No build step — pure markdown + shell
```

## Architecture in 5 Lines

A collection of markdown skill files in `skills/ux-audit/`. The main skill (`SKILL.md`) defines the review protocol. Reference docs (`refs/`) cover specific UI domains in depth. Checklists (Phase 3) will give surface-type-specific review guidance. `install.sh` copies skills to `~/.agents/skills/ux-audit`.

**Key files:**
- `skills/ux-audit/SKILL.md` — Main skill definition and review protocol
- `skills/ux-audit/refs/` — Reference docs (dark-mode, typography, spacing, forms, overlays, ui-states, etc.)
- `skills/ux-audit/review-template.md` — Structured review output template
- `docs/plans/2026-03-04-ux-audit-v2-design.md` — Phase roadmap

## Current Status

**Phase 3 — NEXT:**
1. Component checklists → `skills/ux-audit/checklists/` — one file per surface type (buttons, cards, tables, forms, modals, navigation, dashboards). 8-15 items each.
2. Quick-reference index → top of SKILL.md. "I need help with X → read Y" decision tree across all 13 refs + checklists.
3. Tighten `review-template.md` → split Essential (15) vs Polish (25). Add P0/P1/P2 example findings.

**Phase 4** (after Phase 3): README rewrite with before/after visuals, submit to awesome-claude-code, launch post.

## Gotchas

- **AGENTS.md is present** — this project has its own agent instructions. Read it alongside CLAUDE.md.
- **`install.sh` must be run** after any change to `skills/` to update the global install.
- **The skill lives in the `skills/` subdirectory**, not the repo root. Don't confuse the two levels.
- **review-template.md is currently 255 lines** — deliberately long. Phase 3 splits it into Essential vs Polish.

## Key Decisions

| Decision | Why | Status |
|---|---|---|
| Pure markdown (no build) | Portability — works anywhere Claude Code runs | Settled |
| 12 principles as the frame | Comprehensive without overlap; tested across real audits | Settled |
| Modern Minimal as aesthetic standard | Naren's taste; clear and enforceable | Settled |
| Phase 3 before launch | Checklists + index make it actionable, not just reference | Settled |

## Related Files

- `CLAUDE.md` — AI behavior for this project
- `AGENTS.md` — Agent-specific instructions
- `~/.claude/projects/.../memory/ux-audit-roadmap.md` — Full phase detail
