import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { update } from "@syncfusion/ej2/inplace-editor";
import axios from "axios";
import { toast } from 'react-toastify';

const initialState = {
	loading: false,
	dataNotFoundInAriadne: [],
	dataNotFoundInSoftone: [],
	itemPercentage: 0,
	updatedItemsLength: 0,
	updatedItemsColor: '#da252b',
	imageName: '',
	
}


export const findSoftoneAndSyncTables = createAsyncThunk(
	//action:
	'grid/findSoftoneAndSyncTables',
	async (toBeUpdatedLength, thunkApi) => {
		try {
			const resp = await axios.post('/api/admin/markes/markes', { action: 'findExtraSoftone' })
			
			//Length of itesm that will be updated: 
			// console.log(toBeUpdatedLength)
			return resp.data;
		} catch (error) {
			console.log(error)
		}
})



const compareDatabasesSlice = createSlice({
	name: 'compareDatabases',
	initialState,
	reducers: {
		setAsyncedMarkes: (state, action) => {
			state.asyncedMarkes = action.payload;
		},
		
		setCalculateId: (state, action) => {
			console.log(action.payload.id)
			state.itemPercentage.id = action.payload;
		},
		calculatePercentage: (state, action) => {
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
				state.itemPercentage =  calculate.toFixed(2);
				state.updatedItemsColor = '#da252b'
			}
			
			
		}
		
	},
	extraReducers: (builder) => {
		builder
			//find diffreneces between softone and mongo:
			.addCase(findSoftoneAndSyncTables.pending, (state, {payload}) => {
				state.success = false;
				state.loading = true;
			})
			.addCase(findSoftoneAndSyncTables.fulfilled, (state,  {payload} ) => {
					console.log('payload findSoftoneAndSyncTables')
					console.log(payload)
					state.dataNotFoundInAriadne = payload.notFoundAriadne;
					state.dataNotFoundInSoftone = payload.notFoundSoftone;
					
			})
			.addCase(findSoftoneAndSyncTables.rejected, (state, { payload }) => {
				state.loading = false;
			})
	}
})


export const {setSelectedId, setGridRowData, setSelectedFile, setAsyncedMarkes, setAction, calculatePercentage, setCalculateId} = compareDatabasesSlice.actions;
export default compareDatabasesSlice.reducer;
