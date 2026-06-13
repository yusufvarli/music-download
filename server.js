const express = require('express');
const path = require('path');
const compression = require('compression');
const { Readable } = require('stream');

const app = express();
const PORT = process.env.PORT || 3000;

// Allowed upstream host(s) for the proxy. Add more if your JSON references other domains.
const ALLOWED_HOSTS = new Set(['dangify.net']);

// Gzip responses (artists.json is ~20MB raw, ~3-4MB gzipped -> much faster load)
app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));

// CORS-proxy for mp3 files: streams the file from the source host so the
// browser can fetch() it same-origin (avoiding the source's CORS restrictions).
app.get('/api/proxy', async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send('Missing url parameter');

  let parsed;
  try { parsed = new URL(target); } catch (e) { return res.status(400).send('Invalid url'); }

  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return res.status(400).send('Host not allowed: ' + parsed.hostname);
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': `https://${parsed.hostname}/`
      }
    });

    if (!upstream.ok || !upstream.body) {
      return res.status(upstream.status || 502).send('Upstream error: ' + upstream.status);
    }

    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'audio/mpeg');
    const len = upstream.headers.get('content-length');
    if (len) res.setHeader('Content-Length', len);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');

    Readable.fromWeb(upstream.body).pipe(res);
  } catch (e) {
    res.status(502).send('Proxy error: ' + (e && e.message ? e.message : String(e)));
  }
});

app.get('/health', (req, res) => res.send('ok'));

app.listen(PORT, () => console.log('Server running on port ' + PORT));
