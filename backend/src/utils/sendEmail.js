// utils/sendEmail.js
import nodemailer from 'nodemailer'
import logger from './logger.js'

const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Define email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    logger.info({ messageId: info.messageId }, 'Email sent successfully')
    return true
  } catch (error) {
    logger.error({ err: error }, 'Error sending email')
    throw error
  }
}

// Email template for password reset
export const getPasswordResetEmailTemplate = (resetUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: linear-gradient(135deg, #d87093 0%, #764ba2 100%);
          padding: 30px;
          border-radius: 10px;
          color: white;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          color: #333;
          margin-top: 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #dd25af 0%, #d87093 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #666;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 10px;
          margin: 15px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔐 Ilmora Writes</h1>
        
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Hi ${userName},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This link will expire in 10 minutes.
          </div>
          
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Ilmora Writes. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export default sendEmail