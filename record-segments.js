const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Transcript segments from Matthew Berman composition
const SEGMENTS = [
  {
    scene: 1,
    name: "intro",
    transcript: "This is Claudebot, the ultimate personal AI assistant that is open-source, runs locally, and can basically do everything.",
    url: "https://clawd.bot",
    actions: async (page) => {
      await page.waitForTimeout(2000);
      // Scroll down slowly to show testimonials
      for (let i = 0; i < 3; i++) {
        await page.mouse.wheel(0, 400);
        await page.waitForTimeout(1500);
      }
    }
  },
  {
    scene: 2,
    name: "what-is-clawdbot",
    transcript: "So what is Clawdbot? It is an always on agent that can run on your machine.",
    url: "https://github.com/clawdbot/clawdbot#-clawdbot--personal-ai-assistant",
    actions: async (page) => {
      await page.waitForTimeout(2000);
      // Scroll to show the description
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(2000);
    }
  },
  {
    scene: 3,
    name: "open-source",
    transcript: "The first major advantage is that it's fully open source and self-hosted.",
    url: "https://github.com/clawdbot/clawdbot",
    actions: async (page) => {
      await page.waitForTimeout(2000);
      // Click on License badge if visible
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(2000);
      // Scroll to models section
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(2000);
    }
  },
  {
    scene: 4,
    name: "memory",
    transcript: "The second advantage is persistent memory. As you're using it, it learns about you.",
    url: "https://docs.clawd.bot/concepts/memory",
    actions: async (page) => {
      await page.waitForTimeout(2000);
      for (let i = 0; i < 2; i++) {
        await page.mouse.wheel(0, 350);
        await page.waitForTimeout(1500);
      }
    }
  },
  {
    scene: 5,
    name: "proactive",
    transcript: "Third is proactive behavior. You could tell it to do things like, Check my email.",
    url: "https://docs.clawd.bot/concepts/heartbeats",
    actions: async (page) => {
      await page.waitForTimeout(2000);
      for (let i = 0; i < 2; i++) {
        await page.mouse.wheel(0, 350);
        await page.waitForTimeout(1500);
      }
    }
  },
  {
    scene: 6,
    name: "computer-access",
    transcript: "Fourth is full computer access. You can limit it. You can put some guardrails on it.",
    url: "https://docs.clawd.bot/gateway/security",
    actions: async (page) => {
      await page.waitForTimeout(2000);
      for (let i = 0; i < 3; i++) {
        await page.mouse.wheel(0, 400);
        await page.waitForTimeout(1500);
      }
    }
  },
  {
    scene: 7,
    name: "personality",
    transcript: "Fifth is customizable personality through a soul dot M D file.",
    url: "https://docs.clawd.bot/workspace/workspace-files",
    actions: async (page) => {
      await page.waitForTimeout(2000);
      // Try to find SOUL.md section
      try {
        await page.click('text=SOUL.md', { timeout: 3000 });
      } catch (e) {}
      await page.waitForTimeout(1000);
      for (let i = 0; i < 2; i++) {
        await page.mouse.wheel(0, 350);
        await page.waitForTimeout(1500);
      }
    }
  },
  {
    scene: 8,
    name: "installation",
    transcript: "Installation is straightforward. It supports Mac, Windows, and Linux.",
    url: "https://docs.clawd.bot/start/getting-started",
    actions: async (page) => {
      await page.waitForTimeout(2000);
      for (let i = 0; i < 3; i++) {
        await page.mouse.wheel(0, 350);
        await page.waitForTimeout(1500);
      }
    }
  },
  {
    scene: 9,
    name: "clawdhub",
    transcript: "ClawdHub is where the community shines. Browse skills at ClawdHub.",
    url: "https://clawdhub.com",
    actions: async (page) => {
      await page.waitForTimeout(2500);
      for (let i = 0; i < 3; i++) {
        await page.mouse.wheel(0, 400);
        await page.waitForTimeout(1500);
      }
    }
  },
  {
    scene: 10,
    name: "use-case",
    transcript: "Here's a real-world use case. You can set up ClawdBot to automatically produce educational videos.",
    url: "https://docs.clawd.bot/start/showcase",
    actions: async (page) => {
      await page.waitForTimeout(2000);
      for (let i = 0; i < 3; i++) {
        await page.mouse.wheel(0, 350);
        await page.waitForTimeout(1500);
      }
    }
  },
  {
    scene: 11,
    name: "conclusion",
    transcript: "Very cool project. I think this is something special. Definitely give it a try.",
    url: "https://github.com/clawdbot/clawdbot",
    actions: async (page) => {
      await page.waitForTimeout(2000);
      // Star button area
      await page.mouse.wheel(0, -500); // Scroll to top
      await page.waitForTimeout(1500);
      // Show the repo main info
      await page.waitForTimeout(3000);
    }
  }
];

async function recordSegment(segment, outputDir) {
  console.log(`\n🎬 Recording Scene ${segment.scene}: ${segment.name}`);
  console.log(`   Transcript: "${segment.transcript}"`);
  console.log(`   URL: ${segment.url}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  try {
    await page.goto(segment.url, { waitUntil: 'networkidle', timeout: 30000 });
    await segment.actions(page);
    
    // Take screenshot
    await page.screenshot({ 
      path: path.join(outputDir, `scene-${segment.scene}-${segment.name}.png`)
    });
    
  } catch (e) {
    console.log(`   ⚠️ Error: ${e.message}`);
  }

  await context.close();
  await browser.close();

  // Rename the video file
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webm'));
  const latestVideo = files.sort().pop();
  if (latestVideo) {
    const newName = `scene-${segment.scene}-${segment.name}.webm`;
    fs.renameSync(
      path.join(outputDir, latestVideo),
      path.join(outputDir, newName)
    );
    console.log(`   ✅ Saved: ${newName}`);
  }
}

async function main() {
  const outputDir = '/root/clawd/segment-videos';
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🦞 Clawdbot Segment Video Recorder');
  console.log('==================================');
  console.log(`Output: ${outputDir}`);
  console.log(`Segments: ${SEGMENTS.length}`);

  for (const segment of SEGMENTS) {
    await recordSegment(segment, outputDir);
  }

  console.log('\n✅ All segments recorded!');
  console.log('\nFiles:');
  const files = fs.readdirSync(outputDir);
  files.forEach(f => console.log(`  - ${f}`));
}

main().catch(console.error);
