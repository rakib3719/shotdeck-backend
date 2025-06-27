import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import tmp from 'tmp';

// Read cookies from external txt file (must be in the root or specify correct path)
const cookiesFilePath = path.join(process.cwd(), 'www.youtube.com_cookies.txt');
const rawCookies = fs.readFileSync(cookiesFilePath, 'utf-8');

export const getScreenshot = (req, res) => {
  const { url, timestamp } = req.query;

  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  const cleanUrl = url.split('?')[0];
  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const output = path.join(tempDir.name, 'thumb.jpg');

  // Write cookies to a temp file in the temp directory
  const cookiesPath = path.join(tempDir.name, 'youtube_cookies.txt');
  fs.writeFileSync(cookiesPath, rawCookies);

  // Step 1: Get direct video URL using yt-dlp and cookies
  const ytdlCmd = `yt-dlp --cookies "${cookiesPath}" -f best -g "${cleanUrl}"`;

  exec(ytdlCmd, (err, stdout, stderr) => {
    if (err || !stdout.trim()) {
      tempDir.removeCallback();
      console.error('yt-dlp error:', stderr);
      return res.status(500).json({ error: 'yt-dlp failed', details: stderr });
    }

    const videoURL = stdout.trim();
    const ffmpegCmd = `ffmpeg -ss ${timestamp} -i "${videoURL}" -frames:v 1 -q:v 2 "${output}" -y`;

    exec(ffmpegCmd, (ffErr, ffStdout, ffStderr) => {
      if (ffErr || !fs.existsSync(output)) {
        tempDir.removeCallback();
        console.error('ffmpeg error:', ffStderr);
        return res.status(500).json({ error: 'ffmpeg failed', details: ffStderr });
      }

      const img = fs.readFileSync(output);
      tempDir.removeCallback();
      res.set('Content-Type', 'image/jpeg').status(200).send(img);
    });
  });
};














