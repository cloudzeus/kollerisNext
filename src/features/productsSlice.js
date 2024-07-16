import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    selectedProducts: [],
    submitted: false,
    mtrLines: [],
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setSelectedProducts: (state, {payload}) => {
            state.selectedProducts = payload;
            state.mtrLines = payload.map(item => {
                return {
                    NAME: item.NAME,
                    QTY1: 1,
                    PRICE: parseInt(item.PRICER),
                    COST: item.COST,
                    MTRL: item.MTRL,
                    TOTAL_PRICE: parseInt(item.PRICER),
                    TOTAL_COST: item.COST,
                }
            });

        },
        setSubmitted: (state) => {
            state.submitted = !state.submitted;
        },
        deleteSelectedProduct: (state, {payload}) => {
            state.selectedProducts = state.selectedProducts.filter(product => product._id !== payload.id);
            state.mtrLines = state.mtrLines.filter(product => product.NAME !== payload.name);
        },
        //#used in the selected products grid to update the quantity and the total price
        setMtrLines: (state, {payload}) => {
            state.mtrLines = state.mtrLines.map(item => {
                if (item.MTRL === payload.MTRL) {
                    return {
                        ...item,
                        QTY1: payload.QTY1,
                        TOTAL_PRICE: payload.QTY1 * parseInt(item.PRICE),
                        TOTAL_COST: payload.QTY1 * item.COST
                    };
                }
                return item;
            });
        },
    },

})


export const {

    setSelectedProducts,
    setMtrLines,
    deleteSelectedProduct,
    setSubmitted,
} = productsSlice.actions;

export default productsSlice.reducer;



