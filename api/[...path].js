import { URL } from 'url';

const DEFAULT_UPSTREAM = 'https://dokirana-api-47864120198.asia-south1.run.app';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  const incomingUrl = new URL(req.url || '/', 'http://localhost');
  const upstreamBase = process.env.VITE_API_BASE_URL || process.env.UPSTREAM_API_BASE_URL || DEFAULT_UPSTREAM;
  const upstreamUrl = new URL(`${incomingUrl.pathname}${incomingUrl.search}`, upstreamBase);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue;
    if (['host', 'connection', 'content-length'].includes(key)) continue;
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else {
      headers.set(key, value);
    }
  }

  headers.set('x-forwarded-host', req.headers.host || 'vercel.app');
  headers.set('x-forwarded-proto', req.headers['x-forwarded-proto'] || 'https');

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = req.body;
    if (body && typeof body === 'object' && !Buffer.isBuffer(body) && !(body instanceof Uint8Array)) {
      body = JSON.stringify(body);
    }
  }

  const response = await fetch(upstreamUrl, {
    method: req.method,
    headers,
    body,
  });

  const responseBody = Buffer.from(await response.arrayBuffer());
  res.status(response.status);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'content-length') return;
    res.setHeader(key, value);
  });

  return res.send(responseBody);
}
