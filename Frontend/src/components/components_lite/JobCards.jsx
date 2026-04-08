import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";

const JobCards = ({ job }) => {
  const navigate = useNavigate();

  // ✅ CONSISTENT RANDOM DAYS BASED ON JOB ID (same as Job1 and Description components)
  const jobIdNum = parseInt(job?._id) || 1;
  const daysAgo = (jobIdNum * 7) % 30 + 1; // 1-30 days

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-xl bg-white shadow-md hover:shadow-2xl transition duration-300 border hover:border-blue-400 hover:scale-105 cursor-pointer"
    >
      {/* TOP SECTION */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {job.company?.logo && (
            <img 
              src={job.company.logo} 
              alt={job.company.name}
              className="w-12 h-12 object-contain rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div>
            <h1 className="text-lg font-medium">
              {job.company?.name || "Company"}
            </h1>
            <p className="text-sm text-gray-500">India</p>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          {daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`}
        </p>
      </div>

      {/* JOB DETAILS */}
      <div>
        <h2 className="font-bold text-lg my-2 text-gray-800">
          {job.title}
        </h2>
      </div>

      {/* ICON STYLE (MATCHES Job1.jsx) */}
      <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600">

        <p className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-red-500" />
          {job?.location || "India"}
        </p>

        <p className="flex items-center gap-2">
          <MdWork className="text-blue-500" />
          {job?.position || 1} Positions • {job?.jobType || "Full Time"}
        </p>

        <p className="flex items-center gap-2">
          <span className="text-blue-600 font-medium">⏱</span>
          {job?.experience || "Experience not specified"}
        </p>

        <p className="flex items-center gap-2">
          <FaMoneyBillWave className="text-green-500" />
          {job?.salary} LPA
        </p>

      </div>
    </div>
  );
};

export default JobCards;