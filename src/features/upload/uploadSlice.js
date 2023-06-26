import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    uploadedImages:[],
}


export const deleteImage = createAsyncThunk(
	//action:
	'upload/deleteImage',
	async (user, thunkApi) => {
		try {
			// const resp = await axios.post('/api/user/fetchuser', user)
			// return resp.data;
		} catch (error) {
			return thunkApi.rejectWithValue(error.response.data)
		}
	})

const uploadSlice = createSlice({
	name: 'upload',
	initialState,
	reducers: {
		setUploadImages: (state, action) => {
			console.log('-------- setUploadImages ------------')
			console.log(action.payload)
			state.uploadedImages = [...state.uploadedImages, ...action.payload];
		},
		resetUploadImages: (state) => {
			state.uploadedImages = [];
		}
	},
	extraReducers: (builder) => {
		builder
			// LOGIN USER:
			.addCase(deleteImage.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteImage.fulfilled, (state, { payload }) => {
				state.uploadedImages = state.uploadedImages.filter(image => image !== payload);
				
			})
			.addCase(deleteImage.rejected, (state, { payload }) => {
				state.isLoading = false;

			})


		
	}
	
})


export const { setUploadImages, resetUploadImages} = uploadSlice.actions;
export default uploadSlice.reducer;