import { ethers } from 'ethers'
import { useSelector, useDispatch } from 'react-redux'

import { 
	setProvider,
	setNetwork,
	setAccount 
} from './reducers/provider'

import { 
	setContracts,
	setListings,
	setRates
} from './reducers/tokens'

import TOKEN_ABI from '../abis/ResToken.json'
import config from '../config.json';


export const loadProvider = (dispatch) => {
	// Load provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    dispatch(setProvider(provider))
	return provider
}

export const loadNetwork = async (provider, dispatch) => {
	// Load network
	const { chainId } = await provider.getNetwork()
	dispatch(setNetwork(chainId))

	return chainId
}

export const loadAccount = async (provider, dispatch) => {
	// Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    dispatch(setAccount(account))

    return account
}

// Load contracts

export const loadTokens = async (provider, chainId, dispatch) => {
	
	try{
		const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider)

		dispatch(setContracts(token))

		return token
	} catch (error){
		console.log('Failed to load tokens', error)
      	//alert('Failed to approve. Please check the console for more details.')
      	return
	}
}

export const loadListings = async (provider, chainId, dispatch, token) => {
	try{
		// Fetch listing count
	    const countHex = await token.listingCount()
	    const count = parseInt(countHex, 10)
	    //console.log(count)
	    const items = []

	    //Fetch listings
	    for(var i = 0; i < count; i++) {
	      const listing = await token.listings(i+1)
	      items.push(listing)
	    }

		dispatch(setListings(items))

		return items

	} catch(error){
		console.log('Failed to load listings', error)
		return
	}
}

export const loadRates = async (provider, chainId, dispatch, token) => {
	try{

		// Fetch listing count
	    const count = await token.listingCount()
	    //console.log('aaa')
	    const items = []

	    //Fetch listings
	    for(var i = 0; i < count; i++) {
	      const rate = await token.getCost(i+1)
	      items.push(rate)
	    }

		dispatch(setRates(items))

		return items
	} catch(error){
		console.log('Failed to load rates', error)
		return
	}
}