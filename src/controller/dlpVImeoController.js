import fs from 'node:fs';
import path from 'node:path';
import https from 'https';
import { exec } from 'node:child_process';
import { v4 as uuidv4 } from 'uuid'; // to generate unique names
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOAD_DIR = path.resolve(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR); // create if missing

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "rakib.fbinternational@gmail.com",
    pass: "gbjv irau ksag logr",
  },
});

const sendErrorEmail = async (errorDetails) => {
  try {
    await transporter.sendMail({
      from: '"Error Reporter" <rakib.fbinternational@gmail.com>',
      to: "contact.fxreferences@gmail.com",
      subject: "Error in Vimeo Screenshot Service",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #d9534f;">⚠️ Error in Vimeo Screenshot Service</h2>
          <p>An error occurred:</p>
          <div style="background-color: #f8f9fa; border-left: 4px solid #d9534f; padding: 10px;">
            <pre style="white-space: pre-wrap;">${errorDetails}</pre>
          </div>
        </div>
      `
    });
  } catch (emailError) {
    console.error('Failed to send error email:', emailError);
  }
};

const downloadVideo = (videoUrl, outputPath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(videoUrl, (response) => {
      const contentType = response.headers['content-type'] || '';
      if (!contentType.startsWith('video')) {
        reject(`Invalid content-type: ${contentType}`);
        return;
      }

      if (response.statusCode !== 200) {
        reject(`Download failed. Status Code: ${response.statusCode}`);
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => reject(err.message));
    });
  });
};

export const getScreenshotForVimeo = async (req, res) => {
  const { url, timestamp } = req.query;

  if (!url || !timestamp) {
    const error = 'url and timestamp are required';
    sendErrorEmail(error);
    return res.status(400).json({ error });
  }

  const cleanUrl = url.split('?')[0];

  // === Step 1: Generate unique filename for video ===
  const uniqueId = uuidv4();
  const videoPath = path.join(DOWNLOAD_DIR, `${uniqueId}.mp4`);
  const thumbPath = path.join(DOWNLOAD_DIR, `${uniqueId}.jpg`);

  try {
    // Step 2: Download video to ./downloads/
    await downloadVideo(cleanUrl, videoPath);

    // Step 3: Take thumbnail from local file
    const ffmpegCmd = `ffmpeg -ss ${timestamp} -i "${videoPath}" -frames:v 1 -q:v 2 "${thumbPath}" -y`;
    exec(ffmpegCmd, { encoding: 'utf8' }, (err, stdout, stderr) => {
      if (err || !fs.existsSync(thumbPath)) {
        const error = `ffmpeg failed: ${stderr}`;
        console.error(error);
        sendErrorEmail(error);
        return res.status(500).json({ error: 'ffmpeg failed', details: stderr });
      }

      const img = fs.readFileSync(thumbPath);
      fs.unlinkSync(thumbPath); // delete thumbnail only
      res.set('Content-Type', 'image/jpeg').status(200).send(img);
    });
  } catch (err) {
    const error = `Video download failed: ${err}`;
    console.error(error);
    sendErrorEmail(error);
    res.status(500).json({ error: 'Video download failed', details: err });
  }
};




