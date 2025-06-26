import puppeteer from 'puppeteer-core'; // puppeteer-core দিয়ে Chromium path সেট করতে পারবো
import path from 'node:path';
import fs from 'node:fs';
import tmp from 'tmp';

const CHROMIUM_PATH = '/usr/bin/chromium';  // VPS এ Chromium executable এর সঠিক path দিতে হবে

export const getScreenshot = async (req, res) => {
  const { url, timestamp } = req.query;
  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  let browser;
  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const outputFile = path.join(tempDir.name, 'thumbnail.jpg');

  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: CHROMIUM_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // YouTube ভিডিও পেজে যাওয়া
    await page.goto(url, { waitUntil: 'networkidle2' });

    // ভিডিও প্লেয়ার এলিমেন্ট লোড হওয়া পর্যন্ত অপেক্ষা
    await page.waitForSelector('video');

    // ভিডিও এলিমেন্ট খুঁজে নাও
    const videoHandle = await page.$('video');

    if (!videoHandle) {
      throw new Error('Video element not found on page');
    }

    // ভিডিও timestamp সেট করো (seconds এ কনভার্ট করতে হবে)
    const [hh, mm, ss] = timestamp.split(':').map(Number);
    const totalSeconds = (hh || 0) * 3600 + (mm || 0) * 60 + (ss || 0);

    // ভিডিও timestamp সেট করা - evaluate দিয়ে ভিডিও tag এ currentTime সেট করবো
    await page.evaluate((video, time) => {
      video.currentTime = time;
    }, videoHandle, totalSeconds);

    // ভিডিও সেট হওয়ার জন্য একটু অপেক্ষা
    await page.waitForTimeout(2000);

    // ভিডিও এলিমেন্টের screenshot নাও
    await videoHandle.screenshot({ path: outputFile });

    // ছবি রিড করে response এ পাঠাও
    const imageBuffer = fs.readFileSync(outputFile);
    res.set('Content-Type', 'image/jpeg');
    res.status(200).send(imageBuffer);

  } catch (error) {
    console.error('Puppeteer error:', error);
    res.status(500).json({ error: 'Puppeteer failed', details: error.message });
  } finally {
    if (browser) await browser.close();
    tempDir.removeCallback();
  }
};
