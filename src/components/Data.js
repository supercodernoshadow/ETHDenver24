import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'

import config from '../config.json'

import
{
	loadProvider,
	loadNetwork,
	loadListings,
	loadRates
} from '../store/interactions'

const Data = () => {
	//console.log('Data')

  	let provider, token, listings, rates

    // Fetch dispatch
  	const dispatch = useDispatch()

    // Initiate provider
  	provider = useSelector(state => state.provider)

    // Fetch network chain id
  	const chainId = useSelector(state => state.chainId)

  	// Fetch listings
  	listings = useSelector(state => state.listings)

	// Fetch listing rates
  	rates = useSelector(state => state.rates)

	return(

		<div className='my-4 text-center'>
            {listings && (
            <>
              <p><strong>Listing Name: {listings[0]}</strong></p>
              <p>Nightly Rate: {ethers.utils.formatUnits(rates, 0)} ETH</p>

            </> 
            )}     
        </div>
	)
}

export default Data;
