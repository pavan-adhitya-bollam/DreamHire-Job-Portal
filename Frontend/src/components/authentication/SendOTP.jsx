import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import api from "@/utils/axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const SendOTP = () => {
  const [input, setInput] = useState({
    email: "",
  });
  const [isSending, setIsSending] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSending(true);
    dispatch(setLoading(true));

    try {
      const res = await api.post(`/user/send-otp`, { email: input.email });
      
      if (res.data.success) {
        toast.success(res.data.message);
        // Store email in localStorage for next steps
        localStorage.setItem('verificationEmail', input.email);
        navigate("/verify-otp");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSending(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Start Registration</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address to receive a verification code
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
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
              placeholder="Enter your email address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <Button
            type="submit"
            disabled={isSending || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {isSending || loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <div className="text-sm text-gray-600">
            <span>Already have an account? </span>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
              Sign In
            </Link>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>We'll send a 6-digit OTP to your email.</p>
            <p>The OTP will expire in 10 minutes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendOTP;
