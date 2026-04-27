const jsonHeaders = (env) => ({
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': env.ALLOWED_ORIGIN || '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type,authorization',
});

const json = (env, data, status = 200) => new Response(JSON.stringify(data, null, 2), { status, headers: jsonHeaders(env) });

const readJson = async (request) => {
  try { return await request.json(); } catch { return null; }
};

const adminAuthorized = (request, env) => {
  const expected = env.ADMIN_SECRET;
  if (!expected) return false;
  const header = request.headers.get('authorization') || '';
  return header === `Bearer ${expected}`;
};

const htmlEscape = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const paragraphs = (value) => String(value || '')
  .split(/\n+/)
  .map(line => line.trim())
  .filter(Boolean)
  .map(line => `<p>${htmlEscape(line)}</p>`)
  .join('');

const money = (value) => Number(value || 0).toLocaleString(undefined, { style: 'currency', currency: 'USD' });

const instrumentLabel = (value) => ({
  common_stock: 'Common stock',
  safe: 'SAFE',
  convertible_note: 'Convertible note',
  undecided: 'Undecided',
}[value] || 'Undecided');

const submissionId = () => `sub_${crypto.randomUUID().replace(/-/g, '')}`;

const sha256Hex = async (input) => {
  const data = new TextEncoder().encode(String(input || ''));
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
};

async function getPackage(env, token) {
  const row = await env.DB.prepare('SELECT * FROM packages WHERE token = ?').bind(token).first();
  if (!row) return null;
  return {
    token: row.token,
    company: JSON.parse(row.company_json),
    package: JSON.parse(row.package_json),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sentAt: row.sent_at,
    openedAt: row.opened_at,
    signedAt: row.signed_at,
    expiresOn: row.expires_on,
  };
}

function renderPackagePage(data) {
  const company = data.company || {};
  const pkg = data.package || {};
  const expired = pkg.expirationDate && new Date(`${pkg.expirationDate}T23:59:59Z`) < new Date();
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${htmlEscape(pkg.title || 'Private Investment Reservation')}</title>
<style>
:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#eef3f8;color:#0f172a;font-family:Inter,Arial,Helvetica,sans-serif}.wrap{max-width:900px;margin:0 auto;padding:22px}.hero{background:#071122;color:#fff;border-radius:28px;padding:30px;box-shadow:0 28px 70px rgba(15,23,42,.22)}.eyebrow{color:#93c5fd;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:900}.title{font-size:34px;line-height:1.04;font-weight:950;margin:10px 0}.card{background:#fff;border:1px solid #dbe5f0;border-radius:24px;padding:24px;margin:16px 0;box-shadow:0 18px 50px rgba(15,23,42,.08)}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.box{background:#f8fafc;border:1px solid #dbe5f0;border-radius:18px;padding:14px}.label{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#64748b;font-weight:900}.value{font-weight:900;margin-top:5px}.notice{background:#fffbeb;border:1px solid #fde68a;border-left:6px solid #f59e0b;border-radius:18px;padding:14px;margin-top:12px}.field{display:block;width:100%;border:1px solid #cbd5e1;border-radius:16px;padding:14px;font-size:16px;font-weight:700}.check{display:flex;gap:10px;margin:12px 0;font-weight:750}.btn{width:100%;border:0;border-radius:18px;background:#2563eb;color:#fff;font-weight:950;padding:16px;font-size:16px;cursor:pointer}.btn:disabled{opacity:.5;cursor:not-allowed}.sig{font-family:Georgia,serif;font-size:26px}.footer{font-size:12px;color:#64748b;text-align:center;margin:18px}.error{background:#fee2e2;border:1px solid #fecaca;color:#991b1b;border-radius:16px;padding:14px;font-weight:800}@media(max-width:720px){.wrap{padding:12px}.grid{grid-template-columns:1fr}.title{font-size:27px}.card,.hero{padding:19px;border-radius:22px}}
</style></head><body><div class="wrap">
<div class="hero"><div class="eyebrow">${htmlEscape(company.legalName || 'Private Company')}</div><div class="title">${htmlEscape(pkg.title || 'Private Investment Reservation')}</div><div>Prepared for ${htmlEscape(pkg.investorName || pkg.preparedFor || 'Investor')}${pkg.expirationDate ? ` • expires ${htmlEscape(pkg.expirationDate)}` : ''}</div></div>
${expired ? '<div class="card"><div class="error">This reservation link has expired. Contact the issuer for a new link.</div></div>' : ''}
<div class="card"><div class="label">Private message</div>${paragraphs(pkg.privateMessage || 'Please review the summary below. This page is an indication of interest only, not final investment acceptance.')}</div>
<div class="card"><div class="label">Reservation summary</div><div class="grid"><div class="box"><div class="label">Investor</div><div class="value">${htmlEscape(pkg.investorName || 'Not entered')}</div></div><div class="box"><div class="label">Instrument</div><div class="value">${htmlEscape(instrumentLabel(pkg.instrumentType))}</div></div><div class="box"><div class="label">Desired amount</div><div class="value">${money(pkg.desiredAmount)}</div></div><div class="box"><div class="label">Minimum</div><div class="value">${money(pkg.minimumInvestment)}</div></div>${pkg.instrumentType === 'common_stock' ? `<div class="box"><div class="label">Indicative price/share</div><div class="value">${money(pkg.pricePerShare)}</div></div><div class="box"><div class="label">Estimated shares</div><div class="value">${Number(pkg.estimatedShares || 0).toLocaleString()}</div></div>` : ''}</div></div>
<div class="card"><div class="label">Offering summary</div>${paragraphs(pkg.offeringSummary)}</div>
<div class="card"><div class="label">Major terms</div>${paragraphs(pkg.majorTerms)}</div>
<div class="card"><div class="label">Acknowledgments</div><div class="notice">This is an indication of interest only. It is not final company acceptance, not a completed investment, and not issued shares.</div>${paragraphs(pkg.riskText)}</div>
<form class="card" method="post" action="/api/packages/${encodeURIComponent(data.token)}/sign">
<div class="label">Investor confirmation</div>
<label>Full legal name<input class="field" name="investorName" value="${htmlEscape(pkg.investorName || '')}" required /></label><br/>
<label>Email<input class="field" type="email" name="email" value="${htmlEscape(pkg.email || '')}" required /></label><br/>
<label>Phone<input class="field" name="phone" value="${htmlEscape(pkg.phone || '')}" /></label><br/>
<label>Entity / LLC, if any<input class="field" name="entityName" value="${htmlEscape(pkg.entityName || '')}" /></label><br/>
<label>Desired investment amount<input class="field" type="number" min="0" step="0.01" name="desiredAmount" value="${htmlEscape(pkg.desiredAmount || '')}" required /></label><br/>
<input type="hidden" name="instrumentType" value="${htmlEscape(pkg.instrumentType || 'undecided')}" />
<label>Typed signature<input class="field sig" name="signatureName" value="${htmlEscape(pkg.investorName || '')}" required /></label>
<label class="check"><input type="checkbox" name="consentElectronicRecords" required /> I consent to receive and sign records electronically for this package.</label>
<label class="check"><input type="checkbox" name="acknowledgmentIndicationOnly" required /> I understand this is an indication of interest only and not issued shares.</label>
<label class="check"><input type="checkbox" name="acknowledgmentRisk" required /> I understand private-company investments involve risk.</label>
<button class="btn" ${expired ? 'disabled' : ''}>Submit signed indication of interest</button>
</form><div class="footer">Powered by MONIEZI Cloudflare Investor Portal scaffold. This page does not process payments or issue shares.</div></div></body></html>`;
}

async function handleCreatePackage(request, env) {
  if (!adminAuthorized(request, env)) return json(env, { error: 'Unauthorized' }, 401);
  const body = await readJson(request);
  if (!body?.package?.token) return json(env, { error: 'Missing package.token' }, 400);
  const token = String(body.package.token);
  const companyJson = JSON.stringify(body.company || {});
  const packageJson = JSON.stringify(body.package || {});
  await env.DB.prepare(`INSERT OR REPLACE INTO packages (token, company_json, package_json, status, updated_at, expires_on) VALUES (?, ?, ?, ?, datetime('now'), ?)`)
    .bind(token, companyJson, packageJson, body.status || 'ready_to_send', body.package.expirationDate || null)
    .run();
  const origin = new URL(request.url).origin;
  return json(env, { ok: true, token, link: `${origin}/p/${token}` });
}

async function handleSubmit(request, env, token) {
  const pkg = await getPackage(env, token);
  if (!pkg) return json(env, { error: 'Package not found' }, 404);
  const contentType = request.headers.get('content-type') || '';
  let data = {};
  if (contentType.includes('application/json')) {
    data = await readJson(request) || {};
  } else {
    const form = await request.formData();
    data = Object.fromEntries(form.entries());
  }
  const ip = request.headers.get('cf-connecting-ip') || '';
  const ipHash = ip ? await sha256Hex(`${ip}:${token}:${env.ADMIN_SECRET || 'no-secret'}`) : '';
  const id = submissionId();
  await env.DB.prepare(`INSERT INTO submissions (id, token, package_id, investor_name, email, phone, entity_name, desired_amount, instrument_type, signature_name, consent_electronic_records, acknowledgment_indication_only, acknowledgment_risk, ip_hash, user_agent, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, token, token, String(data.investorName || ''), String(data.email || ''), String(data.phone || ''), String(data.entityName || ''), Number(data.desiredAmount || 0), String(data.instrumentType || pkg.package.instrumentType || 'undecided'), String(data.signatureName || ''), data.consentElectronicRecords ? 1 : 0, data.acknowledgmentIndicationOnly ? 1 : 0, data.acknowledgmentRisk ? 1 : 0, ipHash, request.headers.get('user-agent') || '', String(data.notes || ''))
    .run();
  await env.DB.prepare(`UPDATE packages SET status = 'signed', signed_at = datetime('now'), updated_at = datetime('now') WHERE token = ?`).bind(token).run();
  if (contentType.includes('application/json')) return json(env, { ok: true, id, token });
  return new Response(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:Arial;background:#f8fafc;color:#0f172a;padding:28px"><div style="max-width:720px;margin:auto;background:white;border:1px solid #dbe5f0;border-radius:24px;padding:28px"><h1>Reservation submitted</h1><p>Your signed indication of interest was submitted to the issuer for review.</p><p>This is not final acceptance, not payment processing, and not issued shares.</p></div></body>`, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}

async function handleAdminSubmissions(request, env) {
  if (!adminAuthorized(request, env)) return json(env, { error: 'Unauthorized' }, 401);
  const rows = await env.DB.prepare(`SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 500`).all();
  const submissions = (rows.results || []).map(row => ({
    id: row.id,
    token: row.token,
    packageId: row.package_id,
    submittedAt: row.submitted_at,
    investorName: row.investor_name,
    email: row.email,
    phone: row.phone,
    entityName: row.entity_name,
    desiredAmount: row.desired_amount,
    instrumentType: row.instrument_type,
    signatureName: row.signature_name,
    ipHash: row.ip_hash,
    userAgent: row.user_agent,
    consentElectronicRecords: !!row.consent_electronic_records,
    acknowledgmentIndicationOnly: !!row.acknowledgment_indication_only,
    acknowledgmentRisk: !!row.acknowledgment_risk,
    status: 'new',
    notes: row.notes || '',
  }));
  return json(env, { submissions });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: jsonHeaders(env) });
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/api/admin/packages') return handleCreatePackage(request, env);
    if (request.method === 'GET' && url.pathname === '/api/admin/submissions') return handleAdminSubmissions(request, env);
    const publicMatch = url.pathname.match(/^\/p\/([^/]+)$/);
    if (request.method === 'GET' && publicMatch) {
      const data = await getPackage(env, publicMatch[1]);
      if (!data) return new Response('Package not found', { status: 404 });
      await env.DB.prepare(`UPDATE packages SET status = CASE WHEN status = 'ready_to_send' THEN 'opened' ELSE status END, opened_at = COALESCE(opened_at, datetime('now')), updated_at = datetime('now') WHERE token = ?`).bind(publicMatch[1]).run();
      return new Response(renderPackagePage(data), { headers: { 'content-type': 'text/html; charset=utf-8' } });
    }
    const apiMatch = url.pathname.match(/^\/api\/packages\/([^/]+)$/);
    if (request.method === 'GET' && apiMatch) {
      const data = await getPackage(env, apiMatch[1]);
      return data ? json(env, data) : json(env, { error: 'Package not found' }, 404);
    }
    const signMatch = url.pathname.match(/^\/api\/packages\/([^/]+)\/sign$/);
    if (request.method === 'POST' && signMatch) return handleSubmit(request, env, signMatch[1]);
    return json(env, { ok: true, service: env.PORTAL_BRAND_NAME || 'MONIEZI Investor Portal', routes: ['/p/:token', '/api/admin/packages', '/api/admin/submissions'] });
  }
};
