# 🔍 OTP TROUBLESHOOTING GUIDE

## ❌ **Current Issue: OTP Failed**

### **Error Analysis:**
```
'535 5.7.8  https://support.google.com/mail/?p=BadCredentials'
```

This means Gmail rejected your login credentials.

### **🔧 IMMEDIATE FIX:**

#### **Step 1: Check Your .env File**
Your current .env has placeholder values:
```env
EMAIL_USER=pavan@gmail.com  # ❌ This is a placeholder
EMAIL_PASS=abc123          # ❌ This is a placeholder
```

#### **Step 2: Get REAL Gmail Credentials**

1. **Enable 2-Factor Authentication** on your Gmail account
2. Visit: https://myaccount.google.com/apppasswords
3. Click "Select app" → "Mail"
4. Click "Select device" → "Other (Custom name)"
5. Enter "Job Portal" as the name
6. Click "Generate"
7. **Copy the 16-character password** (it looks like: xxxx xxxx xxxx xxxx)

#### **Step 3: Update .env with REAL Credentials**
```env
# Email Configuration for OTP
EMAIL_USER=your_real_gmail@gmail.com
EMAIL_PASS=your_real_16_character_app_password
```

#### **Step 4: Restart Backend**
```bash
npm run dev
```

### **🧪 Test After Fix:**

1. **Visit**: http://localhost:5173
2. **Click "Register"**
3. **Enter your email**
4. **Click "Send OTP"**
5. **Check your email inbox** (should receive OTP)
6. **Enter OTP from email**
7. **Click "Verify"**

### **🔍 If Still Failing:**

#### **Common Gmail Issues:**
- ❌ 2FA not enabled
- ❌ Using regular password instead of App Password
- ❌ App Password generated for wrong app
- ❌ Gmail account blocking less secure apps

#### **Solutions:**
1. **Enable 2FA** if not done
2. **Generate new App Password** specifically for "Job Portal"
3. **Check Gmail spam folder**
4. **Try "Allow less secure apps"** in Gmail settings

### **📞 Quick Help:**

**What's your Gmail address?** I can guide you through the exact steps.

**Did you enable 2-Factor Authentication?** This is required for App Passwords.

**What error do you see in the backend console?** This helps identify the specific issue.

---

## 🎯 **Expected Behavior After Fix:**

1. ✅ Backend shows: "Email sent successfully to: your@email.com"
2. ✅ You receive email with OTP code
3. ✅ OTP verification works
4. ✅ Registration proceeds successfully

**Configure your real Gmail credentials and the OTP system will work perfectly!** 🚀
