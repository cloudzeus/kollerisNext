import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gridData: [],
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
		PRICER05: 0,
	},
	pricesMultiplier: {
		PRICER: 1,
		PRICEW: 1,
		PRICER05: 1,
	}
}



const catalogSlice = createSlice({
	name: 'catalog',
	initialState,
	reducers: {
		setGridData: (state, {payload}) => {
			state.gridData = payload;
		},
		setNewData: (state, {payload}) => {
			state.newData = payload;
		},
		setCurrentPage: (state, {payload}) => {
			state.currentPage = payload;
		},
        setSelectedMongoKey: (state, {payload}) => {
			state.selectedMongoKey = payload;
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
			state.attributes = state.attributes.filter(item => item.name !== payload.newkey);
			const existingKey = state.mongoKeys.find(item => item.oldKey === payload.oldKey);
			if(existingKey) return;
			state.mongoKeys.push(payload);
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
				case "PRICER05":
					state.pricesMultiplier.PRICER05 = payload.value;
					state.prices.PRICER05 = payload.value * state.prices.PRICER05;
				  break;
				default:
			}  
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
	setNewData
} = catalogSlice.actions;

export default catalogSlice.reducer;



