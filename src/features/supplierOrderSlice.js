import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedSupplier: null,
	selectedProducts: [],
	selectedMarkes: null,
    inputEmail: "",
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
		}	
		
	},

})


export const {	
	setSelectedSupplier,  
    setInputEmail, 
	setSelectedProducts,
	setSelectedMarkes,
	
} = supplierOrderSlice.actions;

export default supplierOrderSlice.reducer;



