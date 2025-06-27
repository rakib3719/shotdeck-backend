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

.youtube.com    TRUE    /       TRUE    0       S       youtube_lounge_remote=DT6afFaqTgPmCvbCSlUF82lcnsELSLJB
.youtube.com    TRUE    /       FALSE   0       wide    0
.youtube.com    TRUE    /       TRUE    1785530868      PREF    tz=Europe.Paris&f6=40000000&f5=20000&f7=150&f4=4000000
.youtube.com    TRUE    /       TRUE    1762154164      VISITOR_PRIVACY_METADATA        CgJGUhIhEh0SGwsMDg8QERITFBUWFxg>.youtube.com    TRUE    /       TRUE    1785098535      SOCS    CAESEwgDEgk3NzU0NTE5MjQaAmZyIAEaBgiAm_LCBg
.youtube.com    TRUE    /       TRUE    1782506809      __Secure-1PSIDTS        sidts-CjIB5H03Pwwc8bquGWbw7lYXZkUT4i-GC>.youtube.com    TRUE    /       TRUE    1782506809      __Secure-3PSIDTS        sidts-CjIB5H03Pwwc8bquGWbw7lYXZkUT4i-GC>.youtube.com    TRUE    /       FALSE   1785530810      HSID    A6saciNSAtsfmkGKD
.youtube.com    TRUE    /       TRUE    1785530810      SSID    AByjUuL-X3fLeefm7
# Netscape HTTP Cookie File
# http://curl.haxx.se/rfc/cookie_spec.html
# This is a generated file!  Do not edit.

.youtube.com	TRUE	/	TRUE	0	S	youtube_lounge_remote=DT6afFaqTgPmCvbCSlUF82lcnsELSLJB
.youtube.com	TRUE	/	FALSE	0	wide	0
.youtube.com	TRUE	/	TRUE	1785530868	PREF	tz=Europe.Paris&f6=40000000&f5=20000&f7=150&f4=4000000
.youtube.com	TRUE	/	TRUE	1762154164	VISITOR_PRIVACY_METADATA	CgJGUhIhEh0SGwsMDg8QERITFBUWFxgZGhscHR4fICEiIyQlJiBE
.youtube.com	TRUE	/	TRUE	1785098535	SOCS	CAESEwgDEgk3NzU0NTE5MjQaAmZyIAEaBgiAm_LCBg
.youtube.com	TRUE	/	TRUE	1782506809	__Secure-1PSIDTS	sidts-CjIB5H03Pwwc8bquGWbw7lYXZkUT4i-GCKywq3wXuwQseHWKwkSfeiSY7kV92wnKHhs55hAA
.youtube.com	TRUE	/	TRUE	1782506809	__Secure-3PSIDTS	sidts-CjIB5H03Pwwc8bquGWbw7lYXZkUT4i-GCKywq3wXuwQseHWKwkSfeiSY7kV92wnKHhs55hAA
.youtube.com	TRUE	/	FALSE	1785530810	HSID	A6saciNSAtsfmkGKD
.youtube.com	TRUE	/	TRUE	1785530810	SSID	AByjUuL-X3fLeefm7
.youtube.com	TRUE	/	FALSE	1785530810	APISID	lXG-lmAj6aYKZ-0I/Ad0GzO98vEJo35VE9
.youtube.com	TRUE	/	TRUE	1785530810	SAPISID	q_qiTejjTpz8MTsB/A8kvlaK25ll-wP6F2
.youtube.com	TRUE	/	TRUE	1785530810	__Secure-1PAPISID	q_qiTejjTpz8MTsB/A8kvlaK25ll-wP6F2
.youtube.com	TRUE	/	TRUE	1785530810	__Secure-3PAPISID	q_qiTejjTpz8MTsB/A8kvlaK25ll-wP6F2
.youtube.com	TRUE	/	TRUE	1785530810	LOGIN_INFO	AFmmF2swRgIhAOTyFKGlcgMUHV95BKdS0X0tHBmygT4OijE7o4E8OHAEAiEA-A8Q2urus0lsIw8pjVVHHeLEjjFoFscCgvT7F27j2B0:QUQ3MjNmemtnNlpuOW1iV3FyRVFJWGU1V1RQcHRyNHNHdkZYRV84U1Q3MnMyczhieWVwMmhkOXZ6VURCYzZvM0dmSjFINHVuU1RWeHN3REtSd0NnUEV3bF93TWNRemY2ckoySGEtTnZXQ21tM1RSTjNzN3Z1OXpXckkwSWUtQV8xSm5HN2dmX1hZQ3ljeWJaQ1V6cmx5ZGJJRlp3b3FCZTh3
.youtube.com	TRUE	/	TRUE	1750970930	YTSESSION-1b	ANPz9KiQJKk+30T7N+vjLq8eJt5aC3y1w3/MeN4PCKlx6/J+tujkEHZ624RKZ5x6RpgxLaRP+5Nl8lJSZuQMzyw2jMxMsTChXAVubSXkQbZRAUh3
.youtube.com	TRUE	/	FALSE	1785530810	SID	g.a000ygiuVH1f-BKA2IufKOldNKumQ4LmjHCrEky1yEHnonLAy1SoHzfVGJntgg6VIwP1xDOaNAACgYKAW8SARUSFQHGX2MiQwU8vi5aHo10jj5h7Xn0IRoVAUF8yKp2L0N4MtEsoOZ1bIuLD6cM0076
.youtube.com	TRUE	/	TRUE	1785530810	__Secure-1PSID	g.a000ygiuVH1f-BKA2IufKOldNKumQ4LmjHCrEky1yEHnonLAy1So_p4o4tv-4VhIFvE5mg3n3wACgYKAZ0SARUSFQHGX2MizzCvPi-5UAkXslJCPI8EGBoVAUF8yKp5asRc73imm-NWKOzKmwWc0076
.youtube.com	TRUE	/	TRUE	1785530810	__Secure-3PSID	g.a000ygiuVH1f-BKA2IufKOldNKumQ4LmjHCrEky1yEHnonLAy1Som5mxBrtyP3yKgIzjS5LmxwACgYKAdwSARUSFQHGX2MiK_vjacRs6X6NjmGv3zzkjhoVAUF8yKr7OgoL1POWanmnxLrBLx0Z0076
.youtube.com	TRUE	/	TRUE	1766782013	NID	525=R74YbcWuUJpJVmpPdM9Bkl_5IxVuhtoGaAGsmferMbWGBcerMcBuBbBxog3jbyYqWtTM26s88Ut4X3BmfuafAkrQKd73NfhwQI7zJDXJkob7qjgHyyKwFvJeUB79a2lBGbao2O6yXV4Bf_8EuSuIGYceyKR0gpLLvJ57ogBZld6f3r5QMQBllokERoWKXJ1OAQr0JnRK4QVk8qUYbIbCm-Os3JSRdNOFOaFr1ib5HiqTzncgpLrwfbz5bEeVDWo0fnZ0wBXfL3aOF9nl
.youtube.com	TRUE	/	TRUE	1750971463	CONSISTENCY	AKreu9sL666dsGFab5h8LDVUEX37qgNTojuAedstvcFs6fIHd42PaFGc7x7OnMrQyLvuMotuFeN_I8c6aWE3OeygotKzOl3rYkeNs0WUeNBITmrOVOIVCLhB0Wti420LKgHIh1nn8MM0e_ei3LBT4epInFXPmYVW1eHpybE2u60wUIQLm7x4eIi5L61zJRLscq-sx_CN-gI6AQqKVvW-ison-60vnMfUcMrC27XGk1IUhSMm1EMagyYnhuS8eLkLEum0S2EdsITIEdgPMEsEQ7tdsa44-hoxWCig7V_BgQJ1E_6iPyv0RrG_hlK8bkLkqYI5FjG12PqLLMUCI6QYAcKv3ZTe
.youtube.com	TRUE	/	TRUE	1777230532	__Secure-YEC	CgtfcENObnIyTWpPOCjz4_bCBjInCgJGUhIhEh0SGwsMDg8QERITFBUWFxgZGhscHR4fICEiIyQlJiAR
.youtube.com	TRUE	/	FALSE	1782506871	SIDCC	AKEyXzVK78Qr1hErFZ7aeTSOHHMq_9fa4wqK0pQGVs9hPYIg_4fOSMmNXI4xQ60dVLYhAG1V
.youtube.com	TRUE	/	TRUE	1782506871	__Secure-1PSIDCC	AKEyXzXOfmG6eFpbcEss6k96-ePJEI2Kf2yB5ofrbx2XIsLDIiUWI_DOd9DKn3Vfoq-2r4Lk
.youtube.com	TRUE	/	TRUE	1782506871	__Secure-3PSIDCC	AKEyXzX7TFYV6KAIeE9ypqWJOklCn12B2So05agZ_nQ7SNjtdjVxadO0-WP9r5it7NnW_zvrnQ
.youtube.com	TRUE	/	TRUE	1766477774	__Secure-ROLLOUT_TOKEN	CIOF4bnow5agsgEQs6bfhZGZigMYmuqm5tKOjgM%3D
.youtube.com	TRUE	/	TRUE	0	YSC	vhb-wil5-RA
.youtube.com	TRUE	/	TRUE	1766522871	VISITOR_PRIVACY_METADATA	CgJGUhIhEh0SGwsMDg8QERITFBUWFxgZGhscHR4fICEiIyQlJiAR









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














