import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Job1 from "./Job1";

const MyList = () => {
  const { savedJobs } = useSelector((store) => store.myList);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      <div className="w-full mt-5 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Saved Jobs</h1>
          
          {savedJobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                No saved jobs yet
              </h2>
              <p className="text-gray-500">
                Start saving jobs you're interested in and they'll appear here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {savedJobs.map((job) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MyList;
