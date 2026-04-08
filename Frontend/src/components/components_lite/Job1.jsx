import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Bookmark } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToMyList, removeFromMyList } from "@/redux/myListSlice";
import { toast } from "sonner";

import { FaMapMarkerAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";

import { getCompanyImage } from "../../assets/companyImages";

const Job1 = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((store) => store.myList);

  // CONSISTENT RANDOM DAYS BASED ON JOB ID (same as Description component)
  // ✅ CONSISTENT RANDOM DAYS BASED ON JOB ID (same as Description component)
  const jobIdNum = parseInt(job?._id) || 1;
  const daysAgo = (jobIdNum * 7) % 30 + 1; // 1-30 days

  // ✅ CHECK IF JOB IS ALREADY SAVED
  const isSaved = savedJobs.some(savedJob => savedJob._id === job._id);

  // ✅ BOOKMARK CLICK HANDLER
  const handleBookmarkClick = () => {
    // Single click toggle save/unsave
    if (isSaved) {
      dispatch(removeFromMyList(job._id));
      toast("Removed from MyList");
    } else {
      dispatch(addToMyList(job));
      toast("Added to MyList!");
    }
  };

  const handleSave = () => {
    if (isSaved) {
      dispatch(removeFromMyList(job._id));
      toast("Removed from MyList");
    } else {
      dispatch(addToMyList(job));
      toast("Added to MyList!");
    }
  };

  return (
    <div className="p-5 rounded-xl bg-white shadow-md hover:shadow-2xl transition duration-300 border hover:border-blue-400 hover:scale-105 cursor-pointer">
      
      {/* TOP SECTION */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`}
        </p>

        <Button 
          variant="outline" 
          className={`rounded-full transition-colors duration-300 ${
            isSaved ? "bg-blue-500 border-blue-500 text-white" : "border-input bg-background"
          }`}
          size="icon"
          onClick={handleBookmarkClick}
        >
          <Bookmark className={isSaved ? "text-white" : ""} />
        </Button>
      </div>

      {/* COMPANY */}
      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar className="w-12 h-12">
            <AvatarImage 
              src={getCompanyImage(job?.company?.name)} 
              className="object-contain p-1"
              onError={(e) => {
                // If local logo fails, try to use any provided logo
                if (job?.company?.logo) {
                  e.target.src = job?.company?.logo;
                } else {
                  e.target.style.display = 'none';
                }
              }}
            />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">
            {job?.company?.name || "Company"}
          </h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      {/* JOB DETAILS */}
      <div>
        <div className="flex items-center gap-2 my-2">
          <h1 className="font-bold text-lg text-gray-800">{job?.title}</h1>
          {job?.jobType === "Internship" && (
            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
              Internship
            </Badge>
          )}
        </div>
      </div>

      {/* JOB INFO WITH ICONS */}
      <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600">

        <p className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-red-500" />
          {job?.location || "India"}
        </p>

        <p className="flex items-center gap-2">
          <MdWork className="text-blue-500" />
          {job?.position || 1} {job?.position === 1 ? "Position" : "Positions"} • {job?.jobType || "Full Time"}
          {job?.duration && ` • ${job.duration}`}
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

      {/* BUTTONS */}
      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
        >
          Details
        </Button>

        <Button
          onClick={handleSave}
          className={`${
            isSaved ? "bg-gray-500" : "bg-[#7209b7]"
          } text-white`}
        >
          {isSaved ? "Saved" : "Save For Later"}
        </Button>
      </div>
    </div>
  );
};

export default Job1;