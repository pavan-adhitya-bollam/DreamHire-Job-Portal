import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FilterCard from "./Filtercard";
import Job1 from "./Job1";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const { loading, error } = useGetAllJobs(); // This will fetch data when searchedQuery changes
  
  console.log("Jobs component - allJobs length:", allJobs.length);
  console.log("Jobs component - searchedQuery:", searchedQuery);
  console.log("Jobs component - sample job location:", allJobs[0]?.location);
  console.log("Jobs component - loading:", loading);
  console.log("Jobs component - error:", error);

  return (
  <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      <div className="w-full mt-5 px-4">
        <div className="flex gap-5">
          <div className="w-1/5">
            <FilterCard />
          </div>

          {allJobs.length <= 0 ? (
            <span>Job not found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-3 gap-4">
                {allJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    key={job._id || job.id}
                  >
                    <Job1 job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
