import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
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
            console.log('payload')
            console.log(payload)
            state.category = payload;
        },
        setGroup: (state, {payload}) => {
            state.group = payload;
        },
        setSubgroup: (state, {payload}) => {
            state.subgroup = payload;
        },
        setLazyState: (state, {payload}) => {
            state.lazyState = payload;
        },
        setFiltersLoading: (state, {payload}) => {
            state.loading = payload
        }
		
	},

})


export const {	
	setFilters,
    setCategory,
    setGroup,
    setSubgroup,
    setLazyState,
    setFiltersLoading,
} = productsSlice.actions;

export default productsSlice.reducer;



