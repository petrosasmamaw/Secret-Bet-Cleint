import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFootball = createAsyncThunk(
  "football/fetchFootball",
  async () => {
    const res = await fetch("http://localhost:5000/api/football/matches");
    const data = await res.json();

    // ensure array
    return Array.isArray(data) ? data : [];
  }
);

const footballSlice = createSlice({
  name: "football",
  initialState: {
    matches: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFootball.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFootball.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchFootball.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load matches";
      });
  },
});

export default footballSlice.reducer;