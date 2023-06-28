import { createSlice} from "@reduxjs/toolkit";

const initialState = {
	brandData: null,
    brandDialog: false,
}



const brandSlice = createSlice({
	name: 'brand',
	initialState,
	reducers: {
		setBrandData: (state, action) => {
			console.log('brand data: ' + JSON.stringify(action.payload))
			state.brandData = action.payload;
			
		},

		setBrandDialog: (state, action) => {
			state.brandDialog = action.payload;
		}
		
		
		
	},
	
})


export const {setBrandData} = brandSlice.actions;
export default brandSlice .reducer;
