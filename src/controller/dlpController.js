import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import tmp from 'tmp';

// এখানে ffmpeg static ব্যবহার না করে system ffmpeg ব্যবহার করবো, কারণ Dockerfile-এ system ffmpeg ইনস্টল করেছি

export const getScreenshot = (req, res) => {
  const { url, timestamp } = req.query;

  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  // Clean URL from query params for safety (optional)
  const cleanUrl = url.split('?')[0];

  // Create temp dir
  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const outputPath = path.join(tempDir.name, 'thumb.jpg');

  // yt-dlp কমান্ড, system-wide ইনস্টল করা হয়েছে /usr/local/bin/yt-dlp হিসেবে
  const ytdlCmd = `yt-dlp -f worst -g "${cleanUrl}"`;

  exec(ytdlCmd, (err, stdout, stderr) => {
    if (err) {
      console.error('yt-dlp error:', stderr);
      tempDir.removeCallback();
      return res.status(500).json({ error: 'yt-dlp failed', details: stderr || err.message });
    }

    const videoURL = stdout.trim();

    // ffmpeg কমান্ড: system-installed ffmpeg ব্যবহার করবো (Dockerfile-এ apt থেকে ইনস্টল করা)
    const ffmpegCmd = `ffmpeg -ss ${timestamp} -i "${videoURL}" -frames:v 1 -q:v 2 "${outputPath}" -y`;

    exec(ffmpegCmd, (err, stdout, stderr) => {
      if (err || !fs.existsSync(outputPath)) {
        console.error('ffmpeg error:', stderr);
        tempDir.removeCallback();
        return res.status(500).json({ error: 'ffmpeg failed', details: stderr || err?.message });
      }

      // ছবি পাঠানো
      const img = fs.readFileSync(outputPath);
      tempDir.removeCallback();

      res.set('Content-Type', 'image/jpeg');
      res.status(200).send(img);
    });
  });
};
