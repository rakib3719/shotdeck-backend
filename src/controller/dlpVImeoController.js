import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import tmp from 'tmp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getScreenshotForVimeo = async (req, res) => {
  const { url, timestamp } = req.query;
  if (!url || !timestamp) return res.status(400).json({ error: 'URL and timestamp required' });

  const tempDir = tmp.dirSync({ dir: '/home/ubuntu/tmp', unsafeCleanup: true });
  const videoPath = path.join(tempDir.name, 'video.mp4');
  const thumbnailPath = path.join(tempDir.name, 'thumbnail.jpg');

  try {
    // 1. Download with yt-dlp (full path)
    const downloadCmd = `/usr/local/bin/yt-dlp -f "best[height<=480]" -o "${videoPath}" "${url.split('?')[0]}"`;
    console.log(await execPromise(downloadCmd));

    // 2. Generate thumbnail (full path)
    const ffmpegCmd = `/usr/bin/ffmpeg -ss ${timestamp} -i "${videoPath}" -frames:v 1 -q:v 2 "${thumbnailPath}" -y`;
    console.log(await execPromise(ffmpegCmd));

    // 3. Send thumbnail
    res.sendFile(thumbnailPath, () => {
      fs.unlinkSync(videoPath);
      tempDir.removeCallback();
    });

  } catch (error) {
    console.error('VPS Error:', error);
    res.status(500).json({ error: 'VPS processing failed', details: error.message });
  }
};

// Helper function to convert exec to Promise
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error);
      } else {
        resolve(stdout);
      }
    });
  });
}