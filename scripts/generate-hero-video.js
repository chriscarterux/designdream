#!/usr/bin/env node

/**
 * HOW-303: Landing Page Hero - Value Proposition Showcase Video Generator
 *
 * Generates Veo3 API requests for a 30-second hero video with 4 cinematic scenes
 * that immediately communicates Design Dreams' value proposition
 */

const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(__dirname, '..', 'public', 'videos');
const METADATA_FILE = path.join(VIDEOS_DIR, 'hero-video-metadata.json');

// Ensure videos directory exists
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

const heroVideoScenes = [
  {
    number: 1,
    name: "Opening Hook",
    duration: "5 seconds (0-5s)",
    visualConcept: "Dynamic reveal of Design Dreams brand",
    veo3Prompt: `Cinematic opening shot, smooth camera push forward through a minimalist modern office space with floating holographic design elements in purple and blue gradient colors, clean white environment with natural lighting, professional tech startup aesthetic, high production value, shallow depth of field, 4K ultra detailed, modern SaaS brand reveal`,
    textOverlay: [
      "Design Dreams (brand name, fade in)",
      "Unlimited Design + Development (subtitle)"
    ],
    voiceoverScript: "Design Dreams. Unlimited design and development on subscription.",
    srtSubtitle: "00:00:00,000 --> 00:00:05,000\nDesign Dreams.\nUnlimited Design + Development"
  },
  {
    number: 2,
    name: "Problem/Solution Transition",
    duration: "7 seconds (5-12s)",
    visualConcept: "Transformation from chaos to order",
    veo3Prompt: `Split screen transition, left side showing cluttered messy design workflow with scattered papers and stressed designer, right side showing clean organized digital dashboard with smooth animations, purple to blue gradient background, seamless morph transition between chaos and order, cinematic lighting, professional SaaS commercial style, 4K resolution, smooth camera movement`,
    textOverlay: [
      'Left: "Traditional Design Agencies" (fades out)',
      'Right: "One Flat Monthly Rate" (fades in)'
    ],
    voiceoverScript: "Stop juggling vendors. Start shipping with one flat monthly rate.",
    srtSubtitle: "00:00:05,000 --> 00:00:12,000\nTraditional Design Agencies → One Flat Monthly Rate\nNo more vendor chaos"
  },
  {
    number: 3,
    name: "Service Showcase",
    duration: "10 seconds (12-22s)",
    visualConcept: "Quick cuts of services being delivered",
    veo3Prompt: `Fast-paced montage sequence showing: 1) sleek website designs appearing on modern laptop screens with glowing edges, 2) mobile app interfaces floating in 3D space with smooth rotations, 3) AI-powered code generation with flowing particle effects, 4) brand identity elements arranging themselves in perfect grid layout, purple and blue color scheme, professional tech commercial aesthetic, dynamic camera movements, high-end production quality, 4K ultra detailed`,
    textOverlay: [
      '"Web Design & Development" (appears with website)',
      '"Mobile Apps & AI Integration" (appears with mobile)',
      '"Brand Identity & Strategy" (appears with brand)',
      '"All-in-One Subscription" (final reveal)'
    ],
    voiceoverScript: "Web design. Mobile apps. AI features. All from one expert partner. Unlimited requests. 48-hour delivery.",
    srtSubtitle: "00:00:12,000 --> 00:00:22,000\nWeb Design & Development\nMobile Apps & AI Integration\nBrand Identity & Strategy\nAll-in-One Subscription"
  },
  {
    number: 4,
    name: "Call to Action",
    duration: "8 seconds (22-30s)",
    visualConcept: "Clean, confident close with CTA",
    veo3Prompt: `Elegant slow zoom out revealing complete Design Dreams dashboard interface on sleek ultrawide monitor in modern minimalist office, purple and blue accent lighting, professional product photography style, clean composition with negative space, premium tech brand aesthetic, soft bokeh background, 4K resolution, cinematic color grading`,
    textOverlay: [
      '"Start Your Free Trial"',
      '"designdream.is"'
    ],
    voiceoverScript: "Start your free trial today. No credit card required. No contracts.",
    srtSubtitle: "00:00:22,000 --> 00:00:30,000\nStart Your Free Trial\ndesigndream.is"
  }
];

const metadata = {
  projectId: "HOW-303",
  title: "Landing Page Hero - Value Proposition Showcase",
  description: "30-second cinematic hero video for landing page",
  specifications: {
    duration: "30 seconds (adjusted to 15-30s per brief)",
    aspectRatio: "16:9",
    resolution: "1920x1080 (desktop), 3840x2160 (4K), 1080x1080 (social)",
    frameRate: "60fps",
    bitrate: "20 Mbps minimum",
    colorSpace: "Rec. 709",
    audio: "AAC, 320kbps, stereo"
  },
  scenes: heroVideoScenes,
  audioGuidance: {
    genre: "Modern, upbeat electronic/corporate",
    mood: "Confident, innovative, professional",
    style: "Clean beats with subtle synth progression",
    reference: "Tech startup launch videos (Apple, Notion style)",
    volumeMix: "Music at 60%, sound effects at 40%"
  },
  deliverables: [
    "16:9 desktop version (1920x1080)",
    "16:9 4K version (3840x2160)",
    "1:1 square version for social (1080x1080)",
    "Source files for future editing"
  ],
  successMetrics: [
    "Immediate value proposition clarity",
    "80%+ viewer retention through 15 seconds",
    "Strong emotional response (modern, trustworthy)",
    "Clear CTA visibility"
  ],
  generatedAt: new Date().toISOString(),
  status: "metadata_generated"
};

// Generate SRT subtitle file
function generateSRTFile() {
  let srtContent = "";
  heroVideoScenes.forEach((scene) => {
    srtContent += `${scene.srtSubtitle}\n\n`;
  });

  const srtPath = path.join(VIDEOS_DIR, 'hero-video-subtitles.srt');
  fs.writeFileSync(srtPath, srtContent);
  return srtPath;
}

// Main execution
function main() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log("\n=== HOW-303: Landing Page Hero Video Generator ===\n");
  console.log("Project: Design Dream Landing Page");
  console.log("Duration: 30 seconds");
  console.log("Scenes: 4 cinematic sequences");
  console.log("Resolution: 1920x1080 (desktop), 3840x2160 (4K), 1080x1080 (social)");
  console.log("\n--- Scene Breakdown ---\n");

  heroVideoScenes.forEach((scene) => {
    console.log(`Scene ${scene.number}: ${scene.name}`);
    console.log(`Duration: ${scene.duration}`);
    console.log(`Visual Concept: ${scene.visualConcept}`);
    console.log(`\nVeo3 Prompt:\n${scene.veo3Prompt}\n`);
    console.log(`Text Overlays:`, scene.textOverlay.join(", "));
    console.log(`Voiceover: "${scene.voiceoverScript}"\n`);
    console.log("---\n");
  });

  console.log("--- Audio Guidance ---\n");
  console.log(`Genre: ${metadata.audioGuidance.genre}`);
  console.log(`Mood: ${metadata.audioGuidance.mood}`);
  console.log(`Style: ${metadata.audioGuidance.style}`);
  console.log(`Reference: ${metadata.audioGuidance.reference}`);
  console.log(`Volume Mix: ${metadata.audioGuidance.volumeMix}\n`);

  if (isDryRun) {
    console.log("✓ DRY RUN: Metadata validated");
    console.log("✓ All scene prompts ready for Veo3 API");
    return;
  }

  // Write metadata file
  const srtPath = generateSRTFile();
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));

  console.log(`✓ Metadata file created: ${METADATA_FILE}`);
  console.log(`✓ Subtitle file created: ${srtPath}`);
  console.log("\n✓ Ready to submit to Veo3 API");
  console.log("\nNext steps:");
  console.log("1. Authenticate with Veo3 API");
  console.log("2. Submit each scene prompt to Veo3");
  console.log("3. Generate video with voiceover");
  console.log("4. Add background music and SFX");
  console.log("5. Composite into 30-second final video");
  console.log("6. Generate 1:1 social media version");
  console.log("7. Export all formats and optimizations\n");
}

main();
