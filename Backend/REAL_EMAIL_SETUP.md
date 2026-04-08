# 📧 REAL EMAIL OTP SETUP GUIDE

## 🎯 **Your Goal:**
You want **real OTP sent to your email inbox**, NOT displayed on screen.

## 🔧 **CURRENT ISSUE:**
Your `.env` file has placeholder Gmail credentials:
```env
EMAIL_USER=pavan@gmail.com  # ❌ Placeholder
EMAIL_PASS=abc123          # ❌ Placeholder
```

## ✅ **SOLUTION - Step by Step:**

### **Step 1: Enable 2-Factor Authentication**
1. Go to your Gmail account
2. Go to Settings → Security
3. Enable **2-Step Verification**

### **Step 2: Generate App Password**
1. Visit: https://myaccount.google.com/apppasswords
2. Click "Select app" → **"Mail"**
3. Click "Select device" → **"Other (Custom name)"**
4. Enter: **"Job Portal"**
5. Click **"Generate"**
6. **Copy the 16-character password** (looks like: xxxx xxxx xxxx xxxx)

### **Step 3: Update .env File**
Replace the placeholder values with your **REAL credentials**:

```env
# Email Configuration for OTP
EMAIL_USER=your_real_gmail@gmail.com
EMAIL_PASS=your_real_16_character_app_password
```

### **Step 4: Restart Backend**
```bash
npm run dev
```

## 🧪 **Test Real Email OTP:**

1. **Visit**: http://localhost:5173
2. **Click "Register"**
3. **Enter your email**
4. **Click "Send OTP"**
5. **Check your email inbox** (should receive OTP)
6. **Enter OTP from email**
7. **Click "Verify"**

## 📱 **Expected Behavior:**

- ✅ **No OTP shown on screen**
- ✅ **Real email sent to your inbox**
- ✅ **Beautiful HTML email template**
- ✅ **5-minute OTP expiration**
- ✅ **30-second resend cooldown**

## ❌ **If Still Not Working:**

### **Common Issues:**
1. **2FA not enabled** → Must enable 2-Step Verification first
2. **Wrong app password** → Generate new one specifically for "Job Portal"
3. **Using regular password** → Must use App Password, not regular password
4. **Email in spam** → Check spam folder

### **Debug Steps:**
1. Check backend console for errors
2. Verify Gmail credentials are correct
3. Try sending test email from Gmail settings

## 🎉 **Success Indicators:**

- Backend shows: "Email sent successfully to: your@email.com"
- You receive email with subject "Your OTP Code"
- OTP verification works
- No OTP displayed on screen

---

## 📞 **Need Help?**

**What's your Gmail address?** I can provide specific steps.

**Did you enable 2FA?** This is required for App Passwords.

**Can you share the exact error?** Helps identify the issue.

**Once you configure your real Gmail credentials, you'll receive real OTP emails in your inbox!** 🚀
