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

.youtube.com	TRUE	/	TRUE	1784448967	__Secure-1PAPISID	cNf1nwBjfyBtZBal/AK-r0LbNiQzz2h4wy
.youtube.com	TRUE	/	TRUE	1784448967	__Secure-1PSID	g.a000yAhDLHxNXR8YLkXbiG8webUYxoKN32NJYoNdmT16wHzyaNhfeEc65cPGK5-MCFVS1QYQ9wACgYKATASARcSFQHGX2MiH_5vhuvWAy9g4BesihZuVhoVAUF8yKpkhis-e7GtCeOrdkJhhKn00076
.youtube.com	TRUE	/	TRUE	1784448967	__Secure-3PAPISID	cNf1nwBjfyBtZBal/AK-r0LbNiQzz2h4wy
.youtube.com	TRUE	/	TRUE	1784448967	__Secure-3PSID	g.a000yAhDLHxNXR8YLkXbiG8webUYxoKN32NJYoNdmT16wHzyaNhfpgNtsJbgFiOrTMsGAhJodQACgYKAQkSARcSFQHGX2MiITr3TdZEBCp6_qfHs_3gSBoVAUF8yKpprRN3-3y7kcRwhQl-Bkn-0076
.youtube.com	TRUE	/	FALSE	1784448967	APISID	VXqIJJqCOWmoRq90/AOacXsUFCHcapyzx7
.youtube.com	TRUE	/	TRUE	1782100136	LOGIN_INFO	AFmmF2swRgIhAKPonh7_M9D_xxzFNge7RJ5HCKFKGiszqhNH82dMbZGjAiEApc0WMy4_HqKGfoj-414ty1eqiRxzFHwL8zloFQUayLY:QUQ3MjNmd1NnN3RmUThWV2NjTV9QMVpRT0h6ek5VMUNna3hwQWFXajVMRlRLMEtxUXlhb1NtYzBudWkxYXBDbU92NGc2SGxnRDdPakdZTW0xX2VUX2xTT0JKLXRRS0R2d1NsVnFVY2F3VmRGaEpicEhQREdEYXBrLTNWQW9mV1I4bkR5OGhOQmVDMVV2ZTc1a1lWaE1DZEZSbWNQT1JOU0FB
.youtube.com	TRUE	/	TRUE	1784448967	SAPISID	cNf1nwBjfyBtZBal/AK-r0LbNiQzz2h4wy
.youtube.com	TRUE	/	FALSE	1784448967	SID	g.a000yAhDLHxNXR8YLkXbiG8webUYxoKN32NJYoNdmT16wHzyaNhfjBRtiejXZJuxPoXOG8ai9gACgYKAZgSARcSFQHGX2MiCKbB2dza45CswqIe74Tn-xoVAUF8yKrFISQ_8RQef75ugM1hvL9Q0076
.youtube.com	TRUE	/	TRUE	1784448967	SSID	AMheZOdZM9aRo5ouN
.youtube.com	TRUE	/	TRUE	1765443892	VISITOR_INFO1_LIVE	8d2LPbbrwlI
.youtube.com	TRUE	/	TRUE	1765443892	VISITOR_PRIVACY_METADATA	CgJCRBIEGgAgDA%3D%3D
.youtube.com	TRUE	/	FALSE	1784448967	HSID	A9SgG9968dsK6JZjg
.youtube.com	TRUE	/	TRUE	1785042203	PREF	tz=Asia.Dhaka&f7=100&f4=10000&f6=40000000
.youtube.com	TRUE	/	TRUE	1750482802	CONSISTENCY	AKreu9ufYaTVW8d_MwcvBm8wS-aJ7KTmVGwqMdPVsOlUPwze_mPUtxzziCKr9UQTD3NczgnQ0q10NaZcSqbAZZNIEHbA_Vfp64W1MQxewoDwLmTL5csrnupYVT1BFzVS2kYsNjkR0GdC4wn1YTM5I2t6
.youtube.com	TRUE	/	TRUE	1782018204	__Secure-1PSIDTS	sidts-CjEB5H03P_d0WqfIcne7_XNMCd3BpA2P7VtErXWUuJ_eNim0U_OEqfxU2eJniVfzhrNMEAA
.youtube.com	TRUE	/	TRUE	1782018204	__Secure-3PSIDTS	sidts-CjEB5H03P_d0WqfIcne7_XNMCd3BpA2P7VtErXWUuJ_eNim0U_OEqfxU2eJniVfzhrNMEAA
.youtube.com	TRUE	/	FALSE	1782018211	SIDCC	AKEyXzUEufwbntFnbdhGdvrP6m2BcgaYhG7vMhhwQZkbnEvbUqrXxls7qyfpZIlE5wD7xCMWeA
.youtube.com	TRUE	/	TRUE	1782018211	__Secure-1PSIDCC	AKEyXzUc8ryla5Psf5Y6LVu-ssQS85PxdP3HKddPqD7a51DRBCd0VPDgj2G22r86520bA1nYNQ
.youtube.com	TRUE	/	TRUE	1782018211	__Secure-3PSIDCC	AKEyXzW3UjWEC01ABwCjqLWCmG7Z4oIoDIBVQ1s-8ywKPMirDYaMqFEiFrPQXT3TfoOlmlHRpeU
.youtube.com	TRUE	/	TRUE	1766034201	VISITOR_INFO1_LIVE	wWFeSnOdi3c
.youtube.com	TRUE	/	TRUE	1766034201	VISITOR_PRIVACY_METADATA	CgJCRBIEGgAgHw%3D%3D
.youtube.com	TRUE	/	TRUE	1765967267	__Secure-ROLLOUT_TOKEN	CJzrr7GMwcWd7AEQjt_C5Ka2jQMY7vSb_-T_jQM%3D
.youtube.com	TRUE	/	TRUE	0	YSC	-BMvb8V9bxw



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
