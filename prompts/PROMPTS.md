# The 3-Prompt Workflow

This document contains the three prompts that transform this template into a complete, customized landing page for any SaaS idea.

---

## Overview

| Prompt       | Purpose                                 | Time   |
| ------------ | --------------------------------------- | ------ |
| **Prompt 1** | Discovery - Gather business information | ~5 min |
| **Prompt 2** | Generation - Create all content         | ~2 min |
| **Prompt 3** | Refinement - Polish and deploy          | ~3 min |

---

## PROMPT 1: Discovery

Copy and paste this prompt, then answer the questions:

```
I want to create a landing page for my SaaS product using the template in this folder.

Please ask me about:
1. Product name and tagline
2. What the product does (1-2 sentences)
3. Target audience
4. Key benefits/features (3-6)
5. How it works (3-4 steps)
6. Pricing model (free tier? paid tiers? prices?)
7. Common questions customers might have (3-5)
8. Company/founder info for the About section
9. Contact email
10. Preferred accent color (or let me suggest based on industry)
11. Tone of voice (professional, casual, playful, technical)

After I answer, summarize my business in a brief that we'll use for Prompt 2.
```

### Example Answers:

> 1. **InvoiceFlow** - "Invoicing that flows"
> 2. An invoicing tool that automatically generates and sends invoices based on project milestones
> 3. Freelancers and small agencies who bill by project
> 4. Auto-generation from milestones, Smart payment reminders, Multi-currency support, Beautiful templates, Client portal, Expense tracking
> 5. Connect your project tool → Set milestone rules → Invoices generate automatically → Get paid faster
> 6. Free (3 clients), Pro $19/mo (unlimited), Team $49/mo (collaboration)
> 7. "Does it work with Notion?", "Can I customize invoice templates?", "What payment methods are supported?", "Is my data secure?"
> 8. Founded by a freelancer tired of manual invoicing. Solo founder, bootstrapped.
> 9. hello@invoiceflow.io
> 10. Green (money/growth vibes)
> 11. Professional but friendly

---

## PROMPT 2: Generation

After Prompt 1, use this prompt:

```
Based on the brief above, generate all BILINGUAL (English + Spanish) content for my landing page.

IMPORTANT: All content must be bilingual using this format:
{
  "key": {
    "en": "English text here",
    "es": "Spanish text here"
  }
}

Use parallel agents to generate these files simultaneously:
- Agent 1: Update src/content/site.json (brand name, description, meta tags)
- Agent 2: Update src/content/home.json (hero, features, how it works, waitlist CTA)
- Agent 3: Update src/content/pricing.json (all tiers with features)
- Agent 4: Update src/content/about.json (story, values)
- Agent 5: Update src/content/contact.json and src/content/faq.json
- Agent 6: Update src/content/legal.json (privacy policy, terms - fill in company details)

Also:
- Update the --primary color in src/app/globals.css to match my chosen accent color (use oklch format)
- Ensure all copy is compelling, benefit-focused, and matches my tone of voice
- Use action verbs and clear value propositions
- Keep headlines punchy (under 10 words)
- Make CTAs specific ("Start Free Trial" > "Get Started")
- Spanish translations should be natural, not machine-translated

Write all files directly to the template folder.
```

### What This Generates:

The AI will update 7 JSON files with **bilingual content** (EN + ES):

| File           | Content                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `site.json`    | Brand name, tagline, navigation, footer links, social links, meta info |
| `home.json`    | Hero section, features grid, how-it-works steps, waitlist CTA           |
| `pricing.json` | All pricing tiers with features                                        |
| `about.json`   | Company story, values                                                  |
| `contact.json` | Form fields, contact info                                              |
| `faq.json`     | 5+ frequently asked questions                                          |
| `legal.json`   | Privacy policy and Terms of Service                                     |

Users can toggle between English and Spanish using the language switcher in the navigation bar.

---

## PROMPT 3: Refinement & Deploy

Use this prompt for final adjustments and deployment:

```
Let's finalize my landing page:

1. **Review**: Read through all the generated JSON files and check for:
   - Consistency in tone and messaging
   - No placeholder text remaining ([brackets] or "Lorem ipsum")
   - Accurate pricing and feature lists
   - Complete legal pages with my company info
   - Both English AND Spanish translations are present and correct

2. **Quick fixes** (if needed):
   - [List any specific changes you want]

3. **Setup verification**:
   - Check that all pages render correctly
   - Test the waitlist form submission (uses localStorage fallback if no Supabase)
   - Verify dark mode toggle works
   - Verify language switcher works

4. **Deploy**:
   - Provide step-by-step Vercel deployment instructions
   - List the environment variables I need to set (optional Supabase)
   - Any post-deployment checks

Run the dev server and use a browser testing agent to verify the site works.
```

---

## Tips for Best Results

### Be Specific in Prompt 1

The more detail you provide, the better the generated content:

- **Bad**: "An app for freelancers"
- **Good**: "An invoicing app that auto-generates invoices from Notion project milestones for freelance designers"

### Review the Brief

Before Prompt 2, make sure the AI's summary captures your vision. Correct any misunderstandings.

### Iterate on Prompt 3

You can run Prompt 3 multiple times to refine specific sections:

- "Make the hero headline more urgent"
- "Add a feature about API access"
- "Change the pricing to include an annual discount"

### Color Suggestions by Industry

| Industry          | Suggested Colors (oklch)                    |
| ----------------- | ------------------------------------------- |
| Finance/Invoicing | Green (oklch(0.7 0.15 150)), Blue (oklch(0.6 0.15 250)) |
| Healthcare        | Blue (oklch(0.65 0.12 230)), Teal (oklch(0.7 0.12 180)) |
| Productivity      | Purple (oklch(0.6 0.2 300)), Indigo (oklch(0.55 0.2 270)) |
| Creative/Design   | Pink (oklch(0.7 0.2 350)), Orange (oklch(0.75 0.18 50)) |
| Developer Tools   | Cyan (oklch(0.7 0.15 200)), Slate (oklch(0.5 0.02 260)) |
| E-commerce        | Orange (oklch(0.75 0.18 50)), Red (oklch(0.65 0.2 25)) |

---

## Optional: Supabase Setup

If you want waitlist emails stored in a database, run this SQL in your Supabase SQL Editor:

```sql
-- Waitlist table
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamp with time zone default now(),
  source text default 'website'
);

-- Enable Row Level Security
alter table waitlist enable row level security;

-- Allow anonymous inserts (for the waitlist form)
create policy "Allow anonymous inserts" on waitlist
  for insert with check (true);

-- Optional: Contact form submissions
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamp with time zone default now()
);

alter table contact_submissions enable row level security;

create policy "Allow anonymous inserts" on contact_submissions
  for insert with check (true);
```

Then create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: If Supabase is not configured, the waitlist form will automatically use localStorage as a fallback.

---

## Troubleshooting

### "Module not found" errors

Run `npm install` to ensure all dependencies are installed.

### Supabase connection fails

1. Check `.env.local` has correct values (no quotes around values)
2. Verify the Supabase project is active
3. Check the anon key has insert permissions

### Styles not applying

1. Make sure `globals.css` is imported in `layout.tsx`
2. Check that CSS variables are defined in `:root`
3. Run `npm run dev` to see Tailwind updates

### Form submissions not working

1. Check browser Network tab for API errors
2. Verify Supabase table exists (or check localStorage)
3. Check RLS policies allow inserts

### Dark mode not working

1. Verify ThemeProvider wraps the app in `providers.tsx`
2. Check the `dark` class is being applied to `<html>`
3. Clear localStorage and refresh

---

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Tailwind + CSS variables (edit --primary for accent)
│   ├── layout.tsx       # Root layout with fonts
│   ├── page.tsx         # Main page with all sections
│   └── providers.tsx    # Theme + Language providers
├── components/
│   ├── sections/        # Hero, Features, Pricing, FAQ, etc.
│   ├── ui/              # shadcn/ui components
│   ├── Navbar.tsx       # Navigation with lang/theme toggles
│   ├── Footer.tsx       # Footer with links
│   ├── LanguageSwitcher.tsx
│   └── ThemeToggle.tsx
├── content/             # JSON content files (edit these!)
│   ├── site.json
│   ├── home.json
│   ├── pricing.json
│   ├── about.json
│   ├── contact.json
│   ├── faq.json
│   └── legal.json
├── contexts/            # Theme + Language contexts
├── hooks/               # useTranslation hook
├── lib/                 # Supabase client + waitlist logic
└── types/               # TypeScript types
```
