# OTP System Test Script

## 🧪 Quick Test

### 1. Test API Endpoints

#### Send OTP (without email configured)
```bash
curl -X POST http://localhost:5001/api/otp/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

#### Verify OTP
```bash
curl -X POST http://localhost:5001/api/otp/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

### 2. Test in Browser

1. Visit: http://localhost:5173
2. Click "Register"
3. Enter your email
4. Click "Send OTP"
5. Check console for OTP (if email not configured)
6. Enter OTP and verify

### 3. Expected Behaviors

- ✅ **Without email config**: Error about email configuration
- ✅ **With email config**: Real OTP sent to email
- ✅ **Cooldown**: 1 minute between requests
- ✅ **Expiration**: 5 minutes OTP validity
- ✅ **Security**: Proper validation and error handling

### 4. Email Template Preview

When configured, users receive beautiful emails with:
- Job Portal branding
- Clear OTP display
- Security instructions
- Professional design

---

## 🎯 System Status

- ✅ Backend running: http://localhost:5001
- ✅ Frontend running: http://localhost:5173
- ✅ OTP APIs: `/api/otp/send-otp` & `/api/otp/verify-otp`
- ✅ Security features implemented
- ✅ Ready for production use

**Test now and configure your Gmail credentials for real emails!** 🚀
