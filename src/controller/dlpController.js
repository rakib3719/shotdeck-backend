import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import tmp from 'tmp';

/**
 * Your raw cookies string copied directly from the .txt file.
 * Keep the exact Netscape cookie format including comments.
 * This will be saved to a temporary file before running yt-dlp.
 */
const rawCookies = `# Netscape HTTP Cookie File
# http://curl.haxx.se/rfc/cookie_spec.html
# This is a generated file!  Do not edit.

.youtube.com	TRUE	/	TRUE	1765443892	VISITOR_INFO1_LIVE	8d2LPbbrwlI
.youtube.com	TRUE	/	TRUE	1765443892	VISITOR_PRIVACY_METADATA	CgJCRBIEGgAgDA%3D%3D
.youtube.com	TRUE	/	TRUE	1785218620	PREF	tz=Asia.Dhaka&f7=100&f6=40000000
.youtube.com	TRUE	/	FALSE	1785218619	HSID	AeXsIFTYvJyDevY7z
.youtube.com	TRUE	/	TRUE	1785218619	SSID	AbrOfdHMcBLMt89fI
.youtube.com	TRUE	/	FALSE	1785218619	APISID	I_ZzePouuGb4lJHh/A_4hc7Ray2JypdPv7
.youtube.com	TRUE	/	TRUE	1785218619	SAPISID	0I48LvzUFV3O3528/AiJZ4QHwGPWMFCVDO
.youtube.com	TRUE	/	TRUE	1785218619	__Secure-1PAPISID	0I48LvzUFV3O3528/AiJZ4QHwGPWMFCVDO
.youtube.com	TRUE	/	TRUE	1785218619	__Secure-3PAPISID	0I48LvzUFV3O3528/AiJZ4QHwGPWMFCVDO
.youtube.com	TRUE	/	TRUE	1750658736	YTSESSION-1b	ANPz9Kha2GVKMVZNtVoo8EzN2saXSEI033oMiKLUMu6i+E0uRU46UCeGZ3RPRIGtR0RGGYSrFlJj54pnBYqb2C5QIK/GtiknJwJ05KQ=
.youtube.com	TRUE	/	TRUE	1750660416	GPS	1
.youtube.com	TRUE	/	TRUE	1782194616	__Secure-1PSIDTS	sidts-CjEB5H03P4h-jCPO1GMFvGLvWYUw6ecTcZyF4h9mdows-0hxg6QRCQznJYbfZdcFQnKrEAA
.youtube.com	TRUE	/	TRUE	1782194616	__Secure-3PSIDTS	sidts-CjEB5H03P4h-jCPO1GMFvGLvWYUw6ecTcZyF4h9mdows-0hxg6QRCQznJYbfZdcFQnKrEAA
.youtube.com	TRUE	/	TRUE	1785218617	LOGIN_INFO	AFmmF2swRgIhALmA1sM0p4KN_8FYwtehEeeyU6f403IyGM7_wiujlsFUAiEAlHwHWlMVnVtvjvxNy-w87bgHS_AvUzNvR7xbPsr083Y:QUQ3MjNmeldxdFo3MGFEUVZycU9xbU10YzM4VHRXNUVaejZzYnc2dFlCTE5YYU1aR0hiakw5cXBRWDJ5WFoxX0RncGJUc2VQby1VV0RKTU5XOHdWRmh1VjRzNndOZmFJMGxxcklOQTl3cVBoVy05TGtGZ0Utbkl3VlRaUGx0Q1kxVW1OVW40bS0xdmtmUUluMkcxZE1jdUFYM1JrTFpKODJn
.youtube.com	TRUE	/	FALSE	1785218619	SID	g.a000yQhDLL8D-UKmNv7Lrx78hWAF-hsUzC6SpzjZrsfZiHur_MeNfyazjq3ASfYW1EzFHjqRaAACgYKAX0SARcSFQHGX2Mil3dHzarYb6Q6Z0vDeiVW4RoVAUF8yKryGrNGU4vCBjYaAchhXxps0076
.youtube.com	TRUE	/	TRUE	1785218619	__Secure-1PSID	g.a000yQhDLL8D-UKmNv7Lrx78hWAF-hsUzC6SpzjZrsfZiHur_MeNCh7FR0ZPHymwmBF-LCQedQACgYKATISARcSFQHGX2Mi28tjjVndDILCQU_ipUkJdBoVAUF8yKqQItkX_wu8iZR-YijPKgYE0076
.youtube.com	TRUE	/	TRUE	1785218619	__Secure-3PSID	g.a000yQhDLL8D-UKmNv7Lrx78hWAF-hsUzC6SpzjZrsfZiHur_MeNyhbbdA8sarHzen2y3RHY1QACgYKAbkSARcSFQHGX2MiT6HU8UNp_6j6xj-d4GtJpBoVAUF8yKplS_2BJxOVRlhW9JyITS-p0076
.youtube.com	TRUE	/	FALSE	1782194631	SIDCC	AKEyXzXgizrv_J6dBvcfObkWhbfyUt4FJ05FDzJ1D4-9Ty6FQcC9d8Y4ctAX7t2Owo7UENRLEw
.youtube.com	TRUE	/	TRUE	1782194631	__Secure-1PSIDCC	AKEyXzW9ZT94wEb10bEKR0w18eGfni34B9WinOaY87rWk5-upwuYnTVtubexXBBo_0kz2ON0OQ
.youtube.com	TRUE	/	TRUE	1782194631	__Secure-3PSIDCC	AKEyXzUBH8ENcoefKuSoK5toB-_pKlvtgdKLK7xKrYnfrkYBL4W101KI2_mBS89zk43lO3Ot3iM
.youtube.com	TRUE	/	TRUE	1766210619	VISITOR_INFO1_LIVE	wWFeSnOdi3c
.youtube.com	TRUE	/	TRUE	1766210619	VISITOR_PRIVACY_METADATA	CgJCRBIEGgAgHw%3D%3D
.youtube.com	TRUE	/	TRUE	0	YSC	xU-gyf9GudQ
.youtube.com	TRUE	/	TRUE	1766200694	__Secure-ROLLOUT_TOKEN	CJzrr7GMwcWd7AEQjt_C5Ka2jQMY5PrgycqGjgM%3D





`;

export const getScreenshot = (req, res) => {
  const { url, timestamp } = req.query;
  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  const cleanUrl = url.split('?')[0];
  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const output = path.join(tempDir.name, 'thumb.jpg');

  // Write cookies to a temp file
  const cookiesPath = path.join(tempDir.name, 'youtube_cookies.txt');
  fs.writeFileSync(cookiesPath, rawCookies);

  // Use yt-dlp with the cookie file inside temp dir
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
