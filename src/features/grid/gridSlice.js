import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
	notFoundData: [],
}


export const findSoftoneAndSyncTables = createAsyncThunk(
	//action:
	'grid/findSoftoneAndSyncTables',
	async (grid, thunkApi) => {
		try {
			const resp = await axios.post('/api/admin/markes/markes', { action: 'findExtraSoftone' })
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
		console.log('whysssss')
		try {
			console.log('why')
			const resp = await axios.post('/api/admin/markes/markes', { action: 'sync' })
			console.log('--------------- REDUX FETCH UNYNCED MARKES -----------------')
		console.log()
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
					state.notFoundData = payload.result;
					
			})
			.addCase(findSoftoneAndSyncTables.rejected, (state, { payload }) => {
				state.loading = false;
			})
	}
})


export const {setSelectedId, setGridRowData, setSelectedFile, setAsyncedMarkes, setAction} = gridSlice.actions;
export default gridSlice.reducer;
