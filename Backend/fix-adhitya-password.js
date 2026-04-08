import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

mongoose.connect('mongodb://localhost:27017/jobportal')
.then(async () => {
  console.log('Connected to MongoDB');
  
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({ email: 'adhityabollam@gmail.com' }).toArray();
  
  if (users.length > 0) {
    const user = users[0];
    console.log('User found:', user.email);
    
    // Hash new password
    const hashedPassword = await bcrypt.hash('Pavan@2005', 10);
    console.log('New hashed password length:', hashedPassword.length);
    
    // Update password
    const result = await db.collection('users').updateOne(
      { _id: user._id }, 
      { $set: { password: hashedPassword } }
    );
    console.log('Update result:', result);
    
    // Verify update
    const updatedUser = await db.collection('users').findOne({ _id: user._id });
    const isMatch = await bcrypt.compare('Pavan@2005', updatedUser.password);
    console.log('Password comparison test:', isMatch);
    
    console.log('Password updated successfully for adhityabollam@gmail.com!');
  } else {
    console.log('User adhityabollam@gmail.com not found');
  }
  
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
