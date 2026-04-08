import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import { RadioGroup } from "../ui/radio-group";
import { Link } from "react-router-dom";
import api from "@/utils/axios";
import { USER_API_ENDPOINT, AUTH_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "", 
    role: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const ChangeFilehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const forgotPasswordHandler = async () => {
    if (!input.email) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      const res = await api.post(`/auth/forgot-password`, { email: input.email });
      
      if (res.data.success) {
        toast.success("Password reset link sent to your email");
        toast.info("Please check your email and click the link to reset your password");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send password reset link");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true)); // Start loading
      const res = await api.post(`/user/login`, input, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false)); // End loading
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Role</Label>
            <RadioGroup 
              value={input.role} 
              onValueChange={(value) => setInput({ ...input, role: value })}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="student"
                  name="role"
                  value="Student"
                  checked={input.role === "Student"}
                  onChange={changeEventHandler}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="student" className="text-sm text-gray-700">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="recruiter"
                  name="role"
                  value="Recruiter"
                  checked={input.role === "Recruiter"}
                  onChange={changeEventHandler}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="recruiter" className="text-sm text-gray-700">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent border-r-transparent animate-spin"></div>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="space-y-4">
          {/* Forgot Password Section */}
          <div className="text-center">
            <button
              type="button"
              onClick={forgotPasswordHandler}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Forgot Password?
            </button>
          </div>

          {/* Register Section */}
          <div className="flex flex-col space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Don't have an account?
            </p>
            <Link to="/register" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
