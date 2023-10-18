import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    selectedProducts: [],
    mtrLines: [],
    loading: false,
    sort: 0,
    searchTerm: '',
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
}



const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
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
        },
        setGroup: (state, {payload}) => {
            state.group = payload;
            state.subgroup = null;
            state.lazyState.first = 0;
        },
        setSubgroup: (state, {payload}) => {
            state.subgroup = payload;
            state.lazyState.first = 0;
        },
        setLazyState: (state, {payload}) => {
            state.lazyState = payload;
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
        }
	},

})


export const {	
	setFilters,
    setCategory,
    setGroup,
    setSubgroup,
    setLazyState,
    setLoading,
    resetSelectedFilters,
    setSearchTerm,
    setSort,
} = productsSlice.actions;

export default productsSlice.reducer;



