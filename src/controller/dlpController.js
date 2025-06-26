import puppeteer from 'puppeteer';
import fs from 'fs/promises';

export const getScreenshot = async (req, res) => {
  const { url, timestamp } = req.query;

  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  // Convert timestamp to seconds
  const timeParts = timestamp.split(':').map(Number);
  const seconds =
    timeParts.length === 3
      ? timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
      : timeParts.length === 2
      ? timeParts[0] * 60 + timeParts[1]
      : timeParts[0];

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-popup-blocking',
        '--disable-dev-shm-usage',
      ],
      defaultViewport: { width: 1280, height: 720 },
    });

    const page = await browser.newPage();

    // Block ads/popups
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const blocked = ['image', 'stylesheet', 'font'].includes(req.resourceType()) ||
        req.url().includes('adservice') ||
        req.url().includes('doubleclick') ||
        req.url().includes('googleads');
      blocked ? req.abort() : req.continue();
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await page.waitForSelector('video', { timeout: 15000 });

    // Wait for video to load and seek
    await page.evaluate(async (seconds) => {
      const video = document.querySelector('video');
      if (video) {
        video.currentTime = seconds;
        video.pause();
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait for seek
      }
    }, seconds);

    const video = await page.$('video');
    if (!video) throw new Error('Video element not found');

    const filePath = `/tmp/yt-thumb-${Date.now()}.jpg`;
    await video.screenshot({ path: filePath });

    const imgBuffer = await fs.readFile(filePath);
    await browser.close();

    res.set('Content-Type', 'image/jpeg').send(imgBuffer);
  } catch (err) {
    console.error('Puppeteer failed:', err);
    res.status(500).json({ error: 'Puppeteer failed', details: err.message });
  }
};
