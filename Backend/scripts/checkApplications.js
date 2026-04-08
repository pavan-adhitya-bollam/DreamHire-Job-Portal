import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Application } from '../models/application.model.js';

dotenv.config();

const checkApplications = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    const applications = await Application.find({});
    console.log(`Found ${applications.length} applications:`);
    
    applications.forEach((app, index) => {
      console.log(`\nApplication ${index + 1}:`);
      console.log('ID:', app._id);
      console.log('Job:', app.job);
      console.log('Applicant:', app.applicant);
      console.log('Resume:', app.resume);
      console.log('Status:', app.status);
      console.log('Created At:', app.createdAt);
    });
    
    // Test populate
    const populatedApps = await Application.find({})
      .populate('job', 'title company')
      .populate('applicant', 'fullname email');
    
    console.log('\n=== POPULATED APPLICATIONS ===');
    populatedApps.forEach((app, index) => {
      console.log(`\nPopulated Application ${index + 1}:`);
      console.log('ID:', app._id);
      console.log('Job:', app.job);
      console.log('Applicant:', app.applicant);
      console.log('Status:', app.status);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkApplications();
