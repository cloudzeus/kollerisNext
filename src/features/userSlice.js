import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	error: null,
	response: {
		success: null,
		error: null,
	},
	isLoading: false,
	isSidebarOpen:true,
}


const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		toggleSidebar: (state) => {
			state.isSidebarOpen = !state.isSidebarOpen;
		},
		closeSidebar: (state) => {
			state.isSidebarOpen = false;
		},
	},
	
})


export const {  toggleSidebar, closeSidebar } = userSlice.actions;
export default userSlice.reducer;



