import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import tmp from 'tmp';
import ffmpegPath from 'ffmpeg-static';        // ✓ bundled ffmpeg

export const getScreenshot = (req, res) => {
  const { url, timestamp } = req.query;

  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  const cleanUrl   = url.split('?')[0];
  const tempDir    = tmp.dirSync({ unsafeCleanup: true });
  const outputPath = path.join(tempDir.name, 'thumb.jpg');

  // yt‑dlp was installed into /usr/local/bin by the Dockerfile → in $PATH
  const ytdlCmd = `yt-dlp -f worst -g "${cleanUrl}"`;

  exec(ytdlCmd, (err, stdout) => {
    if (err) {
      tempDir.removeCallback();
      return res.status(500).json({ error: 'yt-dlp failed', details: err.message });
    }

    const videoURL  = stdout.trim();
    const ffmpegCmd =
      `${ffmpegPath} -ss ${timestamp} -i "${videoURL}" -frames:v 1 -q:v 2 "${outputPath}" -y`;

    exec(ffmpegCmd, (err) => {
      if (err || !fs.existsSync(outputPath)) {
        tempDir.removeCallback();
        return res.status(500).json({ error: 'ffmpeg failed', details: err?.message });
      }

      const img = fs.readFileSync(outputPath);
      tempDir.removeCallback();

      res.set('Content-Type', 'image/jpeg');
      res.status(200).send(img);
    });
  });
};
