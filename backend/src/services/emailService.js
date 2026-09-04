const nodemailer = require('nodemailer');
const environment = require('../config/environment');

let cachedTransporter = null;

/**
 * Escapes HTML characters to prevent XSS / HTML injection in email clients
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Creates or retrieves the cached Nodemailer transporter instance
 */
function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const isConfigured = Boolean(environment.SMTP_USER && environment.SMTP_PASSWORD);

  if (!isConfigured) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: environment.SMTP_HOST || 'smtp.gmail.com',
    port: Number(environment.SMTP_PORT) || 587,
    secure: Boolean(environment.SMTP_SECURE),
    auth: {
      user: environment.SMTP_USER,
      pass: environment.SMTP_PASSWORD,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  return cachedTransporter;
}

/**
 * Allows overriding or resetting the transporter (useful for testing)
 */
function setTransporter(transporter) {
  cachedTransporter = transporter;
}

/**
 * Verify transporter configuration during startup (non-fatal)
 */
async function verifyEmailTransporter() {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('[EmailService] SMTP credentials not set. Email notifications will be skipped until configured in .env.');
    return { verified: false, reason: 'unconfigured' };
  }

  try {
    await transporter.verify();
    console.log(`[EmailService] SMTP connection verified successfully (${environment.SMTP_HOST}:${environment.SMTP_PORT})`);
    return { verified: true };
  } catch (error) {
    console.warn(`[EmailService] SMTP connection verification failed: ${error.message}`);
    return { verified: false, error: error.message };
  }
}

/**
 * Send contact form email notification
 *
 * @param {Object} params
 * @param {string} params.name - Visitor name
 * @param {string} params.email - Visitor email
 * @param {string} params.subject - Message subject
 * @param {string} params.message - Message body
 * @param {Date|string} params.createdAt - Submission timestamp
 * @returns {Promise<{ delivered: boolean, messageId?: string, error?: string }>}
 */
async function sendContactNotification({ name, email, subject, message, createdAt = new Date() }) {
  const transporter = getTransporter();
  const receiverEmail = environment.CONTACT_RECEIVER_EMAIL || 'dhanush2005mp@gmail.com';
  const senderAddress = environment.SMTP_USER || 'no-reply@dhanush.dev';

  if (!transporter) {
    console.warn('[EmailService] Skipping email notification: SMTP credentials are not configured.');
    return {
      delivered: false,
      reason: 'SMTP credentials not configured in backend/.env',
    };
  }

  const formattedDate = new Date(createdAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  // Plain-text fallback version
  const textContent = `
========================================
NEW PORTFOLIO CONTACT MESSAGE
========================================

Name:      ${name}
Email:     ${email}
Subject:   ${subject}
Submitted: ${formattedDate}

----------------------------------------
MESSAGE:
----------------------------------------
${message}

========================================
This message was submitted via the contact form on your portfolio website (Dhanush M Portfolio).
Reply to this email directly to answer ${name} (${email}).
========================================
`.trim();

  // Clean, professional HTML version
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0F172A;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #334155;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0F172A;
      padding: 40px 16px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%);
      padding: 32px 28px;
      color: #FFFFFF;
    }
    .header-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      background: rgba(255, 255, 255, 0.15);
      padding: 4px 10px;
      border-radius: 20px;
      margin-bottom: 12px;
      color: #A5B4FC;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: #FFFFFF;
      line-height: 1.3;
    }
    .header p {
      margin: 8px 0 0;
      font-size: 14px;
      color: #C7D2FE;
    }
    .content {
      padding: 32px 28px;
    }
    .meta-grid {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .meta-row {
      display: flex;
      padding: 6px 0;
      border-bottom: 1px solid #EEF2F6;
      font-size: 14px;
    }
    .meta-row:last-child {
      border-bottom: none;
    }
    .meta-label {
      width: 110px;
      font-weight: 600;
      color: #64748B;
      flex-shrink: 0;
    }
    .meta-value {
      color: #0F172A;
      word-break: break-word;
    }
    .meta-value a {
      color: #4F46E5;
      text-decoration: none;
    }
    .message-box {
      background: #FFFFFF;
      border-left: 4px solid #4F46E5;
      padding: 18px 20px;
      background-color: #F8FAFC;
      border-radius: 0 8px 8px 0;
      margin-bottom: 24px;
    }
    .message-title {
      margin: 0 0 10px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #4F46E5;
    }
    .message-body {
      margin: 0;
      font-size: 15px;
      line-height: 1.6;
      color: #1E293B;
    }
    .action-button {
      display: inline-block;
      background: #4F46E5;
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 12px 24px;
      border-radius: 6px;
      text-align: center;
      margin-top: 8px;
    }
    .footer {
      background: #F1F5F9;
      padding: 20px 28px;
      font-size: 12px;
      color: #64748B;
      text-align: center;
      border-top: 1px solid #E2E8F0;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="header-badge">Portfolio Inquiry</div>
        <h1>New Contact Message</h1>
        <p>You received a new message through your developer portfolio website.</p>
      </div>
      <div class="content">
        <div class="meta-grid">
          <div class="meta-row">
            <span class="meta-label">From:</span>
            <span class="meta-value"><strong>${safeName}</strong></span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Email:</span>
            <span class="meta-value"><a href="mailto:${safeEmail}">${safeEmail}</a></span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Subject:</span>
            <span class="meta-value">${safeSubject}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Submitted:</span>
            <span class="meta-value">${formattedDate} (IST)</span>
          </div>
        </div>

        <div class="message-box">
          <div class="message-title">Message Content</div>
          <div class="message-body">${safeMessage}</div>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(subject)}" class="action-button">
            Reply to ${safeName}
          </a>
        </div>
      </div>
      <div class="footer">
        This notification was automatically sent by the Dhanush M Developer Portfolio backend.<br/>
        Direct replies will be routed to <strong>${safeEmail}</strong>.
      </div>
    </div>
  </div>
</body>
</html>
`.trim();

  const mailOptions = {
    from: `"Dhanush M Portfolio" <${senderAddress}>`,
    to: receiverEmail,
    replyTo: email,
    subject: `New Portfolio Contact Message - ${subject}`,
    text: textContent,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Contact notification sent successfully to ${receiverEmail} (ID: ${info.messageId})`);
    return {
      delivered: true,
      messageId: info.messageId,
    };
  } catch (error) {
    // Log error safely without exposing passwords or internal secrets
    console.error(`[EmailService] Failed to deliver contact notification: ${error.message}`);
    return {
      delivered: false,
      error: error.message,
    };
  }
}

module.exports = {
  getTransporter,
  setTransporter,
  verifyEmailTransporter,
  sendContactNotification,
  escapeHtml,
};
