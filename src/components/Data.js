import { useSelector } from 'react-redux'
import { ethers } from 'ethers'

import {
  loadListings,
  loadRates
} from '../store/interactions'

const Data = () => {
	//console.log('Data')

  	let listings, rates

  	// Fetch listings
  	listings = useSelector(state => state.tokens.listings)
  	//console.log(listings)

	// Fetch listing rates
  	rates = useSelector(state => state.tokens.rates)
  	//console.log(rates)

	return(

		<div className='my-4 text-center'>
            <>
              <p><strong>Listing Name: {listings}</strong></p>
              <p>Nightly Rate: {1e18 * rates} ETH</p>

            </> 
        </div>
	)

}
export default Data;
