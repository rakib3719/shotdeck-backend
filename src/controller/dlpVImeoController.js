import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import tmp from 'tmp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getScreenshotForVimeo = async (req, res) => {
  const { url, timestamp } = req.query;

  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  const cleanUrl = url.split('?')[0];
  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const videoPath = path.join(tempDir.name, 'video.mp4');
  const thumbnailPath = path.join(tempDir.name, 'thumbnail.jpg');

  try {
    // Step 1: Download the video using yt-dlp (low quality for faster download)
    const downloadCmd = `yt-dlp -f "best[height<=480]" -o "${videoPath}" "${cleanUrl}"`;
    await execPromise(downloadCmd);

    // Step 2: Generate thumbnail from downloaded video
    const ffmpegCmd = `ffmpeg -ss ${timestamp} -i "${videoPath}" -frames:v 1 -q:v 2 "${thumbnailPath}" -y`;
    await execPromise(ffmpegCmd);

    // Step 3: Delete the video file (optional)
    fs.unlinkSync(videoPath);

    // Send the thumbnail
    const thumbnail = fs.readFileSync(thumbnailPath);
    res.set('Content-Type', 'image/jpeg').status(200).send(thumbnail);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate thumbnail', details: error.message });
  } finally {
    tempDir.removeCallback(); // Cleanup temp directory
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