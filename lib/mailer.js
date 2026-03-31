import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const fmt = (d) =>
  new Date(d).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

export async function sendHostNotification({ to, hostName, guestName, guestEmail, start, end }) {
  await transporter.sendMail({
    from: `"Schedulr" <${process.env.SMTP_USER}>`,
    to,
    subject: `New meeting booked: ${guestName}`,
    html: `
      <p>Hi ${hostName},</p>
      <p>A new meeting has been added to your calendar.</p>
      <ul>
        <li><strong>Guest:</strong> ${guestName} (${guestEmail})</li>
        <li><strong>Start:</strong> ${fmt(start)}</li>
        <li><strong>End:</strong> ${fmt(end)}</li>
      </ul>
      <p>You can view it in your Google Calendar.</p>
    `,
  });
}

