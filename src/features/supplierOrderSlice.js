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
	quantity: 0,
	orderReady: false,
	brandHasActiveOrder: false,
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
			function calculateAndRound(a, b) {
				const result = a * b;
				return Math.round(result * 100) / 100;
			}
			state.mtrLines = payload.map(item => {
				return {
					MTRL: item.MTRL,
					NAME: item.NAME,
					QTY1: 1,
					PRICE: parseFloat(item.PRICER),
					TOTAL_PRICE: parseFloat(item.PRICER),
				}
			});

		},
		updateMtrlines: (state, {payload}) => {
			function calculateAndRound(a, b) {
				const result = a * b;
				return Math.round(result * 100) / 100;
			}
			state.mtrLines = state.mtrLines.map(item => {
				if(item.MTRL === payload.MTRL) {
					return { ...item, QTY1: payload.QTY1, TOTAL_PRICE: calculateAndRound( payload.QTY1, parseFloat(item.PRICE)) };

				}
				return item
			})
			
		},
		setBrandHasActiveOrder: (state, {payload}) => {
			state.brandHasActiveOrder = payload;
		},
		setOrderReady: (state, {payload}) => {
			state.orderReady = payload		
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
	updateMtrlines,
	setOrderReady
	
} = supplierOrderSlice.actions;

export default supplierOrderSlice.reducer;



