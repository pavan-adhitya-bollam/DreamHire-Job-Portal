import React, { useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { PiBuildingOfficeBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchjobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div>
      <div className="text-center">
        <div className="flex flex-col gap-5 my-10">

          {/* TOP BADGE */}
          <span className="px-4 mx-auto flex justify-center items-center py-2 gap-2 rounded-full bg-gray-200 text-red-600 font-medium shadow-sm">
            <span className="text-[#614232]">
              <PiBuildingOfficeBold />
            </span>
            No.1 Job Hunt Website
          </span>

          {/* HEADING */}
          <h2 className="text-5xl font-bold leading-tight">
            Search Apply & <br />
            Get Your <span className="text-[#6A38C2]">Dream Job</span>
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-600">
            Start your hunt for the best, life-changing career opportunities
            from here in your <br />
            selected areas conveniently and get hired quickly.
          </p>

          {/* 🔥 IMPROVED SEARCH BAR */}
          <div className="flex w-[45%] mx-auto bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden items-center hover:shadow-xl transition">

  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder=" Find Your Dream Job"
    
    // ✅ ENTER KEY SUPPORT
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        searchjobHandler();
      }
    }}

    className="flex-1 px-5 py-3 outline-none text-gray-700"
  />

  <button
    onClick={searchjobHandler}
    className="bg-black text-white px-5 py-3 h-full flex items-center justify-center"
  >
    <Search className="h-5 w-5" />
  </button>

</div>

        </div>
      </div>
    </div>
  );
};

export default Header;