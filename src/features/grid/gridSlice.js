import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from 'react-toastify'
const initialState = {
	selectedId: null,
	gridAction: null,
	gridRowData: [],
	gridSelectedFile: null,
	loading: false,
	asyncedMarkes: 0,
	notSyncedData: [],
}


export const fetchNotSynced = createAsyncThunk(
	//action:
	'grid/fetchNotSynced',
	async (grid, thunkApi) => {
		console.log('fsefsefsfsfesfsf')
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
			console.log('ressssssssss')
			console.log(res)
			if(!res.data.success) {
				toast.error('Αποτυχία Συγχρονισμού');
			}
			if(res) {
				const resp = await axios.post('/api/admin/markes/markes', { action: 'sync' })
				return {length: resp.data.markes.length};
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

				const { markes } = payload;
				console.log('-------------------- MARKES -------------------')
				console.log(markes)
				state.notSyncedData = markes;
				state.asyncedMarkes = markes.length;
			})
			.addCase(fetchNotSynced.rejected, (state, { payload }) => {
				state.loading = false;
			})

			//FetchNotSynced
			.addCase(updateNotSynced.pending, (state, {payload}) => {
				state.loading = true;
			})
			.addCase(updateNotSynced.fulfilled, (state,  {payload} ) => {
					state.asyncedMarkes = payload.length;
					state.loading = false;
			})
			.addCase(updateNotSynced.rejected, (state, { payload }) => {
				state.loading = false;
			})
	}
})


export const {setSelectedId, setGridRowData, setSelectedFile, setAsyncedMarkes} = gridSlice.actions;
export default gridSlice.reducer;
