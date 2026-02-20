const { chromium } = require('playwright');
const { spawn } = require('child_process');

async function main() {
  const outputVideo = '/root/clawd/google-news-demo2.mp4';
  
  // Use WSLg display :0
  process.env.DISPLAY = ':0';
  
  console.log('Starting screen recording on DISPLAY=:0 ...');
  
  // Start ffmpeg screen recording on :0
  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'x11grab',
    '-framerate', '30',
    '-video_size', '1920x1080',  // Adjust if needed
    '-i', ':0',
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-crf', '23',
    outputVideo
  ], { 
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, DISPLAY: ':0' }
  });

  ffmpeg.stderr.on('data', (d) => console.log('ffmpeg:', d.toString().trim()));

  // Give ffmpeg a moment to start
  await new Promise(r => setTimeout(r, 2000));
  console.log('Recording started...');

  // Launch browser on :0
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized', '--no-sandbox']
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
  
  // Try clicking Technology
  try {
    const techLink = page.locator('text=Technology').first();
    if (await techLink.isVisible({ timeout: 2000 })) {
      console.log('Clicking Technology section...');
      await techLink.click();
      await page.waitForTimeout(3000);
    }
  } catch (e) {
    console.log('Technology link not found, continuing...');
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
  
  await new Promise(r => setTimeout(r, 3000));
  
  try { ffmpeg.kill('SIGINT'); } catch(e) {}
  
  console.log(`Video saved to: ${outputVideo}`);
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
