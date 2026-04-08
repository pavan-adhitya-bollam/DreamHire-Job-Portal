import express from 'express';
import { sendOTP, verifyOTPController, forgotPassword, resetPassword } from '../controllers/otp.controller.js';

const router = express.Router();

// POST /api/auth/send-otp
router.post('/send-otp', sendOTP);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTPController);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', resetPassword);

export default router;
