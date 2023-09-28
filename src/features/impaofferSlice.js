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
			state.holder = [...state.holder, payload];
		},
		setMtrLines: (state, {payload}) => {
			state.mtrLines = state.mtrLines.map(item => {
				console.log(item)
				console.log(payload.QUANTITY)
				if (item.MTRL === payload.MTRL) {
					return { ...item, QUANTITY: payload.QUANTITY, TOTAL_PRICE: payload.QUANTITY * parseInt(item.PRICE) };
				}
				return item;
			});
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
} = impaofferSlice.actions;

export default impaofferSlice.reducer;



