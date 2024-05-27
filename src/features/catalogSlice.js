import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gridData: [],
	data: [],
	attributes: [],
	mongoKeys: [],

	newData: [],
	headers: [],
	// selectedPriceKey: null,
	// selectedHeaders: null,
	// dropdownValue: null,
	// object: [],
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
			console.log(state.attributes)
			const existingAttribute = state.attributes.find(item => item.name === payload.name);
			if(existingAttribute) {
				existingAttribute.oldKey = payload.oldkey;
				return;
			} else {
				state.attributes.push(payload);
			}
			// const existingAttribute = state.attributes.find(item => item.name === payload.name);
			// if(existingAttribute) {
			// 	existingAttribute.value = payload.value;
			// 	return;
			// } else {
			// 	state.attributes.push(payload);
			// }
			// state.mongoKeys = state.mongoKeys.filter(item => item.newkey !== payload.name);
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
	// setCurrentPage,
	setDropdownValue, 
	setAttribute, 
	// setSelectedPriceKey,
	// setPricesMultiplier,
	setNewData,
	setReturnedProducts,
	setData,
	clearMongoKeys
} = catalogSlice.actions;

export default catalogSlice.reducer;



