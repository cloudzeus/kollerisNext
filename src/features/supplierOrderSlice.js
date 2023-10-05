import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedSupplier: null,
    inputEmail: '',
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
        }
	
		
	},

})


export const {	
	setSelectedSupplier,  
    setInputEmail, 
	
} = supplierOrderSlice.actions;

export default supplierOrderSlice.reducer;



