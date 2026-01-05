import nodemailer from "nodemailer";

export async function sendBookingEmail(booking) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const {
    bookingType,
    itemTitle,
    fullName,
    email,
    phone,
    travelDate,
    travelers,
    message,
  } = booking;

  const mailOptions = {
    from: `"${fullName}" <${process.env.SMTP_USER}>`,
    to: process.env.OWNER_EMAIL,
    replyTo: email, // Allows you to reply directly to the customer
    subject: `New Booking Request: ${itemTitle} – ${fullName}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Request</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <!-- Main Container -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="background-color: #1a3a6e; padding: 30px 20px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                      Royal Challengers Travelers
                    </h1>
                    <p style="color: #a8c8ff; margin: 8px 0 0; font-size: 16px;">
                      New Booking Request
                    </p>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="font-size: 18px; color: #333; margin: 0 0 24px;">
                      Hello Team,
                    </p>
                    <p style="font-size: 16px; color: #444; line-height: 1.6; margin: 0 0 24px;">
                      You have received a new booking request from <strong>${fullName}</strong> for:
                    </p>
                    
                    <!-- Highlighted Item -->
                    <div style="background-color: #f0f7ff; border-left: 4px solid #1a3a6e; padding: 20px; margin: 24px 0; border-radius: 6px;">
                      <p style="margin: 0; font-size: 18px; color: #1a3a6e;">
                        <strong>${itemTitle}</strong>
                      </p>
                      <p style="margin: 8px 0 0; color: #555;">
                        Booking Type: ${bookingType}
                      </p>
                    </div>
                    
                    <h3 style="color: #1a3a6e; margin: 32px 0 16px; font-size: 20px;">Customer Details</h3>
                    
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 15px; color: #444;">
                      <tr>
                        <td style="padding: 10px 0; font-weight: bold; width: 140px;">Name:</td>
                        <td style="padding: 10px 0;">${fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; font-weight: bold;">Email:</td>
                        <td style="padding: 10px 0;">
                          <a href="mailto:${email}" style="color: #1a3a6e; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; font-weight: bold;">Phone:</td>
                        <td style="padding: 10px 0;">
                          <a href="tel:${phone}" style="color: #1a3a6e; text-decoration: none;">${phone}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; font-weight: bold;">Travel Date:</td>
                        <td style="padding: 10px 0;">${travelDate || "<em>Not specified</em>"}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; font-weight: bold;">Travelers:</td>
                        <td style="padding: 10px 0;">${travelers}</td>
                      </tr>
                    </table>
                    
                    ${message ? `
                      <h3 style="color: #1a3a6e; margin: 32px 0 16px; font-size: 20px;">Additional Message</h3>
                      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; border: 1px solid #eee; font-size: 15px; color: #444; line-height: 1.6;">
                        ${message.replace(/\n/g, '<br>')}
                      </div>
                    ` : ''}
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 24px; text-align: center; font-size: 13px; color: #777;">
                    <p style="margin: 0;">
                      This booking was submitted through your website on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
                    </p>
                    <p style="margin: 12px 0 0;">
                      © 2026 Royal Challengers Travelers. All rights reserved.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}