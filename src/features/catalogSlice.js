import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gridData: [],
	headers: [],
	selectedHeaders: null,
    currentPage: 1,
	dropdownValue: null,
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
			console.log(state.headers)
			state.headers = payload;
		},
        setSelectedHeaders: (state, {payload}) => {
			state.selectedHeaders = payload;
		},
        setDropdownValue: (state, {payload}) => {
			state.dropdownValue = payload;
		},
        setSelectedMongoKey: (state, {payload}) => {
			const update = state.selectedHeaders.filter(item => item.value == payload.old);
			update.map(item => {
				item.related = payload.new
			})
		},
	},

})


export const {	setGridData,   setSelectedHeaders, setHeaders, setSelectedMongoKey, setCurrentPage, setDropdownValue } = catalogSlice.actions;
export default catalogSlice.reducer;



