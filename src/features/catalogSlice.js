import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gridData: [],
	data: [],
	newData: [],
	headers: [],
	selectedPriceKey: null,
	selectedHeaders: null,
    currentPage: 1,
	dropdownValue: null,
	attributes: [],
	object: [],
	mongoKeys: [],
	prices: {
		PRICER: 0,
		PRICEW: 0,
		PRICER01: 0,
	},
	pricesMultiplier: {
		PRICER: 1,
		PRICEW: 1,
		PRICER01: 1,
	},
	returnProducts: [],
}



const catalogSlice = createSlice({
	name: 'catalog',
	initialState,
	reducers: {
		setGridData: (state, {payload}) => {
			state.gridData = payload;
		},
		setData: (state, {payload}) => {
			state.data = payload;
		},
		setNewData: (state, {payload}) => {
			state.newData = payload;
		},
		setCurrentPage: (state, {payload}) => {
			state.currentPage = payload;
		},
      
        setHeaders: (state, {payload}) => {
			state.headers = payload;
		},
        setSelectedHeaders: (state, {payload}) => {
			state.selectedHeaders = payload;
		},
        setDropdownValue: (state, {payload}) => {
			state.dropdownValue = payload;
		},
        setSelectedMongoKey: (state, {payload}) => {
			const existingKey = state.mongoKeys.find(item => item.oldKey === payload.oldKey);
			if(existingKey) {
				existingKey.related = payload.related;
				return;
			};
			state.mongoKeys.push(payload);
		},
		clearMongoKeys: (state) => {
			state.mongoKeys = [];
		},
		setAttribute: (state, {payload}) => {
			console.log(payload)
			const existingAttribute = state.attributes.find(item => item.name === payload.name);
			if(existingAttribute) {
				existingAttribute.value = payload.value;
				return;
			} else {
				state.attributes.push(payload);
			}
			state.mongoKeys = state.mongoKeys.filter(item => item.newkey !== payload.name);
		},
	
		setSelectedPriceKey: (state, {payload}) => {
			state.selectedPriceKey = payload;

		},
		setPricesMultiplier: (state, {payload}) => {
			switch (payload.type) {
				case "PRICER":
					state.pricesMultiplier.PRICER = payload.value;
					state.prices.PRICER = payload.value * state.prices.PRICER;
				  break;
				case "PRICEW":
					state.pricesMultiplier.PRICEW = payload.value;
					state.prices.PRICEW = payload.value * state.prices.PRICEW;
				  break;
				case "PRICER01":
					state.pricesMultiplier.PRICER01 = payload.value;
					state.prices.PRICER01 = payload.value * state.prices.PRICER01;
				  break;
				default:
			}  
		},
		setReturnedProducts: (state, {payload}) => {
			 state.returnProducts.push(payload);
		}
		
	},

})


export const {	
	setGridData,   
	setSelectedHeaders, 
	setHeaders, 
	setSelectedMongoKey, 
	setCurrentPage, 
	setDropdownValue, 
	setAttribute, 
	setSelectedPriceKey,
	setPricesMultiplier,
	setNewData,
	setReturnedProducts,
	setData,
	clearMongoKeys
} = catalogSlice.actions;

export default catalogSlice.reducer;



