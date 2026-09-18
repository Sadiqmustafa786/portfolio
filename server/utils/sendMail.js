const nodemailer = require("nodemailer");
const Admin = require("../models/Admin");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isMailConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function getAdminNotifyEmail() {
  if (process.env.EMAIL_TO) return process.env.EMAIL_TO;

  const admin = await Admin.findOne().select("email").lean();
  return admin?.email || process.env.EMAIL_USER;
}

/**
 * Notify admin that someone submitted the contact form.
 * Does not throw — contact save should succeed even if email fails.
 */
async function sendContactNotification(contact) {
  if (!isMailConfigured()) {
    console.warn(
      "Email skipped: set EMAIL_USER and EMAIL_PASS in server/.env (Gmail App Password).",
    );
    return false;
  }

  const to = await getAdminNotifyEmail();
  const name = escapeHtml(contact.name);
  const email = escapeHtml(contact.email);
  const subject = escapeHtml(contact.subject);
  const message = escapeHtml(contact.message).replace(/\n/g, "<br>");
  const submittedAt = new Date(contact.createdAt).toLocaleString();

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: contact.email,
    subject: `New contact: ${contact.subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
        <h2 style="color:#018790;margin-bottom:8px">Someone wants to contact you</h2>
        <p style="color:#475569;margin-top:0">A new message was submitted from your portfolio contact form.</p>
        <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:8px">
          <tr>
            <td style="padding:10px 14px;font-weight:bold;width:90px">Name</td>
            <td style="padding:10px 14px">${name}</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-weight:bold">Email</td>
            <td style="padding:10px 14px"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 14px;font-weight:bold">Subject</td>
            <td style="padding:10px 14px">${subject}</td>
          </tr>
        </table>
        <p style="margin:16px 0 8px;font-weight:bold">Message</p>
        <p style="background:#fff;border:1px solid #e2e8f0;padding:14px;border-radius:8px;line-height:1.5">${message}</p>
        <p style="color:#64748b;font-size:12px;margin-top:20px">Submitted on ${escapeHtml(submittedAt)}</p>
      </div>
    `,
  });

  console.log(`Contact notification sent to ${to}`);
  return true;
}

module.exports = { sendContactNotification, isMailConfigured };
