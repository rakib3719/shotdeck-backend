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

.youtube.com	TRUE	/	TRUE	1785619674	PREF	f4=4000000&f6=40000000&tz=Europe.Paris
.youtube.com	TRUE	/	TRUE	1785187634	SOCS	CAISEwgDEgk3NzU4Mzc2MTQaAmZyIAEaBgiAvvfCBg
.youtube.com	TRUE	/	TRUE	1766611634	VISITOR_INFO1_LIVE	YcvmhuxgyBI
.youtube.com	TRUE	/	TRUE	1751061434	GPS	1
.youtube.com	TRUE	/	TRUE	1782595673	__Secure-1PSIDTS	sidts-CjIB5H03PxzCKedVT987Or7_AHvu2-w4yUmaYFgVsgLuCV9HSFa8p7qNHe6SXRv46mQvvRAA
.youtube.com	TRUE	/	TRUE	1782595673	__Secure-3PSIDTS	sidts-CjIB5H03PxzCKedVT987Or7_AHvu2-w4yUmaYFgVsgLuCV9HSFa8p7qNHe6SXRv46mQvvRAA
.youtube.com	TRUE	/	FALSE	1785619673	HSID	At43vi0RgzgGUU_Ik
.youtube.com	TRUE	/	TRUE	1785619673	SSID	AAQxoXoc8PciqjsZk
.youtube.com	TRUE	/	FALSE	1785619673	APISID	ikeDnO4jjLQt_pk3/A_B4b0AIq-zDhYSDT
.youtube.com	TRUE	/	TRUE	1785619673	SAPISID	0icL9qOkSCTAw0_S/AkgKbixuRWhA6-GGo
.youtube.com	TRUE	/	TRUE	1785619673	__Secure-1PAPISID	0icL9qOkSCTAw0_S/AkgKbixuRWhA6-GGo
.youtube.com	TRUE	/	TRUE	1785619673	__Secure-3PAPISID	0icL9qOkSCTAw0_S/AkgKbixuRWhA6-GGo
.youtube.com	TRUE	/	FALSE	1785619673	SID	g.a000ygiuVIcObUOGJQFOQzyEY5H1cj8kKBVmVB2qjbJcWpk55tdEhsgo_sMGDZNFMr7aKa6mRAACgYKAVcSARUSFQHGX2MiEPAaKoLJM6OIbktMqUxEZxoVAUF8yKoMEbzGg6AkdXVX6VOqP4Uz0076
.youtube.com	TRUE	/	TRUE	1785619673	__Secure-1PSID	g.a000ygiuVIcObUOGJQFOQzyEY5H1cj8kKBVmVB2qjbJcWpk55tdEYwituzlk58kSPd1YeyXmQwACgYKAQoSARUSFQHGX2MinucmHBzMrLXLM8ydOT3zRRoVAUF8yKoHaDlWn11QmhdK3gKvwyBp0076
.youtube.com	TRUE	/	TRUE	1785619673	__Secure-3PSID	g.a000ygiuVIcObUOGJQFOQzyEY5H1cj8kKBVmVB2qjbJcWpk55tdE79IIAHo0JZkKdd3nP58B1AACgYKAccSARUSFQHGX2MiT2wXhbUDPhJ2uIpYrAVTtxoVAUF8yKoyrqnFRbedSeKfKYSdHNoN0076
.youtube.com	TRUE	/	TRUE	1785619673	LOGIN_INFO	AFmmF2swRAIgRjazj5dh38zrgZR0QTQoFI2QEitogyu-FUBh7WhDTY0CICnsDnVAlLtu1P6ZI5IndcBytm6UG5hZcXBGTpEWNYsv:QUQ3MjNmd3lqWE5KX2lidXhpNVhGMUl3c1JINTBaY21wMDV6NWdjeWtkTG5mR0ZEQURXR3pFdUVEX3owSE1EeG1xSlF3RnZfR3VHOE5ZcXdNeTI1TGhFX1RUU25VVmQ2bkhBZlpycDNmRUVrWFR0am9VOGlSWFAyUzgzV0JyOG5CR2VhbEpBOXY0bHpuLVRsM3BmWnByUTVaRXhCOW9CeUxR
.youtube.com	TRUE	/	FALSE	1782595700	SIDCC	AKEyXzW_5vUozPMChNzT1IxaA0YwODAE0bOhZIXKZw7nrYJnduiwC9fTcP0R4LMyvZ6ehxWdYg
.youtube.com	TRUE	/	TRUE	1782595700	__Secure-1PSIDCC	AKEyXzX_N-l6UhZfYRggj1e4Nl0375VT0_CL6XtuNR2MIUO2BkZKr6F-eeT9xgs0_iKQPXcG
.youtube.com	TRUE	/	TRUE	1782595700	__Secure-3PSIDCC	AKEyXzV4gTln7J7qcur3DslCgYj70rWNaWKhcIN1Yd-NV32DyGYTad0V1ZBPL6LCpt6vR0bmSQ
.youtube.com	TRUE	/	TRUE	0	YSC	IdMDRne7Aw8
.youtube.com	TRUE	/	TRUE	1766611676	VISITOR_INFO1_LIVE	V5n5lC3j4WU
.youtube.com	TRUE	/	TRUE	1766611676	VISITOR_PRIVACY_METADATA	CgJGUhIhEh0SGwsMDg8QERITFBUWFxgZGhscHR4fICEiIyQlJiBs
.youtube.com	TRUE	/	TRUE	1766611634	__Secure-ROLLOUT_TOKEN	CLmF6LjB7_v-wAEQopGVvMWSjgMY9f6YvMWSjgM%3D

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














