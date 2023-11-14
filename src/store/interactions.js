import { ethers } from 'ethers'
//import { useSelector, useDispatch } from 'react-redux'

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
    console.log(account)

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
	    //console.log(await token.listings[0].name)
	    const items = []

	    //Fetch listings
	    for(var i = 0; i < count; i++) {
	      const listing = await token.getListing(i+1)
	      //console.log(listing)
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
	    const countHex = await token.listingCount()
	    const count = parseInt(countHex, 10)
	    const items = []

	    //Fetch listings
	    for(var i = 0; i < count; i++) {
	      const rateBig = await token.getCost(i+1)
	      const rate = ethers.utils.formatUnits(rateBig, 'ether')
	      //console.log(rate)
	      items.push(rate)
	    }

		dispatch(setRates(items))

		return items
	} catch(error){
		console.log('Failed to load rates', error)
		return
	}
}