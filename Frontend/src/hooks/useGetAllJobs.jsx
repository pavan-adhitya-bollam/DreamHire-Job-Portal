import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import api from "@/utils/axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    console.log("useGetAllJobs triggered with searchedQuery:", searchedQuery);
    const fetchAllJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Capture the searchedQuery at this moment to avoid timing issues
        const currentQuery = searchedQuery;
        const url = `${JOB_API_ENDPOINT}/get?keyword=${encodeURIComponent(currentQuery)}`;
        console.log("Calling API URL:", url);
        console.log("Using currentQuery:", currentQuery);
        const res = await api.get(`/job/get?keyword=${encodeURIComponent(currentQuery)}`);
        console.log("API Response:", res.data);
        if (res.data.status) {
          // Updated success check
          dispatch(setAllJobs(res.data.jobs));
        } else {
          setError("Failed to fetch jobs.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, [dispatch, searchedQuery]);

  return { loading, error };
};

export default useGetAllJobs;
