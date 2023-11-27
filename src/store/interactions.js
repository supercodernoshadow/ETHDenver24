import { ethers } from 'ethers'
//import { useSelector, useDispatch } from 'react-redux'

import { 
	setProvider,
	setNetwork,
	setAccount 
} from './reducers/provider'

import { 
	setContracts,
	setAuctionContract,
	setListings,
	setRates,
	setAuctionOwners,
	setAuctionPrices,
	setAuctionStartDates,
	setAuctionEndDates,
	setCompletedAuctions
} from './reducers/tokens'

import TOKEN_ABI from '../abis/ResToken.json'
import AUCTION_ABI from '../abis/Auction.json'
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

export const loadAuctionContract = async (provider, chainId, dispatch) => {
    try {
        const auction = new ethers.Contract(config[chainId].auction.address, AUCTION_ABI, provider);

        // Dispatch the loaded auction contract to the Redux store
        dispatch(setAuctionContract(auction));

        return auction;
    } catch (error) {
        console.log('Failed to load auction contract', error);
        return;
    }
};


export const loadListings = async (provider, chainId, dispatch, token) => {
	try{
		// Fetch listing count
	    const countHex = await token.listingCount()
	    const count = parseInt(countHex, 10)
	    //console.log(count)
	    //console.log(await token.listings[0].name)
	    const items = []

	    //Fetch listings
	    for(var i = 0; i < count; i++) {
	      const listing = await token.getListing(i+1)
	      //console.log({listing})
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
	      const weiRate = ethers.utils.formatUnits(rateBig, 'ether')
	      const ethRate = weiRate * 1e18
	      //console.log(ethRate)
	      items.push(ethRate)
	    }

		dispatch(setRates(items))

		return items
	} catch(error){
		console.log('Failed to load rates', error)
		return
	}
}

export const loadAuctionOwners = async (provider, chainId, dispatch, token, auction) => {
	try{

		// Fetch reservation count
	    const countHex = await token.tokenId()
	    const count = parseInt(countHex, 10)
	    const items = []

	    //Fetch auctions
	    for(var i = 0; i < count; i++) {
          const auctionDetails = await auction.getAuctionOwner(i + 1);
          //console.log(auctionDetails)

		  if (auctionDetails != null) { 
		    items.push(auctionDetails);
	        //console.log({items})
	      }
	    }
		dispatch(setAuctionOwners(items))

		return items
	} catch(error){
		console.log('Failed to load auction owners', error)
		return
	}
}

export const loadAuctionPrices = async (provider, chainId, dispatch, token, auction) => {
	try{

		// Fetch reservation count
	    const countHex = await token.tokenId()
	    const count = parseInt(countHex, 10)
	    const items = []

	    //Fetch auctions
	    for(var i = 0; i < count; i++) {
          const auctionDetails = await auction.getAuctionPrice(i + 1);

		  // Format price
	      const weiRate = ethers.utils.formatUnits(auctionDetails, 'ether')
	      const ethRate = weiRate 
          //console.log(ethRate)

		  if (auctionDetails != null) { 
		    items.push(ethRate);
	        //console.log({items})
	      }
	    }
		dispatch(setAuctionPrices(items))

		return items
	} catch(error){
		console.log('Failed to load auction prices', error)
		return
	}
}

export const loadAuctionStartDates = async (provider, chainId, dispatch, token, auction) => {
	try{

		// Fetch reservation count
	    const countHex = await token.tokenId()
	    const count = parseInt(countHex, 10)
	    const items = []

	    //Fetch auctions
	    for(var i = 0; i < count; i++) {
          const auctionDetails = await auction.getAuctionStart(i + 1);
          //console.log(auctionDetails)

	      // Formate dates
	      const start = parseInt(auctionDetails, 10)
	      //const end = parseInt(auctionDetails[3], 10)
	      //console.log(start)

		  if (auctionDetails != null) { 
		    items.push(start);
	        //console.log({items})
	      }
	    }
		dispatch(setAuctionStartDates(items))

		return items
	} catch(error){
		console.log('Failed to load auction start dates', error)
		return
	}
}

export const loadAuctionEndDates = async (provider, chainId, dispatch, token, auction) => {
	try{

		// Fetch reservation count
	    const countHex = await token.tokenId()
	    const count = parseInt(countHex, 10)
	    const items = []

	    //Fetch auctions
	    for(var i = 0; i < count; i++) {
          const auctionDetails = await auction.getAuctionEnd(i + 1);
          //console.log(auctionDetails)
          
	      // Formate dates
	      const end = parseInt(auctionDetails, 10)
	      //console.log(end)

		  if (auctionDetails != null) { 
		    items.push(end);
	        //console.log({items})
	      }
	    }
		dispatch(setAuctionEndDates(items))

		return items
	} catch(error){
		console.log('Failed to load auction end dates', error)
		return
	}
}

// ------------------------------------------------------------------------------
// LOAD ALL COMPLETED AUCTIONS

export const loadAllCompletedAuctions = async (provider, dispatch, auction) => {
  const block = await provider.getBlockNumber()

  const auctionCompletedStream = await auction.queryFilter('auctionCompleted', 0, block)
  const completedAuctions = auctionCompletedStream.map(event => {
    return { hash: event.transactionHash, args: event.args }
  })
   //const idHex = completedAuctions[0].args.id
   //const id = parseInt(idHex, 10)
   //console.log(id)
  dispatch(setCompletedAuctions(completedAuctions))
}
