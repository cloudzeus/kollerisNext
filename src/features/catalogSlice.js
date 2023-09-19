import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gridData: [],
	headers: [],
	selectedHeaders: null,
    currentPage: 1,
	dropdownValue: null,
	attributes: [],
	object: [],
	mongoKeys: [],
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
		
		
	},

})


export const {	setGridData,   setSelectedHeaders, setHeaders, setSelectedMongoKey, setCurrentPage, setDropdownValue, setAttribute } = catalogSlice.actions;
export default catalogSlice.reducer;



