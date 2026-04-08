# 📧 Email Setup Guide for OTP Verification

## 🚀 Quick Setup Instructions

### 1. **Gmail Configuration (Recommended)**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select: Mail → Other (Custom name)
   - Copy the 16-character password

3. **Update .env file**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### 2. **Alternative Email Services**

#### **Outlook/Hotmail**:
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-app-password
```

#### **Yahoo Mail**:
```env
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

## 🔧 **Configuration Steps**

1. **Stop the backend server** (Ctrl+C in terminal)
2. **Update .env file** with your email credentials
3. **Restart the backend server**:
   ```bash
   npm run dev
   ```

## 🧪 **Testing the OTP System**

1. **Visit**: http://localhost:5173
2. **Click**: "Email Verification" button on login page
3. **Enter**: Your email address
4. **Check**: Your email for 6-digit OTP
5. **Enter**: OTP to verify
6. **Complete**: Registration with your details

## 📨 **Email Templates**

The system sends beautiful HTML emails with:
- ✅ Professional design
- ✅ Clear OTP display
- ✅ Expiration time (10 minutes)
- ✅ Security warnings

## 🔒 **Security Features**

- ⏰ **OTP expires** in 10 minutes
- 🚫 **No OTP reuse** allowed
- 🛡️ **Rate limiting** ready
- 🔐 **Secure token generation**

## 🚨 **Troubleshooting**

### **"Failed to send OTP"**:
1. Check email/password in .env file
2. Enable "Less secure apps" (Gmail) or use App Password
3. Check internet connection

### **"Invalid OTP"**:
1. Wait for new OTP (don't retry with same one)
2. Check email for latest OTP
3. Ensure OTP hasn't expired (10 minutes)

### **"Email already registered"**:
1. Try logging in instead
2. Use password reset if needed

## 📱 **Mobile Testing**

Test on mobile devices:
- ✅ Responsive design works
- ✅ Email client opens correctly
- ✅ OTP entry is easy

## 🎯 **Next Steps**

After setup:
1. ✅ Users can register with email verification
2. ✅ Enhanced security for your platform
3. ✅ Professional user experience
4. ✅ Reduced fake registrations

---

**Need help?** Check the console logs for detailed error messages!
