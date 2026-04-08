# 🔧 Direct Database Password Update

## ❌ **Current Issue:**

The password update page isn't working because the backend endpoint isn't accessible from the frontend.

## ✅ **Direct Database Solution:**

Let me create a simple script to update your password directly in MongoDB.

## 🚀 **Quick Fix:**

### **Step 1: Access MongoDB Directly**

1. **Open Command Prompt**
2. **Run this command:**

```bash
cd "c:\Users\pavan\projects\JOB-PORTAL\Backend"
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/jobportal')
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Find user and update password
  const User = mongoose.model('User', new mongoose.Schema({}, { collection: 'users' }));
  const user = await User.findOne({ email: 'naninanione5two@gmail.com' });
  
  if (user) {
    const hashedPassword = await bcrypt.hash('Nani@123', 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    console.log('Password updated successfully!');
  } else {
    console.log('User not found');
  }
  
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
"
```

### **Step 2: Check Success Message**

You should see: `Password updated successfully!`

### **Step 3: Try Login**

1. **Visit**: http://172.27.240.1:5173
2. **Login with**:
   - Email: naninanione5two@gmail.com
   - Password: Nani@123
   - Role: Student

## 🎯 **What This Does:**

- ✅ **Connects directly** to MongoDB
- ✅ **Finds your user** by email
- ✅ **Hashes the new password** (`Nani@123`)
- ✅ **Updates the password** in database
- ✅ **Exits cleanly**

## 📱 **Alternative:**

If the above doesn't work, I can create a simple Node.js script file that you can run.

**This direct database approach will bypass all the frontend/backend connection issues!** 🚀

**Try running the command above and let me know if you see "Password updated successfully!"**
