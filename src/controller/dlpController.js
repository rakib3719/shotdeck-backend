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
.youtube.com	TRUE	/	TRUE	1785489029	PREF	tz=Asia.Dhaka&f7=100&f6=40000000
.youtube.com	TRUE	/	FALSE	1785218619	HSID	AeXsIFTYvJyDevY7z
.youtube.com	TRUE	/	TRUE	1785218619	SSID	AbrOfdHMcBLMt89fI
.youtube.com	TRUE	/	FALSE	1785218619	APISID	I_ZzePouuGb4lJHh/A_4hc7Ray2JypdPv7
.youtube.com	TRUE	/	TRUE	1785218619	SAPISID	0I48LvzUFV3O3528/AiJZ4QHwGPWMFCVDO
.youtube.com	TRUE	/	TRUE	1785218619	__Secure-1PAPISID	0I48LvzUFV3O3528/AiJZ4QHwGPWMFCVDO
.youtube.com	TRUE	/	TRUE	1785218619	__Secure-3PAPISID	0I48LvzUFV3O3528/AiJZ4QHwGPWMFCVDO
.youtube.com	TRUE	/	FALSE	1785218619	SID	g.a000yQhDLL8D-UKmNv7Lrx78hWAF-hsUzC6SpzjZrsfZiHur_MeNfyazjq3ASfYW1EzFHjqRaAACgYKAX0SARcSFQHGX2Mil3dHzarYb6Q6Z0vDeiVW4RoVAUF8yKryGrNGU4vCBjYaAchhXxps0076
.youtube.com	TRUE	/	TRUE	1785218619	__Secure-1PSID	g.a000yQhDLL8D-UKmNv7Lrx78hWAF-hsUzC6SpzjZrsfZiHur_MeNCh7FR0ZPHymwmBF-LCQedQACgYKATISARcSFQHGX2Mi28tjjVndDILCQU_ipUkJdBoVAUF8yKqQItkX_wu8iZR-YijPKgYE0076
.youtube.com	TRUE	/	TRUE	1785218619	__Secure-3PSID	g.a000yQhDLL8D-UKmNv7Lrx78hWAF-hsUzC6SpzjZrsfZiHur_MeNyhbbdA8sarHzen2y3RHY1QACgYKAbkSARcSFQHGX2MiT6HU8UNp_6j6xj-d4GtJpBoVAUF8yKplS_2BJxOVRlhW9JyITS-p0076
.youtube.com	TRUE	/	TRUE	1785218890	LOGIN_INFO	AFmmF2swRQIgV-vdn20bQhHMurDpi_5FbqAFNwmCuJOVHRUxUXdGo2ICIQDZQR-t50Vxqm_Gb-tx4WdttyBaWlKvfGAh5dQbiu1UCQ:QUQ3MjNmeFBiQTZnMHFVQ3VzRy1VZ1dXTmFMYmk2bFFxSXctaWUyV09RQ0dwdHRkcTJzWnZsYnUxZW54UjhPU0prTEtaSG9Tc2pLeEI5SUNyTUhROTJxREpLV0liSndKaVlQUFF5Zm81MFNMcVNwRXU5STgxWGprRUxIemdyMTdmVzg2OTE4STlxamZGTjNocXZkVjFQZ2VBNVdTWWY1Snp3
.youtube.com	TRUE	/	TRUE	1782464668	__Secure-1PSIDTS	sidts-CjEB5H03Pzyq9B67gz2Nf3-nXD1OMbNJOz9XQImtDWJOkRB4nLWdm0Kn6k-eeWuYVdWZEAA
.youtube.com	TRUE	/	TRUE	1782464668	__Secure-3PSIDTS	sidts-CjEB5H03Pzyq9B67gz2Nf3-nXD1OMbNJOz9XQImtDWJOkRB4nLWdm0Kn6k-eeWuYVdWZEAA
.youtube.com	TRUE	/	FALSE	1782465070	SIDCC	AKEyXzUtd798j8cnIgW3cUI8C6uyha07DR29lroncUfAn2OlgyhmSmth26HWzvsgL_wl9l35HQ
.youtube.com	TRUE	/	TRUE	1782465070	__Secure-1PSIDCC	AKEyXzViNZLD3bDlrx2a1xqoVwpbLR7sLzKD37Ld7UIBBu3trNdC8cK0LO1SbBEou_qQd3LI2Q
.youtube.com	TRUE	/	TRUE	1782465070	__Secure-3PSIDCC	AKEyXzXuAITTzwUdXW25oSJZn5PCyfOCOCKvjnoxSiVMY4eCMbnnEx9uHII1DsMUJt-8wFuJ4zU
.youtube.com	TRUE	/	TRUE	1766481027	VISITOR_INFO1_LIVE	wWFeSnOdi3c
.youtube.com	TRUE	/	TRUE	1766481027	VISITOR_PRIVACY_METADATA	CgJCRBIEGgAgHw%3D%3D
.youtube.com	TRUE	/	TRUE	0	YSC	0UQ9Co29V2M
.youtube.com	TRUE	/	TRUE	1766458572	__Secure-ROLLOUT_TOKEN	CJzrr7GMwcWd7AEQjt_C5Ka2jQMY8ojyn4uOjgM%3D









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
