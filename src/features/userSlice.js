import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { addUserToLocalStorage, getUserFromLocalStorage, removerFromLocalStorage } from "@/utils/localStorage";
import {toast} from 'react-toastify';


const initialState = {
  user: getUserFromLocalStorage(),
  isAuthenticated: false,
  isLoading: false,
  isSidebarOpen: true,
}





export const loginUser = createAsyncThunk(
  //action:
  'user/loginUser',
  async (user, thunkApi) => {
    try {
      const resp = await axios.post('/api/user/login', user)
      return resp.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data)
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
    }
  })

//UPDATE USER:
export const updateUser = createAsyncThunk(
  //action:
  'user/updateUser',
  async (user, thunkApi) => {
    try {
      const resp = await axios.post('/api/user/update', user)
      return resp.data;

    } catch (error) {
      console.log(error)
    }
  })


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoading = false;
      removerFromLocalStorage();
    }
   

  },
  extraReducers: (builder) => {
    builder
      //LOGIN USER:
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        const {user} = payload;
        state.user = user;
        if(user) {
        addUserToLocalStorage(user)
        toast.success(`Welcome back ${user.firstName} ${user.lastName}` );
        }
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        console.log('rejected')
        state.isLoading = false;
        
      })
      //REGISTER USER:
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        const {user} = payload;
        state.isLoading = false;
        state.user = user;
        addUserToLocalStorage(user)
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.isLoading = false;
      })
      //UPDATE USER:
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        const {user} = payload;
        state.user = user;
        state.isLoading = false;
        addUserToLocalStorage(user)
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isLoading = false;
      })
  }
})


export const { logoutUser, toggleSidebar } = userSlice.actions;
export default userSlice.reducer;



