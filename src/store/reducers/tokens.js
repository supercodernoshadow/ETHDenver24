import { createSlice } from '@reduxjs/toolkit'

export const tokens = createSlice({
	name: 'tokens',
	initialState: {
		contracts: [],
		auctionContract: [],
		listings: [],
		rates: [],
		auctionOwners: [],
		auctionPrices: [],
		auctionStartDates: [],
		auctionEndDates: [],
		completedAuctions: [],
	},
	reducers:{
		setContracts: (state, action) => {
			state.contracts = action.payload
		},
		setAuctionContract: (state, action) => {
			state.auctionContract = action.payload
		},
		setListings: (state, action) => {
			state.listings = action.payload
		},
		setRates: (state, action) => {
			state.rates = action.payload
		},
		setAuctionOwners: (state, action) => {
			state.auctionOwners = action.payload
		},
		setAuctionPrices: (state, action) => {
			state.auctionPrices = action.payload
		},
		setAuctionStartDates: (state, action) => {
			state.auctionStartDates = action.payload
		},
		setAuctionEndDates: (state, action) => {
			state.auctionEndDates = action.payload
		},
		setCompletedAuctions: (state, action) => {
			state.completedAuctions = action.payload
		},
	}
})

export const { setContracts, 
		setAuctionContract, 
		setListings, 
		setRates, 
		setAuctionOwners, 
		setAuctionPrices, 
		setAuctionStartDates, 
		setAuctionEndDates,
		setCompletedAuctions } = tokens.actions;

export default tokens.reducer;
