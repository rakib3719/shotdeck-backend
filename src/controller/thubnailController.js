import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import tmp from 'tmp';

export const getFrameThumbnail = (req, res) => {
  const { url, timestamp } = req.query;

  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  // Create temporary directory to store the output image
  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const outputImage = path.join(tempDir.name, 'thumb.jpg');

  // Get direct video URL using youtube-dl
  const ytdlCmd = `youtube-dl -f worst -g "${url}"`;

  exec(ytdlCmd, (err, stdout) => {
    if (err) {
      return res.status(500).json({ error: 'youtube-dl failed', details: err.message });
    }

    const videoStreamURL = stdout.trim();

    // Use ffmpeg to extract frame at specified timestamp
    const ffmpegCmd = `ffmpeg -ss ${timestamp} -i "${videoStreamURL}" -frames:v 1 -q:v 2 "${outputImage}" -y`;

    exec(ffmpegCmd, (err) => {
      if (err || !fs.existsSync(outputImage)) {
        return res.status(500).json({ error: 'ffmpeg failed', details: err?.message });
      }

      const imageBuffer = fs.readFileSync(outputImage);
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(imageBuffer);

      // Cleanup temp directory after response
      tempDir.removeCallback();
    });
  });
};
