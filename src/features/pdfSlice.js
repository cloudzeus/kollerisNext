import { combineReducers, createSlice } from "@reduxjs/toolkit";

const initialState = {
	printState: [],
	
}



const pdfSlice = createSlice({
	name: 'catalog',
	initialState,
	reducers: {
		setPrintState: (state, {payload}) => {
			state.printState = payload;
            
		},
		
	},

})

export const {	
	setPrintState
} = pdfSlice.actions;

export default pdfSlice.reducer;



