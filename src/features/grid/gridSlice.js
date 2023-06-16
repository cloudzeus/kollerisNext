import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { update } from "@syncfusion/ej2/inplace-editor";
import axios from "axios";
import { toast } from 'react-toastify';

const initialState = {
	selectedId: null,
	action: null,
	gridRowData: [],
	gridSelectedFile: null,
	loading: false,
	asyncedMarkes: 0,
	notSyncedData: [],
	success: false,
	editData: [],
	dataNotFoundInAriadne: [],
	dataNotFoundInSoftone: [],
	itemPercentage: {
		percentage: 0,
		id: null,
	},
	updatedItemsLength: {
		updated: 0,
		id: null,
	},
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
export const editGridItem = createAsyncThunk(
	//action:
	'grid/editGridItem',
	async (grid, thunkApi) => {
		try {
			const resp = await axios.post('/api/admin/markes/markes', { action: 'findOne', id: grid.id })
			return resp.data;
		} catch (error) {
			console.log(error)
		}
})

export const fetchNotSynced = createAsyncThunk(
	//action:
	'grid/fetchNotSynced',
	async (grid, thunkApi) => {
		try {
			
			const resp = await axios.post('/api/admin/markes/markes', { action: 'sync' })
			return resp.data;
		} catch (error) {
			console.log(error)
		}
})

export const updateNotSynced = createAsyncThunk(
	//action:
	'grid/updateNotSynced',
	async (data) => {
		const {syncTo, resData} = data;
		try {
			let res = await axios.post('/api/admin/markes/markes', { action: 'syncAndUpdate', syncTo: syncTo?.toString(), data: resData })
		
			if(!res.data.success) {
				toast.error('Αποτυχία Συγχρονισμού');
				return res.data;
			}
			if(res.data.success) {
				const resp = await axios.post('/api/admin/markes/markes', { action: 'sync' })
				console.log('--------------- RES DATA -----------------')
				console.log(resp.data, res.data)
				return {...res.data, ...resp.data};
			}
		} catch (error) {
			console.log(error)
		}


	})


const gridSlice = createSlice({
	name: 'grid',
	initialState,
	reducers: {
		setSelectedId: (state, action) => {
			state.selectedId = action.payload;
		},
		setAction: (state, action) => {
			console.log(action.payload)
			state.action = action.payload;
		},
		setGridRowData: (state, action) => {
			state.gridRowData = action.payload;
		},
		setSelectedFile: (state, action) => {
			console.log(action.payload)
			state.gridSelectedFile = action.payload;
		},
		setAsyncedMarkes: (state, action) => {
			state.asyncedMarkes = action.payload;
		},
		setImageName: (state, action) => {
			state.imageName = action.payload;
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
				state.itemPercentage.percentage =  calculate.toFixed(2);
				state.updatedItemsColor = '#da252b'
			}
			
			
		}
		
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchNotSynced.pending, (state, {payload}) => {
				state.loading = true;
			})
			.addCase(fetchNotSynced.fulfilled, (state,  {payload} ) => {
				console.log('payload')
				console.log(payload)
				const { markes } = payload;
				
				state.notSyncedData = markes;
				state.asyncedMarkes = markes.length;
			})
			.addCase(fetchNotSynced.rejected, (state, { payload }) => {
				state.loading = false;
			})

			//UPDATE NOT SYNCED OBJECTS:
			.addCase(updateNotSynced.pending, (state, {payload}) => {
				state.success = false;
				state.loading = true;
			})
			.addCase(updateNotSynced.fulfilled, (state,  {payload} ) => {
					console.log('payload')
					console.log(payload)
					if(payload.success && payload.updated)  {
						state.asyncedMarkes = payload?.markes.length;
						state.success = true;
					} else {
						state.success = false;
					}
					state.loading = false;
			})
			.addCase(updateNotSynced.rejected, (state, { payload }) => {
				state.loading = false;
			})

			//EDIT GRID ITEM:
			.addCase(editGridItem.pending, (state, {payload}) => {
				state.success = false;
				state.loading = true;
			})
			.addCase(editGridItem.fulfilled, (state,  {payload} ) => {
					console.log('payload edit')
					console.log(payload)
					const {markes} = payload;
					state.editData = markes[0];
					
			})
			.addCase(editGridItem.rejected, (state, { payload }) => {
				state.loading = false;
			})

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


export const {setSelectedId, setGridRowData, setSelectedFile, setAsyncedMarkes, setAction, calculatePercentage, setCalculateId} = gridSlice.actions;
export default gridSlice.reducer;
