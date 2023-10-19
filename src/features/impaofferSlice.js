import { combineReducers, createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedImpa: null,
	plainHolderName: '',
	selectedProducts: [],
	selectedClient: null,
	pageId: 1,
	dataSource: 1,
	showImpaTable: false,
	holder: [],
	mtrLines: [],
	offerEmail: '',
	//used in clients page, to set a single client name, and find the offers that correspond to him
	singleClientName: '',
}



const impaofferSlice = createSlice({
	name: 'catalog',
	initialState,
	reducers: {
		setSelectedImpa: (state, {payload}) => {
			state.selectedImpa = payload;
		},
		setSelectedClient: (state, {payload}) => {
			state.selectedClient = payload;
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
	
		setOfferEmail: (state, {payload}) => {
			state.offerEmail = payload;
		},
		setPlainHolderName: (state, {payload}) => {
			state.plainHolderName = payload;
		}


		
	},

})


export const {	
	setSelectedImpa,
	setSelectedClient,
	setHolderPage,
	setOfferPage,
	setPageId,
	setDataSource,
	setShowImpaTable,
	setHolder,
	setOfferEmail,
	setSingleClientName,
	setPlainHolderName
} = impaofferSlice.actions;

export default impaofferSlice.reducer;



