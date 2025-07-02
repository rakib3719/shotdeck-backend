import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import tmp from 'tmp';
import nodemailer from 'nodemailer';

// Create reusable transporter object using the default SMTP transport
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
      subject: "Error in Screenshot Service",
      text: `An error occurred in the screenshot service:\n\n${errorDetails}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #d9534f;">⚠️ Error in Screenshot Service</h2>
          <p>An error occurred while processing a screenshot request:</p>
          <div style="background-color: #f8f9fa; border-left: 4px solid #d9534f; padding: 10px; margin: 10px 0;">
            <pre style="white-space: pre-wrap; word-wrap: break-word;">${errorDetails}</pre>
          </div>
          <p>Please investigate this issue.</p>
        </div>
      `
    });
  } catch (emailError) {
    console.error('Failed to send error email:', emailError);
  }
};

export const getScreenshot = (req, res) => {
  
  const { url, timestamp } = req.query;
  if (!url || !timestamp) {
    const error = 'url and timestamp are required';
    sendErrorEmail(error);
    return res.status(400).json({ error });
  }

  const cleanUrl = url.split('?')[0];
  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const output = path.join(tempDir.name, 'thumb.jpg');

  // Step 1: Copy the cookie file from your defined path
  const originalCookiesPath = path.resolve('./yt.txt');
  const cookiesPath = path.join(tempDir.name, 'yt.txt');
  try {
    fs.copyFileSync(originalCookiesPath, cookiesPath);
  } catch (e) {
    tempDir.removeCallback();
    const error = `Failed to read cookies file: ${e.message}`;
    sendErrorEmail(error);
    return res.status(500).json({ error, details: e.message });
  }

  // Step 2: yt-dlp command with cookies
  const ytdlCmd = `yt-dlp --cookies "${cookiesPath}" -f best -g "${cleanUrl}"`;

  exec(ytdlCmd, (err, stdout, stderr) => {
    if (err || !stdout.trim()) {
      tempDir.removeCallback();
      console.error('yt-dlp error:', stderr);
      const error = `yt-dlp failed: ${stderr}`;
      sendErrorEmail(error);
      return res.status(500).json({ error, details: stderr });
    }

    const videoURL = stdout.trim();
    const ffmpegCmd = `ffmpeg -ss ${timestamp} -i "${videoURL}" -frames:v 1 -q:v 2 "${output}" -y`;

    exec(ffmpegCmd, (ffErr, ffStdout, ffStderr) => {
      if (ffErr || !fs.existsSync(output)) {
        tempDir.removeCallback();
        console.error('ffmpeg error:', ffStderr);
        const error = `ffmpeg failed: ${ffStderr}`;
        sendErrorEmail(error);
        return res.status(500).json({ error, details: ffStderr });
      }

      const img = fs.readFileSync(output);
      tempDir.removeCallback();
      res.set('Content-Type', 'image/jpeg').status(200).send(img);
    });
  });
};