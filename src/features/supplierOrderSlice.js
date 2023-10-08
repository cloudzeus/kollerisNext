import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedSupplier: null,
	selectedProducts: [],
	selectedMarkes: null,
    inputEmail: "",
	searchTerm: '',
	submitProducts: false,
	emailProducts: [],
	totalProductsPrice: 0,
	mtrLines: [],
	findItem: null,
	quantity: 0,
	isFinalSubmit: false,
	mtrProducts: [],
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
		},
		
		setTotalProductsPrice: (state, {payload}) => {
			state.totalProductsPrice = state.totalProductsPrice + payload;
		},
		setQuantity: (state, {payload}) => {
			state.quantity = payload;
		},
		setMtrLines: (state, {payload}) => {
			
			const calc = payload.QTY1 * parseFloat(payload.PRICE);
			const roundedUp = Math.ceil(calc);

			const existingItem = state.mtrLines.find((item) => item.MTRL === payload.MTRL);
			if(existingItem) {
				state.mtrLines = state.mtrLines.map((item) => {
					return item.MTRL === payload.MTRL ? { ...item,  QTY1: payload.QTY1, TOTAL_PRICE: roundedUp} : item
				}
				)
			} else {
				
				state.mtrLines.push({
					...payload,
					TOTAL_PRICE: roundedUp
				});
			}
		},
		setDeleteMtrlLines: (state, {payload}) => {
			state.mtrLines = state.mtrLines.filter((item) => item.MTRL !== payload);
			state.selectedProducts = state.selectedProducts.filter((item) => item.MTRL !== payload);
		},
		setIsFinalSubmit: (state, {payload}) => {
			state.isFinalSubmit = payload;
		}
		
	},

})


export const {	
	setSelectedSupplier,  
    setInputEmail, 
	setSelectedProducts,
	setSelectedMarkes,
	setSearchTerm,
	setTotalProductsPrice,
	setMtrLines,
	setQuantity,
	setDeleteMtrlLines,
	setIsFinalSubmit
	
} = supplierOrderSlice.actions;

export default supplierOrderSlice.reducer;



