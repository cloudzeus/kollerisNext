import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';


const initialState = {
  user: [],
}




export const loginUser = createAsyncThunk(
  //action:
  'user/loginUser',
  async (user, thunkApi) => {
    console.log(`Login User: ${JSON.stringify(user)}`)
    try {
      const resp = await axios.post('https://dummyjson.com/auth/login', user)
      return resp.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.msg)
    }
  })


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isSidebarOpen = false;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        console.log(payload)
        const { user } = payload;
        state.isLoading = false;
        state.user = user;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
      })

  }
})


export const { logoutUser, toggleSidebar } = userSlice.actions;
export default userSlice.reducer;



