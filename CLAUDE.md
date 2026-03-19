# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

## Design Context

### Users
Hotel operations directors and general managers at beachfront properties in Mexico and the Caribbean (primarily Quintana Roo). They are practical, data-oriented decision-makers who evaluate vendors on credibility, cost, and operational fit — not aesthetics. They encounter this site during a research phase, likely on desktop, while dealing with a real and expensive recurring problem (sargassum removal costing $60–90K/month). They are skeptical of startups and need to quickly trust that Alga.e is serious.

### Brand Personality
**Three words: Rigorous. Grounded. Credible.**

Alga.e is a cleantech startup solving an industrial problem for a hospitality audience. The brand should feel like a well-funded engineering company, not a sustainability NGO or a SaaS pitch. The emotional goal is **confidence** — a hotel GM should leave feeling "this is a real company with a real solution," not "this looks cool."

### Aesthetic Direction
**Clean tech / scientific.** Precise, data-forward, structured. Feels like it was designed by people who understand operations and industrial processes — not a branding agency chasing trends.

**Reference feel:** Think field instrumentation companies, industrial equipment manufacturers, or climate-tech firms that let their data do the work. Structured grids, clear typographic hierarchy, numbers given prominence.

**Anti-references (avoid all of these):**
- Generic SaaS startup — purple/blue gradients, floating 3D blobs, "The future of X" hero copy
- NGO / charity site — stock beach photos, donation-adjacent tone, non-profit energy
- Heavy corporate — dated navy-suit enterprise aesthetic, 2010 enterprise software feel
- Trendy design studio — scroll-jacking, all-black maximalism, style-over-substance

**Theme:** Both light and dark supported (toggle already built). Light mode is clean, cool-white with teal accents — feels like a lab report. Dark mode is the deep navy brand palette.

### Design Principles

1. **Data earns attention.** Numbers are Alga.e's strongest asset. Design frames them — it never competes with them. No gradient text on metrics. No decorative oversizing for its own sake.

2. **Trust through restraint.** A hotel GM is skeptical of startups. Credibility comes from not overdesigning. Avoid glow effects, gradient text, glassmorphism, and neon accents — these read as "trying too hard."

3. **Engineered, not decorated.** Spacing, grid alignment, and type scales should feel intentional and systematic — like a well-calibrated instrument. Asymmetry is allowed only when it's purposeful.

4. **Hierarchy is function.** The most important information must be visually dominant. Secondary information recedes. Nothing fights for equal attention. Layout communicates priority.

5. **No NGO energy.** Every design decision should reinforce that this is a B2B industrial product with a serious economic proposition, not an environmental cause asking for sympathy. Language and visuals stay operational and evidence-based.

### Technical Context
- **Stack:** Next.js 15, Tailwind CSS v4, Framer Motion
- **Fonts:** Fraunces (display/serif, for headings) + Jost (sans, for body)
- **Palette:** Orange `#FF751F`, Teal `#0897B3`, Sky `#47AECC`, Navy `#063D57` / `#093349`, Ice `#CCE6EA`
- **Bilingual:** EN/ES via custom translation hook
- **Accessibility:** WCAG AA target, `prefers-reduced-motion` already handled
