import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gridData: [],
	newData: [],
	headers: [],
	
}



const impaofferSlice = createSlice({
	name: 'catalog',
	initialState,
	reducers: {
		setGridData: (state, {payload}) => {
			state.gridData = payload;
		},
	
		
	},

})


export const {	
	setGridData,   
	setSelectedHeaders, 
	
} = impaofferSlice.actions;

export default impaofferSlice.reducer;



