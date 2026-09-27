---
name: KedaiKas Precision BI
colors:
  surface: '#f8f9ff'
  surface-dim: '#d8dadf'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3f9'
  surface-container: '#eceef3'
  surface-container-high: '#e6e8ed'
  surface-container-highest: '#e1e2e8'
  on-surface: '#191c20'
  on-surface-variant: '#44474c'
  inverse-surface: '#2e3135'
  inverse-on-surface: '#eff0f6'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#506075'
  primary: '#102134'
  on-primary: '#ffffff'
  primary-container: '#26364a'
  on-primary-container: '#8e9fb7'
  inverse-primary: '#b7c8e1'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d4e4fc'
  on-secondary-container: '#57657a'
  tertiary: '#400e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#621e04'
  on-tertiary-container: '#e78261'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e4fe'
  primary-fixed-dim: '#b7c8e1'
  on-primary-fixed: '#0b1c2f'
  on-primary-fixed-variant: '#38485d'
  secondary-fixed: '#d4e4fc'
  secondary-fixed-dim: '#b8c8df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#39485b'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#7a2f14'
  background: '#f8f9ff'
  on-background: '#191c20'
  surface-variant: '#e1e2e8'
typography:
  display-kpi:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-kpi-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-ui:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  metric-tabular:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  metric-tabular-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an executive-grade business intelligence and financial telemetry environment tailored for modern Indonesian enterprise operators and high-growth MSMEs (Usaha Mikro, Kecil, dan Menengah). The design philosophy moves decisively away from folksy, rustic marketplace tropes and chaotic retail dashboards. Instead, it embodies restrained modernism, architectural clarity, and institutional trust.

The aesthetic fuses **Minimalism** and **Modern Corporate Editorial**:
- **Tone & Demeanor**: Authoritative, steady, mathematically rigorous, yet approachable and warm. It honors local fiscal sensibilities through grounded, natural mineral tones rather than synthetic neon fintech accents.
- **Target Experience**: Seamless daily financial closes, inventory turnover analysis, multi-outlet unit economics, and margin simulations. The interface stays unobtrusive, prioritizing dense metrics, data legibility, and immediate comprehension of operational health.
- **Visual Stance**: Structured 1px containment lines, tactile warm white canvas tiers, and strict information hierarchy. The interface projects the stability of a tier-one corporate bank paired with the razor-sharp agility of modern analytical software.

## Colors

The palette is engineered around an architectural triad: Deep Navy `#26364A` establishes operational authority; Terracotta `#C96B4B` acts as an intentional, high-conversion action driver; and Soft Warm White `#F7F5F0` provides a fatigue-reducing foundation for prolonged analytical work.

### Palette Architecture
- **Primary (`#26364A` - Deep Navy)**: Structural frame, primary interactive states, sidebar navigation anchors, and dominant headline text.
- **Secondary (`#66758A` - Slate Blue)**: Meta-labels, axis markers, inactive tab states, secondary action buttons, and descriptive supporting text.
- **Accent / CTA (`#C96B4B` - Terracotta)**: High-priority operational triggers (e.g., "Tutup Buku", "Ekspor Laporan"), active interactive selections, and key focus states.
- **Surface & Canvas**:
  - `Canvas / App Background`: `#F7F5F0` (Soft Warm White). Eliminates glare during intense data reconciliation.
  - `Surface Tier 1 (Cards, Modules, Flyouts)`: `#FFFFFF` (Clean White).
  - `Surface Tier 2 (Nested Tables, Filter Bars)`: `#FAF8F5`.
- **Structural Outlines (`#E4E1DA` - Soft Gray)**: Universal border token for card perimeters, input field outlines, and data grid divisions.
- **Semantic Financial States**:
  - `Positive / Growth`: `#4F8A82` (Muted Teal). Indicates margin expansion, cash inflow, and profitable trends.
  - `Warning / Attention`: `#D6A04A` (Warm Amber). Out-of-stock risks, pending tax invoices, and threshold alerts.
  - `Negative / Alert`: `#C45C5C` (Muted Red). Margin erosion, net deficit, overdue receivables, and system anomalies.
- **Text Tiers**:
  - `Text Primary`: `#24272B` (Dark Charcoal, WCAG AAA compliant against white surfaces).
  - `Text Muted`: `#66758A` (Slate Blue).
  - `Text Inverted`: `#FFFFFF` on Primary Navy or Terracotta containers.

## Typography

The typographic hierarchy is calibrated for fast, unambiguous scanning of complex ledger entries, transaction streams, and visual reporting.

- **Primary Typeface (`Plus Jakarta Sans`)**: Delivers friendly precision, geometric clarity, and humanist warmth. It maintains structural balance across dense dashboard headers and compact contextual summaries.
- **Numerical Typeface (`JetBrains Mono`)**: Mandated across all transactional surfaces, data tables, unit prices, IDR balance figures, tax calculations, and percentage deltas. The fixed width prevents visual staggering when vertical ledger columns are read line by line.
- **Micro-Labels & Data Category Tags**: Styled in `label-caps` using uppercase tracking (`0.06em`) to provide instant spatial separation between static ledger classifications and dynamic numerical values.
- **Font Feature Settings**: `font-feature-settings: "tnum" 1, "cv02" 1, "cv04" 1` is enforced across all body and metric styles to preserve tabular alignment even in proportional runs.

## Layout & Spacing

The platform is constructed on an adaptable 12-column fluid grid system anchored by strict horizontal 4px baseline rhythm increments.

### Grid Configuration
- **Desktop (1280px and above)**: 12-column structure with `2rem` (32px) margins and `1.25rem` (20px) gutters. Maximum content reading frame caps at `1600px`.
- **Tablet / Small Laptop (768px – 1279px)**: 8-column layout with `1.5rem` (24px) margins and `1rem` (16px) gutters. Complex tables gain horizontal freeze-column scroll behaviors.
- **Mobile Handheld (320px – 767px)**: 4-column layout with `1rem` (16px) margins and `0.75rem` (12px) gutters. Multi-metric KPI blocks shift from horizontal arrays into 2x2 cards or full-width vertical stacks.

### Rhythm and Hierarchy
- **Module Breathing Room**: Use `space-lg` (24px) for intra-card padding in desktop views, dropping to `space-md` (16px) on compact screens.
- **Metric Proximity**: Maintain tight pairing (`space-xs` to `space-sm`) between the metric label (`label-caps`) and its associated tabular numerical value.
- **Table Density**: Table rows utilize vertical padding of `0.625rem` (10px) in standard mode and `0.375rem` (6px) in dense accounting mode to maximize viewport data capture.

## Elevation & Depth

This system avoids aggressive skeuomorphism and excessive blur-heavy glass surfaces. Instead, it builds depth through crisp boundary definition and whisper-soft structural shadows.

### Surface Tiers & Layering
1. **Foundation Level (0dp)**: Canvas layer colored in Soft Warm White (`#F7F5F0`).
2. **Container Level (1dp)**: Primary card blocks, analytics widgets, and data grids sit in Clean White (`#FFFFFF`), bounded by a 1px continuous border of Soft Gray (`#E4E1DA`) and reinforced by an ambient micro-shadow:
   `box-shadow: 0 1px 3px rgba(38, 54, 74, 0.04), 0 1px 2px rgba(38, 54, 74, 0.02);`
3. **Interactive & Hover Level (2dp)**: Triggered during card elevation or active row selection:
   `box-shadow: 0 4px 12px rgba(38, 54, 74, 0.06), 0 2px 4px rgba(38, 54, 74, 0.03);`
4. **Overlay / Flyout Level (3dp)**: Slide-out reconciliation drawers, contextual dropdown menus, date range filters, and modal modals:
   `box-shadow: 0 12px 32px rgba(38, 54, 74, 0.12), 0 4px 8px rgba(38, 54, 74, 0.04);`
   Coupled with a low-opacity dark neutral backdrop overlay (`#26364A` at 35% opacity with a `2px` subtle blur).

## Shapes

The interface balances crisp numerical precision with ergonomic visual comfort through moderate corner smoothing:

- **Base Radius (`rounded`, 0.5rem / 8px)**: Standard form inputs, buttons, status badges, drop-down sheets, and embedded table cells.
- **Large Radius (`rounded-lg`, 0.75rem / 12px)**: Primary analytics cards, chart canvas containers, and modal dialogs.
- **Extra-Large Radius (`rounded-xl`, 1rem / 16px)**: Root layout wrappers, slide-over detail panels, and master navigation shells.
- **Strict Geometric Constraints**: Chart indicators, sparklines, and inline table dividers remain square and razor-sharp to maintain analytical accuracy.

## Components

### Buttons
- **Primary CTA**: Background Terracotta `#C96B4B`, text `#FFFFFF`, font-weight 600, border radius `8px`. Hover: `#B35D3F`. Active: `#9E4F34`.
- **Secondary (Navy)**: Background Deep Navy `#26364A`, text `#FFFFFF`. Hover: `#1B2735`.
- **Outline / Neutral**: Background transparent, border 1px solid `#E4E1DA`, text `#24272B`. Hover: `#FAF8F5`, border `#66758A`.
- **Size Profiles**:
  - Small (dense tables): Height 32px, padding 0 12px, font-size 13px.
  - Medium (default): Height 40px, padding 0 16px, font-size 14px.
  - Large (primary actions): Height 48px, padding 0 20px, font-size 15px.

### Badges & Status Chips
- Built with a 12% tint background of the respective semantic color and 100% solid text tone:
  - **Growth / Positive**: Background `rgba(79, 138, 130, 0.12)`, text `#3D6E67`, border 1px solid `rgba(79, 138, 130, 0.25)`.
  - **Warning / Simulation**: Background `rgba(214, 160, 74, 0.12)`, text `#9B712E`, border 1px solid `rgba(214, 160, 74, 0.25)`.
  - **Alert / Deficit**: Background `rgba(196, 92, 92, 0.12)`, text `#A34444`, border 1px solid `rgba(196, 92, 92, 0.25)`.
  - **Neutral State**: Background `rgba(102, 117, 138, 0.10)`, text `#4B5767`, border 1px solid `rgba(102, 117, 138, 0.20)`.
- Border-radius: `6px`. Font: `JetBrains Mono`, 11px, weight 500.

### Input Fields & Selectors
- **Default State**: Surface `#FFFFFF`, border 1px solid `#E4E1DA`, text `#24272B`, border-radius `8px`, height `40px`.
- **Focus State**: Border 1.5px solid `#26364A`, outer focus ring `0 0 0 3px rgba(38, 54, 74, 0.08)`.
- **Currency Inputs (IDR)**: Prepended with static, non-editable prefix "Rp" styled in Slate Blue `#66758A` with JetBrains Mono numbers formatted with thousands separators (`.`).

### Data Tables
- **Header**: Background `#FAF8F5`, border-bottom 1px solid `#E4E1DA`, text in `label-caps` (`#66758A`).
- **Rows**: Alternating white background with subtle hover highlight `#F7F5F0`. Border-bottom 1px solid `#E4E1DA`.
- **Alignment Rules**: Text labels left-aligned; status chips centered; monetary values, quantities, and percentage changes right-aligned using tabular figures.

### Analytics Cards & KPI Panels
- Solid Clean White container, 1px `#E4E1DA` perimeter outline, subtle drop shadow.
- Top row: Metric label in uppercase letter-spacing paired with timeframe badge (e.g., \"30 HARI TERAKHIR\").
- Middle row: Massive high-contrast numerical KPI (`display-kpi`) with inline currency symbol.
- Bottom row: Inline delta badge showing positive/negative trend against prior period with contextual comparison label.

### Visual Charts
- Gridlines: Minimal, dotted or dashed lines using `#E4E1DA` at 60% opacity.
- Tooltips: Deep Navy `#26364A` background with crisp white typography and muted teal/terracotta legend indicators.
