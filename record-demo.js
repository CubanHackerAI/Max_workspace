const { chromium } = require('playwright');
const { exec, spawn } = require('child_process');
const path = require('path');

async function main() {
  const outputVideo = '/root/clawd/google-news-demo.mp4';
  
  console.log('Starting screen recording...');
  
  // Start ffmpeg screen recording
  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'x11grab',
    '-framerate', '30',
    '-video_size', '1280x800',
    '-i', ':10.0',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-crf', '23',
    outputVideo
  ], { stdio: ['pipe', 'pipe', 'pipe'] });

  // Give ffmpeg a moment to start
  await new Promise(r => setTimeout(r, 2000));
  console.log('Recording started...');

  // Launch browser (visible, not headless)
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1200, height: 700 }
  });
  
  const page = await context.newPage();
  
  console.log('Opening Google News...');
  await page.goto('https://news.google.com', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Scroll down slowly
  console.log('Scrolling through news...');
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(1000);
  }
  
  // Click on a news category if visible
  try {
    const techLink = page.locator('text=Technology').first();
    if (await techLink.isVisible()) {
      console.log('Clicking Technology section...');
      await techLink.click();
      await page.waitForTimeout(3000);
    }
  } catch (e) {
    console.log('Could not find Technology link, continuing...');
  }
  
  // Scroll some more
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(800);
  }
  
  console.log('Demo complete, closing browser...');
  await page.waitForTimeout(2000);
  await browser.close();
  
  // Stop recording
  console.log('Stopping recording...');
  ffmpeg.stdin.write('q');
  
  await new Promise(r => setTimeout(r, 2000));
  ffmpeg.kill('SIGINT');
  
  console.log(`Video saved to: ${outputVideo}`);
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
