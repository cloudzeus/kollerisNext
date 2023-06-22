import { createSlice} from "@reduxjs/toolkit";

const initialState = {
	childListData: [],
	parentCategory: ''
}



const listSlice = createSlice({
	name: 'list',
	initialState,
	reducers: {
		setChildListData: (state, action) => {
			console.log('action.payload')
			console.log(action.payload)
			state.childListData = action.payload.groups;
			state.parentCategory = action.payload.categoryName
		},
		
		
		
	},
	
})


export const {setChildListData} = listSlice .actions;
export default listSlice .reducer;
