import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import api from "@/utils/axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const CompleteRegistration = () => {
  const [input, setInput] = useState({
    email: "",
    fullname: "",
    password: "",
    role: "",
    phoneNumber: "",
    pancard: "",
    adharcard: "",
    file: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  // Get email from localStorage or previous step
  useEffect(() => {
    const email = localStorage.getItem('verificationEmail');
    if (email) {
      setInput(prev => ({ ...prev, email }));
    } else {
      navigate('/send-otp');
    }
  }, [navigate]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const ChangeFilehandler = (e) => {
    const file = e.target.files[0];
    setInput((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const formData = new FormData();
    formData.append("email", input.email);
    formData.append("fullname", input.fullname);
    formData.append("password", input.password);
    formData.append("pancard", input.pancard);
    formData.append("adharcard", input.adharcard);
    formData.append("role", input.role);
    formData.append("phoneNumber", input.phoneNumber);
    
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await api.post(`/user/complete-registration`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.removeItem('verificationEmail');
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration completion failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Complete Registration</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in your details to complete the registration
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
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              type="text"
              id="fullname"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="Enter your phone number"
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
              placeholder="Create a password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pancard" className="text-sm font-medium text-gray-700">
              PAN Card Number
            </Label>
            <Input
              type="text"
              id="pancard"
              name="pancard"
              value={input.pancard}
              onChange={changeEventHandler}
              placeholder="Enter PAN card number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adharcard" className="text-sm font-medium text-gray-700">
              Aadhaar Card Number
            </Label>
            <Input
              type="text"
              id="adharcard"
              name="adharcard"
              value={input.adharcard}
              onChange={changeEventHandler}
              placeholder="Enter Aadhaar card number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Profile Photo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={ChangeFilehandler}
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
            {loading ? "Completing Registration..." : "Complete Registration"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          <span>Already have an account? </span>
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompleteRegistration;
