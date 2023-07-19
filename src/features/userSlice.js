import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { addUserToLocalStorage, getUserFromLocalStorage, removeFromLocalStorage } from "@/utils/localStorage";
import { toast } from 'react-toastify';

const initialState = {
	user: getUserFromLocalStorage(),
	error: null,
	response: {
		success: null,
		error: null,
	},
	isLoading: false,
	isSidebarOpen: false,
	asycnedMarkes: 0,
}





export const fetchUser = createAsyncThunk(
	//action:
	'user/fetchUser',
	async (user, thunkApi) => {
		try {
			const resp = await axios.post('/api/user/fetchuser', user)
			return resp.data;
		} catch (error) {
			return thunkApi.rejectWithValue(error.response.data)
		}
	})

//REGISTER USER:
export const registerUser = createAsyncThunk(
	//action:
	'user/registerUser',
	async (user, thunkApi) => {
		try {
			const resp = await axios.post('/api/user/registeruser', user)
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
			removeFromLocalStorage();
		},



	},
	extraReducers: (builder) => {
		builder
			// LOGIN USER:
			.addCase(fetchUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchUser.fulfilled, (state, { payload }) => {
				const { user } = payload;

				state.user = user;
				if (user) {
					addUserToLocalStorage(user)
				}
				state.isLoading = false;
			})
			.addCase(fetchUser.rejected, (state, { payload }) => {
				state.isLoading = false;

			})


			//REGISTER USER:
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(registerUser.fulfilled, (state, { payload }) => {
				state.isLoading = false;
				console.log('payload')
				console.log(payload)
				state.user = payload?.user;
				state.response = payload;
			})
			.addCase(registerUser.rejected, (state, { payload }) => {
				state.isLoading = false;
			})


			//UPDATE USER:
			.addCase(updateUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateUser.fulfilled, (state, { payload }) => {
				const { user,} = payload;
				state.user = user;
			
				addUserToLocalStorage(user)

				if(payload.error) {
					toast.error = payload.error
				}
			})
		
			.addCase(updateUser.rejected, (state, { payload }) => {
				state.isLoading = false;
			})

		
	}
})


export const { logoutUser, toggleSidebar } = userSlice.actions;
export default userSlice.reducer;



