import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
	isAdd: false,
	isEdit: false,
	isDelete: false,
	
}



const gridSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setIsAdd: (state, action) => {
			state.isAdd = action.payload;
		}


	},
	
})


export const {setIsAdd } = gridSlice.actions;
export default gridSlice.reducer;
