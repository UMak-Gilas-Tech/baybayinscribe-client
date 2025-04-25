"use server";

import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail app password
  },
});

type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export const sendEmail = async (options: EmailOptions) => {
  // Log in development environment
  if (process.env.NODE_ENV !== 'production') {
    console.log('------- EMAIL WOULD BE SENT -------');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Content: ${options.text}`);
    console.log('-----------------------------------');
  }
  
  try {
    // Actually send the email
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER, // sender address
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    // Still return success in development to allow testing
    if (process.env.NODE_ENV !== 'production') {
      return { success: true, messageId: 'mock-id-' + Date.now() };
    }
    throw error;
  }
};
