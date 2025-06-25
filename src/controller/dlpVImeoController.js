import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import tmp from 'tmp';

const rawCookies = `# Netscape HTTP Cookie File
# http://curl.haxx.se/rfc/cookie_spec.html
# This is a generated file!  Do not edit.

.vimeo.com	TRUE	/	TRUE	1785400029	vuid	pl1326396465.1572113068
.vimeo.com	TRUE	/	TRUE	1782374646	player	""
.vimeo.com	TRUE	/	FALSE	1756610761	_gcl_aw	GCL.1748834761.Cj0KCQjw9O_BBhCUARIsAHQMjS4d1vnWgPQK-fg0vpJMoSW0hlDpU1Q5xLEkzks7xYEfmuk8sVhpwDUaAuLuEALw_wcB
.vimeo.com	TRUE	/	FALSE	1756610761	_gcl_dc	GCL.1748834761.Cj0KCQjw9O_BBhCUARIsAHQMjS4d1vnWgPQK-fg0vpJMoSW0hlDpU1Q5xLEkzks7xYEfmuk8sVhpwDUaAuLuEALw_wcB
.vimeo.com	TRUE	/	FALSE	1756610760	_gcl_gs	2.1.k1$i1748834758$u22955708
vimeo.com	FALSE	/	TRUE	1783394761	_gd_visitor	a91c789f-ee1e-433f-82f2-219ee72f2f58
.vimeo.com	TRUE	/	FALSE	1756610762	_fbp	fb.1.1748834762234.633790441198408267
.vimeo.com	TRUE	/	TRUE	1756610806	_gac_UA-76641-8	1.1748834806.Cj0KCQjw9O_BBhCUARIsAHQMjS4d1vnWgPQK-fg0vpJMoSW0hlDpU1Q5xLEkzks7xYEfmuk8sVhpwDUaAuLuEALw_wcB
.vimeo.com	TRUE	/	TRUE	0	_cfuvid	vcN.Cm6QRTDKMiE0IAWx44QKdZUw9xNsfWzBb6VKUsI-1750831176933-0.0.1.1-604800000
.vimeo.com	TRUE	/	TRUE	1750926428	_gid	GA1.2.252741263.1750831199
.vimeo.com	TRUE	/	TRUE	1750843626	auth_xsrft	ba6ac64230292cd398ebf6b13454dff22da5ed93
.vimeo.com	TRUE	/	TRUE	1785400026	auth_redirect	%2F524933864
.vimeo.com	TRUE	/	TRUE	1785400026	redirect_url_after_social_login	%2F
.vimeo.com	TRUE	/	TRUE	1785400026	vimeo_gdpr_optin	1
.vimeo.com	TRUE	/	TRUE	1785400647	language	en
.vimeo.com	TRUE	/	TRUE	1753432027	vimeo	OHDdDZStSdDMVHLZe4td44DDMNVHLZe4td44DSMxHZB3ZcttaZcDaXaSSSNt3t4dDXtSP%2CDaLaZNBSe4ZMw3h_OI3uHLMIHDXSX%2C3dNN34eNecLPadD%2CdPL3%2CP3atNaSDatNcXeS4SXX%2CXZ%2CSZ3XeZt44PtaatS
vimeo.com	FALSE	/	FALSE	1782376027	_abexps	%7B%223227%22%3A%22variant%22%2C%223296%22%3A%22variant%22%7D
.vimeo.com	TRUE	/	FALSE	1750926428	_uetsid	a0a92740518911f09a3ec190b5beb945
.vimeo.com	TRUE	/	FALSE	1784536028	_uetvid	4e6825f03f6111f09bbe254edbd44dc9|zxjp5e|1750657379012|1|1|bat.bing-int.com/p/insights/c/n
.vimeo.com	TRUE	/	TRUE	1758616028	_rdt_uuid	1750840028867.ca85f2df-6566-401c-9437-521b5b68709f
.vimeo.com	TRUE	/	FALSE	1785400029	_ga_126VYLCXDY	GS2.1.s1750839599$o12$g1$t1750840028$j50$l0$h0
.vimeo.com	TRUE	/	TRUE	1785400029	_ga	GA1.2.1690635033.1748834761
.vimeo.com	TRUE	/	FALSE	1758616029	_gcl_au	1.1.1066871815.1750840029
.vimeo.com	TRUE	/	TRUE	1750842241	__cf_bm	095jd96Ui_Aj.QPXwhDCK2_sf7AAGlhCXNRJMsNUg3M-1750840437-1.0.1.1-cnkq8GRe3UvTeT8y4BvLzgtsSNeep8QlLSGSAaTLtOIhCuzWxDXp2vcmyrgUDByr
vimeo.com	FALSE	/	TRUE	1750841549	_dd_s	rum=0&expire=1750841546525
`; // already correct

export const getScreenshotForVimeo = (req, res) => {
  const { url, timestamp } = req.query;
  if (!url || !timestamp) {
    return res.status(400).json({ error: 'url and timestamp are required' });
  }

  const cleanUrl = url.split('?')[0];
  const tempDir = tmp.dirSync({ unsafeCleanup: true });
  const output = path.join(tempDir.name, 'thumb.jpg');

  // Write Vimeo cookies to a temp file
  const cookiesPath = path.join(tempDir.name, 'vimeo_cookies.txt');
  fs.writeFileSync(cookiesPath, rawCookies);

  // Use yt-dlp with a specific working format (e.g. 586 for 640x360)
  const ytdlFormat = 'hls-fastly_skyfire-586'; // or 2364, 4636 based on quality
  const ytdlCmd = `yt-dlp --cookies "${cookiesPath}" -f ${ytdlFormat} -g "${cleanUrl}"`;

  exec(ytdlCmd, (err, stdout, stderr) => {
    if (err || !stdout.trim()) {
      tempDir.removeCallback();
      console.error('yt-dlp error:', stderr);
      return res.status(500).json({
        error: 'yt-dlp failed',
        details: stderr || 'No video URL extracted',
      });
    }

    const videoURL = stdout.trim();
    const ffmpegCmd = `ffmpeg -ss ${timestamp} -i "${videoURL}" -frames:v 1 -q:v 2 "${output}" -y`;

    exec(ffmpegCmd, (ffErr, ffStdout, ffStderr) => {
      if (ffErr || !fs.existsSync(output)) {
        tempDir.removeCallback();
        console.error('ffmpeg error:', ffStderr);
        return res.status(500).json({
          error: 'ffmpeg failed',
          details: ffStderr || 'Screenshot not generated',
        });
      }

      const img = fs.readFileSync(output);
      tempDir.removeCallback();
      res.set('Content-Type', 'image/jpeg').status(200).send(img);
    });
  });
};

