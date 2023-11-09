import { ethers } from 'ethers'

const Data = ({ listing, nightlyRate }) => {
	return(

		<div className='my-4 text-center'>
            {listing && listing.length > 0 && (
            <>
              <p><strong>Listing Name: {listing.name}</strong></p>
              <p>Nightly Rate: {ethers.utils.formatUnits(nightlyRate, 0)} ETH</p>

            </> 
            )}     
        </div>
	)
}

export default Data;
