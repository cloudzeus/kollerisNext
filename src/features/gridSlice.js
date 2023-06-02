import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
	selectedId: null,
	gridAction: null,
	gridRowData: [],
	gridSelectedFile: null,
}



const gridSlice = createSlice({
	name: 'grid',
	initialState,
	reducers: {
		setSelectedId: (state, action) => {
			state.selectedId = action.payload;
		},
		setAction: (state, action) => {
			state.gridAction = action.payload;
		},
		setGridRowData: (state, action) => {
			state.gridRowData = action.payload;
		},
		setSelectedFile: (state, action) => {
			console.log('redux selected file')
			console.log(action.payload)
			state.gridSelectedFile = action.payload;
		},


	},
	
})


export const {setSelectedId, setGridRowData, setSelectedFile } = gridSlice.actions;
export default gridSlice.reducer;
