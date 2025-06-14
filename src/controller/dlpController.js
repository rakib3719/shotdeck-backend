import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import tmp from 'tmp';

export const getScreenshot = (req, res) => {
  const url = req.query.url;
  const timestamp = req.query.timestamp;

  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  const cleanUrl = url.split('?')[0];
  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const outputImage = path.join(tempDir.name, 'thumb.jpg');

const ytdlCmd = `yt-dlp -f worst -g "${cleanUrl}"`;


  exec(ytdlCmd, (err, stdout) => {
    if (err) {
      tempDir.removeCallback();
      return res.status(500).json({ error: 'yt-dlp failed', details: err.message });
    }

    const videoStreamURL = stdout.trim();
    const ffmpegCmd = `ffmpeg -ss ${timestamp} -i "${videoStreamURL}" -frames:v 1 -q:v 2 "${outputImage}" -y`;

    exec(ffmpegCmd, (err) => {
      if (err || !fs.existsSync(outputImage)) {
        tempDir.removeCallback();
        return res.status(500).json({ error: 'ffmpeg failed', details: err?.message });
      }

      const imageBuffer = fs.readFileSync(outputImage);
      tempDir.removeCallback();

      res.set('Content-Type', 'image/jpeg');
      return res.status(200).send(imageBuffer);
    });
  });
};
