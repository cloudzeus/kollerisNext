import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedImpa: null,
	selectedProducts: [],
	selectedClient: null,
	pageId: 1,
	dataSource: 1,
	showImpaTable: false,
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
		},
		
		setPageId: (state, {payload}) => {
			state.pageId = payload;
		},
		setDataSource: (state, {payload}) => {
			state.dataSource = payload;
		},
		setShowImpaTable: (state, {payload}) => {
			state.showImpaTable = payload;
		}
		
	},

})


export const {	
	setSelectedImpa,
	setSelectedProducts,
	setSelectedClient,
	deleteSelectedProduct,
	setHolderPage,
	setOfferPage,
	setPageId,
	setDataSource,
	setShowImpaTable,
} = impaofferSlice.actions;

export default impaofferSlice.reducer;



