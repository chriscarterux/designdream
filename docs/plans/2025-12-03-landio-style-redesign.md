# Landio-Style Dark Theme Redesign - Design Document

**Date:** December 3, 2025
**Project:** Design Dreams Landing Page
**Objective:** Transform current landing page to Landio-inspired dark, minimal aesthetic using shadcnblocks.com professional blocks

---

## Design Vision

Transform the Design Dreams landing page from a traditional colorful SaaS layout to a sophisticated, dark, minimal design inspired by landio.framer.website while maintaining all existing functionality and content.

**Key Characteristics:**
- Dark theme with #015450 (dark teal) as primary accent
- Centered, vertical content flow (not side-by-side layouts)
- Generous spacing (80-160px vertical padding)
- Professional shadcnblocks components throughout
- Serif headings (DM Serif Display) + sans body (Inter)
- Subtle animations and radial gradient effects

---

## 1. Color Scheme & Theme

### Foundation Colors
- **Background:** `#04070d` (very dark navy, Landio-like)
- **Card/Section backgrounds:** `#0a0e14` (slightly lighter)
- **Primary accent:** `#015450` (dark teal) - MUST verify WCAG AA contrast
- **Text hierarchy:**
  - Primary: `#f5f5f5` (near-white)
  - Secondary: `#d5dbe6` (light gray)
  - Body: `#a0a8b8` (medium gray)
  - Muted: `#6b7280` (darker gray)
- **Borders:** `#1a1f2e` (subtle, low contrast)
- **Border radius:** `0.75rem` (modern, smooth)

### Accent Usage (Sparingly)
Use #015450 teal ONLY for:
- Primary CTA buttons
- Hover states on interactive elements
- Active navigation items
- Step numbers/key highlights
- Subtle border accents on pricing card

**Accessibility Requirement:** Verify #015450 on dark backgrounds meets WCAG AA (4.5:1 for text, 3:1 for UI). Lighten if needed.

---

## 2. Typography System

### Font Families
**Headings:** DM Serif Display (Google Font)
```typescript
import { DM_Serif_Display } from 'next/font/google';

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif',
});
```

**Body:** Inter (already installed)
```typescript
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});
```

### Type Scale
- **Hero h1:** `text-6xl lg:text-7xl` (DM Serif, ~60-80px)
- **Section h2:** `text-4xl lg:text-5xl` (DM Serif, ~36-48px)
- **Card h3:** `text-2xl lg:text-3xl` (DM Serif, ~24-30px)
- **Subheadings:** `text-xl lg:text-2xl` (Inter, font-light)
- **Body:** `text-base lg:text-lg` (Inter, ~16-18px)
- **Small/Meta:** `text-sm` (Inter, ~14px)

### Application
Apply via Tailwind classes:
```css
h1, h2, h3 { font-family: var(--font-dm-serif); }
body, p, button { font-family: var(--font-inter); }
```

---

## 3. Hero Section Design

### Layout
**Structure:** Fully centered, vertical stack (not two-column)

```
┌─────────────────────────────────┐
│         [Badge/Pill]            │
│                                 │
│      LARGE SERIF HEADLINE       │
│                                 │
│  Subheading in lighter weight   │
│                                 │
│   [Primary CTA] [Teal CTA]     │
│                                 │
│    (Optional: Centered visual)  │
└─────────────────────────────────┘
```

### Spacing
- Top padding: `pt-40` (160px - accounts for fixed header)
- Bottom padding: `pb-32` (128px)
- Max width: `max-w-4xl mx-auto`
- Gap between elements: `space-y-8`

### Content
- **Badge:** "Built by a full-stack developer & designer..." (small, subtle)
- **Headline:** "Your Always-On Design & Development Partner" (DM Serif, huge)
- **Subhead:** "Ship websites, mobile apps..." (Inter, lighter)
- **CTAs:**
  - Primary: "Get Started" (bg-primary, #015450)
  - Secondary: "Book a 15-minute intro" (outline with teal border/text)

### Implementation
Use shadcnblocks centered hero block as base, customize content

---

## 4. All Sections Transformation

### Section Structure Template
```tsx
<section className="py-20 lg:py-32">
  <div className="container mx-auto px-6 lg:px-8">
    <div className="mx-auto max-w-4xl text-center">
      {/* Section content */}
    </div>
  </div>
</section>
```

### Problem Section
- **Block:** shadcnblocks feature block with icon cards
- **Layout:** 2x2 grid, centered
- **Icons:** X icons in red/muted
- **Cards:** Dark background, subtle border
- **Text:** Light gray

### Solution Section
- **Block:** shadcnblocks feature block
- **Layout:** 2x2 grid OR stacked cards
- **Icons:** Checkmarks in teal #015450
- **Headline:** "No meetings. No standups. Just async work in Linear."

### How It Works (5 Steps)
- **Block:** shadcnblocks timeline or process block
- **Layout:** Vertical, centered
- **Numbers:** Teal (#015450) circles with white text
- **Spacing:** 80px between steps
- **Content:** Linear workflow (Create issues → In Progress → Work → Review → Done)

### Services (What You Get)
- **Block:** shadcnblocks feature grid
- **Layout:** 2x2 on desktop, stack on mobile
- **Icons:** Muted, not colorful
- **Cards:** Dark, subtle hover states

### Pricing
- **Block:** shadcnblocks single-plan pricing block
- **Styling:** Dark card with teal border/accent
- **Features:** Checkmarks list, "Managed via Linear (no meetings)" highlighted
- **CTA:** Large teal button "Lock In Launch Pricing"
- **Secondary:** Ghost button "Talk to us first"

### About Chris Carter
- **Layout:** Centered or split (photo + text)
- **Photo:** Rounded container with subtle border
- **Text:** Centered or left-aligned
- **Badges:** "Full-Stack Developer" + "Product Designer" (no VP)

### FAQ
- **Block:** shadcnblocks accordion FAQ
- **Styling:** Dark theme with subtle borders
- **Content:** Linear workflow FAQs
- **CTA Below:** "Schedule a call" + "Email us"

### Final CTA
- **Block:** shadcnblocks CTA block
- **Headline:** "Stop Juggling Vendors. Start Shipping."
- **Buttons:** Primary + Teal accent side-by-side
- **Background:** Subtle radial gradient glow

### Footer
- **Layout:** Centered, minimal
- **Logo:** Centered at top
- **Links:** Terms, Privacy, Refund (horizontal row)
- **Copyright:** Small, centered below

---

## 5. Animations & Interactions

### Animation Updates
Refine existing FadeIn components:

```typescript
// Updated timing
duration: 0.7 // Was 0.5s
delay: stagger in 0.1s increments

// Subtler movement
translateY: 20px // Was 40px

// Smoother easing
ease: [0.25, 0.46, 0.45, 0.94] // Landio-like cubic-bezier
```

### Hover States
Buttons:
```css
transition: all 0.3s ease
hover: transform scale(1.02) + teal glow
```

Cards:
```css
transition: border-color 0.3s ease
hover: border brightens slightly
```

### Radial Gradients
Add glow effects:
```tsx
<div className="absolute inset-0 -z-10 opacity-20">
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px]" />
</div>
```

Use behind: Hero, Pricing, Final CTA sections

---

## 6. shadcnblocks Integration Strategy

### Block Selection Criteria
For each section, find blocks that:
1. Support dark theme
2. Have centered or centerable layouts
3. Match the minimal aesthetic
4. Include the component types we need (cards, accordions, etc.)

### Installation Process
```bash
export SHADCNBLOCKS_API_KEY=sk_live_z-BDxla9dwrNBu2JRJgKbr_nUji3S0MU

# Example installations (actual block names TBD during research)
npx shadcn add @shadcnblocks/hero-[number]
npx shadcn add @shadcnblocks/feature-[number]
npx shadcn add @shadcnblocks/pricing-[number]
npx shadcn add @shadcnblocks/faq-[number]
npx shadcn add @shadcnblocks/cta-[number]
```

### Customization After Install
Each block will need:
- Color variables updated to use #015450
- Content replaced with Design Dreams messaging
- Analytics hooks integrated
- Cal.com data attributes added to CTAs
- Spacing adjusted for Landio feel

---

## 7. Preserved Functionality

### Must Maintain
✅ All analytics tracking (12 Plausible events)
✅ Cal.com scheduling with official embed
✅ Scroll depth tracking
✅ Linear workflow messaging throughout
✅ Your professional photo
✅ Sentry error monitoring
✅ SEO metadata
✅ Web Vitals tracking
✅ Responsive design

### Integration Points
- Add `onClick={()=> trackEvent(...)}` to all shadcnblocks CTAs
- Add `data-cal-link` attributes to scheduling buttons
- Wrap shadcnblocks components with existing FadeIn animations
- Ensure shadcnblocks components are client components where needed

---

## 8. Implementation Phases

### Phase A: Foundation
1. Install DM Serif Display font in layout.tsx
2. Update globals.css with dark Landio color scheme
3. Configure Tailwind with dark-first approach
4. Add radial gradient utility classes
5. Test dark theme loads correctly

### Phase B: Header & Navigation
1. Update Header component to match Landio's fixed dark nav
2. Ensure logo works on dark background (brightness-0 invert if needed)
3. Style navigation links with muted-foreground
4. Add teal accent to active/hover states

### Phase C: Hero Section
1. Research shadcnblocks for centered dark hero blocks
2. Install selected hero block
3. Replace content with Design Dreams messaging
4. Add DM Serif to headline
5. Integrate Cal.com and analytics
6. Add radial gradient glow behind hero

### Phase D: Feature Sections
1. Install shadcnblocks feature/problem blocks
2. Customize for dark theme
3. Replace icons and content
4. Maintain Linear workflow messaging

### Phase E: Pricing & Services
1. Install shadcnblocks pricing block (single-plan variant)
2. Style with teal accent
3. Update feature list for Linear
4. Add scheduling CTA below

### Phase F: About, FAQ, Footer
1. Install shadcnblocks FAQ accordion
2. Style About section with centered photo
3. Update footer to minimal dark design
4. Add logo to footer

### Phase G: Polish & Testing
1. Refine animations to be more subtle
2. Add radial gradients to key sections
3. Test all analytics events
4. Verify Cal.com booking works
5. Run Playwright tests for responsiveness
6. Check accessibility (contrast ratios)

---

## 9. Success Criteria

✅ **Visual:** Matches Landio's dark, minimal, premium aesthetic
✅ **Functional:** All features work (analytics, booking, tracking)
✅ **Accessible:** WCAG AA contrast ratios met
✅ **Responsive:** Beautiful on mobile, tablet, desktop
✅ **Performance:** Lighthouse scores maintained ≥90
✅ **Content:** All Design Dreams messaging preserved with Linear workflow
✅ **Professional:** Uses shadcnblocks quality components throughout

---

## 10. Rollback Plan

If design doesn't work:
- Current version is committed (commit 860acde)
- Can revert with: `git reset --hard 860acde`
- Or create new branch for redesign first

---

## Notes

- shadcnblocks API key configured in components.json
- Cal.com official embed already integrated
- All analytics and tracking already functional
- This is a visual redesign maintaining all functionality
- Estimated time: 4-6 hours for complete transformation
