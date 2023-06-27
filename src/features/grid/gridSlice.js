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
		
		
		
	},
	
})


export const { setGridRowData} = gridSlice.actions;
export default gridSlice.reducer;
