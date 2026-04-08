import { setAllAppliedJobs } from "@/redux/jobSlice";
import api from "@/utils/axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      // Only fetch if user is properly authenticated (has email and _id)
      if (!user || !user.email || !user._id) {
        return;
      }
      
      try {
        const res = await api.get(`/application/get`);
        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.application));
        }
      } catch (error) {
        // Silently handle error - don't log to console
        // This prevents 401 errors from cluttering the console
      }
    };
    
    // Only fetch if user is properly authenticated
    if (user && user.email && user._id) {
      fetchAppliedJobs();
    }
  }, [dispatch, user]);
  return null;
};

export default useGetAppliedJobs;
