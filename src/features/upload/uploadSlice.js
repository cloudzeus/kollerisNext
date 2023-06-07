import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    gridSelectedFile: null,
}


const uploadSlice = createSlice({
	name: 'upload',
	initialState,
	reducers: {
		setSelectedId: (state, action) => {
			state.selectedId = action.payload;
		}
	},
	
})


export const { setSelectedFile} = uploadSlice.actions;
export default uploadSlice.reducer;