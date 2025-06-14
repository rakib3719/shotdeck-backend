import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import tmp from 'tmp';



export const getScreenshot = (req, res) => {
  const { url, timestamp } = req.query;

  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  const cleanUrl = url.split('?')[0];

  // Create temp dir
  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const outputPath = path.join(tempDir.name, 'thumb.jpg');


  const ytdlCmd = `yt-dlp -f worst -g "${cleanUrl}"`;

  exec(ytdlCmd, (err, stdout, stderr) => {
    if (err) {
      console.error('yt-dlp error:', stderr);
      tempDir.removeCallback();
      return res.status(500).json({ error: 'yt-dlp failed', details: stderr || err.message });
    }


    

    const videoURL = stdout.trim();


    const ffmpegCmd = `ffmpeg -ss ${timestamp} -i "${videoURL}" -frames:v 1 -q:v 2 "${outputPath}" -y`;

    exec(ffmpegCmd, (err, stdout, stderr) => {
      if (err || !fs.existsSync(outputPath)) {
        console.error('ffmpeg error:', stderr);
        tempDir.removeCallback();
        return res.status(500).json({ error: 'ffmpeg failed', details: stderr || err?.message });
      }


      const img = fs.readFileSync(outputPath);
      tempDir.removeCallback();

      res.set('Content-Type', 'image/jpeg');
      res.status(200).send(img);
    });
  });
};

