import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gridData: [],
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
	}
}



const catalogSlice = createSlice({
	name: 'catalog',
	initialState,
	reducers: {
		setGridData: (state, {payload}) => {
			state.gridData = payload;
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
			const existingKey = state.attributes.find(item => item.name === payload.name);
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
		setPrices: (state, {payload}) => {
			
			switch (payload.type) {
				case "PRICER":
					state.prices.PRICER = payload.value;
				  break;
				case "PRICEW":
					state.prices.PRICEW = payload.value;
				  break;
				case "PRICER05":
					state.prices.PRICER05 = payload.value;
				  break;
				default:
			}  
		},
		setSelectedPriceKey: (state, {payload}) => {
			state.selectedPriceKey = payload;
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
	setPrices,
	setSelectedPriceKey
} = catalogSlice.actions;

export default catalogSlice.reducer;



