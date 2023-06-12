import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify';

const initialState = {
	selectedId: null,
	gridAction: null,
	gridRowData: [],
	gridSelectedFile: null,
	loading: false,
	asyncedMarkes: 0,
	notSyncedData: [],
	success: false,
}


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
			state.gridAction = action.payload;
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
	}
})


export const {setSelectedId, setGridRowData, setSelectedFile, setAsyncedMarkes} = gridSlice.actions;
export default gridSlice.reducer;
