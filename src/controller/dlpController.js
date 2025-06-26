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
.youtube.com	TRUE	/	TRUE	1785469315	PREF	tz=Asia.Dhaka&f7=100&f6=40000000
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
.youtube.com	TRUE	/	FALSE	1750909319	ST-l3hjtt	session_logininfo=AFmmF2swRQIgV-vdn20bQhHMurDpi_5FbqAFNwmCuJOVHRUxUXdGo2ICIQDZQR-t50Vxqm_Gb-tx4WdttyBaWlKvfGAh5dQbiu1UCQ%3AQUQ3MjNmeFBiQTZnMHFVQ3VzRy1VZ1dXTmFMYmk2bFFxSXctaWUyV09RQ0dwdHRkcTJzWnZsYnUxZW54UjhPU0prTEtaSG9Tc2pLeEI5SUNyTUhROTJxREpLV0liSndKaVlQUFF5Zm81MFNMcVNwRXU5STgxWGprRUxIemdyMTdmVzg2OTE4STlxamZGTjNocXZkVjFQZ2VBNVdTWWY1Snp3
.youtube.com	TRUE	/	FALSE	1750909319	ST-tladcw	session_logininfo=AFmmF2swRQIgV-vdn20bQhHMurDpi_5FbqAFNwmCuJOVHRUxUXdGo2ICIQDZQR-t50Vxqm_Gb-tx4WdttyBaWlKvfGAh5dQbiu1UCQ%3AQUQ3MjNmeFBiQTZnMHFVQ3VzRy1VZ1dXTmFMYmk2bFFxSXctaWUyV09RQ0dwdHRkcTJzWnZsYnUxZW54UjhPU0prTEtaSG9Tc2pLeEI5SUNyTUhROTJxREpLV0liSndKaVlQUFF5Zm81MFNMcVNwRXU5STgxWGprRUxIemdyMTdmVzg2OTE4STlxamZGTjNocXZkVjFQZ2VBNVdTWWY1Snp3
.youtube.com	TRUE	/	FALSE	1750909319	ST-3opvp5	session_logininfo=AFmmF2swRQIgV-vdn20bQhHMurDpi_5FbqAFNwmCuJOVHRUxUXdGo2ICIQDZQR-t50Vxqm_Gb-tx4WdttyBaWlKvfGAh5dQbiu1UCQ%3AQUQ3MjNmeFBiQTZnMHFVQ3VzRy1VZ1dXTmFMYmk2bFFxSXctaWUyV09RQ0dwdHRkcTJzWnZsYnUxZW54UjhPU0prTEtaSG9Tc2pLeEI5SUNyTUhROTJxREpLV0liSndKaVlQUFF5Zm81MFNMcVNwRXU5STgxWGprRUxIemdyMTdmVzg2OTE4STlxamZGTjNocXZkVjFQZ2VBNVdTWWY1Snp3
.youtube.com	TRUE	/	FALSE	1750909319	ST-hcbf8d	session_logininfo=AFmmF2swRQIgV-vdn20bQhHMurDpi_5FbqAFNwmCuJOVHRUxUXdGo2ICIQDZQR-t50Vxqm_Gb-tx4WdttyBaWlKvfGAh5dQbiu1UCQ%3AQUQ3MjNmeFBiQTZnMHFVQ3VzRy1VZ1dXTmFMYmk2bFFxSXctaWUyV09RQ0dwdHRkcTJzWnZsYnUxZW54UjhPU0prTEtaSG9Tc2pLeEI5SUNyTUhROTJxREpLV0liSndKaVlQUFF5Zm81MFNMcVNwRXU5STgxWGprRUxIemdyMTdmVzg2OTE4STlxamZGTjNocXZkVjFQZ2VBNVdTWWY1Snp3
.youtube.com	TRUE	/	TRUE	1750909914	CONSISTENCY	AKreu9uwpHMTlSAmS5MthVFADazPw-fKgMe390ZNszeIxQRyDutN8yOnUFX65iUYR_0QV6eUwHnil5wohUd9E6hvD5ruh46_Gu9uhmpVtUmeeRx_0Mf6HOxu5PVGdgwpmMNROfBA3Jy3n7f3J8_tW_N8
.youtube.com	TRUE	/	FALSE	1750909320	ST-xuwub9	session_logininfo=AFmmF2swRQIgV-vdn20bQhHMurDpi_5FbqAFNwmCuJOVHRUxUXdGo2ICIQDZQR-t50Vxqm_Gb-tx4WdttyBaWlKvfGAh5dQbiu1UCQ%3AQUQ3MjNmeFBiQTZnMHFVQ3VzRy1VZ1dXTmFMYmk2bFFxSXctaWUyV09RQ0dwdHRkcTJzWnZsYnUxZW54UjhPU0prTEtaSG9Tc2pLeEI5SUNyTUhROTJxREpLV0liSndKaVlQUFF5Zm81MFNMcVNwRXU5STgxWGprRUxIemdyMTdmVzg2OTE4STlxamZGTjNocXZkVjFQZ2VBNVdTWWY1Snp3
.youtube.com	TRUE	/	TRUE	1782445316	__Secure-1PSIDTS	sidts-CjEB5H03PwH-_jYSrb4wvtCDjHdviXsdG3gx4c8PZDk85j6Czveyc8UymkAoUmR54GpFEAA
.youtube.com	TRUE	/	TRUE	1782445316	__Secure-3PSIDTS	sidts-CjEB5H03PwH-_jYSrb4wvtCDjHdviXsdG3gx4c8PZDk85j6Czveyc8UymkAoUmR54GpFEAA
.youtube.com	TRUE	/	FALSE	1782445317	SIDCC	AKEyXzWPxJMhMdEAmgv9aDkvYet-gAuQ2KtbT0mqLVeRdSh1S8DzHHfXzU3dmljmyTiCILr2rw
.youtube.com	TRUE	/	TRUE	1782445317	__Secure-1PSIDCC	AKEyXzVxNOgSF1jn5jynfWpvgHx7WEbWRJDhYHlpu8MMi1NR3-SZnJVGfMCYWRkjp5uPrXWAjQ
.youtube.com	TRUE	/	TRUE	1782445317	__Secure-3PSIDCC	AKEyXzViV13kkw_zDVGSMG3lB5_y4CPtnCOLJPIFN7GmvqY_woQ9bEQXHX_KvVElHYx_Kxo_DvU
.youtube.com	TRUE	/	TRUE	1766461312	VISITOR_INFO1_LIVE	wWFeSnOdi3c
.youtube.com	TRUE	/	TRUE	1766461312	VISITOR_PRIVACY_METADATA	CgJCRBIEGgAgHw%3D%3D
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
