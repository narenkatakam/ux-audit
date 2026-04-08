#!/usr/bin/env node
/**
 * UX Audit Report Generator
 *
 * Takes structured audit findings (JSON) and produces a self-contained HTML report
 * with scoring dashboard, grid-based layout, and dimension breakdown.
 *
 * Usage:
 *   node generate-report.mjs input.json                  # → audit-report.html
 *   node generate-report.mjs input.json my-report.html   # → my-report.html
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// ── Scoring System ────────────────────────────────────────────────────────────

function getDimension(principle) {
  if (!principle) return 'visual';
  const p = principle.toLowerCase();
  if (p.includes('typograph') || p.includes('color syst') || p.includes('crap')) return 'visual';
  if (p.includes('task-first') || p.includes('affordance') || p.includes('signifier') || p.includes('error prev')) return 'usability';
  if (p.includes('information arch') || p.includes('consistency') || p.includes('predictab')) return 'structure';
  if (p.includes('feedback') || p.includes('system status') || p.includes('cognitive')) return 'feedback';
  if (p.includes('accessib') || p.includes('wcag') || p.includes('responsive')) return 'accessibility';
  return 'visual';
}

function computeScores(findings) {
  const OW = { P0: 12, P1: 6, P2: 2 };
  const DW = { P0: 20, P1: 10, P2: 4 };
  const dims = {
    visual:        { label: 'Visual Design',  score: 100, count: 0 },
    usability:     { label: 'Usability',       score: 100, count: 0 },
    structure:     { label: 'Structure',       score: 100, count: 0 },
    feedback:      { label: 'Feedback',        score: 100, count: 0 },
    accessibility: { label: 'Accessibility',   score: 100, count: 0 },
  };
  let total = 0, p0d = 0, p1d = 0;
  for (const f of findings) {
    const dim = getDimension(f.principle);
    const ow = OW[f.priority] || 2;
    const dw = DW[f.priority] || 4;
    total += ow;
    if (f.priority === 'P0') p0d += ow;
    if (f.priority === 'P1') p1d += ow;
    dims[dim].score = Math.max(0, dims[dim].score - dw);
    dims[dim].count++;
  }
  const overall = Math.max(0, 100 - total);
  return {
    overall,
    afterP0: Math.min(100, overall + p0d),
    afterP1: Math.min(100, overall + p0d + p1d),
    dims,
    affected: Object.values(dims).filter(d => d.count > 0).length,
  };
}

function scoreLabel(s) {
  if (s >= 85) return 'Excellent';
  if (s >= 70) return 'Good';
  if (s >= 55) return 'Fair';
  if (s >= 40) return 'Poor';
  return 'Critical';
}

function scoreColor(s) {
  if (s >= 85) return '#0f766e';
  if (s >= 70) return '#166534';
  if (s >= 55) return '#b45309';
  if (s >= 40) return '#c2410c';
  return '#b91c1c';
}

function scoreInsight(score, p0) {
  if (score >= 85) return 'Strong design fundamentals. Focus on the remaining polish items.';
  if (score >= 70) return 'Solid foundation with notable issues. Fixing them will significantly elevate the experience.';
  if (score >= 55) return 'Several issues are undermining the experience. Prioritize the blockers first.';
  if (score >= 40) return `${p0} blocker${p0 !== 1 ? 's' : ''} actively hurting credibility. These are why it looks amateur\u2009\u2014\u2009fix them first.`;
  return 'Critical design problems throughout. Foundational fixes are needed before polish matters.';
}

// ── SVG Helpers ────────────────────────────────────────────────────────────────

function donutSvg(score, size = 160) {
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  const color = scoreColor(score);
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="donut">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(44,33,20,0.06)" stroke-width="10"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="10"
      stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"
      stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" dominant-baseline="central"
      font-family="'IBM Plex Sans',sans-serif" font-size="42" font-weight="700" fill="${color}">${score}</text>
    <text x="${cx}" y="${cy + 20}" text-anchor="middle"
      font-family="'IBM Plex Mono',monospace" font-size="11" fill="#6b5c4c" letter-spacing="0.08em">/ 100</text>
  </svg>`;
}

function dimBarHtml(dim) {
  const color = scoreColor(dim.score);
  const ct = dim.count > 0 ? ` <span class="dim-count">(${dim.count})</span>` : '';
  return `<div class="dim-row">
    <span class="dim-label">${esc(dim.label)}${ct}</span>
    <div class="dim-track"><div class="dim-fill" style="width:${dim.score}%;background:${color}"></div></div>
    <span class="dim-value" style="color:${color}">${dim.score}</span>
  </div>`;
}

// ── Report Builder ──────────────────────────────────────────────────────────────

function buildReport(d) {
  const p0 = d.findings.filter(f => f.priority === 'P0');
  const p1 = d.findings.filter(f => f.priority === 'P1');
  const p2 = d.findings.filter(f => f.priority === 'P2');
  const date = d.meta.date || new Date().toISOString().slice(0, 10);
  const scores = computeScores(d.findings);
  const insight = scoreInsight(scores.overall, p0.length);

  // Progress steps for roadmap
  const steps = [{ score: scores.overall, label: 'Now', cls: 'current' }];
  if (p0.length) steps.push({ score: scores.afterP0, label: 'After P0', cls: '' });
  if (p1.length) steps.push({ score: scores.afterP1, label: 'After P1', cls: '' });
  if (scores.overall < 100) steps.push({ score: 100, label: 'All Fixed', cls: 'target' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>UX Audit \u2014 ${esc(d.meta.appName)}</title>
  <meta property="og:title" content="UX Audit \u2014 ${esc(d.meta.appName)}">
  <meta property="og:description" content="Score: ${scores.overall}/100 \u2014 ${d.findings.length} issues found across ${scores.affected} dimensions">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
<div class="report">

  <!-- Header -->
  <header class="header">
    <div class="header-grid">
      <div class="header-left">
        <div class="eyebrow">UX Audit Report</div>
        <h1>${esc(d.meta.appName)}</h1>
        ${d.meta.appUrl ? `<a class="app-url" href="${esc(d.meta.appUrl)}" target="_blank">${esc(d.meta.appUrl)}</a>` : ''}
      </div>
      <div class="header-right">
        <span class="meta-k">Date</span><span class="meta-v">${esc(date)}</span>
        <span class="meta-k">Platform</span><span class="meta-v">${esc(d.meta.platform || 'Web')}</span>
        ${d.meta.targetUser ? `<span class="meta-k">Target</span><span class="meta-v">${esc(d.meta.targetUser)}</span>` : ''}
        ${d.meta.primaryTask ? `<span class="meta-k">Task</span><span class="meta-v">${esc(d.meta.primaryTask)}</span>` : ''}
      </div>
    </div>
  </header>

  <!-- Score Dashboard -->
  <section class="dashboard">
    <div class="dash-top">
      <div class="score-hero">
        ${donutSvg(scores.overall)}
        <span class="score-grade" style="color:${scoreColor(scores.overall)}">${scoreLabel(scores.overall)}</span>
      </div>
      <div class="score-dims">
        <span class="dims-title">Dimension Breakdown</span>
        ${Object.values(scores.dims).map(dm => dimBarHtml(dm)).join('\n        ')}
      </div>
    </div>
    <div class="dash-insight">${esc(insight)}</div>
    <div class="stats-grid">
      <div class="stat-card${p0.length ? ' stat-blockers' : ''}">
        <span class="stat-big">${p0.length}</span>
        <span class="stat-lbl">Blocker${p0.length !== 1 ? 's' : ''}</span>
        <span class="stat-sub">${p0.length ? 'hurting first impressions' : 'no critical issues'}</span>
      </div>
      <div class="stat-card">
        <span class="stat-big">${d.findings.length}</span>
        <span class="stat-lbl">Issues Found</span>
        <span class="stat-sub">across ${scores.affected} dimension${scores.affected !== 1 ? 's' : ''}</span>
      </div>
      ${p0.length ? `<div class="stat-card stat-projected">
        <span class="stat-big">${scores.afterP0}</span>
        <span class="stat-lbl">After Fixing Blockers</span>
        <span class="stat-sub">up from ${scores.overall} (+${scores.afterP0 - scores.overall})</span>
      </div>` : `<div class="stat-card">
        <span class="stat-big">${scores.overall}</span>
        <span class="stat-lbl">Overall Score</span>
        <span class="stat-sub">${scoreLabel(scores.overall).toLowerCase()}</span>
      </div>`}
    </div>
  </section>

  <!-- Summary -->
  ${d.summary?.issuePattern || d.summary?.strongestAspect ? `<section class="summary">
    <div class="summary-grid">
      ${d.summary.issuePattern ? `<div class="summary-card">
        <span class="summary-lbl">Primary Issue Pattern</span>
        <p>${esc(d.summary.issuePattern)}</p>
      </div>` : ''}
      ${d.summary.strongestAspect ? `<div class="summary-card">
        <span class="summary-lbl">Strongest Aspect</span>
        <p>${esc(d.summary.strongestAspect)}</p>
      </div>` : ''}
    </div>
  </section>` : ''}

  <!-- Findings -->
  ${p0.length ? `<section class="ring-section">
    <div class="ring-header ring-p0">
      <span class="ring-badge badge-p0">P0</span>
      <span class="ring-title">Blocker</span>
      <span class="ring-desc">Prevents task completion, kills credibility, or blocks user groups</span>
    </div>
    ${p0.map((f, i) => findingCard(f, i + 1)).join('\n')}
  </section>` : ''}

  ${p1.length ? `<section class="ring-section">
    <div class="ring-header ring-p1">
      <span class="ring-badge badge-p1">P1</span>
      <span class="ring-title">Important</span>
      <span class="ring-desc">Significant friction, degrades experience but doesn\u2019t block</span>
    </div>
    ${p1.map((f, i) => findingCard(f, p0.length + i + 1)).join('\n')}
  </section>` : ''}

  ${p2.length ? `<section class="ring-section">
    <div class="ring-header ring-p2">
      <span class="ring-badge badge-p2">P2</span>
      <span class="ring-title">Polish</span>
      <span class="ring-desc">Minor visual issues, copy improvements, micro-interactions</span>
    </div>
    ${p2.map((f, i) => findingCard(f, p0.length + p1.length + i + 1)).join('\n')}
  </section>` : ''}

  <!-- Fix Roadmap -->
  ${d.findings.length ? `<section class="roadmap">
    <h2>Fix Roadmap</h2>
    <p class="roadmap-intro">Copy each fix into your AI coding tool. Start with P0\u2009\u2014\u2009these are why it looks amateur.</p>
    ${steps.length > 1 ? `<div class="progress-bar">
      ${steps.map((s, i) => `<div class="progress-step${s.cls ? ' ' + s.cls : ''}">
        <span class="progress-num" style="color:${scoreColor(s.score)}">${s.score}</span>
        <span class="progress-lbl">${esc(s.label)}</span>
      </div>${i < steps.length - 1 ? '<div class="progress-line"></div>' : ''}`).join('\n      ')}
    </div>` : ''}
    <ol class="roadmap-list">
      ${[...p0, ...p1, ...p2].map(f => `<li class="roadmap-item">
        <span class="ring-badge badge-${f.priority.toLowerCase()}">${f.priority}</span>
        <span class="roadmap-title">${esc(f.title)}</span>
        <div class="roadmap-fix">${(f.fix || []).map(s => esc(s)).join(' \u2192 ')}</div>
      </li>`).join('\n      ')}
    </ol>
  </section>` : ''}

  <!-- Methodology -->
  <section class="methodology">
    <h2>Methodology</h2>
    <p>This audit evaluates against 12 core UX principles spanning visual design, cognitive design, architecture, interaction design, and accessibility. Each finding is grounded in design science\u2009\u2014\u2009not opinion.</p>
    <div class="principle-grid">
      ${PRINCIPLES.map(p => `<span class="principle-tag">${esc(p)}</span>`).join('\n      ')}
    </div>
    <a class="method-link" href="${METHODOLOGY_URL}" target="_blank">View full framework coverage \u2192</a>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <span>UX Audit by Naren Katakam &middot; narenkatakam.com</span>
    <button class="save-btn" onclick="window.print()">Save / Print</button>
  </footer>

</div>
</body>
</html>`;
}

// ── Finding Card ─────────────────────────────────────────────────────────────────

function findingCard(f, num) {
  const cluster = DIAGNOSIS_CLUSTER[f.diagnosis] || 'audit';
  return `
    <div class="finding-card">
      <div class="finding-top">
        <span class="finding-num">#${num}</span>
        <h3 class="finding-title">${esc(f.title)}</h3>
        ${f.principle ? `<span class="principle-pill" style="--pill-color: var(--cluster-${cluster})">${esc(f.principle)}</span>` : ''}
      </div>
      <div class="finding-meta">
        <span class="diagnosis-tag tag-${cluster}">${esc(f.diagnosis)}</span>
      </div>
      <div class="finding-grid">
        <div class="fb-section">
          <span class="fb-label">Evidence</span>
          <p class="fb-text">${esc(f.evidence)}</p>
        </div>
        <div class="fb-section">
          <span class="fb-label">Impact</span>
          <p class="fb-text">${esc(f.impact)}</p>
        </div>
      </div>
      <div class="fix-section">
        <span class="fb-label">Fix</span>
        <ol class="fix-steps">
          ${(f.fix || []).map(s => `<li>${esc(s)}</li>`).join('\n          ')}
        </ol>
      </div>
    </div>`;
}

// ── Constants ────────────────────────────────────────────────────────────────────

const METHODOLOGY_URL = 'https://narenkatakam.github.io/ux-audit/skill-coverage-map.html';

const PRINCIPLES = [
  'Task-First UX', 'Information Architecture', 'Feedback & System Status',
  'Consistency & Predictability', 'Affordance & Signifiers', 'Error Prevention & Recovery',
  'Cognitive Load Control', 'CRAP (Visual Hierarchy)', 'Accessibility (WCAG 2.1 AA)',
  'Responsive Design', 'Typography', 'Color Systems',
];

const DIAGNOSIS_CLUSTER = {
  'Gulf of Execution':     'cognitive',
  'Gulf of Evaluation':    'cognitive',
  'Slip':                  'interaction',
  'Mistake':               'interaction',
  'Cognitive overload':    'cognitive',
  'Consistency break':     'interaction',
  'Accessibility failure': 'accessibility',
  'Feedback gap':          'cognitive',
};

function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Styles ──────────────────────────────────────────────────────────────────────

const CSS = `
  :root {
    --bg: #e6ecfc; --card: #ffffff; --gb: #f0f3fc;
    --div: rgba(44,33,20,0.09); --text: #1a1511; --dim: #6b5c4c;
    --ff: 'IBM Plex Sans', system-ui, sans-serif;
    --fm: 'IBM Plex Mono', 'SF Mono', monospace;
    --p0: #b91c1c; --p0-bg: #fef2f2; --p0-border: #fecaca;
    --p1: #b45309; --p1-bg: #fffbeb; --p1-border: #fde68a;
    --p2: #0f766e; --p2-bg: #f0fdfa; --p2-border: #99f6e4;
    --cluster-visual: #0a3cd9; --cluster-cognitive: #b45309;
    --cluster-architecture: #166534; --cluster-interaction: #9f1239;
    --cluster-accessibility: #b91c1c; --cluster-audit: #0f766e;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: var(--ff); background: var(--bg);
    display: flex; justify-content: center;
    padding: 48px 20px 64px; min-height: 100vh;
    color: var(--text); line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .report {
    width: 900px; max-width: 100%;
    background: var(--card); border-radius: 16px; overflow: hidden;
    box-shadow: 0 2px 4px rgba(44,33,20,0.05), 0 12px 48px rgba(44,33,20,0.13), 0 0 0 1px rgba(44,33,20,0.06);
  }

  /* ── Header ── */
  .header { padding: 28px 48px 22px; border-bottom: 1px solid var(--div); }
  .header-grid { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: end; }
  .eyebrow { font-family: var(--fm); font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--dim); margin-bottom: 6px; }
  h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); margin-bottom: 4px; }
  .app-url { font-family: var(--fm); font-size: 12px; color: var(--dim); text-decoration: none; border-bottom: 1px solid var(--div); }
  .app-url:hover { color: var(--text); }
  .header-right { display: grid; grid-template-columns: auto 1fr; gap: 3px 12px; align-content: end; }
  .meta-k { font-family: var(--fm); font-size: 9.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--dim); align-self: baseline; text-align: right; }
  .meta-v { font-size: 11px; color: var(--dim); align-self: baseline; line-height: 1.6; }

  /* ── Score Dashboard ── */
  .dashboard { padding: 32px 48px; background: var(--gb); border-bottom: 1px solid var(--div); }
  .dash-top { display: grid; grid-template-columns: auto 1fr; gap: 40px; align-items: center; margin-bottom: 20px; }
  .score-hero { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .donut { display: block; }
  .score-grade { font-family: var(--fm); font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
  .score-dims { display: flex; flex-direction: column; gap: 10px; }
  .dims-title { font-family: var(--fm); font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--dim); margin-bottom: 2px; }
  .dim-row { display: grid; grid-template-columns: 130px 1fr 32px; align-items: center; gap: 12px; }
  .dim-label { font-size: 13px; font-weight: 500; color: var(--text); }
  .dim-count { font-family: var(--fm); font-size: 10px; color: var(--dim); }
  .dim-track { height: 6px; background: rgba(44,33,20,0.06); border-radius: 3px; overflow: hidden; }
  .dim-fill { height: 100%; border-radius: 3px; }
  .dim-value { font-family: var(--fm); font-size: 13px; font-weight: 600; text-align: right; }
  .dash-insight { font-size: 13.5px; color: var(--text); line-height: 1.5; margin-bottom: 20px; padding: 12px 16px; background: var(--card); border-radius: 8px; border: 1px solid var(--div); }

  /* ── Stat Cards ── */
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .stat-card { background: var(--card); border: 1px solid var(--div); border-radius: 8px; padding: 16px 20px; display: flex; flex-direction: column; gap: 2px; }
  .stat-big { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); line-height: 1.1; }
  .stat-lbl { font-family: var(--fm); font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); }
  .stat-sub { font-size: 12px; color: var(--dim); margin-top: 2px; }
  .stat-blockers .stat-big { color: var(--p0); }
  .stat-projected .stat-big { color: var(--p2); }

  /* ── Summary ── */
  .summary { padding: 24px 48px; border-bottom: 1px solid var(--div); }
  .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; }
  .summary-card { background: var(--gb); padding: 16px 20px; border-radius: 8px; border: 1px solid var(--div); }
  .summary-lbl { font-family: var(--fm); font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); display: block; margin-bottom: 6px; }
  .summary-card p { font-size: 13.5px; color: var(--text); line-height: 1.5; }

  /* ── Ring Sections ── */
  .ring-section { padding: 0 48px; }
  .ring-header { display: flex; align-items: center; gap: 12px; padding: 24px 0 8px; border-bottom: 1px solid var(--div); }
  .ring-badge { font-family: var(--fm); font-size: 10px; font-weight: 600; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 4px; flex-shrink: 0; }
  .badge-p0 { background: var(--p0-bg); color: var(--p0); border: 1px solid var(--p0-border); }
  .badge-p1 { background: var(--p1-bg); color: var(--p1); border: 1px solid var(--p1-border); }
  .badge-p2 { background: var(--p2-bg); color: var(--p2); border: 1px solid var(--p2-border); }
  .ring-title { font-size: 14px; font-weight: 700; color: var(--text); }
  .ring-desc { font-size: 12px; color: var(--dim); }

  /* ── Finding Card ── */
  .finding-card { padding: 20px 0; border-bottom: 1px solid var(--div); }
  .finding-card:last-child { border-bottom: none; }
  .finding-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
  .finding-num { font-family: var(--fm); font-size: 11px; font-weight: 500; color: var(--dim); flex-shrink: 0; }
  .finding-title { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.01em; flex: 1; }
  .principle-pill { font-family: var(--fm); font-size: 9.5px; font-weight: 500; letter-spacing: 0.06em; padding: 2px 8px; border-radius: 3px; background: rgba(44,33,20,0.04); color: var(--pill-color, var(--dim)); flex-shrink: 0; }
  .finding-meta { margin-bottom: 12px; }
  .diagnosis-tag { font-family: var(--fm); font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 8px; border-radius: 3px; }
  .tag-cognitive     { background: #fffbeb; color: var(--cluster-cognitive); }
  .tag-interaction   { background: #fff1f2; color: var(--cluster-interaction); }
  .tag-accessibility { background: #fef2f2; color: var(--cluster-accessibility); }
  .tag-visual        { background: #eff6ff; color: var(--cluster-visual); }
  .tag-architecture  { background: #f0fdf4; color: var(--cluster-architecture); }
  .tag-audit         { background: #f0fdfa; color: var(--cluster-audit); }
  .finding-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; }
  .fb-section { display: flex; flex-direction: column; gap: 3px; }
  .fb-label { font-family: var(--fm); font-size: 9.5px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--dim); }
  .fb-text { font-size: 13.5px; color: var(--text); line-height: 1.55; }
  .fix-section { background: var(--gb); padding: 12px 16px; border-radius: 8px; border: 1px solid var(--div); }
  .fix-steps { padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
  .fix-steps li { font-size: 13px; color: var(--text); line-height: 1.5; }
  .fix-steps li::marker { font-family: var(--fm); font-size: 11px; color: var(--dim); }

  /* ── Fix Roadmap ── */
  .roadmap { padding: 24px 48px 32px; border-top: 1px solid var(--div); }
  .roadmap h2 { font-size: 18px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 6px; }
  .roadmap-intro { font-size: 13px; color: var(--dim); margin-bottom: 20px; }
  .progress-bar { display: flex; align-items: flex-start; margin-bottom: 24px; padding: 20px 24px; background: var(--gb); border-radius: 8px; border: 1px solid var(--div); }
  .progress-step { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; min-width: 64px; }
  .progress-num { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; }
  .progress-lbl { font-family: var(--fm); font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); }
  .progress-line { flex: 1; height: 2px; background: rgba(44,33,20,0.12); margin: 18px 16px 0; }
  .roadmap-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .roadmap-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; background: var(--gb); border-radius: 8px; border: 1px solid var(--div); }
  .roadmap-item .ring-badge { margin-top: 1px; }
  .roadmap-title { font-size: 13.5px; font-weight: 600; color: var(--text); flex-shrink: 0; min-width: 200px; }
  .roadmap-fix { font-family: var(--fm); font-size: 11.5px; color: var(--dim); line-height: 1.5; }

  /* ── Methodology ── */
  .methodology { padding: 24px 48px 28px; border-top: 1px solid var(--div); }
  .methodology h2 { font-size: 18px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 8px; }
  .methodology p { font-size: 13px; color: var(--dim); line-height: 1.6; margin-bottom: 14px; }
  .principle-grid { display: flex; flex-wrap: wrap; gap: 6px; }
  .principle-tag { font-family: var(--fm); font-size: 10px; font-weight: 500; padding: 3px 10px; border-radius: 4px; background: var(--gb); color: var(--dim); border: 1px solid var(--div); }
  .method-link { display: inline-block; margin-top: 14px; font-family: var(--fm); font-size: 11px; font-weight: 500; color: var(--cluster-visual); text-decoration: none; border-bottom: 1px solid rgba(10,60,217,0.2); }
  .method-link:hover { border-bottom-color: var(--cluster-visual); }

  /* ── Footer ── */
  .footer { padding: 9px 48px; background: rgba(44,33,20,0.022); border-top: 1px solid var(--div); font-family: var(--fm); font-size: 9.5px; color: var(--dim); display: flex; justify-content: space-between; align-items: center; }
  .save-btn { font-family: var(--fm); font-size: 9.5px; color: var(--dim); background: none; border: 1px solid var(--div); border-radius: 4px; padding: 3px 9px; cursor: pointer; transition: border-color 0.15s; }
  .save-btn:hover { border-color: rgba(44,33,20,0.3); color: var(--text); }

  /* ── Print ── */
  @media print {
    body { background: #fff; padding: 0; }
    .report { box-shadow: none; border-radius: 0; width: 100%; }
    .save-btn { display: none; }
    .finding-card { break-inside: avoid; }
    .ring-section { break-inside: avoid; }
  }

  /* ── Responsive: Tablet ── */
  @media (max-width: 768px) {
    .header-grid { grid-template-columns: 1fr; }
    .header-right { justify-content: start; }
    .meta-k { text-align: left; }
    .dash-top { grid-template-columns: 1fr; justify-items: center; gap: 24px; }
    .score-dims { width: 100%; }
    .summary-grid { grid-template-columns: 1fr; }
    .finding-grid { grid-template-columns: 1fr; }
    .header, .dashboard, .ring-section, .roadmap, .methodology, .summary, .footer { padding-left: 32px; padding-right: 32px; }
  }

  /* ── Responsive: Mobile ── */
  @media (max-width: 480px) {
    body { padding: 12px 8px 24px; }
    .header, .dashboard, .ring-section, .roadmap, .methodology, .summary, .footer { padding-left: 20px; padding-right: 20px; }
    h1 { font-size: 22px; }
    .stats-grid { grid-template-columns: 1fr; }
    .stat-big { font-size: 28px; }
    .progress-bar { flex-wrap: wrap; gap: 12px; justify-content: center; }
    .progress-line { display: none; }
    .roadmap-item { flex-direction: column; gap: 4px; }
    .roadmap-title { min-width: 0; }
    .dim-row { grid-template-columns: 100px 1fr 28px; gap: 8px; }
  }
`;

// ── CLI ─────────────────────────────────────────────────────────────────────────

const [,, inputPath, outputPath] = process.argv;

if (!inputPath) {
  console.error('Usage: node generate-report.mjs <input.json> [output.html]');
  process.exit(1);
}

const data = JSON.parse(readFileSync(resolve(inputPath), 'utf-8'));
const outFile = outputPath || 'audit-report.html';

writeFileSync(resolve(outFile), buildReport(data), 'utf-8');
console.log(`Report written to ${outFile}`);
