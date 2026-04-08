import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Job } from '../models/job.model.js';

dotenv.config();

const checkJobIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Get all jobs to see their actual IDs
    const jobs = await Job.find({});
    console.log(`Found ${jobs.length} jobs:`);
    
    jobs.forEach((job, index) => {
      console.log(`Job ${index + 1}:`);
      console.log('ID:', job._id);
      console.log('Title:', job.title);
      console.log('Company:', job.company);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkJobIds();
