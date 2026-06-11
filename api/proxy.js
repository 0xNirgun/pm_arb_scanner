// Vercel serverless CORS proxy — only forwards to the four whitelisted venue APIs.
const ALLOWED = [
  'gamma-api.polymarket.com',
  'clob.polymarket.com',
  'api.elections.kalshi.com',
  'api.limitless.exchange'
];

export default async function handler(req, res) {
  const url = req.query.url;
  let host;
  try { host = new URL(url).hostname; } catch (e) { return res.status(400).json({ error: 'bad url' }); }
  if (!ALLOWED.includes(host)) return res.status(403).json({ error: 'host not allowed' });
  try {
    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    const body = await r.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
    res.status(r.status).send(body);
  } catch (e) {
    res.status(502).json({ error: String(e) });
  }
}
