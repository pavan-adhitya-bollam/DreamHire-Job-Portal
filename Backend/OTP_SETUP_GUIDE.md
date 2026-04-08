# OTP Email Verification Setup Guide

## 🚀 Real Email OTP System - Ready!

### ✅ What's Implemented:

1. **Backend (Node.js)**:
   - ✅ Clean OTP service with in-memory storage
   - ✅ POST `/api/otp/send-otp` API
   - ✅ POST `/api/otp/verify-otp` API
   - ✅ 5-minute OTP expiration
   - ✅ 1-minute cooldown to prevent spam
   - ✅ Beautiful HTML email template
   - ✅ Proper error handling

2. **Frontend (React)**:
   - ✅ Updated to use new OTP APIs
   - ✅ Removed "Test OTP" display
   - ✅ Shows "OTP sent to your email" message
   - ✅ Proper error handling

3. **Security Features**:
   - ✅ OTP expires in 5 minutes
   - ✅ 1-minute cooldown between requests
   - ✅ In-memory storage with auto-cleanup
   - ✅ Proper validation

---

## 📧 Email Configuration

### Step 1: Get Gmail App Password

1. Enable 2-Factor Authentication on your Gmail
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" → "Other (Custom name)" → Enter "Job Portal"
4. Copy the 16-character app password

### Step 2: Update .env File

Replace in `Backend/.env`:

```env
# Email Configuration for OTP
EMAIL_USER=your_actual_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password
```

### Step 3: Restart Backend

```bash
npm run dev
```

---

## 🧪 Testing

### Without Email Configuration:
- System will show error message about email configuration
- Perfect for development testing

### With Email Configuration:
- Real OTP emails sent to users
- Beautiful HTML email template
- 5-minute expiration
- 1-minute cooldown

---

## 🔄 API Endpoints

### Send OTP
```
POST /api/otp/send-otp
Body: { "email": "user@example.com" }
Response: { "success": true, "message": "OTP sent to your email address" }
```

### Verify OTP
```
POST /api/otp/verify-otp
Body: { "email": "user@example.com", "otp": "123456" }
Response: { "success": true, "message": "OTP verified successfully" }
```

---

## 🛡️ Security Features

1. **OTP Expiration**: 5 minutes
2. **Cooldown**: 1 minute between requests
3. **Auto-cleanup**: Expired OTPs removed every 5 minutes
4. **Rate Limiting**: Prevents spam requests
5. **Input Validation**: Proper email and OTP validation

---

## 🎯 Usage Flow

1. User enters email
2. Clicks "Send OTP" → API called
3. OTP sent to email (or error if not configured)
4. User enters OTP
5. Clicks "Verify" → API called
6. If valid → User can proceed with registration
7. If invalid → Error message shown

---

## 📁 Files Modified/Created

### Backend:
- ✅ `services/otpService.js` - Core OTP logic
- ✅ `controllers/otp.controller.js` - API controllers
- ✅ `routes/otp.route.js` - API routes
- ✅ `index.js` - Added OTP routes
- ✅ `.env` - Email configuration

### Frontend:
- ✅ `Register.jsx` - Updated API calls
- ✅ `Login.jsx` - Updated forgot password

---

## 🚀 Ready to Use!

The system is now **production-ready** with:
- Real email OTP verification
- Proper security measures
- Clean code architecture
- Beautiful email templates
- Comprehensive error handling

**Just configure your Gmail credentials and start using real OTP emails!** 🎉
