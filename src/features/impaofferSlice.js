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
		},
		deleteSelectedProduct: (state, {payload}) => {
			state.selectedProducts = state.selectedProducts.filter(product => product._id !== payload);
		}
		
	},

})


export const {	
	setSelectedImpa,
	setSelectedProducts,
	setSelectedClient,
	deleteSelectedProduct
} = impaofferSlice.actions;

export default impaofferSlice.reducer;



