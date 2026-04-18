#!/bin/bash
# UX Audit — installer for AI coding assistants
# Usage: curl -sSL https://raw.githubusercontent.com/narenkatakam/ux-audit/main/install.sh | bash
# Or: ./install.sh [--global] [--agent claude-code|cursor|codex|windsurf|all]

set -euo pipefail

REPO="narenkatakam/ux-audit"
BRANCH="main"
RAW="https://raw.githubusercontent.com/$REPO/$BRANCH"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}→${NC} $1"; }
ok()    { echo -e "${GREEN}✓${NC} $1"; }
warn()  { echo -e "${YELLOW}!${NC} $1"; }

# Defaults
GLOBAL=false
AGENT=""

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --global|-g) GLOBAL=true; shift ;;
    --agent|-a) AGENT="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# Clone to temp
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT
info "Downloading ux-audit..."
git clone --depth 1 --quiet "https://github.com/$REPO.git" "$TMPDIR/ux-audit"
ok "Downloaded"

install_claude_code() {
  if [ "$GLOBAL" = true ]; then
    TARGET="$HOME/.claude/skills/ux-audit"
  else
    TARGET=".claude/skills/ux-audit"
  fi
  mkdir -p "$TARGET"
  cp -r "$TMPDIR/ux-audit/skills/ux-audit/"* "$TARGET/"
  ok "Claude Code: installed to $TARGET"
  if [ "$GLOBAL" = true ]; then
    info "Add to your CLAUDE.md: \"Load skills from ~/.claude/skills/ux-audit/SKILL.md\""
  else
    info "Add to your CLAUDE.md: \"Load skills from .claude/skills/ux-audit/SKILL.md\""
  fi
}

install_cursor() {
  TARGET=".cursor/rules"
  mkdir -p "$TARGET"
  cp "$TMPDIR/ux-audit/.cursor/rules/ux-audit.mdc" "$TARGET/ux-audit.mdc"
  mkdir -p "skills/ux-audit"
  cp -r "$TMPDIR/ux-audit/skills/ux-audit/"* "skills/ux-audit/"
  cp "$TMPDIR/ux-audit/AGENTS.md" "AGENTS.md"
  ok "Cursor: installed rules to $TARGET/ux-audit.mdc"
}

install_codex() {
  if [ "$GLOBAL" = true ]; then
    TARGET="$HOME/.codex/skills/ux-audit"
  else
    TARGET="skills/ux-audit"
  fi
  mkdir -p "$TARGET"
  cp -r "$TMPDIR/ux-audit/skills/ux-audit/"* "$TARGET/"
  cp "$TMPDIR/ux-audit/agents/openai.yaml" "openai.yaml"
  ok "Codex: installed to $TARGET"
}

install_windsurf() {
  cp "$TMPDIR/ux-audit/AGENTS.md" "AGENTS.md"
  mkdir -p "skills/ux-audit"
  cp -r "$TMPDIR/ux-audit/skills/ux-audit/"* "skills/ux-audit/"
  ok "Windsurf: installed AGENTS.md and skills/"
}

# If no agent specified, detect what's available
if [ -z "$AGENT" ]; then
  echo ""
  echo "Which agent(s) do you want to install for?"
  echo ""
  echo "  1) Claude Code"
  echo "  2) Cursor"
  echo "  3) Codex"
  echo "  4) Windsurf"
  echo "  5) All"
  echo ""
  read -rp "Choose [1-5]: " choice
  case $choice in
    1) AGENT="claude-code" ;;
    2) AGENT="cursor" ;;
    3) AGENT="codex" ;;
    4) AGENT="windsurf" ;;
    5) AGENT="all" ;;
    *) echo "Invalid choice"; exit 1 ;;
  esac
fi

echo ""
case $AGENT in
  claude-code) install_claude_code ;;
  cursor) install_cursor ;;
  codex) install_codex ;;
  windsurf) install_windsurf ;;
  all)
    install_claude_code
    install_cursor
    install_codex
    install_windsurf
    ;;
  *) echo "Unknown agent: $AGENT. Use: claude-code, cursor, codex, windsurf, or all"; exit 1 ;;
esac

echo ""
ok "Done. Start building — the skill activates based on context."
echo ""
echo "  Try: \"Apply the ux-audit skill to review this page.\""
echo "  Try: \"I'm building a settings page. Apply the ux-audit principles.\""
echo ""
