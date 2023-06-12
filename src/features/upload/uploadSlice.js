import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    uploadedImages:[],
}


const uploadSlice = createSlice({
	name: 'upload',
	initialState,
	reducers: {
		setUploadImages: (state, action) => {
			console.log('setUploadImages')
			console.log(action.payload)
			state.uploadedImages = [...state.uploadedImages, ...action.payload];
		}
	},
	
})


export const { setUploadImages} = uploadSlice.actions;
export default uploadSlice.reducer;