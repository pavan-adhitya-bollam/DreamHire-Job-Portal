import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savedJobs: [],
};

const myListSlice = createSlice({
  name: "myList",
  initialState,
  reducers: {
    addToMyList: (state, action) => {
      const job = action.payload;
      // Check if job is already saved
      if (!state.savedJobs.find(savedJob => savedJob._id === job._id)) {
        state.savedJobs.push(job);
      }
    },
    removeFromMyList: (state, action) => {
      const jobId = action.payload;
      state.savedJobs = state.savedJobs.filter(job => job._id !== jobId);
    },
    setMyList: (state, action) => {
      state.savedJobs = action.payload;
    },
  },
});

export const { addToMyList, removeFromMyList, setMyList } = myListSlice.actions;
export default myListSlice.reducer;
