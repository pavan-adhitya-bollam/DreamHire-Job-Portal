import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

mongoose.connect('mongodb://localhost:27017/jobportal')
.then(async () => {
  console.log('Connected to MongoDB');
  
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({ email: 'naninanione5two@gmail.com' }).toArray();
  
  if (users.length > 0) {
    const user = users[0];
    console.log('Found user:', user.email);
    console.log('Current password length:', user.password ? user.password.length : 0);
    
    // Hash new password
    const hashedPassword = await bcrypt.hash('Nani@123', 10);
    console.log('New hashed password length:', hashedPassword.length);
    
    // Update password
    const result = await db.collection('users').updateOne(
      { _id: user._id }, 
      { $set: { password: hashedPassword } }
    );
    console.log('Update result:', result);
    
    // Verify update
    const updatedUser = await db.collection('users').findOne({ _id: user._id });
    console.log('Updated password length:', updatedUser.password ? updatedUser.password.length : 0);
    
    // Test password comparison
    const isMatch = await bcrypt.compare('Nani@123', updatedUser.password);
    console.log('Password comparison test:', isMatch);
    
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
