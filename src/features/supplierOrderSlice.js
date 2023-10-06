import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedSupplier: null,
	selectedProducts: [],
	selectedMarkes: null,
    inputEmail: "",
	searchTerm: '',
}



const supplierOrderSlice = createSlice({
	name: 'supplierOrder',
	initialState,
	reducers: {
		setSelectedSupplier: (state, {payload}) => {
			state.selectedSupplier = payload;
		},
        setInputEmail: (state, {payload}) => {
            state.inputEmail = payload;
        },
		setSelectedProducts: (state, {payload}) => {
			state.selectedProducts = payload;
		},
		setSelectedMarkes: (state, {payload}) => {
			state.selectedMarkes = payload;
		},
		
		setSearchTerm: (state, {payload}) => {
			state.searchTerm = payload;
		}

		
	},

})


export const {	
	setSelectedSupplier,  
    setInputEmail, 
	setSelectedProducts,
	setSelectedMarkes,
	setSearchTerm
	
} = supplierOrderSlice.actions;

export default supplierOrderSlice.reducer;



