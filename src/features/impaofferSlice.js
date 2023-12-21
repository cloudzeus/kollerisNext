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
			const id = payload.id;
			const products = payload.products;
			
			 state.holder = state.holder.map((item) => {
				const updateProducts = []
				if (item.id !== id) return item;
				products.map((p) => {
					let existing = item.products.find((item) => item.MTRL === p.MTRL);
					if(existing) {
						
						updateProducts.push({
							...existing,
							QTY1: existing.QTY1 + p.QTY1,
							TOTAL_PRICE: existing.TOTAL_PRICE + p.TOTAL_PRICE,
							TOTAL_COST: existing.TOTAL_COST + p.TOTAL_COST,
						})

					} else {
						
						updateProducts.push(p)
					}
				})
				return {
					...item,
					products: updateProducts,
				}
			});	

			
		},
		resetHolder: (state) => {
			state.holder = [];
		},
		removeProductFromHolder: (state, {payload}) => {
			const product = payload.product;
			const holderId = payload.holderId;
			state.holder = state.holder.map((item) => {
				if (item.id !== holderId ) return item;
				return {
					...item,
					products: item.products.filter((p) => p.MTRL !== product.MTRL),
				}				
			})
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
	resetHolder,
	removeProductFromHolder,
} = impaofferSlice.actions;

export default impaofferSlice.reducer;



