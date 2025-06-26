import puppeteer from 'puppeteer';
import tmp from 'tmp-promise';
import fs from 'fs/promises';

export const getScreenshot = async (req, res) => {
  const { url, timestamp } = req.query;

  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  const timeParts = timestamp.split(':').map(Number);
  const seconds =
    timeParts.length === 3
      ? timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]
      : timeParts.length === 2
      ? timeParts[0] * 60 + timeParts[1]
      : timeParts[0];

  const tmpFile = await tmp.file({ postfix: '.jpg' });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 720 },
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const block = ['image', 'stylesheet', 'font'].includes(req.resourceType()) ||
        req.url().includes('adservice') || req.url().includes('doubleclick');
      block ? req.abort() : req.continue();
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await page.waitForSelector('video', { timeout: 15000 });

    await page.evaluate(async (seconds) => {
      const video = document.querySelector('video');
      if (video) {
        video.currentTime = seconds;
        video.pause();
        await new Promise(res => setTimeout(res, 2000));
      }
    }, seconds);

    const video = await page.$('video');
    if (!video) throw new Error('Video element not found');

    await video.screenshot({ path: tmpFile.path });

    const imgBuffer = await fs.readFile(tmpFile.path);
    await browser.close();

    res.set('Content-Type', 'image/jpeg').send(imgBuffer);
  } catch (err) {
    console.error('Puppeteer failed:', err);
    res.status(500).json({ error: 'Puppeteer failed', details: err.message });
  } finally {
    await tmpFile.cleanup(); // Clean the temp file even if there's an error
  }
};
