import { LinearClient } from '@linear/sdk';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  console.error('❌ LINEAR_API_KEY environment variable is not set');
  process.exit(1);
}

const client = new LinearClient({ apiKey: LINEAR_API_KEY });

interface GraphicIssue {
  title: string;
  description: string;
  midjourneyPrompt: string;
  specs: {
    size: string;
    format: string;
    style: string;
  };
  priority: 1 | 2 | 3;
  location: string;
}

const graphicsIssues: GraphicIssue[] = [
  {
    title: '[GRAPHICS] Landing Page Hero - Main Illustration',
    location: 'Landing Page Hero Section',
    priority: 1,
    description: `Create the main hero illustration for the Design Dreams landing page. This is the first thing visitors see and needs to convey:
- Unlimited design + development concept
- Speed and efficiency
- Professional quality
- Modern SaaS aesthetic
- Trust and reliability

The illustration should support the headline "Unlimited Design & Development for $4,495/month" and show the value of having a dedicated design+dev team on-demand.`,
    midjourneyPrompt: `A modern, minimalist illustration showing a collaborative workspace where design and development merge seamlessly. Feature abstract representations of design tools (Figma frames, color palettes, typography) flowing into code elements (terminal windows, component trees). Use a vibrant purple and blue gradient (#6E56CF to #3B82F6) as primary colors with white/light gray accents. Include subtle geometric shapes and flowing lines connecting design to development. Clean, professional style with depth and dimensionality. Isometric perspective, soft shadows, glassmorphism elements. No people, focus on tools and workflow. 16:9 aspect ratio, high detail, polished finish. --v 6 --ar 16:9 --style raw --s 250`,
    specs: {
      size: '1920x1080px (16:9)',
      format: 'PNG with transparency, also export WebP',
      style: 'Modern minimal, purple/blue gradient, isometric 3D elements'
    }
  },
  {
    title: '[GRAPHICS] How It Works - Step 1: Subscribe Illustration',
    location: 'Landing Page - How It Works Section',
    priority: 1,
    description: `Create an illustration for Step 1 of the "How It Works" process: Subscribe
- Shows the simplicity of getting started
- Conveys the subscription model
- Should feel welcoming and easy
- Icon/illustration style that matches the hero

Supports text: "Choose your plan and subscribe in minutes. No contracts, cancel anytime."`,
    midjourneyPrompt: `A clean, minimal icon-style illustration of a subscription activation moment. Show a simplified dashboard interface with a glowing "Start" or "Subscribe" button being clicked. Incorporate a checkmark or success indicator with a subtle celebration effect (confetti, sparkles). Use purple (#6E56CF) as the primary color with blue accents. Flat design with subtle gradients and soft shadows. Include abstract credit card or payment element in background. Square composition, centered focal point. --v 6 --ar 1:1 --style raw --s 200`,
    specs: {
      size: '800x800px (1:1)',
      format: 'PNG with transparency',
      style: 'Flat illustration, icon-style, purple primary color'
    }
  },
  {
    title: '[GRAPHICS] How It Works - Step 2: Submit Requests Illustration',
    location: 'Landing Page - How It Works Section',
    priority: 1,
    description: `Create an illustration for Step 2 of the "How It Works" process: Submit Requests
- Shows the request submission interface
- Conveys unlimited requests
- Should show variety (design, dev, AI)
- Emphasizes ease and clarity

Supports text: "Submit unlimited requests via your dashboard. Design, development, or AI automation - we handle it all."`,
    midjourneyPrompt: `A stylized illustration of a request board or queue interface with multiple colorful cards/tickets floating or stacking. Each card should have different icons representing design (paintbrush/palette), development (code brackets), and AI (brain/sparkles). Show cards being added with a plus symbol or drag motion. Use purple (#6E56CF) and blue gradient accents. Include subtle drag-and-drop trails or motion lines. Isometric or 2.5D perspective. Clean, organized layout with a sense of flow and movement. --v 6 --ar 1:1 --style raw --s 200`,
    specs: {
      size: '800x800px (1:1)',
      format: 'PNG with transparency',
      style: 'Flat/2.5D illustration, purple/blue palette, icon elements'
    }
  },
  {
    title: '[GRAPHICS] How It Works - Step 3: Get Deliverables Illustration',
    location: 'Landing Page - How It Works Section',
    priority: 1,
    description: `Create an illustration for Step 3 of the "How It Works" process: Get Deliverables
- Shows completed work being delivered
- Conveys quality and professionalism
- Should feel satisfying and complete
- Emphasizes fast turnaround (48hr)

Supports text: "Receive high-quality deliverables within 48 hours. Review, request revisions, and approve."`,
    midjourneyPrompt: `An elegant illustration showing a delivery or completion moment. Feature a package/gift box opening or a document/file being delivered with a checkmark and approval badge. Include visual elements like Figma file icons, code files, or design assets emerging with a subtle glow or celebration effect. Use purple (#6E56CF) as primary with gold/yellow accents for the success/completion feeling. Include a clock or timer element showing speed. Clean, polished aesthetic with depth. --v 6 --ar 1:1 --style raw --s 200`,
    specs: {
      size: '800x800px (1:1)',
      format: 'PNG with transparency',
      style: 'Flat illustration with depth, purple/gold accents'
    }
  },
  {
    title: '[GRAPHICS] Dashboard Mockup - Client Queue View',
    location: 'Landing Page & Dashboard Preview Section',
    priority: 2,
    description: `Create a realistic mockup/screenshot of the client dashboard showing the queue/kanban board view.
- Show the kanban board with columns (Backlog, In Progress, Review, Done)
- Include example request cards with realistic titles
- Show the clean, modern UI with purple accents
- Should convey organization and clarity
- Can be used on landing page to show the actual product

This should look like a polished interface design, not just an illustration.`,
    midjourneyPrompt: `A photorealistic UI mockup of a modern SaaS dashboard showing a kanban-style project board. Four columns labeled "Backlog", "In Progress", "Review", "Done" with colorful cards in each. Cards have titles like "Logo Redesign", "Website Updates", "API Integration". Clean white background with purple (#6E56CF) accent colors for buttons and highlights. Include subtle shadows and depth. Modern sans-serif typography. Sidebar navigation on left. Professional, polished interface design similar to Linear or Notion. --v 6 --ar 16:9 --style raw --s 250`,
    specs: {
      size: '1920x1080px (16:9)',
      format: 'PNG, also export at 2x for retina',
      style: 'Photorealistic UI mockup, purple accents, modern SaaS aesthetic'
    }
  },
  {
    title: '[GRAPHICS] Dashboard Mockup - Request Submission Form',
    location: 'Landing Page Product Preview',
    priority: 2,
    description: `Create a realistic mockup of the request submission form interface.
- Show the form with fields (title, description, type, priority, attachments)
- Clean, modern form design with purple accents
- Show file upload area with drag-and-drop
- Should feel easy and inviting to use

This demonstrates how simple it is to submit requests.`,
    midjourneyPrompt: `A clean, modern UI mockup of a form interface for submitting design/dev requests. Show input fields with labels like "Request Title", "Description" (text area), "Type" (dropdown), "Priority" (radio buttons), and a drag-and-drop file upload zone with a dashed border and upload icon. Use purple (#6E56CF) for the primary submit button and form accents. White/light gray background. Include subtle field focus states and micro-interactions. Professional typography. Modern web form design. --v 6 --ar 16:9 --style raw --s 250`,
    specs: {
      size: '1920x1080px (16:9)',
      format: 'PNG with retina version',
      style: 'UI mockup, clean form design, purple CTA'
    }
  },
  {
    title: '[GRAPHICS] Service Icons Set - Design, Dev, AI',
    location: 'Landing Page Services Section',
    priority: 1,
    description: `Create a cohesive set of 3 service icons representing:
1. Design (UI/UX, graphics, branding)
2. Development (web, mobile, code)
3. AI/Automation (automation, AI integration)

Icons should be:
- Consistent style across all three
- Simple and recognizable
- Use the purple color palette
- Work well at various sizes
- Modern and professional`,
    midjourneyPrompt: `A set of three minimalist, modern icons in a consistent style. First icon: overlapping rectangles/frames representing design/UI with a color palette swatch. Second icon: code brackets or terminal window representing development. Third icon: neural network nodes or sparkles/stars representing AI/automation. Use purple (#6E56CF) as primary color with gradient effects. Line-based or semi-filled icon style. Clean, geometric, professional. White background. Each icon should be recognizable and cohesive with the others. --v 6 --ar 3:1 --style raw --s 200`,
    specs: {
      size: '400x400px each icon (export as set and individually)',
      format: 'SVG preferred, also PNG with transparency',
      style: 'Line icons with purple fills/gradients, consistent style'
    }
  },
  {
    title: '[GRAPHICS] Social Media Template - Instagram/LinkedIn Announcement',
    location: 'Marketing Assets',
    priority: 3,
    description: `Create a social media post template for announcing Design Dreams launch or sharing content.
- Square format for Instagram/LinkedIn
- Feature the Design Dreams branding
- Include space for text overlay
- Professional but engaging
- Should stop the scroll

Can be reused for multiple posts with different text/content.`,
    midjourneyPrompt: `A modern social media post design with a purple gradient (#6E56CF to #3B82F6) background. Include abstract geometric shapes, flowing lines, and subtle pattern elements. Reserve a central area for text overlay with a semi-transparent white or frosted glass panel. Add subtle brand elements like logo placeholder. Professional, eye-catching design that works for both Instagram and LinkedIn. Clean, minimal, with visual interest. --v 6 --ar 1:1 --style raw --s 200`,
    specs: {
      size: '1080x1080px (1:1 for Instagram)',
      format: 'PNG, also provide PSD/Figma template for text editing',
      style: 'Modern gradient design, space for text, purple/blue palette'
    }
  },
  {
    title: '[GRAPHICS] Email Header Template',
    location: 'Email Marketing & Transactional Emails',
    priority: 2,
    description: `Create an email header template for use in:
- Welcome emails
- Request update notifications
- Newsletter
- Transactional emails

Should include:
- Design Dreams branding/logo area
- Clean, minimal design
- Works well across email clients
- Professional and recognizable`,
    midjourneyPrompt: `A clean, minimal email header banner design. Purple (#6E56CF) brand color bar or gradient across top. Include space for logo/brand name on left. Subtle geometric pattern or abstract shapes in background. Professional, minimal design that works well in email context. Width-optimized for email (600px standard). Clean lines, good whitespace. --v 6 --ar 5:1 --style raw --s 150`,
    specs: {
      size: '600x120px (standard email width)',
      format: 'PNG, also provide web-optimized version',
      style: 'Email-safe design, purple brand color, minimal'
    }
  },
  {
    title: '[GRAPHICS] Feature Benefits Icons - Speed, Quality, Unlimited',
    location: 'Landing Page Benefits Section',
    priority: 2,
    description: `Create a set of 3 benefit icons representing key value propositions:
1. Lightning-fast turnaround (48hr)
2. Premium quality work
3. Unlimited requests

Icons should:
- Match the service icons style
- Be instantly recognizable
- Support the benefit messaging
- Use purple color palette`,
    midjourneyPrompt: `A set of three benefit icons in a consistent modern style. First icon: lightning bolt or stopwatch representing speed. Second icon: star or badge representing quality/premium. Third icon: infinity symbol or circular arrows representing unlimited. Use purple (#6E56CF) with gradient effects. Line-based icon style with subtle fills. Clean, geometric, professional appearance. Should be cohesive with a modern SaaS aesthetic. --v 6 --ar 3:1 --style raw --s 200`,
    specs: {
      size: '400x400px each (export set and individuals)',
      format: 'SVG preferred, PNG with transparency',
      style: 'Line icons with purple accents, modern minimal'
    }
  }
];

async function createGraphicsIssues() {
  try {
    console.log('Starting to create graphics issues...\n');

    // Get the team
    const teams = await client.teams();
    const team = teams.nodes.find(t => t.name === 'Howdycarter');

    if (!team) {
      console.error('Team "Howdycarter" not found');
      return;
    }

    console.log(`Found team: ${team.name} (${team.id})\n`);

    // Get the Design Dream project
    const projects = await client.projects();
    const project = projects.nodes.find(p => p.name === 'Design Dream');

    if (!project) {
      console.error('Project "Design Dream" not found');
      return;
    }

    console.log(`Found project: ${project.name} (${project.id})\n`);

    // Get existing labels (case-insensitive search)
    const allLabels = await client.issueLabels();
    let graphicsLabel = allLabels.nodes.find(l => l.name.toLowerCase() === 'graphics');
    let designLabel = allLabels.nodes.find(l => l.name.toLowerCase() === 'design' || l.name.toLowerCase() === 'design-graphics');
    let visualContentLabel = allLabels.nodes.find(l => l.name.toLowerCase() === 'visual-content');

    // Create labels if they don't exist
    if (!graphicsLabel) {
      const labelResponse = await client.createIssueLabel({
        name: 'graphics',
        color: '#6E56CF',
        teamId: team.id
      });
      graphicsLabel = await labelResponse.issueLabel;
      console.log('Created label: graphics');
    } else {
      console.log('Found existing label: graphics');
    }

    if (!designLabel) {
      const labelResponse = await client.createIssueLabel({
        name: 'design',
        color: '#3B82F6',
        teamId: team.id
      });
      designLabel = await labelResponse.issueLabel;
      console.log('Created label: design');
    } else {
      console.log(`Found existing label: ${designLabel.name}`);
    }

    if (!visualContentLabel) {
      const labelResponse = await client.createIssueLabel({
        name: 'visual-content',
        color: '#8B5CF6',
        teamId: team.id
      });
      visualContentLabel = await labelResponse.issueLabel;
      console.log('Created label: visual-content');
    } else {
      console.log('Found existing label: visual-content');
    }

    console.log('\n---\n');

    const createdIssues: any[] = [];

    // Create each issue
    for (const issue of graphicsIssues) {
      const description = `## Context
${issue.description}

## Location
${issue.location}

## Specifications
- **Size:** ${issue.specs.size}
- **Format:** ${issue.specs.format}
- **Style:** ${issue.specs.style}

## Midjourney Prompt

\`\`\`
${issue.midjourneyPrompt}
\`\`\`

## Deliverables
- [ ] High-resolution source file
- [ ] Optimized web version (PNG/WebP)
- [ ] 2x retina version if applicable
- [ ] SVG version if applicable
- [ ] Added to project assets folder

## Acceptance Criteria
- [ ] Matches Design Dreams brand guidelines (purple #6E56CF primary)
- [ ] High quality and polished finish
- [ ] Optimized for web performance
- [ ] Works across different backgrounds/contexts
- [ ] Reviewed and approved for use

## Notes
- Use the provided Midjourney prompt as a starting point
- Iterate if needed to achieve the right look and feel
- Ensure all files are properly named and organized
- Export in multiple formats for different use cases`;

      const issueResponse = await client.createIssue({
        title: issue.title,
        description: description,
        teamId: team.id,
        projectId: project.id,
        priority: issue.priority,
        labelIds: [graphicsLabel!.id, designLabel!.id, visualContentLabel!.id]
      });

      const createdIssue = await issueResponse.issue;

      if (createdIssue) {
        createdIssues.push({
          title: issue.title,
          url: `https://linear.app/howdycarter/issue/${createdIssue.identifier}`,
          identifier: createdIssue.identifier,
          priority: issue.priority,
          midjourneyPrompt: issue.midjourneyPrompt
        });

        console.log(`✅ Created: ${issue.title}`);
        console.log(`   ID: ${createdIssue.identifier}`);
        console.log(`   Priority: P${issue.priority}`);
        console.log('');
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80) + '\n');

    console.log(`Total issues created: ${createdIssues.length}\n`);

    console.log('ISSUES BY PRIORITY:\n');
    const p1Issues = createdIssues.filter(i => i.priority === 1);
    const p2Issues = createdIssues.filter(i => i.priority === 2);
    const p3Issues = createdIssues.filter(i => i.priority === 3);

    console.log(`P1 (Critical - Landing Page): ${p1Issues.length} issues`);
    p1Issues.forEach(i => console.log(`  - ${i.identifier}: ${i.title}`));

    console.log(`\nP2 (High - Dashboard/Marketing): ${p2Issues.length} issues`);
    p2Issues.forEach(i => console.log(`  - ${i.identifier}: ${i.title}`));

    console.log(`\nP3 (Medium - Nice-to-have): ${p3Issues.length} issues`);
    p3Issues.forEach(i => console.log(`  - ${i.identifier}: ${i.title}`));

    console.log('\n' + '='.repeat(80));
    console.log('TOP 3 PRIORITY MIDJOURNEY PROMPTS');
    console.log('='.repeat(80) + '\n');

    // Show top 3 priority issues with full prompts
    const top3 = p1Issues.slice(0, 3);
    top3.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.identifier} - ${issue.title}`);
      console.log(`   ${issue.url}`);
      console.log('');
      console.log(`   MIDJOURNEY PROMPT:`);
      console.log(`   ${issue.midjourneyPrompt}`);
      console.log('\n' + '-'.repeat(80) + '\n');
    });

    console.log('\n✅ All graphics issues created successfully!');
    console.log(`\nView all issues: https://linear.app/howdycarter/project/design-dream\n`);

  } catch (error) {
    console.error('Error creating issues:', error);
    throw error;
  }
}

// Run the script
createGraphicsIssues();
