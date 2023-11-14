import { createSlice } from '@reduxjs/toolkit'

export const tokens = createSlice({
	name: 'tokens',
	initialState: {
		contracts: [],
		listings: [],
		//rates: []
	},
	reducers:{
		setContracts: (state, action) => {
			state.contracts = action.payload
		},
		setListings: (state, action) => {
			state.listings = action.payload
		},
		setRates: (state, action) => {
			state.rates = action.payload
		},
	}
})

export const { setContracts, setListings, setRates } = tokens.actions;

export default tokens.reducer;