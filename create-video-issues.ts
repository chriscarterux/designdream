import { LinearClient } from '@linear/sdk';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  console.error('❌ LINEAR_API_KEY environment variable is not set');
  process.exit(1);
}

interface VideoIssue {
  title: string;
  priority: number;
  description: string;
  labels: string[];
}

const videoIssues: VideoIssue[] = [
  {
    title: '[VIDEO] Landing Page Hero - Value Proposition Showcase',
    priority: 1,
    labels: ['video', 'veo3', 'visual-content', 'landing-page'],
    description: `# Landing Page Hero Video

**Duration:** 15-30 seconds
**Aspect Ratio:** 16:9 (1920x1080)
**Frame Rate:** 60fps
**Resolution:** 4K (3840x2160)
**Priority:** P1

## Objective
Create an engaging hero video that immediately communicates Design Dreams' value proposition: unlimited design and development on subscription.

---

## Storyboard & Scene Breakdown

### Scene 1: Opening Hook (0-5s)
**Visual Concept:** Dynamic reveal of Design Dreams brand
**Veo3 Prompt:**
\`\`\`
Cinematic opening shot, smooth camera push forward through a minimalist modern office space with floating holographic design elements in purple and blue gradient colors, clean white environment with natural lighting, professional tech startup aesthetic, high production value, shallow depth of field, 4K ultra detailed, modern SaaS brand reveal
\`\`\`

**Text Overlay:**
- "Design Dreams" (brand name, fade in)
- "Unlimited Design + Development" (subtitle)

---

### Scene 2: Problem/Solution Transition (5-12s)
**Visual Concept:** Transformation from chaos to order
**Veo3 Prompt:**
\`\`\`
Split screen transition, left side showing cluttered messy design workflow with scattered papers and stressed designer, right side showing clean organized digital dashboard with smooth animations, purple to blue gradient background, seamless morph transition between chaos and order, cinematic lighting, professional SaaS commercial style, 4K resolution, smooth camera movement
\`\`\`

**Text Overlay:**
- Left: "Traditional Design Agencies" (fades out)
- Right: "One Flat Monthly Rate" (fades in)

---

### Scene 3: Service Showcase (12-22s)
**Visual Concept:** Quick cuts of services being delivered
**Veo3 Prompt:**
\`\`\`
Fast-paced montage sequence showing: 1) sleek website designs appearing on modern laptop screens with glowing edges, 2) mobile app interfaces floating in 3D space with smooth rotations, 3) AI-powered code generation with flowing particle effects, 4) brand identity elements arranging themselves in perfect grid layout, purple and blue color scheme, professional tech commercial aesthetic, dynamic camera movements, high-end production quality, 4K ultra detailed
\`\`\`

**Text Overlays (sequential):**
- "Web Design & Development"
- "Mobile Apps & AI Integration"
- "Brand Identity & Strategy"
- "All-in-One Subscription"

---

### Scene 4: Call to Action (22-30s)
**Visual Concept:** Clean, confident close with CTA
**Veo3 Prompt:**
\`\`\`
Elegant slow zoom out revealing complete Design Dreams dashboard interface on sleek ultrawide monitor in modern minimalist office, purple and blue accent lighting, professional product photography style, clean composition with negative space, premium tech brand aesthetic, soft bokeh background, 4K resolution, cinematic color grading
\`\`\`

**Text Overlay:**
- "Start Your Free Trial"
- "designdreams.com"

---

## Audio/Music Guidance
- **Genre:** Modern, upbeat electronic/corporate
- **Mood:** Confident, innovative, professional
- **Style:** Clean beats with subtle synth progression
- **Reference:** Tech startup launch videos (Apple, Notion style)
- **Volume Mix:** Music at 60%, sound effects at 40%

## Technical Specifications
- Export format: H.264, MP4
- Bitrate: 20 Mbps minimum
- Color space: Rec. 709
- Audio: AAC, 320kbps, stereo

## Deliverables
- [ ] 16:9 desktop version (1920x1080)
- [ ] 16:9 4K version (3840x2160)
- [ ] 1:1 square version for social (1080x1080)
- [ ] Source files for future editing

## Success Metrics
- Immediate value proposition clarity
- 80%+ viewer retention through 15 seconds
- Strong emotional response (modern, trustworthy)
- Clear CTA visibility`
  },

  {
    title: '[VIDEO] How It Works - Animated Process Explainer',
    priority: 1,
    labels: ['video', 'veo3', 'visual-content', 'explainer'],
    description: `# How It Works Animated Explainer

**Duration:** 60-90 seconds
**Aspect Ratio:** 16:9 (1920x1080)
**Frame Rate:** 30fps
**Resolution:** Full HD (1920x1080)
**Priority:** P1

## Objective
Create a clear, engaging animated explainer showing the 3-step process of working with Design Dreams.

---

## Storyboard & Scene Breakdown

### Scene 1: Introduction (0-8s)
**Visual Concept:** Clean title card with brand introduction
**Veo3 Prompt:**
\`\`\`
Professional title card with "How It Works" text emerging from center, purple to blue gradient background with subtle animated particles, modern minimalist design, clean typography, smooth fade-in animation, corporate explainer video style, 4K quality, professional color grading
\`\`\`

**Voiceover Script:**
"Getting started with Design Dreams is simple. Here's how it works."

**Text Overlay:**
- "How Design Dreams Works"

---

### Scene 2: Step 1 - Subscribe (8-28s)
**Visual Concept:** Subscription flow visualization
**Veo3 Prompt:**
\`\`\`
Animated sequence showing modern subscription interface on laptop screen, user cursor smoothly selecting pricing plan with purple highlight effect, credit card information flowing smoothly into form fields with elegant particle trails, checkmark animation confirming subscription, clean white interface with blue and purple accent colors, professional SaaS product demo style, smooth motion graphics, 4K resolution
\`\`\`

**Voiceover Script:**
"Step 1: Choose your plan and subscribe. Select from our flexible monthly or annual options. No contracts, cancel anytime."

**Text Overlays:**
- "Step 1: Subscribe"
- "Choose Your Plan"
- "Unlimited Requests"
- "Cancel Anytime"

---

### Scene 3: Step 2 - Request (28-50s)
**Visual Concept:** Request submission and management
**Veo3 Prompt:**
\`\`\`
Smooth camera movement following user journey through Design Dreams dashboard, design brief being typed in real-time with floating holographic preview elements, drag-and-drop file upload with elegant ripple effects, project board showing multiple requests organizing themselves automatically with smooth card animations, purple and blue UI elements, modern SaaS interface design, professional product demonstration, 4K detailed, clean composition
\`\`\`

**Voiceover Script:**
"Step 2: Submit unlimited design and development requests through our intuitive dashboard. Add details, upload assets, and track everything in one place."

**Text Overlays:**
- "Step 2: Request"
- "Submit Unlimited Projects"
- "Upload Assets & Briefs"
- "Real-Time Tracking"

---

### Scene 4: Step 3 - Receive (50-75s)
**Visual Concept:** Delivery and iteration process
**Veo3 Prompt:**
\`\`\`
Dynamic montage showing: 1) notification bell animation with glowing purple pulse, 2) completed designs appearing with smooth reveal animations, 3) feedback tools with annotation markers and comment bubbles, 4) revision cycles shown as smooth circular flow diagram with connected nodes, 5) final delivery with celebration micro-animation, modern SaaS platform aesthetic, professional motion graphics, blue and purple gradient accents, 4K resolution, clean professional style
\`\`\`

**Voiceover Script:**
"Step 3: Receive your designs within 48 hours. Review, request revisions, and iterate until perfect. Your dedicated team handles everything."

**Text Overlays:**
- "Step 3: Receive"
- "48-Hour Delivery"
- "Unlimited Revisions"
- "Dedicated Team"

---

### Scene 5: Closing CTA (75-90s)
**Visual Concept:** Final brand reinforcement
**Veo3 Prompt:**
\`\`\`
Wide cinematic shot revealing complete Design Dreams ecosystem, multiple project screens floating in organized 3D grid with gentle rotation, purple and blue lighting from below, professional tech brand reveal style, clean minimalist composition, smooth camera orbit movement, premium production quality, 4K resolution, elegant final frame
\`\`\`

**Voiceover Script:**
"Ready to transform your design workflow? Start your free trial today."

**Text Overlays:**
- "Start Your Free Trial"
- "designdreams.com"

---

## Audio/Music Guidance
- **Genre:** Corporate explainer music
- **Mood:** Friendly, informative, confident
- **Style:** Light piano or synth with steady rhythm
- **Voiceover:** Professional, warm, conversational tone
- **Reference:** Slack, Asana explainer videos
- **Volume Mix:** VO at 100%, music at 30%

## Technical Specifications
- Export format: H.264, MP4
- Bitrate: 15 Mbps
- Color space: Rec. 709
- Audio: AAC, 256kbps, stereo
- Subtitles: SRT file included

## Deliverables
- [ ] Full 90-second version with voiceover
- [ ] 60-second cut without VO (music only)
- [ ] Vertical 9:16 version for social media
- [ ] Subtitle/caption files (SRT)
- [ ] Individual step segments for landing page

## Success Metrics
- Clear understanding of 3-step process
- 70%+ completion rate
- Low bounce rate on How It Works page
- Increased trial sign-ups from page`
  },

  {
    title: '[VIDEO] Service Showcase - Design/Dev/AI Capabilities',
    priority: 2,
    labels: ['video', 'veo3', 'visual-content', 'services'],
    description: `# Service Showcase Video

**Duration:** 30-45 seconds
**Aspect Ratio:** 16:9 (1920x1080)
**Frame Rate:** 60fps
**Resolution:** 4K (3840x2160)
**Priority:** P2

## Objective
Highlight Design Dreams' comprehensive service offerings with visually stunning examples of design, development, and AI capabilities.

---

## Storyboard & Scene Breakdown

### Scene 1: Design Services (0-12s)
**Visual Concept:** Beautiful design work coming to life
**Veo3 Prompt:**
\`\`\`
Cinematic showcase of premium design work, starting with blank canvas transforming into beautiful website mockup with smooth morphing animation, layers of UI elements assembling themselves with elegant motion, color palettes flowing like liquid into interface components, typography animating with precision, purple and blue gradient accents, high-end design agency portfolio style, 4K ultra detailed, professional color grading, smooth camera movements
\`\`\`

**Text Overlays:**
- "Design Services"
- "Web Design • Branding • UI/UX"

**Mini-Descriptions:**
- Landing pages that convert
- Brand identities that stand out
- User experiences that delight

---

### Scene 2: Development Services (12-25s)
**Visual Concept:** Code transforming into functional products
**Veo3 Prompt:**
\`\`\`
Dynamic transition showing code editor with syntax-highlighted React/TypeScript code flowing smoothly into live rendered website interface, multiple device screens (desktop, tablet, mobile) appearing in 3D space showing responsive design in action, smooth cross-device animation synchronization, glowing connection lines between devices, purple and blue accent lighting, professional tech commercial style, 4K resolution, premium production quality
\`\`\`

**Text Overlays:**
- "Development Services"
- "Web Apps • Mobile • APIs"

**Mini-Descriptions:**
- Full-stack development
- Mobile-first responsive design
- Scalable cloud architecture

---

### Scene 3: AI Integration (25-38s)
**Visual Concept:** AI-powered features in action
**Veo3 Prompt:**
\`\`\`
Futuristic visualization of AI capabilities, neural network visualization with flowing data particles in purple and blue, automated code generation with typing effect showing AI assistance, chatbot interface responding with smooth message bubbles, machine learning model diagram with animated connections, holographic UI elements floating in space, cutting-edge tech aesthetic, professional AI product demo style, 4K ultra detailed, cinematic lighting
\`\`\`

**Text Overlays:**
- "AI Integration"
- "Chatbots • Automation • ML Models"

**Mini-Descriptions:**
- Custom AI solutions
- Intelligent automation
- Data-driven insights

---

### Scene 4: All-in-One Solution (38-45s)
**Visual Concept:** Everything coming together
**Veo3 Prompt:**
\`\`\`
Wide reveal shot showing all services integrated into unified Design Dreams platform, three distinct service sections merging into single cohesive dashboard interface, smooth camera pull-back revealing complete ecosystem, purple to blue gradient background, professional SaaS brand reveal, clean minimalist composition, premium tech commercial aesthetic, 4K resolution, elegant final frame with logo
\`\`\`

**Text Overlays:**
- "All-in-One Subscription"
- "Unlimited Design + Development"
- "Start Your Trial"

---

## Audio/Music Guidance
- **Genre:** Modern electronic with impact moments
- **Mood:** Impressive, capable, cutting-edge
- **Style:** Building intensity with section transitions
- **SFX:** Whoosh transitions, UI clicks, tech sounds
- **Reference:** Apple product videos, tech showcases
- **Volume Mix:** Music at 70%, SFX at 30%

## Technical Specifications
- Export format: H.264, MP4
- Bitrate: 25 Mbps
- Color space: Rec. 709
- Audio: AAC, 320kbps, stereo

## Deliverables
- [ ] Full 45-second version
- [ ] 30-second cut for ads
- [ ] 15-second teaser version
- [ ] Individual service sections (3x ~10s clips)
- [ ] 1:1 square version for Instagram

## Success Metrics
- Clear service differentiation
- Professional, high-end perception
- Increased services page engagement
- Higher perceived value`
  },

  {
    title: '[VIDEO] Dashboard Demo - Client Platform Walkthrough',
    priority: 2,
    labels: ['video', 'veo3', 'visual-content', 'product-demo'],
    description: `# Dashboard Demo Walkthrough

**Duration:** 45-60 seconds
**Aspect Ratio:** 16:9 (1920x1080)
**Frame Rate:** 30fps
**Resolution:** Full HD (1920x1080)
**Priority:** P2

## Objective
Demonstrate the Design Dreams client dashboard interface, showing how easy and intuitive it is to manage design and development projects.

---

## Storyboard & Scene Breakdown

### Scene 1: Dashboard Overview (0-10s)
**Visual Concept:** First impression of the dashboard
**Veo3 Prompt:**
\`\`\`
Smooth camera zoom into modern desktop computer screen showing Design Dreams dashboard login screen, elegant sign-in animation, dashboard home view revealing with fade-in effect, clean white interface with purple and blue accent colors, organized project cards in grid layout, sidebar navigation with subtle hover effects, professional SaaS platform design, 4K detailed UI, natural desk lighting
\`\`\`

**Text Overlays:**
- "Your Design Dreams Dashboard"
- "Manage Everything in One Place"

**Callouts:**
- Active projects overview
- Quick stats sidebar
- Navigation menu

---

### Scene 2: Creating a Request (10-25s)
**Visual Concept:** New project creation flow
**Veo3 Prompt:**
\`\`\`
Screen recording style footage showing cursor clicking "New Request" button with ripple animation effect, request form sliding in smoothly from right side, user typing project details in real-time with smooth text appearance, dropdown menus opening with elegant animations selecting "Web Design" category, file upload zone with drag-and-drop highlighting and progress bars, priority selection with radio button transitions, clean modern form design with purple accents, professional product demo aesthetic
\`\`\`

**Text Overlays:**
- "Create New Request"
- "Submit Unlimited Projects"

**Callouts:**
- Project type selection
- Asset upload
- Priority setting
- Detail requirements

---

### Scene 3: Project Management (25-40s)
**Visual Concept:** Managing active projects
**Veo3 Prompt:**
\`\`\`
Dynamic view of project board with multiple cards organizing themselves, status columns labeled "Requested," "In Progress," "Under Review," "Completed" with smooth card transitions between columns, clicking into project detail showing timeline view, progress indicators animating to show completion percentage, comment thread appearing with team communication, notification bell pulsing with new updates, modern kanban board aesthetic, professional project management UI, purple and blue status indicators
\`\`\`

**Text Overlays:**
- "Track Project Progress"
- "Real-Time Updates"

**Callouts:**
- Status tracking
- Team communication
- File versioning
- Activity timeline

---

### Scene 4: Review & Feedback (40-52s)
**Visual Concept:** Collaboration and revision process
**Veo3 Prompt:**
\`\`\`
Close-up screen interaction showing completed design appearing in preview panel, annotation tools activating with cursor creating comment markers on design with purple pins, feedback modal opening with comment thread, revision request button with smooth confirmation animation, before/after slider showing design iterations, approval checkmark animation with subtle celebration effect, professional design review tool interface, clean modern UI design
\`\`\`

**Text Overlays:**
- "Review & Request Revisions"
- "Unlimited Iterations"

**Callouts:**
- Inline annotations
- Revision history
- Approval workflow
- Download finals

---

### Scene 5: Closing Overview (52-60s)
**Visual Concept:** Dashboard ecosystem summary
**Veo3 Prompt:**
\`\`\`
Wide angle camera pull-back revealing entire dashboard interface with multiple sections visible, smooth transition showing mobile app version side-by-side with desktop, both interfaces synchronized with matching animations, purple to blue gradient overlay fading in with Design Dreams logo, professional product reveal style, clean minimalist composition, premium SaaS brand aesthetic, 4K resolution
\`\`\`

**Text Overlays:**
- "Available on Desktop & Mobile"
- "Start Managing Projects Today"

---

## Audio/Music Guidance
- **Genre:** Light corporate tech music
- **Mood:** Professional, efficient, user-friendly
- **Style:** Soft electronic with steady pulse
- **SFX:** UI clicks, whooshes, notification sounds
- **Reference:** Notion, Monday.com product demos
- **Volume Mix:** Music at 40%, UI sounds at 60%

## Technical Specifications
- Export format: H.264, MP4
- Bitrate: 12 Mbps
- Color space: Rec. 709
- Audio: AAC, 256kbps, stereo
- Mouse cursor: Highlighted for visibility

## Deliverables
- [ ] Full 60-second walkthrough
- [ ] 45-second condensed version
- [ ] GIF loops of key features (3-5 seconds each)
- [ ] Individual feature segments
- [ ] Mobile version demo (vertical)

## Success Metrics
- Clear platform usability demonstration
- Reduced support questions about workflow
- Increased trial-to-paid conversion
- Lower perceived complexity barrier`
  },

  {
    title: '[VIDEO] Client Testimonial - Template Structure',
    priority: 2,
    labels: ['video', 'veo3', 'visual-content', 'testimonial'],
    description: `# Client Testimonial Video Template

**Duration:** 30 seconds
**Aspect Ratio:** 16:9 (1920x1080) + 9:16 vertical
**Frame Rate:** 24fps (cinematic)
**Resolution:** 4K (3840x2160)
**Priority:** P2

## Objective
Create a reusable template structure for client testimonial videos that can be quickly populated with real client content. This template defines the visual style, structure, and Veo3 prompts for B-roll footage.

---

## Testimonial Structure Template

### Section 1: Client Introduction (0-8s)

**Testimonial Audio:** [Client Name], [Title] at [Company]
"We were struggling with [problem]..."

**Visual Concept:** Professional client environment
**Veo3 Prompt (B-roll):**
\`\`\`
Professional office environment cinematic B-roll, modern startup office with natural window lighting, clean desk setup with laptop showing design work, team collaboration in background slightly out of focus, corporate testimonial video aesthetic, neutral color palette with purple accent lighting subtly visible, shallow depth of field, 24fps cinematic look, 4K resolution, professional color grading
\`\`\`

**Text Overlay:**
- [Client Name]
- [Title], [Company Name]

**Visual Elements:**
- Lower third with name/title
- Company logo (small, corner placement)

---

### Section 2: The Problem (8-15s)

**Testimonial Audio:** [Client describes pain points]
"Traditional agencies were too expensive and slow..."

**Visual Concept:** Problem visualization (subtle, not negative)
**Veo3 Prompt (B-roll):**
\`\`\`
Cinematic sequence showing typical agency challenges in professional manner: calendar pages flipping rapidly suggesting long timelines, meeting room with concerned team reviewing project delays, budget spreadsheets with highlighted costs, professional documentary style, muted color palette, shallow focus, 24fps cinematic motion, 4K detailed, respectful problem visualization without negativity
\`\`\`

**Text Overlay:**
- "The Challenge" (optional subtitle)

**Visual Elements:**
- Subtle vignette
- Problem-related iconography (optional)

---

### Section 3: The Solution (15-23s)

**Testimonial Audio:** [Client describes Design Dreams experience]
"Design Dreams changed everything. The subscription model meant unlimited requests..."

**Visual Concept:** Positive transformation, working with Design Dreams
**Veo3 Prompt (B-roll):**
\`\`\`
Uplifting B-roll montage: laptop screen showing Design Dreams dashboard in use with smooth scrolling, team members smiling and discussing designs with energy, final website/app being demonstrated on multiple devices, successful product launch moment with team celebration, bright natural lighting, vibrant but professional color grading, purple and blue brand colors subtly integrated, 24fps cinematic style, 4K resolution, positive emotional tone
\`\`\`

**Text Overlays:**
- "The Design Dreams Solution"
- Key benefit callouts: "Unlimited Requests" / "48hr Delivery" / "Flat Rate"

**Visual Elements:**
- Design Dreams logo integration
- Dashboard UI glimpses
- Before/after design comparisons (if available)

---

### Section 4: The Results (23-30s)

**Testimonial Audio:** [Client describes outcomes]
"We launched 3 websites in 2 months. Best investment we've made."

**Visual Concept:** Success and results
**Veo3 Prompt (B-roll):**
\`\`\`
Success visualization B-roll: analytics dashboards showing upward trending graphs and positive metrics, finished product being used by end users with satisfied expressions, team celebrating project completion, high-five or handshake moments, professional success story documentary style, bright optimistic lighting, purple and blue accent colors in environment, 24fps cinematic quality, 4K resolution, inspirational positive energy
\`\`\`

**Text Overlays:**
- Key metrics/results: "3 Websites in 2 Months"
- ROI or time savings stats

**Closing Frame:**
- Design Dreams logo
- "Start Your Free Trial" CTA
- designdreams.com

---

## Template Variations

### Variation A: Tech Startup Client
**Industry-Specific B-roll Prompt:**
\`\`\`
Modern tech startup office aesthetic, open floor plan with standing desks, multiple monitors displaying code and designs, product team collaborating on whiteboard with wireframes, contemporary office furniture with purple accent pillows and decor, natural light through large windows, professional tech company environment, 24fps cinematic, 4K detailed
\`\`\`

### Variation B: E-commerce Client
**Industry-Specific B-roll Prompt:**
\`\`\`
E-commerce business environment B-roll, product photography setup with lighting equipment, online store interface being browsed on laptop showing shopping cart flow, warehouse or fulfillment area in background, product packaging with branding, professional retail business aesthetic, clean modern environment with purple brand integration, 24fps cinematic, 4K resolution
\`\`\`

### Variation C: Agency/Creative Client
**Industry-Specific B-roll Prompt:**
\`\`\`
Creative agency atmosphere, design studio with mood boards and sketches on walls, designers working on dual monitor setups with creative software visible, brand identity materials spread on desk, client presentation setup, inspiring creative workspace with plants and art, purple accent lighting, professional creative industry aesthetic, 24fps cinematic style, 4K detailed
\`\`\`

---

## Interview Recording Guidelines

**Setup Requirements:**
- Clean, professional background (office or neutral)
- Natural window light + soft fill light
- Lapel microphone for clear audio
- 4K camera, 24fps
- Eye-line slightly off-camera for natural feel

**Interview Questions (select 3-4):**
1. What challenges were you facing before Design Dreams?
2. What made you choose Design Dreams over alternatives?
3. Describe your experience working with the team.
4. What specific results have you achieved?
5. How has Design Dreams impacted your business?
6. Would you recommend Design Dreams? Why?

---

## Audio/Music Guidance
- **Genre:** Soft inspirational corporate
- **Mood:** Uplifting, genuine, trustworthy
- **Style:** Light piano or acoustic guitar base
- **Volume Mix:** Testimonial audio at 100%, music at 20%
- **Audio Processing:**
  - Light compression
  - Noise reduction
  - EQ for voice clarity
  - Room tone underneath

## Technical Specifications
- Export format: H.264, MP4
- Bitrate: 20 Mbps
- Color space: Rec. 709
- Audio: AAC, 320kbps, stereo
- Subtitle file: SRT (for accessibility)

## Deliverables (Per Testimonial)
- [ ] 16:9 landscape version (30s)
- [ ] 9:16 vertical version (30s) for Stories/Reels
- [ ] 1:1 square version (30s) for Instagram feed
- [ ] 15-second cut of best moment
- [ ] Quote cards (3-4 still frames with key quotes)
- [ ] Subtitle files (SRT)

## Production Checklist
- [ ] Client consent form signed
- [ ] Logo files received
- [ ] Company colors/brand guide reviewed
- [ ] B-roll shot list customized for industry
- [ ] Interview scheduled and confirmed
- [ ] Equipment tested
- [ ] Backup recording devices ready

## Success Metrics
- Authentic, relatable delivery
- Clear problem → solution → results arc
- Strong social proof for landing page
- Increased trust and credibility
- High engagement on social platforms`
  },

  {
    title: '[VIDEO] Social Media Teaser - Instagram/TikTok Vertical',
    priority: 3,
    labels: ['video', 'veo3', 'visual-content', 'social-media'],
    description: `# Social Media Teaser Video

**Duration:** 15 seconds
**Aspect Ratio:** 9:16 vertical (1080x1920)
**Frame Rate:** 30fps
**Resolution:** Full HD vertical (1080x1920)
**Priority:** P3

## Objective
Create attention-grabbing 15-second vertical video optimized for Instagram Reels, TikTok, and Stories that drives traffic to Design Dreams.

---

## Storyboard & Scene Breakdown

### Scene 1: Hook (0-3s)
**Visual Concept:** Immediate attention-grabber
**Veo3 Prompt:**
\`\`\`
Vertical 9:16 format, extreme close-up of hand swiping on smartphone revealing Design Dreams app interface with smooth transition animation, screen glowing with purple and blue gradient lighting reflecting on face in darkened room, cinematic vertical video aesthetic, TikTok/Reels style, high contrast dramatic lighting, 1080x1920 vertical resolution, engaging mobile-first composition
\`\`\`

**Text Overlay (Large, Bold):**
- "POV: You just found"
- "unlimited design + dev"

**Hook Strategy:**
- First 1 second must stop scroll
- Relatable scenario
- Curiosity gap

---

### Scene 2: Value Prop (3-9s)
**Visual Concept:** Fast-paced benefit showcase
**Veo3 Prompt:**
\`\`\`
Vertical format rapid-fire montage: 1) laptop showing stunning website design materializing with snap animation, 2) mobile phone displaying sleek app interface with smooth swipe interactions, 3) dashboard showing "unlimited requests" with check marks appearing, 4) "$2,995/mo" price tag with glow effect, all shots composed for 9:16 vertical framing, dynamic quick cuts every 1.5 seconds, purple and blue color scheme, modern social media content style, high energy pacing, 1080x1920 resolution
\`\`\`

**Text Overlays (Quick succession):**
- "Unlimited requests ✓"
- "48hr turnaround ✓"
- "One flat rate ✓"
- "$2,995/month"

**Visual Strategy:**
- Maximum 2 seconds per shot
- Bold, large text (readable on mobile)
- Emoji use for engagement

---

### Scene 3: Call to Action (9-15s)
**Visual Concept:** Direct CTA with urgency
**Veo3 Prompt:**
\`\`\`
Vertical format close-up shot of hand pointing at screen showing "Start Free Trial" button with glowing purple outline, finger hovering over button creating anticipation, subtle parallax movement of Design Dreams logo in background, clean white interface design optimized for vertical mobile viewing, call-to-action focused composition, modern social media advertisement style, 1080x1920 vertical resolution, professional yet approachable aesthetic
\`\`\`

**Text Overlays:**
- "Free Trial"
- "Link in bio →"
- "designdreams.com"

**CTA Elements:**
- Arrow pointing to bio area
- Urgency indicator (limited spots, etc.)
- Clear next step

---

## Platform-Specific Variations

### Instagram Reels Version
**Optimizations:**
- Add Instagram-style text effects
- Music synced to platform trends
- Hashtag strategy in caption
- First frame optimized for feed preview

### TikTok Version
**Optimizations:**
- More rapid pacing (faster cuts)
- Trending sound integration
- Text speech overlay option
- Hook adapted to TikTok conventions

### Stories Version
**Optimizations:**
- Add "Swipe Up" CTA sticker
- Poll sticker: "Need unlimited design?"
- Question sticker engagement
- Interactive elements throughout

---

## Content Variations (5 Different Angles)

### Variation 1: Pain Point Focus
**Hook:** "Tired of paying $10k for one website?"
**Body:** Show Design Dreams alternative
**CTA:** "Get unlimited for less"

### Variation 2: FOMO/Social Proof
**Hook:** "500+ companies switched to this"
**Body:** Show dashboard and happy clients
**CTA:** "Join the waitlist"

### Variation 3: Before/After
**Hook:** "We upgraded their entire brand"
**Body:** Quick before/after design showcase
**CTA:** "Start your glow-up"

### Variation 4: Day in the Life
**Hook:** "POV: You're a Design Dreams client"
**Body:** Show ease of submitting and receiving
**CTA:** "Try it free"

### Variation 5: Founder Story
**Hook:** "I built this because agencies suck"
**Body:** Personal founder message
**CTA:** "Support our mission"

---

## Audio/Music Guidance
- **Genre:** Trending social media music
- **Mood:** Energetic, modern, attention-grabbing
- **Style:** Popular sounds from target platform
- **Strategy:**
  - Use trending audio for algorithm boost
  - Sync cuts to beat drops
  - Consider voiceover for some versions
  - Music must work without sound (captions!)

**Platform Music Strategy:**
- Instagram: Licensed library or trending sounds
- TikTok: Trending sounds for discoverability
- Stories: Less critical, can be original

## Technical Specifications
- Export format: H.264, MP4
- Bitrate: 8 Mbps (optimized for mobile)
- Color space: Rec. 709
- Audio: AAC, 128kbps, stereo
- Vertical: 1080x1920 (9:16)
- File size: Under 30MB for fast loading

## Deliverables
- [ ] Instagram Reels version (15s)
- [ ] TikTok version (15s)
- [ ] Instagram Stories version (15s)
- [ ] 5 content variations per platform
- [ ] SRT subtitle files
- [ ] Thumbnail stills for feed preview

## Caption Templates

**Instagram:**
\`\`\`
Unlimited design + development for one flat rate? 🤯

Here's what you get:
✓ Unlimited design requests
✓ Unlimited dev projects
✓ 48-hour turnaround
✓ Dedicated team
✓ Cancel anytime

All for $2,995/month. No contracts. No surprises.

Try it free → Link in bio

#design #webdesign #development #saas #startup #branding #designer #webdeveloper
\`\`\`

**TikTok:**
\`\`\`
unlimited design & dev for $3k/month?? where was this when i was paying $10k per project 😭

#designtips #webdesign #businesstips #startup #entrepreneur #designagency #saas
\`\`\`

## Success Metrics
- Hook rate (3-second retention) > 50%
- Completion rate > 40%
- Click-through rate to link > 8%
- Save/share rate > 5%
- Comment engagement

## Testing Strategy
- A/B test different hooks (5 versions)
- Test with/without trending audio
- Test different CTA copy
- Analyze which variation drives most traffic
- Iterate based on metrics weekly`
  },

  {
    title: '[VIDEO] Email Campaign - New Feature/Product Announcement',
    priority: 3,
    labels: ['video', 'veo3', 'visual-content', 'email-marketing'],
    description: `# Email Campaign Video

**Duration:** 20-30 seconds
**Aspect Ratio:** 16:9 (1920x1080)
**Frame Rate:** 30fps
**Resolution:** Full HD (1920x1080)
**Priority:** P3

## Objective
Create engaging video content for email campaigns announcing new features, updates, or promotions. Optimized for email client compatibility and fast loading.

---

## Storyboard & Scene Breakdown

### Scene 1: Announcement Intro (0-6s)
**Visual Concept:** Exciting reveal of news
**Veo3 Prompt:**
\`\`\`
Professional email announcement style opening, animated envelope opening with smooth unfold animation revealing glowing content inside, purple and blue gradient light beams emerging from opened envelope, "What's New" text appearing with elegant fade and scale animation, modern email marketing aesthetic, clean white background with subtle gradient, professional corporate style, optimized for small email preview size
\`\`\`

**Text Overlay:**
- "Exciting News!"
- "New Feature Alert"

**Visual Strategy:**
- Immediate clarity of purpose
- Professional but exciting tone
- Brand colors prominent

---

### Scene 2: Feature/Update Showcase (6-20s)
**Visual Concept:** Demonstrate the new feature or announcement
**Veo3 Prompt:**
\`\`\`
Clean product demo showing new Design Dreams feature on laptop screen, smooth zoom into dashboard interface revealing new functionality with highlight animations and callout badges, cursor interacting with new feature showing intuitive use, purple glow effects emphasizing new UI elements, before/after split screen showing improvement, professional SaaS product update announcement style, email-optimized composition with clear focal points, 1920x1080 resolution
\`\`\`

**Text Overlays:**
- "[Feature Name] is Here"
- Key benefit bullets with check marks
- "3x Faster" or other metrics

**Showcase Elements:**
- Feature highlight with annotation
- Benefit callouts
- Quick win demonstration
- User value clarity

---

### Scene 3: Call to Action (20-30s)
**Visual Concept:** Clear next step
**Veo3 Prompt:**
\`\`\`
Clean CTA frame showing prominent button with "Try It Now" or "Learn More" text, button with subtle pulse animation drawing attention, Design Dreams dashboard interface visible in background with slight blur, professional email marketing style, clear visual hierarchy with button as focal point, purple and blue brand colors, simple composition optimized for email viewing, 1920x1080 resolution
\`\`\`

**Text Overlays:**
- "Start Using [Feature]"
- "Available Now in Your Dashboard"
- "Learn More →"

**CTA Elements:**
- Large, clear button
- No confusion about next step
- Sense of immediacy

---

## Email Video Best Practices

### Technical Optimization
- **File Size:** Under 1MB for fast loading
- **Autoplay:** Design for muted autoplay
- **Thumbnail:** First frame must be compelling
- **Fallback:** Animated GIF version for unsupported clients
- **Loading Time:** Must load in < 3 seconds on slow connections

### Email Client Compatibility
- Test in: Gmail, Outlook, Apple Mail, Yahoo
- GIF fallback for clients that block video
- Link to hosted version for full experience
- Text alternative for accessibility

---

## Campaign Variation Templates

### Variation 1: New Feature Launch
**Subject Line:** "You asked, we built it: [Feature Name]"
**Video Focus:** Feature demonstration and benefits
**CTA:** "Try It Now"

**Veo3 Prompt Adaptation:**
\`\`\`
Feature-focused showcase starting with customer feedback quotes floating on screen, transition to development process visualization with code and design merging, reveal of finished feature with smooth unveiling animation, users interacting with feature successfully, professional product launch video style, purple and blue branding, email-optimized pacing
\`\`\`

---

### Variation 2: Limited-Time Promotion
**Subject Line:** "48-hour flash sale: 20% off annual plans"
**Video Focus:** Urgency and savings visualization
**CTA:** "Claim Your Discount"

**Veo3 Prompt Adaptation:**
\`\`\`
Urgency-focused animation with countdown timer prominent in frame, pricing comparison showing savings with animated dollar signs, annual plan benefits appearing with check marks, limited spots indicator with decreasing number animation, vibrant colors to convey excitement, professional email promotion style, clear value proposition visualization
\`\`\`

---

### Variation 3: Case Study/Success Story
**Subject Line:** "How [Client] launched 3 websites in 2 months"
**Video Focus:** Customer success and results
**CTA:** "Read Full Story"

**Veo3 Prompt Adaptation:**
\`\`\`
Customer success story visualization showing growth metrics appearing as animated bar charts and line graphs trending upward, website mockups of client work displayed elegantly, testimonial quote appearing with client photo and company logo, professional case study video style, data visualization focus, trustworthy and credible aesthetic
\`\`\`

---

### Variation 4: Educational Content
**Subject Line:** "Quick tip: How to write better design briefs"
**Video Focus:** Value-first educational snippet
**CTA:** "Watch Full Tutorial"

**Veo3 Prompt Adaptation:**
\`\`\`
Educational quick tip format showing design brief template on screen with key sections highlighting one by one, before/after examples of vague vs specific briefs, animated checkpoints for best practices, professional educational video style, clean whiteboard animation aesthetic, helpful and instructive tone
\`\`\`

---

### Variation 5: Product Update Roundup
**Subject Line:** "Your monthly Design Dreams update"
**Video Focus:** Multiple small updates showcased quickly
**CTA:** "See All Updates"

**Veo3 Prompt Adaptation:**
\`\`\`
Quick-paced monthly update montage showing 3-4 small improvements, each feature appearing in grid format with icon and label, smooth transitions between features, dashboard interface showing improvements highlighted with purple glow effects, professional product update newsletter style, efficient information delivery
\`\`\`

---

## Audio/Music Guidance
- **Genre:** Light, modern corporate
- **Mood:** Appropriate to announcement type (exciting, helpful, urgent)
- **Style:** Minimal instrumentation for email context
- **Volume:** Music bed at 30% (video may play muted)
- **SFX:** Subtle UI sounds, notification tones

**Important:** Must work perfectly WITHOUT audio (most email videos play muted)

## Technical Specifications
- Export format: H.264, MP4 (highly compressed)
- Bitrate: 2-3 Mbps (email-optimized)
- Color space: Rec. 709
- Audio: AAC, 128kbps, stereo (optional)
- File size target: 800KB - 1MB maximum
- Alternative: Animated GIF (under 1MB)

## Deliverables
- [ ] Full video (20-30s MP4)
- [ ] Compressed email version (<1MB)
- [ ] Animated GIF fallback
- [ ] Thumbnail image (first frame)
- [ ] Hosted video landing page
- [ ] Multiple campaign variations (5 types)

## Email Integration Code
\`\`\`html
<!-- Video with GIF fallback -->
<div class="video-container">
  <video autoplay loop muted playsinline poster="thumbnail.jpg">
    <source src="email-video.mp4" type="video/mp4">
    <img src="animated-fallback.gif" alt="Feature announcement">
  </video>
  <a href="https://designdreams.com/feature" style="display:block;">
    Click to learn more →
  </a>
</div>
\`\`\`

## A/B Testing Strategy
- Test video vs. static image in email
- Test different thumbnail images
- Test placement (top vs. middle of email)
- Test with/without border/frame
- Test different CTA button colors

## Success Metrics
- Email open rate increase (target: +15%)
- Video play rate (target: 40%+)
- Click-through rate to CTA (target: 8%+)
- Landing page conversion improvement
- Lower unsubscribe rate vs. text-only emails

## Production Efficiency Tips
- Create template structure for reuse
- Build library of reusable animations
- Standardize aspect ratios and formats
- Automate compression workflow
- Batch produce multiple variations`
  }
];

async function createIssues() {
  const client = new LinearClient({ apiKey: LINEAR_API_KEY });

  console.log('🎬 Creating Linear issues for Design Dreams videos...\n');

  // Get team and project
  const teams = await client.teams();
  const team = teams.nodes.find(t => t.name === 'Howdycarter');

  if (!team) {
    throw new Error('Team "Howdycarter" not found');
  }

  const projects = await client.projects();
  const project = projects.nodes.find(p => p.name === 'Design Dream');

  if (!project) {
    throw new Error('Project "Design Dream" not found');
  }

  // Create labels if they don't exist
  const existingLabels = await client.issueLabels();
  const labelNames = ['video', 'veo3', 'visual-content', 'landing-page', 'explainer', 'services', 'product-demo', 'testimonial', 'social-media', 'email-marketing'];

  const labelMap: Record<string, string> = {};

  for (const labelName of labelNames) {
    let label = existingLabels.nodes.find(l => l.name === labelName);

    if (!label) {
      console.log(`Creating label: ${labelName}`);
      const created = await client.createIssueLabel({
        name: labelName,
        teamId: team.id,
        color: labelName === 'video' ? '#9333EA' : labelName === 'veo3' ? '#3B82F6' : '#8B5CF6'
      });
      label = await created.issueLabel;
    }

    if (label) {
      labelMap[labelName] = label.id;
    }
  }

  const createdIssues: Array<{ title: string; url: string; priority: number }> = [];

  // Create issues
  for (const issueData of videoIssues) {
    console.log(`\n📝 Creating issue: ${issueData.title}`);

    const labelIds = issueData.labels
      .map(label => labelMap[label])
      .filter(Boolean);

    const issue = await client.createIssue({
      title: issueData.title,
      description: issueData.description,
      teamId: team.id,
      projectId: project.id,
      priority: issueData.priority,
      labelIds: labelIds,
    });

    const createdIssue = await issue.issue;

    if (createdIssue) {
      createdIssues.push({
        title: issueData.title,
        url: createdIssue.url,
        priority: issueData.priority
      });
      console.log(`✓ Created: ${createdIssue.url}`);
    }
  }

  // Summary report
  console.log('\n' + '='.repeat(80));
  console.log('🎉 VIDEO PRODUCTION ISSUES CREATED SUCCESSFULLY');
  console.log('='.repeat(80));
  console.log(`\nTotal Issues Created: ${createdIssues.length}/7`);
  console.log('\nBreakdown by Priority:');
  console.log(`  P1 (Critical): ${createdIssues.filter(i => i.priority === 1).length} issues`);
  console.log(`  P2 (High):     ${createdIssues.filter(i => i.priority === 2).length} issues`);
  console.log(`  P3 (Medium):   ${createdIssues.filter(i => i.priority === 3).length} issues`);

  console.log('\n📋 ISSUE SUMMARY:\n');

  const p1Issues = createdIssues.filter(i => i.priority === 1);
  const p2Issues = createdIssues.filter(i => i.priority === 2);
  const p3Issues = createdIssues.filter(i => i.priority === 3);

  console.log('🔴 P1 - CRITICAL (Launch Blockers):');
  p1Issues.forEach(issue => {
    console.log(`  • ${issue.title}`);
    console.log(`    ${issue.url}`);
  });

  console.log('\n🟡 P2 - HIGH (Core Content):');
  p2Issues.forEach(issue => {
    console.log(`  • ${issue.title}`);
    console.log(`    ${issue.url}`);
  });

  console.log('\n🟢 P3 - MEDIUM (Marketing Assets):');
  p3Issues.forEach(issue => {
    console.log(`  • ${issue.title}`);
    console.log(`    ${issue.url}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('📊 PRODUCTION OVERVIEW');
  console.log('='.repeat(80));

  const totalScenes = [
    { name: 'Landing Page Hero', scenes: 4, duration: '15-30s' },
    { name: 'How It Works Explainer', scenes: 5, duration: '60-90s' },
    { name: 'Service Showcase', scenes: 4, duration: '30-45s' },
    { name: 'Dashboard Demo', scenes: 5, duration: '45-60s' },
    { name: 'Testimonial Template', scenes: 4, duration: '30s' },
    { name: 'Social Media Teaser', scenes: 3, duration: '15s' },
    { name: 'Email Campaign', scenes: 3, duration: '20-30s' }
  ];

  console.log('\nVideo Breakdown:');
  totalScenes.forEach(video => {
    console.log(`  ${video.name}:`);
    console.log(`    • ${video.scenes} scenes`);
    console.log(`    • ${video.duration} duration`);
    console.log(`    • ${video.scenes} Veo3 prompts required`);
  });

  const totalSceneCount = totalScenes.reduce((acc, v) => acc + v.scenes, 0);
  console.log(`\n📹 Total Scenes/Veo3 Prompts: ${totalSceneCount}`);
  console.log(`🎬 Total Videos: ${totalScenes.length}`);
  console.log(`⏱️  Total Content Duration: ~4-6 minutes`);

  console.log('\n' + '='.repeat(80));
  console.log('🎯 NEXT STEPS');
  console.log('='.repeat(80));
  console.log(`
1. Review each issue in Linear for detailed storyboards and Veo3 prompts
2. Start with P1 issues (Landing Page Hero & How It Works)
3. Generate B-roll footage using provided Veo3 prompts
4. Review generated footage and iterate as needed
5. Proceed to audio/music selection and editing
6. Export in specified formats for each platform

All issues include:
  ✓ Complete scene breakdowns
  ✓ Ready-to-use Veo3 prompts
  ✓ Technical specifications
  ✓ Audio/music guidance
  ✓ Delivery requirements
  ✓ Success metrics
`);

  console.log('='.repeat(80));
  console.log('✨ Ready to start video production with Google Veo3!');
  console.log('='.repeat(80) + '\n');
}

createIssues().catch(console.error);
