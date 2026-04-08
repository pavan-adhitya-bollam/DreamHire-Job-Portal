import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";
import api from "@/utils/axios";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // for active page

  // ✅ LOGOUT FUNCTION
  const logoutHandler = async () => {
    try {
      const res = await api.post(`/user/logout`, {});

      if (res?.data?.success) {
        dispatch(setUser(null));
        navigate("/login");
        toast.success(res.data.message);
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  // ✅ ACTIVE STYLE FUNCTION
  const activeStyle = (path) =>
    location.pathname === path
      ? "text-blue-600 font-bold underline"
      : "hover:text-blue-500";

  return (
   <div className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-lg">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        
        {/* LOGO */}
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-[#6B3AC2]">Dream</span>
            <span className="text-[#FA4F09]">Hire</span>
          </h1>
        </div>

        {/* NAV + AUTH */}
        <div className="flex items-center gap-10">
          
          {/* NAV LINKS */}
         <ul className="flex font-medium items-center gap-6">

  <li>
    <Link
      to="/Home"
      className="relative group px-2 py-1"
    >
      Home
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-600 transition-all group-hover:w-full"></span>
    </Link>
  </li>

  <li>
    <Link
      to="/Browse"
      className="relative group px-2 py-1"
    >
      Browse
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-600 transition-all group-hover:w-full"></span>
    </Link>
  </li>

  <li>
    <Link
      to="/Jobs"
      className="relative group px-2 py-1"
    >
      Jobs
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-600 transition-all group-hover:w-full"></span>
    </Link>
  </li>

  <li>
    <Link
      to="/MyList"
      className="relative group px-2 py-1"
    >
      MyList
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-600 transition-all group-hover:w-full"></span>
    </Link>
  </li>

  <li>
    <Link
      to="/about"
      className="relative group px-2 py-1"
    >
      About
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-600 transition-all group-hover:w-full"></span>
    </Link>
  </li>

</ul>

          {/* AUTH BUTTONS */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/Profile">
                  <Button variant="outline">Profile</Button>
                </Link>

                <Button
                  onClick={logoutHandler}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;