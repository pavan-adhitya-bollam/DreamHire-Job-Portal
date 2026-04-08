import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT, USER_API_ENDPOINT } from "@/utils/data";
import api from "@/utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { setUser } from "@/redux/authSlice";
import { Calendar, MapPin, Briefcase, DollarSign, Clock, Building, Users } from "lucide-react";
import { toast } from "sonner";

const Description = () => {
  const params = useParams();
  const jobId = params.id;

  const dispatch = useDispatch();
  const { singleJob } = useSelector((store) => store.job); // Get singleJob from Redux store
  const { user } = useSelector((store) => store.auth); // Get user from Redux store

  const [isApplied, setIsApplied] = useState(false);
  const [daysAgo, setDaysAgo] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [resume, setResume] = useState(null);

  // Helper function to check if user is properly authenticated
  const isUserAuthenticated = () => {
    // Check if user exists and is logged in (user is now defined at component level)
    return !!user && user.email;
  };

  // Helper function to fetch job data without authentication
  const fetchJobData = async () => {
    try {
      const res = await api.get(`/job/get/${jobId}`);
      if (res.data.success || res.data.status) {
        dispatch(setSingleJob(res.data.job));
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      // Don't redirect on job fetch errors - this is public data
    }
  };

  // Helper function to check applied status (requires authentication)
  const checkAppliedStatus = async () => {
    // Only check if user is properly authenticated
    if (!isUserAuthenticated()) {
      return;
    }
    
    try {
      const res = await api.get(`/application/get`);
      
      if (res.data.success && res.data.application) {
        const hasApplied = res.data.application.some(
          (app) => app.job?._id === jobId
        );
        setIsApplied(hasApplied);
      }
    } catch (error) {
      // Silently handle applied status check errors
      console.log("Applied status check failed - user may not be logged in");
    }
  };

  // ✅ Calculate days ago
  useEffect(() => {
    if (singleJob) {
      // Generate consistent random days based on job ID (1-30 days ago)
      const jobIdNum = parseInt(singleJob._id) || 1;
      const randomDays = (jobIdNum * 7) % 30 + 1; // 1-30 days
      setDaysAgo(randomDays);
    }
  }, [singleJob]);

  // ✅ Get company size based on company name
  const getCompanySize = (companyName) => {
    const companySizes = {
      "Google": "100,000+ Employees",
      "Amazon": "1,000,000+ Employees", 
      "Microsoft": "180,000+ Employees",
      "Apple": "150,000+ Employees",
      "Meta": "80,000+ Employees",
      "Tesla": "125,000+ Employees",
      "Netflix": "12,000+ Employees",
      "Adobe": "25,000+ Employees",
      "Oracle": "130,000+ Employees",
      "IBM": "280,000+ Employees",
      "Intel": "110,000+ Employees",
      "NVIDIA": "25,000+ Employees",
      "Cisco": "80,000+ Employees",
      "Spotify": "9,000+ Employees",
      "LinkedIn": "20,000+ Employees",
      "Facebook": "80,000+ Employees",
      "GitHub": "3,000+ Employees",
      "Docker": "500+ Employees",
      "Red Hat": "20,000+ Employees",
      "HashiCorp": "3,000+ Employees",
      "Twilio": "8,000+ Employees",
      "MongoDB": "3,000+ Employees",
      "WordPress": "2,000+ Employees",
      "Alibaba": "100,000+ Employees",
      "Unity": "8,000+ Employees",
      "Epic Games": "5,000+ Employees",
      "Mozilla": "1,000+ Employees",
      "OpenAI": "500+ Employees",
      "Polygon": "1,000+ Employees",
      "Accenture": "700,000+ Employees",
      "Infosys": "350,000+ Employees",
      "TCS": "600,000+ Employees",
      "Wipro": "250,000+ Employees",
      "HCL": "200,000+ Employees",
      "Zoho": "15,000+ Employees",
      "Deloitte": "400,000+ Employees",
      "Kaspersky": "4,000+ Employees",
      "Flipkart": "25,000+ Employees",
      "Ubisoft": "20,000+ Employees",
      "Boston Dynamics": "1,500+ Employees",
      "Datadog": "5,000+ Employees",
      "Splunk": "5,000+ Employees",
      "Snowflake": "4,000+ Employees",
      "Tableau": "4,000+ Employees",
      "PowerBI": "3,000+ Employees",
      "D3.js": "Open Source",
      "Elasticsearch": "1,000+ Employees",
      "Algolia": "800+ Employees",
      "Redis": "200+ Employees",
      "Cloudflare": "3,000+ Employees",
      "NGINX": "500+ Employees",
      "Kubernetes": "Open Source",
      "SRE": "Community",
      "Chaos Engineering": "Community",
      "DR Solutions": "1,000+ Employees",
      "BCP": "2,000+ Employees",
      "AWS": "100,000+ Employees",
      "Slack": "12,000+ Employees",
      "HubSpot": "7,000+ Employees",
      "Selenium": "Open Source",
    };
    
    return companySizes[companyName] || "1,000-5,000 Employees";
  };

  // ✅ APPLY CLICK → OPEN MODAL
  const handleApply = () => {
    if (isApplied) {
      toast.info("You have already applied for this job!");
      return;
    }
    
    // Check if user is properly authenticated
    if (!isUserAuthenticated()) {
      toast.error("Please login to apply for jobs");
      return;
    }
    
    console.log("User is properly authenticated:", user);
    setShowModal(true);
  };

  // ✅ SUBMIT RESUME (REAL API CALL)
  const handleSubmitResume = async () => {
    console.log("=== Submit Resume Called ===");
    console.log("Resume state:", resume);
    console.log("Job ID:", jobId);
    
    if (!resume) {
      toast.error("Please upload resume");
      return;
    }

    try {
      console.log("Creating FormData...");
      const formData = new FormData();
      formData.append("resume", resume);
      
      console.log("FormData created, sending request...");
      console.log("API endpoint:", `/application/apply/${jobId}`);

      const res = await api.post(`/application/apply/${jobId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response received:", res.data);

      if (res.data.success) {
        toast.success("✅ Application Submitted Successfully!");
        setIsApplied(true);
        setShowModal(false);
        setResume(null); // Reset resume after successful submission

        // ✅ Send email notification using new /api/apply endpoint
        try {
          console.log("📧 Sending application email notification...");
          const emailData = {
            user_name: user.fullname || user.email,
            user_email: user.email,
            job_role: singleJob.title,
            company_name: singleJob.company.name
          };

          console.log("Email data:", emailData);

          const emailRes = await api.post('/application/apply', emailData);

          console.log("✅ Email notification response:", emailRes.data);
          
          if (emailRes.data.success) {
            toast.success("📧 Confirmation email sent!");
          } else {
            console.warn("⚠️ Email notification failed:", emailRes.data.message);
          }
        } catch (emailError) {
          console.error("❌ Email notification error:", emailError);
          // Don't show error to user since application was successful
          console.warn("Application submitted but email notification failed");
        }
      } else {
        toast.error(res.data.message || "Failed to apply");
      }
    } catch (error) {
      console.error("Application Error:", error);
      console.error("Error response:", error.response?.data);
      
      // Handle 401 Unauthorized specifically
      if (error.response?.status === 401) {
        toast.error("Please login to apply for jobs");
        // Don't clear user state or redirect automatically - let the auth system handle it
        // The centralized axios instance will handle 401 redirects automatically
        return;
      }
      
      toast.error(error.response?.data?.message || "Failed to apply for job");
    }
  };

  // ✅ SAVE (dummy)
  const handleSave = () => {
    alert("💾 Saved for later!");
  };

  // Fetch job data on component mount
  useEffect(() => {
    fetchJobData();
  }, [jobId]);

  // Check applied status when user changes
  useEffect(() => {
    checkAppliedStatus();
  }, [user, jobId]);

  if (!singleJob) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto my-10 px-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 hover:shadow-2xl transition duration-300 border hover:border-blue-400 hover:scale-105">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="font-bold text-3xl text-gray-800">{singleJob?.title}</h1>
                {singleJob?.jobType === "Internship" && (
                  <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                    Internship
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="text-blue-600 font-bold px-3 py-2 bg-blue-50">
                  {singleJob?.position || 1} {singleJob?.position === 1 ? "Position" : "Positions"}
                </Badge>
                <Badge className="text-[#FA4F09] font-bold px-3 py-2 bg-orange-50">
                  {singleJob?.salary} LPA
                </Badge>
                <Badge className="text-[#6B3AC2] font-bold px-3 py-2 bg-purple-50">
                  {singleJob?.location}
                </Badge>
                <Badge className="text-gray-700 font-bold px-3 py-2 bg-gray-50">
                  {singleJob?.jobType || "Full Time"}
                </Badge>
                {singleJob?.duration && (
                  <Badge className="text-green-700 font-bold px-3 py-2 bg-green-50">
                    {singleJob.duration}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Posted {daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 ml-8">
              <Button
                onClick={handleApply}
                disabled={isApplied}
                className={`${
                  isApplied 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : isUserAuthenticated()
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                      : "bg-gray-300 cursor-not-allowed"
                } text-white rounded-full px-8`}
              >
                {isApplied 
                  ? "✅ Applied" 
                  : isUserAuthenticated()
                    ? "Apply Now" 
                    : "Login to Apply"
                }
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full px-8 hover:opacity-90"
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Job Details */}
          <div className="col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition duration-300 border hover:border-blue-400 hover:scale-105">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {singleJob?.description}
              </p>
            </div>

            {/* Job Requirements */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition duration-300 border hover:border-blue-400 hover:scale-105">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Role</p>
                    <p className="text-gray-600">{singleJob?.position || 1} {singleJob?.position === 1 ? "Position" : "Positions"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Location</p>
                    <p className="text-gray-600">{singleJob?.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Salary</p>
                    <p className="text-gray-600">{singleJob?.salary} LPA</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Job Type</p>
                    <p className="text-gray-600">{singleJob?.jobType || "Full Time"}</p>
                  </div>
                </div>

                {singleJob?.duration && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-700">Duration</p>
                      <p className="text-gray-600">{singleJob.duration}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Company Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition duration-300 border hover:border-blue-400 hover:scale-105">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {singleJob?.company?.logo && (
                    <img 
                      src={singleJob.company.logo} 
                      alt={singleJob.company.name}
                      className="w-16 h-16 object-contain rounded-lg mr-4"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-700">Company Name</p>
                    <p className="text-gray-600">{singleJob?.company?.name || "Leading Tech Company"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Company Size</p>
                    <p className="text-gray-600">{getCompanySize(singleJob?.company?.name)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-700">Headquarters</p>
                    <p className="text-gray-600">{singleJob?.location}, India</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>About Company:</strong> {singleJob?.company?.name || "This company"} is a leading technology company known for innovation and excellence in the industry. They offer competitive salaries, great work culture, and excellent growth opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 RESUME MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Upload Resume</h2>

            <div className="mb-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Check file size (5MB limit)
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("File size must be less than 5MB");
                      return;
                    }
                    // Check file type
                    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    if (!allowedTypes.includes(file.type)) {
                      toast.error("Only PDF, DOC, and DOCX files are allowed");
                      return;
                    }
                    setResume(file);
                    console.log("File selected:", file.name, "Size:", file.size, "Type:", file.type);
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {resume && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {resume.name}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setShowModal(false)}>Cancel</Button>

              <Button
                onClick={handleSubmitResume}
                className="bg-green-600 text-white"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Description;
