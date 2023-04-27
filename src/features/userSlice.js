import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { addUserToLocalStorage, getUserFromLocalStorage } from "@/utils/localStorage";

const initialState = {
  user: [],
  isAuthenticated: false,
  isLoading: false,
  isSidebarOpen: true,
}





export const loginUser = createAsyncThunk(
  //action:
  'user/loginUser',
  async (user, thunkApi) => {
    console.log(`Login User: ${JSON.stringify(user)}`)
    try {
      const resp = await axios.post('/', user)
      return resp.data;

    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.msg)
    }
  })


export const registerUser = createAsyncThunk(
  //action:
  'user/registerUser',
  async (user, thunkApi) => {
    console.log(`Register User: ${JSON.stringify(user)}`)
    try {
      const resp = await axios.post('/api/registerUser', user)
      return resp.data;

    } catch (error) {
      console.log(error)
      // return thunkApi.rejectWithValue(error.response.data)
    }
  })


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
   

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
       
        console.log('This is the login payload')
        console.log(payload)
        const { user } = payload;
        
        state.isLoading = false;
        state.user = user;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
      
        console.log('Register Payload')
        console.log(payload)
        // const { user } = payload;
        state.isLoading = false;
        // state.user = user;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
      })
      
      

  }
})


export const { logoutUser, toggleSidebar } = userSlice.actions;
export default userSlice.reducer;



