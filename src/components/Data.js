import { useSelector } from 'react-redux'
import { ethers } from 'ethers'

import {
  loadListings,
  loadRates
} from '../store/interactions'

const Data = ( { id } ) => {
  	let listings, rates, rate

  	// Fetch listings
  	listings = useSelector(state => state.tokens.listings)
  	//console.log(listings)

	// Fetch listing rates
  	rates = useSelector(state => state.tokens.rates)

	return(

		<div className='my-4 text-center'>
        {listings && rates && (

            <>
              <p><strong>Listing Name: {listings[id]}</strong></p>
              <p>Nightly Rate: {rates[id]} ETH</p>

            </> 
         )}
        </div>
	)

}
export default Data;
