import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Company } from '../models/company.model.js';

dotenv.config();

const checkCompanies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    const companies = await Company.find({});
    console.log(`Found ${companies.length} companies:`);
    
    companies.forEach((company, index) => {
      console.log(`Company ${index + 1}:`);
      console.log('ID:', company._id);
      console.log('Name:', company.name);
      console.log('Description:', company.description);
      console.log('Website:', company.website);
      console.log('Location:', company.location);
      console.log('Logo:', company.logo);
      console.log('Created At:', company.createdAt);
      console.log('---');
    });
    
    // Check if there are any companies with valid data
    const validCompanies = companies.filter(company => 
      company.name && 
      company.name.trim() !== '' && 
      company.name.toLowerCase() !== 'no companies added'
    );
    
    console.log(`\nValid companies: ${validCompanies.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkCompanies();
