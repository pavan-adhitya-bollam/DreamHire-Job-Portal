import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Header from "./Header";
import Categories from "./Categories";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loading, error } = useGetAllJobs();
  const jobs = useSelector((state) => state.job.allJobs);

  console.log("Home Component Debug:");
  console.log("- Loading:", loading);
  console.log("- Error:", error);
  console.log("- Jobs:", jobs);
  console.log("- Jobs length:", jobs?.length);

  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "Recruiter") {
      navigate("/admin/companies");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      
      <Navbar />

      {/* 🔥 HEADER (we will upgrade search inside this component) */}
      <Header />

      <Categories />

      {/* JOB LIST */}
      <div className="max-w-7xl mx-auto px-4">
        {loading && (
          <p className="text-center mt-10 animate-pulse text-gray-600">
            Loading jobs...
          </p>
        )}

        {error && (
          <p className="text-center mt-10 text-red-500">
            Error: {error}
          </p>
        )}

        {!loading && !error && <LatestJobs jobs={jobs} />}
      </div>

      <Footer />
    </div>
  );
};

export default Home;