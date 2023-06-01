import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
	selectedId: null,
}



const gridSlice = createSlice({
	name: 'grid',
	initialState,
	reducers: {
		setSelectedId: (state, action) => {
			console.log('action.payload')
			console.log(action.payload)
			state.selectedId = action.payload;
		}


	},
	
})


export const {setSelectedId } = gridSlice.actions;
export default gridSlice.reducer;
