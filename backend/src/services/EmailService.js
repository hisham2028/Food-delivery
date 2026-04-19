/**
 * Email Service - Handles sending emails
 */

import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    // Remove transporter creation from constructor - create lazily instead
  }

  async sendEmail(to, subject, text, html = null) {
    try {
      // Create transporter lazily when needed
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendOrderStatusUpdate(userEmail, orderId, newStatus) {
    const subject = `Order Status Update - Order #${orderId}`;
    const text = `Your order status has been updated to: ${newStatus}`;
    const html = `
      <h2>Order Status Update</h2>
      <p>Dear Customer,</p>
      <p>Your order <strong>#${orderId}</strong> status has been updated to: <strong>${newStatus}</strong></p>
      <p>Thank you for choosing our service!</p>
    `;

    return await this.sendEmail(userEmail, subject, text, html);
  }
}

export default new EmailService();
