import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Application } from '../models/application.model.js';
import { User } from '../models/user.model.js';
import { Job } from '../models/job.model.js';

dotenv.config();

const debugManualPopulation = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Get first application to test
    const application = await Application.findOne({});
    console.log('First application:', application);
    
    // Test user lookup
    const user = await User.findById(application.applicant);
    console.log('User found:', user ? 'YES' : 'NO');
    if (user) {
      console.log('User details:', {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber
      });
    }
    
    // Test job lookup
    const job = await Job.findById(application.job);
    console.log('Job found:', job ? 'YES' : 'NO');
    if (job) {
      console.log('Job details:', {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugManualPopulation();
