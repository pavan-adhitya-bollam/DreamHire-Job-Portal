import nodemailer from 'nodemailer';
import crypto from 'crypto';

// In-memory OTP storage (email → { otp, expiresAt, lastSent })
const otpStore = new Map();

// In-memory password reset token storage (email → { token, expiresAt })
const passwordResetStore = new Map();

// Check if email is properly configured
const isEmailConfigured = () => {
  const email = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  return email && pass && 
         email !== 'pavan@gmail.com' && 
         pass !== 'abc123';
};

// Create transporter using universal SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Allow connections to any domain
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate secure reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    console.log('OTP generated:', otp);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Job Portal</h1>
            <p style="margin: 10px 0; opacity: 0.9;">Email Verification</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #374151; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              Thank you for registering with Job Portal! To complete your registration, please use the following OTP (One-Time Password) to verify your email address:
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; margin-bottom: 10px;">Your OTP Code:</p>
              <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 5px;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              <strong>Important:</strong>
              <br>• This OTP will expire in <strong>5 minutes</strong>
              <br>• Do not share this OTP with anyone
              <br>• If you didn't request this OTP, please ignore this email
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p>This is an automated message from Job Portal. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    console.log('Password reset token generated:', resetToken);
    
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${email}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - Job Portal',
      text: `Please click the following link to reset your password: ${resetLink}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Job Portal</h1>
            <p style="margin: 10px 0; opacity: 0.9;">Password Reset</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #374151; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your Job Portal account. Click the button below to set a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              <strong>Important:</strong>
              <br>• This link will expire in <strong>15 minutes</strong>
              <br>• If you didn't request this password reset, please ignore this email
              <br>• For security reasons, never share this link with anyone
            </p>
            
            <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <span style="word-break: break-all; color: #667eea;">${resetLink}</span>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p>This is an automated message from Job Portal. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

// Store OTP with expiration
export const storeOTP = (email, otp) => {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(email, { otp, expiresAt, lastSent: Date.now() });
  console.log('OTP stored for email:', email);
};

// Store password reset token
export const storePasswordResetToken = (email, token) => {
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  passwordResetStore.set(email, { token, expiresAt });
  console.log('Password reset token stored for email:', email);
};

// Verify OTP
export const verifyOTP = (email, otp) => {
  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return { valid: false, message: 'OTP not found or expired' };
  }
  
  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);
    return { valid: false, message: 'OTP expired' };
  }
  
  if (storedData.otp !== otp) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  // OTP is valid, remove it from store
  otpStore.delete(email);
  console.log('OTP verified successfully for email:', email);
  return { valid: true, message: 'OTP verified successfully' };
};

// Verify password reset token
export const verifyPasswordResetToken = (email, token) => {
  const storedData = passwordResetStore.get(email);
  
  if (!storedData) {
    return { valid: false, message: 'Invalid or expired reset token' };
  }
  
  if (Date.now() > storedData.expiresAt) {
    passwordResetStore.delete(email);
    return { valid: false, message: 'Reset token expired' };
  }
  
  if (storedData.token !== token) {
    return { valid: false, message: 'Invalid reset token' };
  }
  
  console.log('Password reset token verified successfully for email:', email);
  return { valid: true, message: 'Reset token verified successfully' };
};

// Clear password reset token after use
export const clearPasswordResetToken = (email) => {
  passwordResetStore.delete(email);
  console.log('Password reset token cleared for email:', email);
};

// Check cooldown (prevent spam)
export const canSendOTP = (email) => {
  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return { canSend: true, message: 'Ready to send OTP' };
  }
  
  const cooldownPeriod = 30 * 1000; // 30 seconds cooldown
  const timeSinceLastSent = Date.now() - storedData.lastSent;
  
  if (timeSinceLastSent < cooldownPeriod) {
    const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastSent) / 1000);
    return { 
      canSend: false, 
      message: `Please wait ${remainingTime} seconds before requesting another OTP` 
    };
  }
  
  return { canSend: true, message: 'Ready to send OTP' };
};

// Clean up expired OTPs and reset tokens (run periodically)
export const cleanupExpiredData = () => {
  const now = Date.now();
  
  // Clean up expired OTPs
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
  
  // Clean up expired reset tokens
  for (const [email, data] of passwordResetStore.entries()) {
    if (now > data.expiresAt) {
      passwordResetStore.delete(email);
    }
  }
};

// Auto-cleanup every 5 minutes
setInterval(cleanupExpiredData, 5 * 60 * 1000);
