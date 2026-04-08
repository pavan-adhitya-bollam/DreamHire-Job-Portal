import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Company } from '../models/company.model.js';
import { Job } from '../models/job.model.js';
import { User } from '../models/user.model.js';

dotenv.config();

const createJobsForExistingCompanies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Get all existing companies
    const companies = await Company.find({});
    console.log(`Found ${companies.length} existing companies`);
    
    // Get a recruiter user
    const recruiterUser = await User.findOne({ role: 'Recruiter' });
    if (!recruiterUser) {
      console.log('No recruiter user found. Exiting...');
      process.exit(1);
    }
    
    console.log('Using recruiter user:', recruiterUser.fullname, recruiterUser.email);
    
    // Create sample jobs for existing companies
    const jobs = [
      {
        title: 'Senior Software Engineer',
        description: 'We are looking for an experienced software engineer to join our team and work on cutting-edge projects.',
        requirements: ['5+ years of experience in software development', 'Proficiency in JavaScript, React, Node.js', 'Strong problem-solving skills'],
        salary: '120000-150000',
        experienceLevel: 5,
        location: 'San Francisco, CA',
        jobType: 'full-time',
        position: 10000,
        company: companies[0]._id,
        created_by: recruiterUser._id
      },
      {
        title: 'Frontend Developer',
        description: 'Join our frontend team to build amazing user interfaces and experiences.',
        requirements: ['3+ years of experience in frontend development', 'Strong knowledge of React, CSS, HTML', 'UI/UX design skills'],
        salary: '80000-100000',
        experienceLevel: 3,
        location: 'New York, NY',
        jobType: 'full-time',
        position: 20000,
        company: companies[1]._id,
        created_by: recruiterUser._id
      },
      {
        title: 'Data Scientist',
        description: 'Looking for a data scientist to help us analyze complex datasets and build predictive models.',
        requirements: ['4+ years of experience in data science', 'Python, machine learning, statistics', 'Experience with data visualization tools'],
        salary: '110000-140000',
        experienceLevel: 4,
        location: 'Boston, MA',
        jobType: 'full-time',
        position: 30000,
        company: companies[2]._id,
        created_by: recruiterUser._id
      },
      {
        title: 'DevOps Engineer',
        description: 'Join our DevOps team to manage and optimize our cloud infrastructure.',
        requirements: ['3+ years of experience in DevOps', 'AWS, Docker, Kubernetes, CI/CD', 'Infrastructure as code experience'],
        salary: '100000-130000',
        experienceLevel: 3,
        location: 'Seattle, WA',
        jobType: 'full-time',
        position: 40000,
        company: companies[3]._id,
        created_by: recruiterUser._id
      },
      {
        title: 'Machine Learning Engineer',
        description: 'We need a ML engineer to develop and deploy machine learning models at scale.',
        requirements: ['4+ years of experience in ML', 'Python, TensorFlow, PyTorch, deep learning', 'Model deployment and optimization'],
        salary: '130000-160000',
        experienceLevel: 4,
        location: 'Palo Alto, CA',
        jobType: 'full-time',
        position: 50000,
        company: companies[4]._id,
        created_by: recruiterUser._id
      },
      {
        title: 'Full Stack Developer',
        description: 'Looking for a full stack developer to work on both frontend and backend systems.',
        requirements: ['3+ years of experience in full stack development', 'React, Node.js, databases', 'API development experience'],
        salary: '90000-120000',
        experienceLevel: 3,
        location: 'Remote',
        jobType: 'full-time',
        position: 60000,
        company: companies[0]._id,
        created_by: recruiterUser._id
      },
      {
        title: 'Backend Developer',
        description: 'Join our backend team to build scalable APIs and services.',
        requirements: ['3+ years of experience in backend development', 'Node.js, Python, databases', 'Microservices architecture'],
        salary: '85000-110000',
        experienceLevel: 3,
        location: 'New York, NY',
        jobType: 'full-time',
        position: 70000,
        company: companies[1]._id,
        created_by: recruiterUser._id
      },
      {
        title: 'Product Manager',
        description: 'We need a product manager to lead product development and strategy.',
        requirements: ['5+ years of experience in product management', 'Tech background, leadership skills', 'Agile methodologies'],
        salary: '120000-150000',
        experienceLevel: 5,
        location: 'San Francisco, CA',
        jobType: 'full-time',
        position: 80000,
        company: companies[0]._id,
        created_by: recruiterUser._id
      }
    ];
    
    const createdJobs = await Job.insertMany(jobs);
    console.log(`Created ${createdJobs.length} jobs`);
    
    console.log('\n=== JOBS CREATED SUCCESSFULLY ===');
    console.log('Companies:', companies.length);
    console.log('Jobs:', createdJobs.length);
    console.log('\nThe home page should now display companies and jobs!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createJobsForExistingCompanies();
