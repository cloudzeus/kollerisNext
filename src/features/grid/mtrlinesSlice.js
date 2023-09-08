import { createSlice} from "@reduxjs/toolkit";

const initialState = [
    {
        MTRL: '',
        QTY1: 0
    }
]



const mtrllinesSlice = createSlice({
	name: 'mtrelines',
	initialState,
	reducers: {
        setMtrLines: (state, action) => {
            state = state + action.payload;


        }
		
		
		
	},
	
})


export const { setGridRowData, resetGridRowData} = mtrllinesSlice.actions;
export default mtrllinesSlice.reducer;
