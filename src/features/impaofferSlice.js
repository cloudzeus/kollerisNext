import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedImpa: null,
	selectedProducts: [],
	selectedClient: null,
	
}



const impaofferSlice = createSlice({
	name: 'catalog',
	initialState,
	reducers: {
		setSelectedImpa: (state, {payload}) => {
			state.selectedImpa = payload;
		},
		setSelectedProducts: (state, {payload}) => {
			
			  state.selectedProducts = payload;
		},
		setSelectedClient: (state, {payload}) => {
			state.selectedClient = payload;
		}
	
		
	},

})


export const {	
	setSelectedImpa,
	setSelectedProducts,
	setSelectedClient
} = impaofferSlice.actions;

export default impaofferSlice.reducer;



