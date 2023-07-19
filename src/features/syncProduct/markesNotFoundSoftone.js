import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	loading: false,
	dataNotFoundInSoftone: [],
	ariadneCompletionPercentage: 0,
}

export const notFoundSoftoneApi = createAsyncThunk(
	//action:
	'notFoundSoftone/notFoundSoftoneApi',
	async (toBeUpdatedLength, thunkApi) => {
		// console.log('1000')
		try {
			const resp = await axios.post('/api/product/sync-product', { action: 'notFoundSoftone' })
			let notFoundSoftone = [];
			resp.data.result.map((item) => {
				notFoundSoftone.push(item.softOne)
			})
			return {notFoundSoftone: notFoundSoftone};
		} catch (error) {
			console.log(error)
		}
})



const notFoundSoftoneSlice = createSlice({
	name: 'notFoundSoftone',
	initialState,
	reducers: {
		calculateCompletionAriadne: (state, action) => {
			const {dataToUpdateLength, dataLength} = action.payload;
			let calculate = ( dataToUpdateLength / dataLength ) * 100;
		
			if(calculate >= 60 && calculate < 100) {
				state.updatedItemsColor = '#ea8f15'
			}
			if(calculate <= 100) {
				state.ariadneCompletionPercentage =  calculate.toFixed(2);
			}
			
			
		}
		
	},
	extraReducers: (builder) => {
		builder
			//find diffreneces between softone and mongo:
			.addCase(notFoundSoftoneApi.pending, (state, {payload}) => {
				state.success = false;
				state.loading = true;
			})
			.addCase(notFoundSoftoneApi.fulfilled, (state,  {payload} ) => {
					
					state.dataNotFoundInSoftone = payload.notFoundSoftone;
					
			})
			.addCase(notFoundSoftoneApi.rejected, (state, { payload }) => {
				state.loading = false;
			})
	}
})


export const { calculateCompletionAriadne } = notFoundSoftoneSlice.actions;
export default notFoundSoftoneSlice.reducer;
