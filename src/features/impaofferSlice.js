import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedImpa: null
	
}



const impaofferSlice = createSlice({
	name: 'catalog',
	initialState,
	reducers: {
		setSelectedImpa: (state, {payload}) => {
			state.selectedImpa = payload;
		},
	
		
	},

})


export const {	
	setSelectedImpa
	
} = impaofferSlice.actions;

export default impaofferSlice.reducer;



