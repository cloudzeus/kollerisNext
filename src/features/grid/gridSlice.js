import { createSlice} from "@reduxjs/toolkit";

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
