import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { ethers } from 'ethers'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import {
  loadListings,
  loadAuctionOwners
} from '../store/interactions'



const ResAuction = ( { id } ) => {
    const [isWaiting, setIsWaiting] = useState(false);
    const [completedAuctions, setCompletedAuctions] = useState(new Set());


  	let listings, auctionOwners, owner, auction, auctionPrices, auctionStartDates, auctionEndDates, allCompletedAuctions

    // Fetch providor
    const provider = useSelector(state => state.provider.connection)
    const auctionContract = useSelector(state => state.tokens.auctionContract)

  	// Fetch listings
  	listings = useSelector(state => state.tokens.listings)

    // Fetch auction data
    auctionOwners = useSelector(state => state.tokens.auctionOwners)
    //console.log(auctionOwners)
    owner = auctionOwners[0]
    auctionPrices = useSelector(state => state.tokens.auctionPrices)
    //console.log(auctionPrices)
    auctionStartDates = useSelector(state => state.tokens.auctionStartDates)
    auctionEndDates = useSelector(state => state.tokens.auctionEndDates)
    allCompletedAuctions = useSelector(state => state.tokens.completedAuctions)
    //console.log(allCompletedAuctions[0])

    // Fetch auction status
    //const idHex = allCompletedAuctions[0].args.id
    //const id = parseInt(idHex, 10)

    const deploymentDate = new Date('2023-01-01');

    const formatDate = (daysSinceDeployment) => {
      // Calculate the date by adding days to the deployment date
      const date = new Date(deploymentDate.getTime());
      date.setDate(date.getDate() + daysSinceDeployment);

      // Format the date
      return date.toLocaleDateString("en-US");
    };

    const buyResHandler = async (e) => {
        e.preventDefault();
        setIsWaiting(true);

        try {
          const signer = await provider.getSigner();
          const transaction = await auctionContract.connect(signer).buyRes(
            1,
            { value: ethers.utils.parseUnits(auctionPrices[0].toString(), 'ether') }
          );
          await transaction.wait();
        } catch (error) {
          window.alert('Transaction failed: ' + error.message);
        } finally {
          setIsWaiting(false);
        }
    }


	return(

		<div className='my-4 text-center'>

            <>
              <p><strong>Active Auctions: {listings[id]}</strong></p>

              <Row>
                {owner && (
                  <Col>
                    <p>Owner: {owner.slice(0, 5) + '...' + owner.slice(38, 42)}</p>
                  </Col>
                )}
                <Col>
                  <p>Price: {auctionPrices} ETH</p>
                </Col>
              </Row>
              <Row>
                <p>Dates: {auctionStartDates.map(formatDate).join(', ')} to {auctionEndDates.map(formatDate).join(', ')}</p>
              </Row>
                  <Form onSubmit={buyResHandler} style={{ maxWidth: '450px', margin: '50px auto' }}>
                    {isWaiting ? (
                      <Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
                    ) : (
                    <>
                      {!allCompletedAuctions[0]&& (
                        <Button variant="primary" type="submit" style={{ width: '100%' }}>
                          Buy Auctioned Token
                        </Button>
                      )}
                    </>
                    )}
                  </Form>
            </> 
        </div>
	)

}
export default ResAuction;
