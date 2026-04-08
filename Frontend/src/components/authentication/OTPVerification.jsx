import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import api from "@/utils/axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const OTPVerification = () => {
  const [input, setInput] = useState({
    email: "",
    otp: "",
  });
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const verifyHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const res = await api.post(`/user/user/verify-otp`, input);
      
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/complete-registration");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resendOTP = async () => {
    if (timer > 0) return;
    
    setIsResending(true);
    try {
      const res = await api.post(`/user/send-otp`, { email: input.email });
      
      if (res.data.success) {
        toast.success("OTP resent successfully");
        startTimer();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Verify Email</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the OTP sent to your email address
          </p>
        </div>

        <form onSubmit={verifyHandler} className="space-y-4">
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
            <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
              OTP Code
            </Label>
            <Input
              type="text"
              id="otp"
              name="otp"
              value={input.otp}
              onChange={changeEventHandler}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Verify OTP
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={resendOTP}
            disabled={isResending || timer > 0}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isResending 
              ? "Sending..." 
              : timer > 0 
                ? `Resend OTP in ${timer}s` 
                : "Resend OTP"
            }
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          <span>Remember your email? </span>
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
