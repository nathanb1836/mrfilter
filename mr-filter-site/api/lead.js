// Receives quote requests from the website and emails them to you via Resend.
// Needs two environment variables in Vercel: RESEND_API_KEY and LEAD_TO_EMAIL.
// Optional: LEAD_FROM_EMAIL (must be on a domain verified in Resend; defaults to Resend's test sender).

function clean(v, max) {
  return String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').slice(0, max || 500);
}
function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  // Hidden "website" field: real people leave it empty, bots fill it in.
  if (b.website) return res.status(200).json({ ok: true });

  const name = clean(b.name, 120), email = clean(b.email, 200);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid' });
  }

  const key = process.env.RESEND_API_KEY, to = process.env.LEAD_TO_EMAIL;
  if (!key || !to) {
    console.error('Lead received but RESEND_API_KEY / LEAD_TO_EMAIL are not set');
    return res.status(500).json({ error: 'not_configured' });
  }

  const labels = {
    kind_of_request: 'Request type', name: 'Name', business: 'Business', kind: 'Business kind', locations: 'Locations',
    filters: 'Filters', email: 'Email', phone: 'Phone', zip: 'ZIP', type: 'Home or business', units: 'Heating/AC units',
    sizes: 'Filter sizes', term: 'Plan term', payment: 'Payment', consent: 'OK to email/text'
  };
  const rows = Object.keys(labels).filter(k => b[k] !== undefined && String(b[k]).trim() !== '')
    .map(k => [labels[k], clean(b[k])]);
  const text = rows.map(r => r[0] + ': ' + r[1]).join('\n');
  const html = '<table cellpadding="6" style="font-family:sans-serif;font-size:15px">' +
    rows.map(r => '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td></tr>').join('') + '</table>';

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL || 'Mister Filter <onboarding@resend.dev>',
      to: to.split(',').map(s => s.trim()),
      reply_to: email,
      subject: 'New ' + (b.kind_of_request === 'business' ? 'business quote' : 'quote') + ' request: ' + name,
      text, html
    })
  }).catch(() => null);

  if (!r || !r.ok) {
    console.error('Resend failed', r && r.status);
    return res.status(502).json({ error: 'send_failed' });
  }
  return res.status(200).json({ ok: true });
};
