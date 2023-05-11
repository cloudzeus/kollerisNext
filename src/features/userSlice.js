import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { addUserToLocalStorage, getUserFromLocalStorage, removerFromLocalStorage } from "@/utils/localStorage";
import { toast } from 'react-toastify';


const initialState = {
	user: getUserFromLocalStorage(),
	isLoading: false,
	isSidebarOpen: true,
}





export const fetchUser = createAsyncThunk(
	//action:
	'user/fetchUser',
	async (user, thunkApi) => {
		console.log(`Fetch User: ${JSON.stringify(user)}`)
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
		console.log(`Register User: ${JSON.stringify(user)}`)
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
		console.log(`Update User: ${JSON.stringify(user)}`)
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
				console.log('User in reducers' + JSON.stringify(user))

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
			
				const { user } = payload;
				console.log('register user payload:' + JSON.stringify(payload))
				state.isLoading = false;
			
				if(payload.success == true && payload.error == null) {
					state.user = user;
					addUserToLocalStorage(user)
				  	toast.success('Eπιτυχής εγγραφή! Συνδεθείτε τώρα!')
				}

			})
			.addCase(registerUser.rejected, (state, { payload }) => {
				state.isLoading = false;
			})
			//UPDATE USER:
			.addCase(updateUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateUser.fulfilled, (state, { payload }) => {
				console.log(payload)
				const { user } = payload;
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



