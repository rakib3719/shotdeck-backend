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
.youtube.com	TRUE	/	TRUE	1785067973	PREF	tz=Asia.Dhaka&f7=100&f4=10000&f6=40000000
.youtube.com	TRUE	/	TRUE	1782043512	__Secure-1PSIDTS	sidts-CjEB5H03P_q7-IIdwqcECVY33ad7n9tGy70mcgxBWktW3tvDGzH5GKk3b45aH3_ODFLSEAA
.youtube.com	TRUE	/	TRUE	1782043512	__Secure-3PSIDTS	sidts-CjEB5H03P_q7-IIdwqcECVY33ad7n9tGy70mcgxBWktW3tvDGzH5GKk3b45aH3_ODFLSEAA
.youtube.com	TRUE	/	FALSE	1750507977	ST-tladcw	session_logininfo=AFmmF2swRgIhAKPonh7_M9D_xxzFNge7RJ5HCKFKGiszqhNH82dMbZGjAiEApc0WMy4_HqKGfoj-414ty1eqiRxzFHwL8zloFQUayLY%3AQUQ3MjNmd1NnN3RmUThWV2NjTV9QMVpRT0h6ek5VMUNna3hwQWFXajVMRlRLMEtxUXlhb1NtYzBudWkxYXBDbU92NGc2SGxnRDdPakdZTW0xX2VUX2xTT0JKLXRRS0R2d1NsVnFVY2F3VmRGaEpicEhQREdEYXBrLTNWQW9mV1I4bkR5OGhOQmVDMVV2ZTc1a1lWaE1DZEZSbWNQT1JOU0FB
.youtube.com	TRUE	/	FALSE	1750507977	ST-3opvp5	session_logininfo=AFmmF2swRgIhAKPonh7_M9D_xxzFNge7RJ5HCKFKGiszqhNH82dMbZGjAiEApc0WMy4_HqKGfoj-414ty1eqiRxzFHwL8zloFQUayLY%3AQUQ3MjNmd1NnN3RmUThWV2NjTV9QMVpRT0h6ek5VMUNna3hwQWFXajVMRlRLMEtxUXlhb1NtYzBudWkxYXBDbU92NGc2SGxnRDdPakdZTW0xX2VUX2xTT0JKLXRRS0R2d1NsVnFVY2F3VmRGaEpicEhQREdEYXBrLTNWQW9mV1I4bkR5OGhOQmVDMVV2ZTc1a1lWaE1DZEZSbWNQT1JOU0FB
.youtube.com	TRUE	/	FALSE	1750507977	ST-xuwub9	session_logininfo=AFmmF2swRgIhAKPonh7_M9D_xxzFNge7RJ5HCKFKGiszqhNH82dMbZGjAiEApc0WMy4_HqKGfoj-414ty1eqiRxzFHwL8zloFQUayLY%3AQUQ3MjNmd1NnN3RmUThWV2NjTV9QMVpRT0h6ek5VMUNna3hwQWFXajVMRlRLMEtxUXlhb1NtYzBudWkxYXBDbU92NGc2SGxnRDdPakdZTW0xX2VUX2xTT0JKLXRRS0R2d1NsVnFVY2F3VmRGaEpicEhQREdEYXBrLTNWQW9mV1I4bkR5OGhOQmVDMVV2ZTc1a1lWaE1DZEZSbWNQT1JOU0FB
.youtube.com	TRUE	/	FALSE	1782043975	SIDCC	AKEyXzW5qApyE6iiYzBP3DN3scS4mPztoxx95DHLNmuHywrRAJrQmEJkpvb_LlTaZEUhe1Ykyg
.youtube.com	TRUE	/	TRUE	1782043975	__Secure-1PSIDCC	AKEyXzVrELYbNvlauZlkRKlg8ZcRcjWQJO-y401MORNZqimwRiu4ykUHPb5A9MM_5DbtdYL7JQ
.youtube.com	TRUE	/	TRUE	1782043975	__Secure-3PSIDCC	AKEyXzVAIySJfE05A-YCW-MHODZH_M398uN2g5XzKVVNWhwGhhcow9zxR3LVJ2C1cN33uTRkuGQ
.youtube.com	TRUE	/	TRUE	1766059970	VISITOR_INFO1_LIVE	wWFeSnOdi3c
.youtube.com	TRUE	/	TRUE	1766059970	VISITOR_PRIVACY_METADATA	CgJCRBIEGgAgHw%3D%3D
.youtube.com	TRUE	/	TRUE	0	YSC	HI6VfU-TOdg
.youtube.com	TRUE	/	TRUE	1766053904	__Secure-ROLLOUT_TOKEN	CJzrr7GMwcWd7AEQjt_C5Ka2jQMY1-X536eCjgM%3D




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
