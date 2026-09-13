import { Resend } from 'resend';
import ENV from '../config/environment.js';

let resendClient = null;

if (ENV.RESEND_API_KEY) {
  resendClient = new Resend(ENV.RESEND_API_KEY);
}

/**
 * Send contact form notification email using Resend
 */
export const sendContactNotificationEmail = async ({ name, email, subject, message, createdAt }) => {
  if (!resendClient) {
    console.warn('⚠️ Resend API key not configured. Skipping email dispatch (message saved in database).');
    return { success: false, reason: 'RESEND_API_KEY not configured' };
  }

  const submissionDate = createdAt ? new Date(createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B; }
          .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 24px; color: #FFFFFF; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
          .header p { margin: 4px 0 0 0; font-size: 14px; opacity: 0.85; }
          .content { padding: 24px; }
          .field { margin-bottom: 16px; }
          .field-label { font-size: 12px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .field-value { font-size: 15px; color: #0F172A; font-weight: 500; }
          .message-box { background: #F1F5F9; border-radius: 8px; padding: 16px; font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-top: 8px; }
          .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 16px 24px; font-size: 13px; color: #64748B; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>New Portfolio Inquiry</h1>
            <p>A new message was submitted via your website contact form.</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">Sender Name</div>
              <div class="field-value">${name}</div>
            </div>
            <div class="field">
              <div class="field-label">Sender Email</div>
              <div class="field-value"><a href="mailto:${email}" style="color: #4F46E5; text-decoration: none;">${email}</a></div>
            </div>
            <div class="field">
              <div class="field-label">Subject</div>
              <div class="field-value">${subject || 'General Inquiry'}</div>
            </div>
            <div class="field">
              <div class="field-label">Submission Date & Time</div>
              <div class="field-value">${submissionDate}</div>
            </div>
            <div class="field">
              <div class="field-label">Message Content</div>
              <div class="message-box">${message}</div>
            </div>
          </div>
          <div class="footer">
            Directly reply to this email to respond to <strong>${name}</strong> (${email}).
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const data = await resendClient.emails.send({
      from: `Dhanush Portfolio <${ENV.RESEND_FROM_EMAIL}>`,
      to: ENV.CONTACT_RECEIVER_EMAIL,
      reply_to: email,
      subject: `[Portfolio Contact] ${subject || 'New message from ' + name}`,
      html: htmlContent,
    });

    return { success: true, data };
  } catch (error) {
    console.error('🚨 Failed to send contact notification email via Resend:', error.message);
    return { success: false, error: error.message };
  }
};

export default {
  sendContactNotificationEmail,
};
