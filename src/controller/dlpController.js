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
.youtube.com	TRUE	/	TRUE	1785218890	LOGIN_INFO	AFmmF2swRQIgV-vdn20bQhHMurDpi_5FbqAFNwmCuJOVHRUxUXdGo2ICIQDZQR-t50Vxqm_Gb-tx4WdttyBaWlKvfGAh5dQbiu1UCQ:QUQ3MjNmeFBiQTZnMHFVQ3VzRy1VZ1dXTmFMYmk2bFFxSXctaWUyV09RQ0dwdHRkcTJzWnZsYnUxZW54UjhPU0prTEtaSG9Tc2pLeEI5SUNyTUhROTJxREpLV0liSndKaVlQUFF5Zm81MFNMcVNwRXU5STgxWGprRUxIemdyMTdmVzg2OTE4STlxamZGTjNocXZkVjFQZ2VBNVdTWWY1Snp3
.youtube.com	TRUE	/	TRUE	1785574909	PREF	tz=Asia.Dhaka&f7=100&f6=40000000
.youtube.com	TRUE	/	FALSE	1785500171	SID	g.a000yQhDLGvqjJX63IowXvvckGBwwt4AulPMN5Go-G4IFz9hdV0h_FFf1dNrI93KM4agJhHqSAACgYKAWISARcSFQHGX2Mi2T3SUwngvGl73ulmfwK8vRoVAUF8yKrLIaLYLKJiPO_Rull5pSIt0076
.youtube.com	TRUE	/	TRUE	1785500171	__Secure-1PSID	g.a000yQhDLGvqjJX63IowXvvckGBwwt4AulPMN5Go-G4IFz9hdV0hXldpdJRCgun-jjSKtb5Y9AACgYKAdISARcSFQHGX2MiFttU-CWhtk3cSTEhFaChoBoVAUF8yKrNeJe8CBAY5xC0TOVfc8tH0076
.youtube.com	TRUE	/	TRUE	1785500171	__Secure-3PSID	g.a000yQhDLGvqjJX63IowXvvckGBwwt4AulPMN5Go-G4IFz9hdV0hABcWvWJb9nA8E1dEECoF8QACgYKAWESARcSFQHGX2Mit1CNUj-Gpx8HX09GEMEHoBoVAUF8yKpMeNzJaWKI3QQRWhgXUkpC0076
.youtube.com	TRUE	/	FALSE	1785500171	HSID	ABE3opzfS24H-PIg5
.youtube.com	TRUE	/	TRUE	1785500171	SSID	AnDsHBvBj_vB4oeVa
.youtube.com	TRUE	/	FALSE	1785500171	APISID	z6fxH5RxbtsCyu5G/AIfSz8biYCZ8QyUpM
.youtube.com	TRUE	/	TRUE	1785500171	SAPISID	BznAqCqrIP4BAnhj/Awpxw8bqqe0xup20X
.youtube.com	TRUE	/	TRUE	1785500171	__Secure-1PAPISID	BznAqCqrIP4BAnhj/Awpxw8bqqe0xup20X
.youtube.com	TRUE	/	TRUE	1785500171	__Secure-3PAPISID	BznAqCqrIP4BAnhj/Awpxw8bqqe0xup20X
.youtube.com	TRUE	/	TRUE	1782551866	__Secure-1PSIDTS	sidts-CjEB5H03P8osPypggIVPFrFAfeQyUwKeQVtogVc2LVGZUH3l3VQoBCLmLJCZi8T5lCAVEAA
.youtube.com	TRUE	/	TRUE	1782551866	__Secure-3PSIDTS	sidts-CjEB5H03P8osPypggIVPFrFAfeQyUwKeQVtogVc2LVGZUH3l3VQoBCLmLJCZi8T5lCAVEAA
.youtube.com	TRUE	/	FALSE	1782551866	SIDCC	AKEyXzW_xnLr15MdQPD9G97MkArE2jEyJw7TUiE_gb2o4uufytQ61c-MP_qmPrg3MS8G5SnB6g
.youtube.com	TRUE	/	TRUE	1782551866	__Secure-1PSIDCC	AKEyXzXl8EoN1gdvv6mY97ku-VyMCwOAB40WjXL-22XbkJVrm8jH8fip3lGo1Qufsf8VfBUxOw
.youtube.com	TRUE	/	TRUE	1782551866	__Secure-3PSIDCC	AKEyXzUhWOF1Q21-P1Oh-R0uXKJ3D1NRbsOwR0TYYgFcHvXK90lIniFmQX7maPFS1tTGNxIcp3s
.youtube.com	TRUE	/	TRUE	1766564855	VISITOR_INFO1_LIVE	wWFeSnOdi3c
.youtube.com	TRUE	/	TRUE	1766564855	VISITOR_PRIVACY_METADATA	CgJCRBIEGgAgHw%3D%3D
.youtube.com	TRUE	/	TRUE	1766545021	__Secure-ROLLOUT_TOKEN	CJzrr7GMwcWd7AEQjt_C5Ka2jQMYoov7pc2QjgM%3D
.youtube.com	TRUE	/	TRUE	0	YSC	6Y74rDtYyk4




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














