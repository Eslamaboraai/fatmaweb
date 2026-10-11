// Renders an ad page (animation.html by default) frame by frame and encodes the MP4 with its voiceover.
// Usage: node render.mjs [out.mp4] [--page skit.html] [--fps 30] [--from 0 --to 10] [--still 12.5 still.png]
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const here = path.dirname(new URL(import.meta.url).pathname);
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i < 0 ? def : args[i + 1]; };
const out = args[0] && !args[0].startsWith('--') && !args[0].endsWith('.html') ? args[0] : path.join(here, 'out', 'listgo-ad.mp4');
const fps = +opt('--fps', 30);

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.wav': 'audio/wav' };
const server = http.createServer((req, res) => {
  const file = path.join(here, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(here) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));

const browser = await chromium.launch(fs.existsSync('/opt/pw-browsers/chromium') ? {} : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('pageerror', e => { console.error('page error:', e.message); process.exitCode = 1; });
await page.goto(`http://127.0.0.1:${server.address().port}/${opt('--page', 'animation.html')}?render`);
await page.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
const { total, audio } = await page.evaluate(() => ({ total: window.TOTAL, audio: window.TIMINGS.audio }));

const still = opt('--still');
if (still !== undefined) {
  const file = args[args.indexOf('--still') + 2] || 'still.png';
  for (const t of still.split(',')) {
    await page.evaluate(t => window.seek(t), +t);
    await page.screenshot({ path: still.includes(',') ? file.replace('.png', `-${t}.png`) : file });
  }
} else {
  const from = +opt('--from', 0), to = Math.min(+opt('--to', total), total);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const withAudio = audio && fs.existsSync(path.join(here, audio));
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    ...(withAudio ? ['-ss', String(from), '-t', String(to - from), '-i', path.join(here, audio)] : []),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(fps),
    ...(withAudio ? ['-c:a', 'aac', '-b:a', '192k', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-shortest'] : []),
    '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((to - from) * fps);
  const t0 = Date.now();
  for (let f = 0; f < n; f++) {
    await page.evaluate(t => window.seek(t), from + f / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % (fps * 5) === 0) console.log(`frame ${f}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on('close', c => c ? j(new Error('ffmpeg ' + c)) : r()));
  console.log(`wrote ${out} (${(to - from).toFixed(1)}s${withAudio ? ', with voice' : ', silent'})`);
}
await browser.close();
server.close();
