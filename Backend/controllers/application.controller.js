import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { sendJobApplicationEmail } from "../utils/emailService.js";
import { sendEmail } from "../utils/sendEmail.js";

export const applyJob = async (req, res) => {
  try {
    console.log("=== Application Submission Started ===");
    console.log("User ID from middleware:", req.id);
    console.log("Job ID from params:", req.params.jobId);
    console.log("Files received:", req.file);
    
    const userId = req.id; // from auth middleware
    const jobId = req.params.jobId; // Fixed: use jobId instead of id

    if (!jobId) {
      return res.status(400).json({
        message: "Invalid job id",
        success: false,
      });
    }

    if (!userId) {
      console.log("ERROR: User ID is missing from middleware");
      return res.status(401).json({
        message: "User authentication failed",
        success: false,
      });
    }

    // ✅ check already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // ✅ check job exists in hardcoded data
    const getRandomExperience = (jobId) => {
      const experiences = ["0-3 years", "3-5 years", "5-7 years", "7+ years"];
      const seed = parseInt(jobId) || 1;
      return experiences[seed % experiences.length];
    };

    const jobs = [
      { _id: "1", title: "Frontend Developer", location: "Hyderabad", salary: "50000", jobType: "Full Time", position: 6, experience: getRandomExperience("1"), company: { name: "Google" } },
      { _id: "2", title: "Backend Developer", location: "Bangalore", salary: "60000", jobType: "Full Time", position: 8, experience: getRandomExperience("2"), company: { name: "Amazon" } },
      { _id: "3", title: "Full Stack Developer", location: "Chennai", salary: "70000", jobType: "Full Time", position: 1, experience: getRandomExperience("3"), company: { name: "Microsoft" } },
      { _id: "4", title: "Java Developer", location: "Pune", salary: "55000", jobType: "Full Time", position: 150, experience: getRandomExperience("4"), company: { name: "Infosys" } },
      { _id: "5", title: "Python Developer", location: "Delhi", salary: "65000", jobType: "Full Time", position: 200, experience: getRandomExperience("5"), company: { name: "TCS" } },
      { _id: "6", title: "UI/UX Designer", location: "Mumbai", salary: "45000", jobType: "Full Time", position: 5, experience: getRandomExperience("6"), company: { name: "Adobe" } },
      { _id: "7", title: "DevOps Engineer", location: "Noida", salary: "80000", jobType: "Full Time", position: 120, experience: getRandomExperience("7"), company: { name: "Accenture" } },
      { _id: "8", title: "Data Analyst", location: "Kolkata", salary: "50000", jobType: "Full Time", position: 180, experience: getRandomExperience("8"), company: { name: "Wipro" } },
      { _id: "9", title: "Mobile App Developer", location: "Ahmedabad", salary: "60000", jobType: "Full Time", position: 5, experience: getRandomExperience("9"), company: { name: "Flipkart" } },
      { _id: "10", title: "AI Engineer", location: "Bangalore", salary: "90000", jobType: "Full Time", position: 1, experience: getRandomExperience("10"), company: { name: "OpenAI" } },
      { _id: "11", title: "Cyber Security Analyst", location: "Delhi", salary: "75000", jobType: "Full Time", position: 80, experience: getRandomExperience("11"), company: { name: "Kaspersky" } },
      { _id: "12", title: "Cloud Engineer", location: "Hyderabad", salary: "85000", jobType: "Full Time", position: 150, experience: getRandomExperience("12"), company: { name: "IBM" } },
      { _id: "13", title: "QA Tester", location: "Chennai", salary: "40000", jobType: "Full Time", position: 200, experience: getRandomExperience("13"), company: { name: "Zoho" } },
      { _id: "14", title: "Business Analyst", location: "Mumbai", salary: "70000", jobType: "Full Time", position: 100, experience: getRandomExperience("14"), company: { name: "Deloitte" } },
      { _id: "15", title: "Game Developer", location: "Bangalore", salary: "65000", jobType: "Full Time", position: 4, experience: getRandomExperience("15"), company: { name: "Ubisoft" } },
      { _id: "16", title: "Blockchain Developer", location: "Noida", salary: "95000", jobType: "Full Time", position: 3, experience: getRandomExperience("16"), company: { name: "Polygon" } },
      { _id: "17", title: "Technical Support Engineer", location: "Pune", salary: "35000", jobType: "Full Time", position: 250, experience: getRandomExperience("17"), company: { name: "HCL" } },
      { _id: "18", title: "Network Engineer", location: "Kolkata", salary: "60000", jobType: "Full Time", position: 120, experience: getRandomExperience("18"), company: { name: "Cisco" } },
      { _id: "19", title: "Data Scientist", location: "Bangalore", salary: "100000", jobType: "Full Time", position: 4, experience: getRandomExperience("19"), company: { name: "Tesla" } },
      { _id: "20", title: "Product Manager", location: "Delhi", salary: "120000", jobType: "Full Time", position: 3, experience: getRandomExperience("20"), company: { name: "Meta" } },
      { _id: "21", title: "Software Architect", location: "Hyderabad", salary: "110000", jobType: "Full Time", position: 3, experience: getRandomExperience("21"), company: { name: "Oracle" } },
      { _id: "22", title: "Database Administrator", location: "Pune", salary: "55000", jobType: "Full Time", position: 3, experience: getRandomExperience("22"), company: { name: "MongoDB" } },
      { _id: "23", title: "Machine Learning Engineer", location: "Bangalore", salary: "95000", jobType: "Full Time", position: 8, experience: getRandomExperience("23"), company: { name: "NVIDIA" } },
      { _id: "24", title: "Frontend Architect", location: "Mumbai", salary: "85000", jobType: "Full Time", position: 4, experience: getRandomExperience("24"), company: { name: "Spotify" } },
      { _id: "25", title: "Backend Architect", location: "Chennai", salary: "90000", jobType: "Full Time", position: 2, experience: getRandomExperience("25"), company: { name: "Netflix" } },
      { _id: "26", title: "React Developer", location: "Delhi", salary: "55000", jobType: "Full Time", position: 6, experience: getRandomExperience("26"), company: { name: "Facebook" } },
      { _id: "27", title: "Angular Developer", location: "Noida", salary: "60000", jobType: "Full Time", position: 4, experience: getRandomExperience("27"), company: { name: "Google" } },
      { _id: "28", title: "Vue.js Developer", location: "Hyderabad", salary: "52000", jobType: "Full Time", position: 2, experience: getRandomExperience("28"), company: { name: "Alibaba" } },
      { _id: "29", title: "Node.js Developer", location: "Bangalore", salary: "65000", jobType: "Full Time", position: 7, experience: getRandomExperience("29"), company: { name: "LinkedIn" } },
      { _id: "30", title: "PHP Developer", location: "Pune", salary: "45000", jobType: "Full Time", position: 5, experience: getRandomExperience("30"), company: { name: "WordPress" } },
      { _id: "31", title: "Ruby Developer", location: "Mumbai", salary: "58000", jobType: "Full Time", position: 4, experience: getRandomExperience("31"), company: { name: "GitHub" } },
      { _id: "32", title: "Go Developer", location: "Chennai", salary: "70000", jobType: "Full Time", position: 6, experience: getRandomExperience("32"), company: { name: "Docker" } },
      { _id: "33", title: "Kubernetes Engineer", location: "Delhi", salary: "85000", jobType: "Full Time", position: 5, experience: getRandomExperience("33"), company: { name: "Red Hat" } },
      { _id: "34", title: "Terraform Engineer", location: "Noida", salary: "75000", jobType: "Full Time", position: 4, experience: getRandomExperience("34"), company: { name: "HashiCorp" } },
      { _id: "35", title: "Site Reliability Engineer", location: "Hyderabad", salary: "90000", jobType: "Full Time", position: 1, experience: getRandomExperience("35"), company: { name: "Google" } },
      { _id: "36", title: "Security Engineer", location: "Bangalore", salary: "80000", jobType: "Full Time", position: 4, experience: getRandomExperience("36"), company: { name: "Microsoft" } },
      { _id: "37", title: "Performance Engineer", location: "Pune", salary: "70000", jobType: "Full Time", position: 2, experience: getRandomExperience("37"), company: { name: "Amazon" } },
      { _id: "38", title: "API Developer", location: "Mumbai", salary: "62000", jobType: "Full Time", position: 5, experience: getRandomExperience("38"), company: { name: "Twilio" } },
      { _id: "39", title: "Microservices Developer", location: "Chennai", salary: "75000", jobType: "Full Time", position: 6, experience: getRandomExperience("39"), company: { name: "Netflix" } },
      { _id: "40", title: "Embedded Systems Engineer", location: "Delhi", salary: "68000", jobType: "Full Time", position: 4, experience: getRandomExperience("40"), company: { name: "Intel" } },
      { _id: "41", title: "Robotics Engineer", location: "Noida", salary: "72000", jobType: "Full Time", position: 1, experience: getRandomExperience("41"), company: { name: "Boston Dynamics" } },
      { _id: "42", title: "AR/VR Developer", location: "Hyderabad", salary: "78000", jobType: "Full Time", position: 4, experience: getRandomExperience("42"), company: { name: "Meta" } },
      { _id: "43", title: "iOS Developer", location: "Bangalore", salary: "65000", jobType: "Full Time", position: 5, experience: getRandomExperience("43"), company: { name: "Apple" } },
      { _id: "44", title: "Android Developer", location: "Pune", salary: "60000", jobType: "Full Time", position: 6, experience: getRandomExperience("44"), company: { name: "Google" } },
      { _id: "45", title: "Flutter Developer", location: "Mumbai", salary: "58000", jobType: "Full Time", position: 4, experience: getRandomExperience("45"), company: { name: "Alibaba" } },
      { _id: "46", title: "Unity Developer", location: "Chennai", salary: "55000", jobType: "Full Time", position: 2, experience: getRandomExperience("46"), company: { name: "Unity" } },
      { _id: "47", title: "Unreal Engine Developer", location: "Delhi", salary: "70000", jobType: "Full Time", position: 1, experience: getRandomExperience("47"), company: { name: "Epic Games" } },
      { _id: "48", title: "WebGL Developer", location: "Noida", salary: "62000", jobType: "Full Time", position: 3, experience: getRandomExperience("48"), company: { name: "Adobe" } },
      { _id: "49", title: "Three.js Developer", location: "Hyderabad", salary: "58000", jobType: "Full Time", position: 4, experience: getRandomExperience("49"), company: { name: "Google" } },
      { _id: "50", title: "WebAssembly Developer", location: "Bangalore", salary: "85000", jobType: "Full Time", position: 3, experience: getRandomExperience("50"), company: { name: "Mozilla" } },
      { _id: "51", title: "Frontend Development Intern", location: "Bangalore", salary: "15000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("51"), company: { name: "Microsoft" } },
      { _id: "52", title: "Backend Development Intern", location: "Hyderabad", salary: "12000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("52"), company: { name: "Amazon" } },
      { _id: "53", title: "Full Stack Intern", location: "Chennai", salary: "18000", jobType: "Internship", duration: "6 months", experience: getRandomExperience("53"), company: { name: "Google" } },
      { _id: "54", title: "Mobile App Intern", location: "Mumbai", salary: "14000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("54"), company: { name: "Facebook" } },
      { _id: "55", title: "Data Science Intern", location: "Delhi", salary: "20000", jobType: "Internship", duration: "6 months", experience: getRandomExperience("55"), company: { name: "Tesla" } },
      { _id: "56", title: "AI/ML Intern", location: "Bangalore", salary: "22000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("56"), company: { name: "OpenAI" } },
      { _id: "57", title: "Cloud Computing Intern", location: "Noida", salary: "16000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("57"), company: { name: "Amazon" } },
      { _id: "58", title: "DevOps Intern", location: "Pune", salary: "17000", jobType: "Internship", duration: "5 months", experience: getRandomExperience("58"), company: { name: "Microsoft" } },
      { _id: "59", title: "Cyber Security Intern", location: "Hyderabad", salary: "15000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("59"), company: { name: "Cisco" } },
      { _id: "60", title: "UI/UX Design Intern", location: "Mumbai", salary: "13000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("60"), company: { name: "Adobe" } },
      { _id: "61", title: "Game Development Intern", location: "Bangalore", salary: "14000", jobType: "Internship", duration: "6 months", experience: getRandomExperience("61"), company: { name: "Ubisoft" } },
      { _id: "62", title: "Blockchain Intern", location: "Chennai", salary: "18000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("62"), company: { name: "Polygon" } },
      { _id: "63", title: "IoT Intern", location: "Delhi", salary: "16000", jobType: "Internship", duration: "5 months", experience: getRandomExperience("63"), company: { name: "Intel" } },
      { _id: "64", title: "AR/VR Intern", location: "Noida", salary: "17000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("64"), company: { name: "Meta" } },
      { _id: "65", title: "Robotics Intern", location: "Hyderabad", salary: "19000", jobType: "Internship", duration: "6 months", experience: getRandomExperience("65"), company: { name: "Boston Dynamics" } },
      { _id: "66", title: "Data Analytics Intern", location: "Bangalore", salary: "14000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("66"), company: { name: "Tableau" } },
      { _id: "67", title: "QA Testing Intern", location: "Pune", salary: "12000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("67"), company: { name: "Selenium" } },
      { _id: "68", title: "Technical Writing Intern", location: "Mumbai", salary: "10000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("68"), company: { name: "GitHub" } },
      { _id: "69", title: "Product Management Intern", location: "Chennai", salary: "15000", jobType: "Internship", duration: "5 months", experience: getRandomExperience("69"), company: { name: "Slack" } },
      { _id: "70", title: "Marketing Intern", location: "Delhi", salary: "8000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("70"), company: { name: "HubSpot" } },
      { _id: "71", title: "Senior Software Engineer", location: "Bangalore", salary: "120000", jobType: "Full Time", position: 3, experience: getRandomExperience("71"), company: { name: "Microsoft" } },
      { _id: "72", title: "Principal Engineer", location: "Hyderabad", salary: "150000", jobType: "Full Time", position: 2, experience: getRandomExperience("72"), company: { name: "Amazon" } },
      { _id: "73", title: "Staff Engineer", location: "Chennai", salary: "130000", jobType: "Full Time", position: 2, experience: getRandomExperience("73"), company: { name: "Google" } },
      { _id: "74", title: "Engineering Manager", location: "Mumbai", salary: "140000", jobType: "Full Time", position: 3, experience: getRandomExperience("74"), company: { name: "Facebook" } },
      { _id: "75", title: "Technical Lead", location: "Delhi", salary: "110000", jobType: "Full Time", position: 4, experience: getRandomExperience("75"), company: { name: "Apple" } },
      { _id: "76", title: "Solutions Architect", location: "Noida", salary: "105000", jobType: "Full Time", position: 5, experience: getRandomExperience("76"), company: { name: "AWS" } },
      { _id: "77", title: "Systems Engineer", location: "Pune", salary: "75000", jobType: "Full Time", position: 8, experience: getRandomExperience("77"), company: { name: "IBM" } },
      { _id: "78", title: "Platform Engineer", location: "Hyderabad", salary: "95000", jobType: "Full Time", position: 6, experience: getRandomExperience("78"), company: { name: "Netflix" } },
      { _id: "79", title: "Infrastructure Engineer", location: "Bangalore", salary: "88000", jobType: "Full Time", position: 7, experience: getRandomExperience("79"), company: { name: "Google" } },
      { _id: "80", title: "Compliance Engineer", location: "Chennai", salary: "82000", jobType: "Full Time", position: 5, experience: getRandomExperience("80"), company: { name: "Microsoft" } },
      { _id: "81", title: "Automation Engineer", location: "Mumbai", salary: "78000", jobType: "Full Time", position: 4, experience: getRandomExperience("81"), company: { name: "Tesla" } },
      { _id: "82", title: "Validation Engineer", location: "Delhi", salary: "72000", jobType: "Full Time", position: 6, experience: getRandomExperience("82"), company: { name: "Intel" } },
      { _id: "83", title: "Integration Engineer", location: "Noida", salary: "85000", jobType: "Full Time", position: 7, experience: getRandomExperience("83"), company: { name: "Oracle" } },
      { _id: "84", title: "Migration Engineer", location: "Pune", salary: "90000", jobType: "Full Time", position: 4, experience: getRandomExperience("84"), company: { name: "AWS" } },
      { _id: "85", title: "Monitoring Engineer", location: "Hyderabad", salary: "76000", jobType: "Full Time", position: 5, experience: getRandomExperience("85"), company: { name: "Datadog" } },
      { _id: "86", title: "Logging Engineer", location: "Bangalore", salary: "74000", jobType: "Full Time", position: 6, experience: getRandomExperience("86"), company: { name: "Splunk" } },
      { _id: "87", title: "Analytics Engineer", location: "Chennai", salary: "86000", jobType: "Full Time", position: 4, experience: getRandomExperience("87"), company: { name: "Snowflake" } },
      { _id: "88", title: "Reporting Engineer", location: "Mumbai", salary: "68000", jobType: "Full Time", position: 3, experience: getRandomExperience("88"), company: { name: "Tableau" } },
      { _id: "89", title: "Dashboard Developer", location: "Delhi", salary: "62000", jobType: "Full Time", position: 4, experience: getRandomExperience("89"), company: { name: "PowerBI" } },
      { _id: "90", title: "Visualization Engineer", location: "Noida", salary: "71000", jobType: "Full Time", position: 5, experience: getRandomExperience("90"), company: { name: "D3.js" } },
      { _id: "91", title: "Search Engineer", location: "Pune", salary: "83000", jobType: "Full Time", position: 6, experience: getRandomExperience("91"), company: { name: "Elasticsearch" } },
      { _id: "92", title: "Indexing Engineer", location: "Hyderabad", salary: "79000", jobType: "Full Time", position: 4, experience: getRandomExperience("92"), company: { name: "Algolia" } },
      { _id: "93", title: "Caching Engineer", location: "Bangalore", salary: "81000", jobType: "Full Time", position: 3, experience: getRandomExperience("93"), company: { name: "Redis" } },
      { _id: "94", title: "CDN Engineer", location: "Chennai", salary: "77000", jobType: "Full Time", position: 5, experience: getRandomExperience("94"), company: { name: "Cloudflare" } },
      { _id: "95", title: "Load Balancing Engineer", location: "Mumbai", salary: "84000", jobType: "Full Time", position: 4, experience: getRandomExperience("95"), company: { name: "NGINX" } },
      { _id: "96", title: "Scaling Engineer", location: "Delhi", salary: "87000", jobType: "Full Time", position: 3, experience: getRandomExperience("96"), company: { name: "Kubernetes" } },
      { _id: "97", title: "Reliability Engineer", location: "Noida", salary: "89000", jobType: "Full Time", position: 4, experience: getRandomExperience("97"), company: { name: "SRE" } },
      { _id: "98", title: "Resilience Engineer", location: "Pune", salary: "86000", jobType: "Full Time", position: 2, experience: getRandomExperience("98"), company: { name: "Chaos Engineering" } },
      { _id: "99", title: "Disaster Recovery Engineer", location: "Hyderabad", salary: "82000", jobType: "Full Time", position: 3, experience: getRandomExperience("99"), company: { name: "DR Solutions" } },
      { _id: "100", title: "Business Continuity Engineer", location: "Bangalore", salary: "78000", jobType: "Full Time", position: 4, experience: getRandomExperience("100"), company: { name: "BCP" } }
    ];

    const job = jobs.find(j => j._id === jobId);
    
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // ✅ GET RESUME FILE
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Resume is required",
        success: false,
      });
    }

    // Use the file path from disk storage
    const resumeUrl = file.path;

    // GET USER DETAILS FOR EMAIL
    console.log("Fetching user details for email...");
    const user = await User.findById(userId);
    if (!user) {
      console.log("ERROR: User not found for ID:", userId);
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    
    console.log("User found:", user.fullname, "Email:", user.email);

    // create application
    console.log("Creating application...");
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      resume: resumeUrl,
      status: "pending", // Default status
    });

    console.log("Application created successfully");

    // SEND EMAIL CONFIRMATION
    console.log("Sending application confirmation email...");
    try {
      await sendJobApplicationEmail(
        user.email,
        user.fullname,
        job.title,
        job.company.name
      );
      console.log("✅ Application confirmation email sent successfully to:", user.email);
    } catch (emailError) {
      console.error('❌ Failed to send application email:', emailError);
      // Continue with application even if email fails
    }

    return res.status(201).json({
      message: "Application submitted successfully",
      success: true,
      application: newApplication
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    
    console.log("=== APPLIED JOBS DEBUG ===");
    console.log("User ID from middleware:", userId);
    console.log("Request cookies:", req.cookies);

    // Get applications from MongoDB
    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 });

    if (!applications || applications.length === 0) {
      return res.status(200).json({
        application: [],
        success: true,
      });
    }

    // Get hardcoded job data
    const getRandomExperience = (jobId) => {
      const experiences = ["0-3 years", "3-5 years", "5-7 years", "7+ years"];
      const seed = parseInt(jobId) || 1;
      return experiences[seed % experiences.length];
    };

    const jobs = [
      { _id: "1", title: "Frontend Developer", location: "Hyderabad", salary: "50000", jobType: "Full Time", position: 6, experience: getRandomExperience("1"), company: { name: "Google" } },
      { _id: "2", title: "Backend Developer", location: "Bangalore", salary: "60000", jobType: "Full Time", position: 8, experience: getRandomExperience("2"), company: { name: "Amazon" } },
      { _id: "3", title: "Full Stack Developer", location: "Chennai", salary: "70000", jobType: "Full Time", position: 1, experience: getRandomExperience("3"), company: { name: "Microsoft" } },
      { _id: "4", title: "Java Developer", location: "Pune", salary: "55000", jobType: "Full Time", position: 150, experience: getRandomExperience("4"), company: { name: "Infosys" } },
      { _id: "5", title: "Python Developer", location: "Delhi", salary: "65000", jobType: "Full Time", position: 200, experience: getRandomExperience("5"), company: { name: "TCS" } },
      { _id: "6", title: "UI/UX Designer", location: "Mumbai", salary: "45000", jobType: "Full Time", position: 5, experience: getRandomExperience("6"), company: { name: "Adobe" } },
      { _id: "7", title: "DevOps Engineer", location: "Noida", salary: "80000", jobType: "Full Time", position: 120, experience: getRandomExperience("7"), company: { name: "Accenture" } },
      { _id: "8", title: "Data Analyst", location: "Kolkata", salary: "50000", jobType: "Full Time", position: 180, experience: getRandomExperience("8"), company: { name: "Wipro" } },
      { _id: "9", title: "Mobile App Developer", location: "Ahmedabad", salary: "60000", jobType: "Full Time", position: 5, experience: getRandomExperience("9"), company: { name: "Flipkart" } },
      { _id: "10", title: "AI Engineer", location: "Bangalore", salary: "90000", jobType: "Full Time", position: 1, experience: getRandomExperience("10"), company: { name: "OpenAI" } },
      { _id: "11", title: "Cyber Security Analyst", location: "Delhi", salary: "75000", jobType: "Full Time", position: 80, experience: getRandomExperience("11"), company: { name: "Kaspersky" } },
      { _id: "12", title: "Cloud Engineer", location: "Hyderabad", salary: "85000", jobType: "Full Time", position: 150, experience: getRandomExperience("12"), company: { name: "IBM" } },
      { _id: "13", title: "QA Tester", location: "Chennai", salary: "40000", jobType: "Full Time", position: 200, experience: getRandomExperience("13"), company: { name: "Zoho" } },
      { _id: "14", title: "Business Analyst", location: "Mumbai", salary: "70000", jobType: "Full Time", position: 100, experience: getRandomExperience("14"), company: { name: "Deloitte" } },
      { _id: "15", title: "Game Developer", location: "Bangalore", salary: "65000", jobType: "Full Time", position: 4, experience: getRandomExperience("15"), company: { name: "Ubisoft" } },
      { _id: "16", title: "Blockchain Developer", location: "Noida", salary: "95000", jobType: "Full Time", position: 3, experience: getRandomExperience("16"), company: { name: "Polygon" } },
      { _id: "17", title: "Technical Support Engineer", location: "Pune", salary: "35000", jobType: "Full Time", position: 250, experience: getRandomExperience("17"), company: { name: "HCL" } },
      { _id: "18", title: "Network Engineer", location: "Kolkata", salary: "60000", jobType: "Full Time", position: 120, experience: getRandomExperience("18"), company: { name: "Cisco" } },
      { _id: "19", title: "Data Scientist", location: "Bangalore", salary: "100000", jobType: "Full Time", position: 4, experience: getRandomExperience("19"), company: { name: "Tesla" } },
      { _id: "20", title: "Product Manager", location: "Delhi", salary: "120000", jobType: "Full Time", position: 3, experience: getRandomExperience("20"), company: { name: "Meta" } },
      { _id: "21", title: "Software Architect", location: "Hyderabad", salary: "110000", jobType: "Full Time", position: 3, experience: getRandomExperience("21"), company: { name: "Oracle" } },
      { _id: "22", title: "Database Administrator", location: "Pune", salary: "55000", jobType: "Full Time", position: 3, experience: getRandomExperience("22"), company: { name: "MongoDB" } },
      { _id: "23", title: "Machine Learning Engineer", location: "Bangalore", salary: "95000", jobType: "Full Time", position: 8, experience: getRandomExperience("23"), company: { name: "NVIDIA" } },
      { _id: "24", title: "Frontend Architect", location: "Mumbai", salary: "85000", jobType: "Full Time", position: 4, experience: getRandomExperience("24"), company: { name: "Spotify" } },
      { _id: "25", title: "Backend Architect", location: "Chennai", salary: "90000", jobType: "Full Time", position: 2, experience: getRandomExperience("25"), company: { name: "Netflix" } },
      { _id: "26", title: "React Developer", location: "Delhi", salary: "55000", jobType: "Full Time", position: 6, experience: getRandomExperience("26"), company: { name: "Facebook" } },
      { _id: "27", title: "Angular Developer", location: "Noida", salary: "60000", jobType: "Full Time", position: 4, experience: getRandomExperience("27"), company: { name: "Google" } },
      { _id: "28", title: "Vue.js Developer", location: "Hyderabad", salary: "52000", jobType: "Full Time", position: 2, experience: getRandomExperience("28"), company: { name: "Alibaba" } },
      { _id: "29", title: "Node.js Developer", location: "Bangalore", salary: "65000", jobType: "Full Time", position: 7, experience: getRandomExperience("29"), company: { name: "LinkedIn" } },
      { _id: "30", title: "PHP Developer", location: "Pune", salary: "45000", jobType: "Full Time", position: 5, experience: getRandomExperience("30"), company: { name: "WordPress" } },
      { _id: "31", title: "Ruby Developer", location: "Mumbai", salary: "58000", jobType: "Full Time", position: 4, experience: getRandomExperience("31"), company: { name: "GitHub" } },
      { _id: "32", title: "Go Developer", location: "Chennai", salary: "70000", jobType: "Full Time", position: 6, experience: getRandomExperience("32"), company: { name: "Docker" } },
      { _id: "33", title: "Kubernetes Engineer", location: "Delhi", salary: "85000", jobType: "Full Time", position: 5, experience: getRandomExperience("33"), company: { name: "Red Hat" } },
      { _id: "34", title: "Terraform Engineer", location: "Noida", salary: "75000", jobType: "Full Time", position: 4, experience: getRandomExperience("34"), company: { name: "HashiCorp" } },
      { _id: "35", title: "Site Reliability Engineer", location: "Hyderabad", salary: "90000", jobType: "Full Time", position: 1, experience: getRandomExperience("35"), company: { name: "Google" } },
      { _id: "36", title: "Security Engineer", location: "Bangalore", salary: "80000", jobType: "Full Time", position: 4, experience: getRandomExperience("36"), company: { name: "Microsoft" } },
      { _id: "37", title: "Performance Engineer", location: "Pune", salary: "70000", jobType: "Full Time", position: 2, experience: getRandomExperience("37"), company: { name: "Amazon" } },
      { _id: "38", title: "API Developer", location: "Mumbai", salary: "62000", jobType: "Full Time", position: 5, experience: getRandomExperience("38"), company: { name: "Twilio" } },
      { _id: "39", title: "Microservices Developer", location: "Chennai", salary: "75000", jobType: "Full Time", position: 6, experience: getRandomExperience("39"), company: { name: "Netflix" } },
      { _id: "40", title: "Embedded Systems Engineer", location: "Delhi", salary: "68000", jobType: "Full Time", position: 4, experience: getRandomExperience("40"), company: { name: "Intel" } },
      { _id: "41", title: "Robotics Engineer", location: "Noida", salary: "72000", jobType: "Full Time", position: 1, experience: getRandomExperience("41"), company: { name: "Boston Dynamics" } },
      { _id: "42", title: "AR/VR Developer", location: "Hyderabad", salary: "78000", jobType: "Full Time", position: 4, experience: getRandomExperience("42"), company: { name: "Meta" } },
      { _id: "43", title: "iOS Developer", location: "Bangalore", salary: "65000", jobType: "Full Time", position: 5, experience: getRandomExperience("43"), company: { name: "Apple" } },
      { _id: "44", title: "Android Developer", location: "Pune", salary: "60000", jobType: "Full Time", position: 6, experience: getRandomExperience("44"), company: { name: "Google" } },
      { _id: "45", title: "Flutter Developer", location: "Mumbai", salary: "58000", jobType: "Full Time", position: 4, experience: getRandomExperience("45"), company: { name: "Alibaba" } },
      { _id: "46", title: "Unity Developer", location: "Chennai", salary: "55000", jobType: "Full Time", position: 2, experience: getRandomExperience("46"), company: { name: "Unity" } },
      { _id: "47", title: "Unreal Engine Developer", location: "Delhi", salary: "70000", jobType: "Full Time", position: 1, experience: getRandomExperience("47"), company: { name: "Epic Games" } },
      { _id: "48", title: "WebGL Developer", location: "Noida", salary: "62000", jobType: "Full Time", position: 3, experience: getRandomExperience("48"), company: { name: "Adobe" } },
      { _id: "49", title: "Three.js Developer", location: "Hyderabad", salary: "58000", jobType: "Full Time", position: 4, experience: getRandomExperience("49"), company: { name: "Google" } },
      { _id: "50", title: "WebAssembly Developer", location: "Bangalore", salary: "85000", jobType: "Full Time", position: 3, experience: getRandomExperience("50"), company: { name: "Mozilla" } },
      { _id: "51", title: "Frontend Development Intern", location: "Bangalore", salary: "15000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("51"), company: { name: "Microsoft" } },
      { _id: "52", title: "Backend Development Intern", location: "Hyderabad", salary: "12000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("52"), company: { name: "Amazon" } },
      { _id: "53", title: "Full Stack Intern", location: "Chennai", salary: "18000", jobType: "Internship", duration: "6 months", experience: getRandomExperience("53"), company: { name: "Google" } },
      { _id: "54", title: "Mobile App Intern", location: "Mumbai", salary: "14000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("54"), company: { name: "Facebook" } },
      { _id: "55", title: "Data Science Intern", location: "Delhi", salary: "20000", jobType: "Internship", duration: "6 months", experience: getRandomExperience("55"), company: { name: "Tesla" } },
      { _id: "56", title: "AI/ML Intern", location: "Bangalore", salary: "22000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("56"), company: { name: "OpenAI" } },
      { _id: "57", title: "Cloud Computing Intern", location: "Noida", salary: "16000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("57"), company: { name: "Amazon" } },
      { _id: "58", title: "DevOps Intern", location: "Pune", salary: "17000", jobType: "Internship", duration: "5 months", experience: getRandomExperience("58"), company: { name: "Microsoft" } },
      { _id: "59", title: "Cyber Security Intern", location: "Hyderabad", salary: "15000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("59"), company: { name: "Cisco" } },
      { _id: "60", title: "UI/UX Design Intern", location: "Mumbai", salary: "13000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("60"), company: { name: "Adobe" } },
      { _id: "61", title: "Game Development Intern", location: "Bangalore", salary: "14000", jobType: "Internship", duration: "6 months", experience: getRandomExperience("61"), company: { name: "Ubisoft" } },
      { _id: "62", title: "Blockchain Intern", location: "Chennai", salary: "18000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("62"), company: { name: "Polygon" } },
      { _id: "63", title: "IoT Intern", location: "Delhi", salary: "16000", jobType: "Internship", duration: "5 months", experience: getRandomExperience("63"), company: { name: "Intel" } },
      { _id: "64", title: "AR/VR Intern", location: "Noida", salary: "17000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("64"), company: { name: "Meta" } },
      { _id: "65", title: "Robotics Intern", location: "Hyderabad", salary: "19000", jobType: "Internship", duration: "6 months", experience: getRandomExperience("65"), company: { name: "Boston Dynamics" } },
      { _id: "66", title: "Data Analytics Intern", location: "Bangalore", salary: "14000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("66"), company: { name: "Tableau" } },
      { _id: "67", title: "QA Testing Intern", location: "Pune", salary: "12000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("67"), company: { name: "Selenium" } },
      { _id: "68", title: "Technical Writing Intern", location: "Mumbai", salary: "10000", jobType: "Internship", duration: "4 months", experience: getRandomExperience("68"), company: { name: "GitHub" } },
      { _id: "69", title: "Product Management Intern", location: "Chennai", salary: "15000", jobType: "Internship", duration: "5 months", experience: getRandomExperience("69"), company: { name: "Slack" } },
      { _id: "70", title: "Marketing Intern", location: "Delhi", salary: "8000", jobType: "Internship", duration: "3 months", experience: getRandomExperience("70"), company: { name: "HubSpot" } },
      { _id: "71", title: "Senior Software Engineer", location: "Bangalore", salary: "120000", jobType: "Full Time", position: 3, experience: getRandomExperience("71"), company: { name: "Microsoft" } },
      { _id: "72", title: "Principal Engineer", location: "Hyderabad", salary: "150000", jobType: "Full Time", position: 2, experience: getRandomExperience("72"), company: { name: "Amazon" } },
      { _id: "73", title: "Staff Engineer", location: "Chennai", salary: "130000", jobType: "Full Time", position: 2, experience: getRandomExperience("73"), company: { name: "Google" } },
      { _id: "74", title: "Engineering Manager", location: "Mumbai", salary: "140000", jobType: "Full Time", position: 3, experience: getRandomExperience("74"), company: { name: "Facebook" } },
      { _id: "75", title: "Technical Lead", location: "Delhi", salary: "110000", jobType: "Full Time", position: 4, experience: getRandomExperience("75"), company: { name: "Apple" } },
      { _id: "76", title: "Solutions Architect", location: "Noida", salary: "105000", jobType: "Full Time", position: 5, experience: getRandomExperience("76"), company: { name: "AWS" } },
      { _id: "77", title: "Systems Engineer", location: "Pune", salary: "75000", jobType: "Full Time", position: 8, experience: getRandomExperience("77"), company: { name: "IBM" } },
      { _id: "78", title: "Platform Engineer", location: "Hyderabad", salary: "95000", jobType: "Full Time", position: 6, experience: getRandomExperience("78"), company: { name: "Netflix" } },
      { _id: "79", title: "Infrastructure Engineer", location: "Bangalore", salary: "88000", jobType: "Full Time", position: 7, experience: getRandomExperience("79"), company: { name: "Google" } },
      { _id: "80", title: "Compliance Engineer", location: "Chennai", salary: "82000", jobType: "Full Time", position: 5, experience: getRandomExperience("80"), company: { name: "Microsoft" } },
      { _id: "81", title: "Automation Engineer", location: "Mumbai", salary: "78000", jobType: "Full Time", position: 4, experience: getRandomExperience("81"), company: { name: "Tesla" } },
      { _id: "82", title: "Validation Engineer", location: "Delhi", salary: "72000", jobType: "Full Time", position: 6, experience: getRandomExperience("82"), company: { name: "Intel" } },
      { _id: "83", title: "Integration Engineer", location: "Noida", salary: "85000", jobType: "Full Time", position: 7, experience: getRandomExperience("83"), company: { name: "Oracle" } },
      { _id: "84", title: "Migration Engineer", location: "Pune", salary: "90000", jobType: "Full Time", position: 4, experience: getRandomExperience("84"), company: { name: "AWS" } },
      { _id: "85", title: "Monitoring Engineer", location: "Hyderabad", salary: "76000", jobType: "Full Time", position: 5, experience: getRandomExperience("85"), company: { name: "Datadog" } },
      { _id: "86", title: "Logging Engineer", location: "Bangalore", salary: "74000", jobType: "Full Time", position: 6, experience: getRandomExperience("86"), company: { name: "Splunk" } },
      { _id: "87", title: "Analytics Engineer", location: "Chennai", salary: "86000", jobType: "Full Time", position: 4, experience: getRandomExperience("87"), company: { name: "Snowflake" } },
      { _id: "88", title: "Reporting Engineer", location: "Mumbai", salary: "68000", jobType: "Full Time", position: 3, experience: getRandomExperience("88"), company: { name: "Tableau" } },
      { _id: "89", title: "Dashboard Developer", location: "Delhi", salary: "62000", jobType: "Full Time", position: 4, experience: getRandomExperience("89"), company: { name: "PowerBI" } },
      { _id: "90", title: "Visualization Engineer", location: "Noida", salary: "71000", jobType: "Full Time", position: 5, experience: getRandomExperience("90"), company: { name: "D3.js" } },
      { _id: "91", title: "Search Engineer", location: "Pune", salary: "83000", jobType: "Full Time", position: 6, experience: getRandomExperience("91"), company: { name: "Elasticsearch" } },
      { _id: "92", title: "Indexing Engineer", location: "Hyderabad", salary: "79000", jobType: "Full Time", position: 4, experience: getRandomExperience("92"), company: { name: "Algolia" } },
      { _id: "93", title: "Caching Engineer", location: "Bangalore", salary: "81000", jobType: "Full Time", position: 3, experience: getRandomExperience("93"), company: { name: "Redis" } },
      { _id: "94", title: "CDN Engineer", location: "Chennai", salary: "77000", jobType: "Full Time", position: 5, experience: getRandomExperience("94"), company: { name: "Cloudflare" } },
      { _id: "95", title: "Load Balancing Engineer", location: "Mumbai", salary: "84000", jobType: "Full Time", position: 4, experience: getRandomExperience("95"), company: { name: "NGINX" } },
      { _id: "96", title: "Scaling Engineer", location: "Delhi", salary: "87000", jobType: "Full Time", position: 3, experience: getRandomExperience("96"), company: { name: "Kubernetes" } },
      { _id: "97", title: "Reliability Engineer", location: "Noida", salary: "89000", jobType: "Full Time", position: 4, experience: getRandomExperience("97"), company: { name: "SRE" } },
      { _id: "98", title: "Resilience Engineer", location: "Pune", salary: "86000", jobType: "Full Time", position: 2, experience: getRandomExperience("98"), company: { name: "Chaos Engineering" } },
      { _id: "99", title: "Disaster Recovery Engineer", location: "Hyderabad", salary: "82000", jobType: "Full Time", position: 3, experience: getRandomExperience("99"), company: { name: "DR Solutions" } },
      { _id: "100", title: "Business Continuity Engineer", location: "Bangalore", salary: "78000", jobType: "Full Time", position: 4, experience: getRandomExperience("100"), company: { name: "BCP" } }
    ];

    // Map applications to include job details
    const applicationWithJobDetails = applications.map(app => {
      const job = jobs.find(j => j._id === app.job);
      return {
        ...app.toObject(),
        job: job || null
      };
    });

    return res.status(200).json({
      application: applicationWithJobDetails,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        options: { sort: { createdAt: -1 } },
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Application status updated",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const sendApplicationEmail = async (req, res) => {
  try {
    console.log("=== /api/apply endpoint called ===");
    console.log("Request body:", req.body);

    const { user_name, user_email, job_role, company_name } = req.body;

    // Validate required fields
    if (!user_name || !user_email || !job_role || !company_name) {
      return res.status(400).json({
        message: "Missing required fields: user_name, user_email, job_role, company_name",
        success: false,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return res.status(400).json({
        message: "Invalid email format",
        success: false,
      });
    }

    // Create email content
    const subject = `Application Received – ${job_role}`;
    
    const html = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 32px;">Job Portal</h1>
          <p style="margin: 10px 0; opacity: 0.9;">Application Confirmation</p>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #374151; margin-bottom: 20px;">Dear ${user_name},</h2>
          
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Thank you for applying for the role of <strong>${job_role}</strong> at <strong>${company_name}</strong>.
          </p>
          
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Your application is now under review. We will get back to you soon.
          </p>
          
          <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0c4a6e; margin: 0 0 10px 0;">Application Details:</h3>
            <ul style="color: #0c4a6e; margin: 0; padding-left: 20px;">
              <li><strong>Position:</strong> ${job_role}</li>
              <li><strong>Company:</strong> ${company_name}</li>
              <li><strong>Email:</strong> ${user_email}</li>
              <li><strong>Status:</strong> Under Review</li>
            </ul>
          </div>
          
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Regards,<br>
            DreamHire Team
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    console.log("📧 Sending email to:", user_email);
    console.log("📧 Subject:", subject);

    // Send email
    const emailSent = await sendEmail(user_email, subject, html);

    if (emailSent) {
      console.log("✅ Email sent successfully to:", user_email);
      return res.status(200).json({
        message: "Application email sent successfully",
        success: true,
      });
    } else {
      console.error("❌ Failed to send email to:", user_email);
      return res.status(500).json({
        message: "Failed to send application email",
        success: false,
      });
    }

  } catch (error) {
    console.error("❌ Error in sendApplicationEmail:", error);
    return res.status(500).json({
      message: "Server error while sending email",
      success: false,
      error: error.message,
    });
  }
};