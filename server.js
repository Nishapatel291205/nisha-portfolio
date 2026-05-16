// ================================================
//   NISHA PATEL PORTFOLIO — Backend Server v3
//   Node.js + Express + MongoDB + Nodemailer
// ================================================
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const nodemailer = require('nodemailer');
const path       = require('path');
const rateLimit  = require('express-rate-limit');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter: max 5 messages per IP per 15 min
const limiter = rateLimit({ windowMs: 15*60*1000, max: 5,
  message: { error: 'Too many messages. Please wait 15 minutes.' }
});

// MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nisha-portfolio')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(e => console.log('⚠️  MongoDB:', e.message));

const MsgSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  subject: { type: String, trim: true, default: 'Portfolio Contact' },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  emailSent: { type: Boolean, default: false }
});
const Msg = mongoose.model('Message', MsgSchema);

// ── Email function ──
async function sendEmails({ name, email, subject, message }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  // 1. Notification to Nisha
  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `📬 Portfolio: ${subject || 'New Message'} — from ${name}`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:580px;background:#0d1628;border:1px solid #1e3a5f;border-radius:12px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#1e40af,#0891b2);padding:24px 28px;">
    <h2 style="color:#fff;margin:0;font-size:18px;">📬 New Portfolio Message</h2>
    <p style="color:rgba(255,255,255,.7);margin:4px 0 0;font-size:13px;">Someone reached out via your portfolio</p>
  </div>
  <div style="padding:24px 28px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;border-bottom:1px solid #1e3a5f;color:#64748b;font-size:13px;width:80px;">Name</td><td style="padding:8px 0;border-bottom:1px solid #1e3a5f;color:#e2e8f0;font-weight:600;">${name}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #1e3a5f;color:#64748b;font-size:13px;">Email</td><td style="padding:8px 0;border-bottom:1px solid #1e3a5f;"><a href="mailto:${email}" style="color:#38bdf8;">${email}</a></td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #1e3a5f;color:#64748b;font-size:13px;">Subject</td><td style="padding:8px 0;border-bottom:1px solid #1e3a5f;color:#e2e8f0;">${subject||'—'}</td></tr>
    </table>
    <div style="margin-top:18px;background:#162035;border:1px solid #1e3a5f;border-left:3px solid #0891b2;border-radius:8px;padding:14px;color:#cbd5e1;font-size:14px;line-height:1.8;">${message.replace(/\n/g,'<br>')}</div>
    <div style="margin-top:20px;text-align:center;">
      <a href="mailto:${email}?subject=Re: ${subject||'Portfolio Enquiry'}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0891b2);color:#fff;padding:11px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Reply to ${name} →</a>
    </div>
  </div>
  <div style="padding:12px 28px;background:#080f20;border-top:1px solid #1e3a5f;text-align:center;">
    <p style="color:#475569;font-size:11px;margin:0;">nishapatel291205@gmail.com · Khambhat, Gujarat</p>
  </div>
</div>`
  });

  // 2. Auto-reply to sender
  await transporter.sendMail({
    from: `"Nisha Patel" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thanks for reaching out, ${name}! 👋`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:580px;background:#0d1628;border:1px solid #1e3a5f;border-radius:12px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#1e40af,#0891b2);padding:24px 28px;">
    <h2 style="color:#fff;margin:0;">Hey ${name}! 👋</h2>
    <p style="color:rgba(255,255,255,.75);margin:5px 0 0;font-size:14px;">Thanks for reaching out via my portfolio!</p>
  </div>
  <div style="padding:24px 28px;color:#cbd5e1;">
    <p style="font-size:15px;line-height:1.8;">I received your message and will get back to you within <strong style="color:#38bdf8;">24 hours</strong>. Looking forward to connecting!</p>
    <div style="background:#162035;border:1px solid #1e3a5f;border-radius:8px;padding:14px;margin:16px 0;">
      <p style="color:#64748b;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">Your message</p>
      <p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0;">${message.replace(/\n/g,'<br>')}</p>
    </div>
    <p style="font-size:14px;color:#94a3b8;">
      Meanwhile, feel free to check out my work:<br>
      🐙 <a href="https://github.com/Nishapatel291205" style="color:#38bdf8;">GitHub</a> &nbsp;·&nbsp;
      💼 <a href="https://www.linkedin.com/in/nishapatel2912" style="color:#38bdf8;">LinkedIn</a>
    </p>
  </div>
  <div style="padding:12px 28px;background:#080f20;border-top:1px solid #1e3a5f;">
    <p style="color:#475569;font-size:12px;margin:0;">Nisha Harshadbhai Patel · Full Stack &amp; AI/ML Developer · Khambhat, Gujarat</p>
  </div>
</div>`
  });
}

// ── ROUTES ──
app.post('/api/contact', limiter, async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim())
    return res.status(400).json({ error: 'Name, email and message are required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Invalid email address.' });

  let emailSent = false;
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendEmails({ name, email, subject, message });
      emailSent = true;
      console.log(`📧 Email sent — ${name} (${email})`);
    } else {
      console.log('⚠️  EMAIL not configured in .env');
    }
    await new Msg({ name, email, subject, message, emailSent }).save();
    res.json({ success: true, message: emailSent
      ? 'Message sent! You will receive a confirmation email.'
      : 'Message received! I\'ll get back to you within 24 hours.' });
  } catch (err) {
    console.error('Error:', err.message);
    try { await new Msg({ name, email, subject, message, emailSent: false }).save(); } catch {}
    res.status(500).json({ error: 'Server error. Please email: nishapatel291205@gmail.com' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const msgs = await Msg.find().sort({ createdAt: -1 });
    res.json({ count: msgs.length, messages: msgs });
  } catch { res.status(500).json({ error: 'DB error' }); }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ running',
    db: mongoose.connection.readyState === 1 ? '✅ connected' : '⚠️ disconnected',
    email: (process.env.EMAIL_USER && process.env.EMAIL_PASS) ? '✅ configured' : '⚠️ not set'
  });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`\n🚀 Server: http://localhost:${PORT}\n✅ Health: http://localhost:${PORT}/api/health\n`));
