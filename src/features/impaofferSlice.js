import { combineReducers, createSlice, current } from "@reduxjs/toolkit";

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
		addMoreToHolder: (state, {payload}) => {
			state.holder = state.holder.map((item) => {
				if(item.id === payload.id) {
					return {
						...item,
						products: [...item.products, ...payload.products]
					}
				}
				return item;
			});
		
		},
		setOfferEmail: (state, {payload}) => {
			state.offerEmail = payload;
		},
		setPlainHolderName: (state, {payload}) => {
			state.plainHolderName = payload;
		},
		removeHolder: (state, {payload}) => {
			state.holder = state.holder.filter((item) => item.id !== payload);
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
	setPlainHolderName,
	removeHolder,
	addMoreToHolder,
} = impaofferSlice.actions;

export default impaofferSlice.reducer;



