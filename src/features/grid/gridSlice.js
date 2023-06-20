import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { update } from "@syncfusion/ej2/inplace-editor";
import axios from "axios";
import { toast } from 'react-toastify';

const initialState = {
	selectedId: null,
	action: null,
	gridRowData: [],
	gridSelectedFile: null,
	loading: false,
	success: false,
	editData: [],
}





const gridSlice = createSlice({
	name: 'grid',
	initialState,
	reducers: {
		setSelectedId: (state, action) => {
			state.selectedId = action.payload;
		},
		setAction: (state, action) => {
			console.log(action.payload)
			state.action = action.payload;
		},
		setGridRowData: (state, action) => {
			state.gridRowData = action.payload;
		},
		setSelectedFile: (state, action) => {
			console.log(action.payload)
			state.gridSelectedFile = action.payload;
		},
		
		
	},
	
})


export const {setSelectedId, setGridRowData, setSelectedFile, setAction} = gridSlice.actions;
export default gridSlice.reducer;
