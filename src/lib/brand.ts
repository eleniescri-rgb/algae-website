// ─── Brand constants — single source of truth ─────────────────────────────────

/** Framer Motion easing used across all sections. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Brand accent colours in cycling order.
 * Usage: `const accent = BRAND_ACCENTS[index % BRAND_ACCENTS.length]`
 */
export const BRAND_ACCENTS = ["#FF751F", "#0897B3", "#47AECC"] as const;

/** Core colour tokens. */
export const COLORS = {
  textLight:   "#CCE6EA",  // brand-ice — primary light text on dark bg
  textMuted:   "#729DB9",  // brand-steel — secondary / body text on dark bg
  accentOrange:"#FF751F",  // brand-orange
  accentTeal:  "#0897B3",  // brand-teal
  accentSky:   "#47AECC",  // brand-sky
  bgDark:      "#093349",  // dark navy (About, StatsStrip)
  bgDarker:    "#063D57",  // deeper navy (Hero, HowItWorks, Pricing)
  bgDeepest:   "#041820",  // Recognition
} as const;

/** Viewport margins for `useInView` / `whileInView`. */
export const VIEWPORT = {
  loose:  { once: true, margin: "-80px" },
  default:{ once: true, margin: "-60px" },
  tight:  { once: true, margin: "-40px" },
  flush:  { once: true, margin: "-30px" },
} as const;
