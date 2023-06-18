import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	loading: false,
	dataNotFoundInAriadne: [],
	softoneCompletionPercentage: 0,
	updatedItemsLength: 0,
	updatedItemsColor: '#da252b',
	
}


export const notFoundAriadneApi = createAsyncThunk(
	//action:
	'notFoundAriadne/findSoftoneAndSyncTables',
	async (toBeUpdatedLength, thunkApi) => {
		try {
			const resp = await axios.post('/api/product/sync-product', { action: 'notFoundAriadne' })
			return resp.data;
		} catch (error) {
			console.log(error)
		}
})



const notFoundAriadneSlice = createSlice({
	name: 'notFoundAriadne',
	initialState,
	reducers: {
		calculateCompletionSoftone: (state, action) => {
			console.log('action payload')
			console.log(action.payload)
			const {dataToUpdateLength, dataLength} = action.payload;
				state.updatedItemsLength = state.updatedItemsLength + dataToUpdateLength

			
			let calculate = (state.updatedItemsLength / dataLength ) * 100;
			// if(calculate => 30 && calculate < 60) {
			// 	state.updatedItemsColor = '#e66c19'
			// }
			
			if(calculate >= 60 && calculate < 100) {
				state.updatedItemsColor = '#ea8f15'
			}
			if(calculate < 100) {
				state.softoneCompletionPercentage =  calculate.toFixed(2);
				state.updatedItemsColor = '#da252b'
			}
			
			
		}
		
	},
	extraReducers: (builder) => {
		builder
			//find diffreneces between softone and mongo:
			.addCase(notFoundAriadneApi.pending, (state, {payload}) => {
				state.success = false;
				state.loading = true;
			})
			.addCase(notFoundAriadneApi.fulfilled, (state,  {payload} ) => {
					console.log('payload findSoftoneAndSyncTables')
					console.log(payload)
					state.dataNotFoundInAriadne = payload.notFoundAriadne;
					
			})
			.addCase(notFoundAriadneApi.rejected, (state, { payload }) => {
				state.loading = false;
			})
	}
})


export const {calculateCompletionSoftone } = notFoundAriadneSlice.actions;
export default notFoundAriadneSlice.reducer;
