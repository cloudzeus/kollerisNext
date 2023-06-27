import { createSlice} from "@reduxjs/toolkit";

const initialState = {
	gridRowData: [],
}



const gridSlice = createSlice({
	name: 'grid',
	initialState,
	reducers: {
		setGridRowData: (state, action) => {
			state.gridRowData = action.payload;
		},
		resetGridRowData: (state, action) => {
			state.gridRowData = [];
			console.log('reset gird row data')
			console.log(state.gridRowData)
		},
		
		
		
	},
	
})


export const { setGridRowData, resetGridRowData} = gridSlice.actions;
export default gridSlice.reducer;
