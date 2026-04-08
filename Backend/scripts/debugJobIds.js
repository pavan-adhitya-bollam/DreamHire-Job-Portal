import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Application } from '../models/application.model.js';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';

dotenv.config();

const debugJobIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Get all applications and check their job IDs
    const applications = await Application.find({});
    console.log(`Found ${applications.length} applications`);
    
    applications.forEach((app, index) => {
      console.log(`\nApplication ${index + 1}:`);
      console.log('Job ID:', app.job);
      console.log('Job ID type:', typeof app.job);
      console.log('Is valid ObjectId?', mongoose.Types.ObjectId.isValid(app.job));
      
      // Try to find the job
      Job.findById(app.job).then(job => {
        if (job) {
          console.log('✅ Job found:', job.title);
        } else {
          console.log('❌ Job NOT found');
        }
      }).catch(err => {
        console.log('❌ Job lookup error:', err.message);
      });
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugJobIds();
