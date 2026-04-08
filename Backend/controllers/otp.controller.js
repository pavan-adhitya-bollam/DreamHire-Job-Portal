import { storeOTP, verifyOTP, canSendOTP, sendOTPEmail, sendPasswordResetEmail, storePasswordResetToken, verifyPasswordResetToken, clearPasswordResetToken } from '../services/otpService.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// Check if email is properly configured
const isEmailConfigured = () => {
  const email = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  return email && pass && 
         email !== 'pavan@gmail.com' && 
         pass !== 'abc123';
};

// POST /api/auth/send-otp
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check cooldown
    const cooldownCheck = canSendOTP(email);
    if (!cooldownCheck.canSend) {
      return res.status(429).json({
        success: false,
        message: cooldownCheck.message
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration
    storeOTP(email, otp);

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please check your Gmail credentials in .env file.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email address'
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/auth/verify-otp
export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Verify OTP
    const verification = verifyOTP(email, otp);

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }

    return res.status(200).json({
      success: true,
      message: verification.message
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("=== FORGOT PASSWORD DEBUG ===");
    console.log("Email received:", email);
    console.log("Email service configured:", isEmailConfigured());
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("================================");

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    console.log("User found:", user.email, "ID:", user._id);

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log("Reset token generated:", resetToken);

    // Store reset token
    storePasswordResetToken(email, resetToken);

    // Send password reset email
    console.log("Attempting to send password reset email...");
    const emailSent = await sendPasswordResetEmail(email, resetToken);
    console.log("Email sent result:", emailSent);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email. Please check your Gmail credentials.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email address'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    console.log('Reset password request received:', req.body);
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      console.log('Missing required fields:', { email: !!email, token: !!token, newPassword: !!newPassword });
      return res.status(400).json({
        success: false,
        message: 'Email, token, and new password are required'
      });
    }

    // Verify reset token
    const verification = verifyPasswordResetToken(email, token);
    console.log('Token verification result:', verification);

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    // Clear reset token
    clearPasswordResetToken(email);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
