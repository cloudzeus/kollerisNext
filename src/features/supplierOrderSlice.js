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
			console.log('PAYLOAD')
			console.log(payload)
			const existingItem = state.mtrLines.find((item) => item.MTRL === payload.MTRL);
			if(existingItem) {
				state.mtrLines = state.mtrLines.map((item) => {
					return item.MTRL === payload.MTRL ? { ...item, QUANTITY: payload.QUANTITY, TOTAL_PRICE: payload.QUANTITY * parseInt(payload.PRICE) } : item
				}
				)
			} else {
				state.mtrLines.push({
					...payload,
					TOTAL_PRICE: payload.QUANTITY * parseInt(payload.PRICE)
				});
			}
		},
		setDeleteMtrlLines: (state, {payload}) => {
			state.mtrLines = state.mtrLines.filter((item) => item.MTRL !== payload);
			state.selectedProducts = state.selectedProducts.filter((item) => item.MTRL !== payload);
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
	setDeleteMtrlLines
	
} = supplierOrderSlice.actions;

export default supplierOrderSlice.reducer;



