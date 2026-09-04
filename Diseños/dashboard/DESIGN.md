---
name: Governance & Observability Console
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2b4fdc'
  primary: '#0033be'
  on-primary: '#ffffff'
  primary-container: '#2a4edb'
  on-primary-container: '#cfd5ff'
  inverse-primary: '#b9c3ff'
  secondary: '#006a69'
  on-secondary: '#ffffff'
  secondary-container: '#7df5f4'
  on-secondary-container: '#007070'
  tertiary: '#5415be'
  on-tertiary: '#ffffff'
  tertiary-container: '#6d3ad6'
  on-tertiary-container: '#dfd0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b9c3ff'
  on-primary-fixed: '#001257'
  on-primary-fixed-variant: '#0034c0'
  secondary-fixed: '#7df5f4'
  secondary-fixed-dim: '#5ed9d7'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#00504f'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  code:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-micro:
    fontFamily: geist
    fontSize: 10.5px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2: 0.125rem
  space-4: 0.25rem
  space-6: 0.375rem
  space-8: 0.5rem
  space-12: 0.75rem
  space-16: 1rem
  space-20: 1.25rem
  space-24: 1.5rem
  space-32: 2rem
  topbar-height: 3.5rem
  sidebar-width: 16rem
  container-max: 80rem
---

## Brand & Style

The design system projects absolute operational precision, audit defensibility, and algorithmic transparency for enterprise IT operations. It balances the high-density requirements of monitoring pipelines with the calm, systematic clarity found in modern technical platforms. The emotional signature is rigorous, objective, and authoritative: the interface acts as a silent, infallible audit log where autonomous agents and human gatekeepers inspect, debate, and approve actions with zero visual ambiguity.

A modern enterprise technical aesthetic combines structured data density with low cognitive overhead. High-contrast micro-metadata, restrained line work, strictly structured cards, and precise tabular structures allow operators to scan thousands of execution logs while immediately resolving critical governance escalations.

## Colors

The palette uses a foundational cool slate wash to avoid visual fatigue over extended operational shifts while maintaining pure white workspaces for key audit entities.

- **Primary Canvas (`#F7F8FA`):** The persistent backdrop for main application views, structural gutters, and breadcrumb rails.
- **Surface Elevation (`#FFFFFF`):** High-contrast background for execution panels, governance trees, policy tables, and modal drawers.
- **Core Governance Blue (`#2A4EDB`):** Primary interactive elements, verified compliance state anchors, and focal workflow actions.
- **AI Accent Teal (`#0EA5A4`):** Flags autonomous AI synthesis, active LLM inspection pipelines, token consumption metrics, and neural-driven automated rule proposals.

### Semantic Status Palette
Every operational state maps directly to explicit semantic definitions:
- **Approved / Verified (`#10B981`):** Applied to passing pre-flight checks, cryptographic verification badges, and accepted policy rules.
- **Rejected / Blocked (`#EF4444`):** Applied to anomalous agent tool-calls, hard policy halts, toxic inputs, and failed integrity checks.
- **Debating / Evaluation / Medium Risk (`#F59E0B`):** Applied to active multi-model consensus stages, non-blocking policy warnings, and rate-limit friction.
- **Human Escalation (`#8B5CF6`):** Applied to manual overrides, required executive approvals, break-glass credentials, and policy disputes.
- **Executing / In-Flight (`#3B82F6`):** Active agent runtime, distributed job execution, and rolling deployment locks.

All structural borders utilize a calibrated slate stroke (`#E2E8F0`). Secondary text, subtle separators, and inactive indicators leverage neutral slate tiers from `#64748B` down to `#0F172A` for headers.

## Typography

Typography prioritizes scannability across dense data layouts. Geist handles structural anchors, high-level headers, and micro-labels. Inter governs standard body copy and complex audit event streams. JetBrains Mono is designated for API endpoints, payload hashes, deterministic agent prompts, and JSON payloads.

- **Tabular Numerics:** All quantitative columns, confidence scores, latency timings, and token counters require `font-variant-numeric: tabular-nums` to ensure exact columnar vertical alignment across continuous updates.
- **Section Eyebrows / Micro-Labels:** Formatted strictly in uppercase using `label-micro`, with tracked-out spacing (`tracking-wider` or `0.08em`) to establish visual separation for category headers without requiring heavy borders or intrusive dividers.

## Layout & Spacing

The layout is built around a fixed viewport scaffolding designed for workstation environments:

- **Sidebar Framework:** A fixed width of `256px` (`16rem`), full-height, pinned to the left edge with continuous `1px solid #E2E8F0` border demarcation.
- **Global Header / Topbar:** Fixed height of `56px` (`3.5rem`), anchored horizontally across the remaining viewport width, providing breadcrumbs, global environment switches, and agent status feeds.
- **Main Viewport & Max-Width Shell:** Content loads over a persistent `#F7F8FA` background. Data panes, activity logs, and table grids expand flexibly to fill available width up to a strict `1280px` (`80rem`) centered container within standard monitoring workspaces. Full-width stretch mode is supported when rendering deep tree logs and visual graph nodes.
- **Rhythm & Grid:** Built on an absolute `4px`/`8px` grid. Standard cell padding for dense data tables defaults to `8px 12px`. Structural card margins and container gaps use `16px` or `24px`.

## Elevation & Depth

Visual hierarchy uses crisp boundary delineation rather than heavy drop shadows. Surfaces maintain high contrast through structured 1px border lines and tight, diffused shadow layers.

- **Flat Surface (Tier 0):** Pure `#FFFFFF` surfaces sitting directly over `#F7F8FA`, defined by a continuous `1px solid #E2E8F0` stroke. No shadow.
- **Raised Card (Tier 1):** Applied to telemetry panels, policy group cards, and metric summaries:
  - Border: `1px solid #E2E8F0`
  - Shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`
- **Interactive / Hovered Card (Tier 2):** Applied to selectable audit runs and interactive agent nodes:
  - Border: `1px solid #CBD5E1`
  - Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)`
- **Overlay Panels & Flyouts (Tier 3):** Applied to filter menus, dropdown inspectors, and slide-out policy diffs:
  - Border: `1px solid #E2E8F0`
  - Shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`
- **Modals & Escalation Interrupters (Tier 4):**
  - Border: `1px solid #CBD5E1`
  - Backdrop: `rgba(15, 23, 42, 0.35)` with 4px Gaussian blur
  - Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`

## Shapes

The interface balances sharp, technical discipline with modern ergonomics:

- **Surface Cards & Data Panels:** Explicitly styled with `12px` border-radius (`0.75rem`), balancing structured rectangular grids with soften outer boundaries.
- **Interactive Controls (Buttons, Inputs, Dropdowns):** Standardized on `6px` border-radius (`0.375rem`) to maintain sharp technical affordance.
- **Pills, Badges, & Chips:** High-density status chips adopt an engineered `4px` radius or full `9999px` circular containment based on whether they sit inside tables or standalone breadcrumbs.
- **Corner Nested Harmony:** Elements placed inside a `12px` parent card maintain an inner radius of `6px` to avoid awkward optical gap variance.

## Components

### Buttons
- **Primary Governance Action:** `#2A4EDB` background, `#FFFFFF` text, `6px` radius, `font-weight: 500`. Hover: `#1E3BB8`. Focus: `2px` offset ring in `#2A4EDB`.
- **Secondary / Outline:** `#FFFFFF` background, `1px solid #E2E8F0`, `#0F172A` text. Hover: `#F8FAFC` background with `#CBD5E1` border.
- **Destructive Action:** `#FFFFFF` background, `1px solid #FCA5A5`, `#EF4444` text. Hover: `#FEF2F2` background, `#DC2626` text.

### Status Indicators & Chips
Every status item must render an inline icon paired with an explicit text label. Never use color alone.
- **Approved:** Tinted container `#ECFDF5`, border `1px solid #A7F3D0`, text `#065F46`. Icon: Checkmark-circle.
- **Rejected:** Tinted container `#FEF2F2`, border `1px solid #FECACA`, text `#991B1B`. Icon: X-octagon.
- **Debating / Med Risk:** Tinted container `#FFFBEB`, border `1px solid #FDE68A`, text `#92400E`. Icon: Scale or message-square-alert.
- **Human Escalation:** Tinted container `#F5F3FF`, border `1px solid #DDD6FE`, text `#5B21B6`. Icon: User-alert or shield-alert.
- **Executing:** Tinted container `#EFF6FF`, border `1px solid #BFDBFE`, text `#1E40AF`. Icon: Synchronous animated spinner or pulse-dot.

### Cards & Telemetry Panels
Constructed on `#FFFFFF` backgrounds, `1px solid #E2E8F0` perimeter border, `12px` border-radius, and Tier 1 elevation shadow. Headers within cards feature uppercase micro-labels (`label-micro`) with tracking, paired with actionable tools or right-aligned status chips.

### Data Tables
- **Header Rows:** `#F8FAFC` background, `1px solid #E2E8F0` bottom border, `10.5px` uppercase label typography (`label-micro`), slate text `#64748B`.
- **Data Rows:** Alternating hover transitions to `#F8FAFC`, baseline height of `36px` to `42px` for maximum usable density, cells split with `1px solid #F1F5F9`. Numeric metrics utilize tabular numerals and monospace formatting where precision hashes are involved.

### Form Inputs & Search Filters
- Neutral backgrounds `#FFFFFF`, `1px solid #CBD5E1` border, `6px` radius.
- Focus state: Border color transitions to `#2A4EDB` with a subtle focus glow (`0 0 0 1px #2A4EDB`).
- Filter bars incorporate embedded quick-filter tags, system prompt selectors, and active state pill toggles.