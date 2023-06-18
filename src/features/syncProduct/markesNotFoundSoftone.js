import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { update } from "@syncfusion/ej2/inplace-editor";
import axios from "axios";
import { toast } from 'react-toastify';

const initialState = {
	loading: false,
	dataNotFoundInSoftone: [],
	ariadneCompletionPercentage: 0,
	updatedItemsLength: 0,
	updatedItemsColor: '#da252b',
}


export const notFoundSoftoneApi = createAsyncThunk(
	//action:
	'notFoundSoftone/findSoftoneAndSyncTables',
	async (toBeUpdatedLength, thunkApi) => {
		console.log('sefsfeef')
		try {
			const resp = await axios.post('/api/procut/sync-product', { action: 'notFoundSoftone' })
			console.log('1000')
			console.log('respdata 1111' + JSON.stringify(resp.data))
			let notFoundSoftone = [];
			resp.data.notFoun.map((item) => {
				array.push(item.softOne)
			})
			return notFoundSoftone;
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
				state.updatedItemsLength = state.updatedItemsLength + dataToUpdateLength
			let calculate = (state.updatedItemsLength / dataLength ) * 100;
		
			if(calculate >= 60 && calculate < 100) {
				state.updatedItemsColor = '#ea8f15'
			}
			if(calculate < 100) {
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
					console.log('payload 1000000000 findSoftoneAndSyncTables')
					console.log(payload)
					// state.dataNotFoundInSoftone = payload.notFoundSoftone;
					
			})
			.addCase(notFoundSoftoneApi.rejected, (state, { payload }) => {
				state.loading = false;
			})
	}
})


export const { calculateCompletionAriadne } = notFoundSoftoneSlice.actions;
export default notFoundSoftoneSlice.reducer;
