import { combineReducers, createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedImpa: null,
	selectedProducts: [],
	selectedClient: null,
	pageId: 1,
	dataSource: 1,
	showImpaTable: false,
	holder: [],
	mtrLines: [],
	offerEmail: '',
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
			
			const updateMTRLINES = payload.map(item => {
				return {
					NAME: item.NAME,
					QUANTITY: 1,
					PRICE: parseInt(item.PRICER),
					MTRL: item.MTRL,
					TOTAL_PRICE: parseInt(item.PRICER)
				}
			})
			state.mtrLines = updateMTRLINES;

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
		},
		setHolder: (state, {payload}) => {
			
			state.holder.push(payload);
		},
		setMtrLines: (state, {payload}) => {
			state.mtrLines = state.mtrLines.map(item => {
				if (item.MTRL === payload.MTRL) {
					return { ...item, QUANTITY: payload.QUANTITY, TOTAL_PRICE: payload.QUANTITY * parseInt(item.PRICE) };
				}
				return item;
			});
		},
		setOfferEmail: (state, {payload}) => {
			state.offerEmail = payload;
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
	setHolder,
	setMtrLines,
	setOfferEmail
} = impaofferSlice.actions;

export default impaofferSlice.reducer;



