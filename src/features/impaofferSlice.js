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
		addMoreToHolder: (state, {payload}) => {
			console.log('payload')
			console.log(payload)
			console.log('state.holder')
			console.log(current(state.holder))
			console.log('payload')
			console.log(payload)
			let holder = state.holder;
			holder.map((item) => {
				if(item.id === payload.id) {
					console.log('item')
					console.log(item)
					return {
						...item,
						products: [...item.products, payload.products]
					}
				}
				return item;
			})
			console.log('holder')
			console.log(holder)
			// state.holder.push(payload);
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



