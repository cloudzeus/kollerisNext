import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    selectedProducts: [],
    mtrLines: [],
    loading: false,
    sort: 0,
    searchTerm: '',
    softoneFilter: null,
    filters: {
        category: null,
        group: null,
        subgroup: null,
        marka: null,
    },
    category: null,
    group: null,
    subgroup: null,
    lazyState: {
        first: 0,
        rows: 10,
        page: 1,
    },
    lazyState2: {
        first: 0,
        rows: 50,
        page: 1,
    },
    productsForSoftone: [],
    singleProductForSoftone: null,
}



const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
        setSelectedProducts: (state, {payload}) => {
			state.selectedProducts = payload;
			
			const updateMTRLINES = payload.map(item => {
				return {
					NAME: item.NAME,
					QTY1: 1,
					PRICE: parseInt(item.PRICER),
					MTRL: item.MTRL,
					TOTAL_PRICE: parseInt(item.PRICER)
				}
			})
			state.mtrLines = updateMTRLINES;

		},
        deleteSelectedProduct: (state, {payload}) => {
			state.selectedProducts = state.selectedProducts.filter(product => product._id !== payload);
		},
		setMtrLines: (state, {payload}) => {
			state.mtrLines = state.mtrLines.map(item => {
				if (item.MTRL === payload.MTRL) {
					return { ...item, QTY1: payload.QTY1, TOTAL_PRICE: payload.QTY1 * parseInt(item.PRICE) };
				}
				return item;
			});
		},
		setFilters: (state, {payload}) => {
            switch(payload.action) {
                case "category": 
                    state.filters.category = payload.value;
                    state.filters.group = null;
                    state.filters.subgroup = null;
                    break;
                case "group": 
                    state.filters.group = payload.value;
                    state.filters.subgroup = null;
                    break;
                case "subgroup":
                    state.filters.subgroup = payload.value;
                    break;
            }
		},
        setCategory: (state, {payload}) => { 
            state.category = payload;
            state.group = null;
            state.subgroup = null;
            state.searchTerm = '';
            state.lazyState.first = 0;
            state.lazyState2.first = 0;
        },
        setGroup: (state, {payload}) => {
            state.group = payload;
            state.subgroup = null;
            state.lazyState.first = 0;
            state.lazyState2.first = 0;
        },
        setSubgroup: (state, {payload}) => {
            state.subgroup = payload;
            state.lazyState.first = 0;
            state.lazyState2.first = 0;

        },
        setLazyState: (state, {payload}) => {
            state.lazyState = payload;
        },
        setLazyState2: (state, {payload}) => {
            state.lazyState2 = payload;
        },
        setLoading: (state, {payload}) => {
            state.loading = payload
        },
        resetSelectedFilters: (state) => {
            state.category = null;
            state.group = null;
            state.subgroup = null;
        },
        setSearchTerm: (state, {payload}) => {
            state.searchTerm = payload;
            state.category = null;
            state.group = null;
            state.subgroup = null;
        },
        setSort: (state) => {
            state.searchTerm = '';
            state.category = null;
            state.group = null;
            state.subgroup = null;
            state.softoneFilter = null;
            if(state.sort == 0) {
                state.sort = 1;
                return;
            };
            if(state.sort == 1) {
                state.sort = -1;
                return;
            };
            if(state.sort == -1) {
                state.sort = 0;
                return;
            };
        },
        setProductsForSoftone: (state, {payload}) => {
            state.productsForSoftone = payload;
        },
        //There is a queue of products waiting to be inserted to softone, this is the single product that is being inserted
        setSingleProductForSoftone: (state, {payload}) => {
            state.singleProductForSoftone = payload;
        },
       removeProductForSoftone: (state, {payload}) => {
           
            let filter = state.productsForSoftone.filter(product => product._id !== payload)
            state.productsForSoftone = filter;
            // state.singleProductForSoftone = null;
       },
       setSoftoneFilter: (state, {payload}) => {
            state.softoneFilter = payload;
       }    

	},

})


export const {	
	setFilters,
    setCategory,
    setGroup,
    setSubgroup,
    setLazyState,
    setLazyState2,
    setLoading,
    resetSelectedFilters,
    setSearchTerm,
    setSort,
    setSelectedProducts,
    setMtrLines,
    deleteSelectedProduct,
    setProductsForSoftone,
    setSingleProductForSoftone,
    removeProductForSoftone,
    setSoftoneFilter,
} = productsSlice.actions;

export default productsSlice.reducer;



