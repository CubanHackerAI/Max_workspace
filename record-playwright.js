const { chromium } = require('playwright');

async function main() {
  console.log('Launching browser with video recording...');
  
  const browser = await chromium.launch({
    headless: true  // Run headless, but record video
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: '/root/clawd/videos/',
      size: { width: 1920, height: 1080 }
    }
  });
  
  const page = await context.newPage();
  
  console.log('Opening Google News...');
  await page.goto('https://news.google.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Scroll down slowly  
  console.log('Scrolling through news...');
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(1500);
  }
  
  // Try clicking a section
  try {
    await page.click('text=Technology', { timeout: 3000 });
    console.log('Clicked Technology');
    await page.waitForTimeout(3000);
  } catch (e) {
    console.log('Technology not found, trying Business...');
    try {
      await page.click('text=Business', { timeout: 3000 });
      await page.waitForTimeout(3000);
    } catch (e2) {
      console.log('Continuing without clicking section...');
    }
  }
  
  // More scrolling
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(1000);
  }
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: '/root/clawd/videos/final-screenshot.png' });
  
  console.log('Closing browser...');
  await context.close();
  await browser.close();
  
  // Find the video file
  const fs = require('fs');
  const videos = fs.readdirSync('/root/clawd/videos/').filter(f => f.endsWith('.webm'));
  console.log('Video saved:', videos);
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
