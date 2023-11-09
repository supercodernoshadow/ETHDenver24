import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from 'ethers'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import villa from '../Villa.png'

// Components
import Navigation from './Navigation';
import Loading from './Loading';
import Data from './Data'
import Mint from './Mint';

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens
} from '../store/interactions'


function App() {
  let provider, token, rate

  const[listing, setListings] = useState([])

  const [nightlyRate, setNightlyRate] = useState(0)

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    // Initiate provider
    provider = await loadProvider(dispatch)

    const chainId = await loadNetwork(provider, dispatch)

    // Fetch accounts
    //await loadAccount(provider, dispatch)

    // Initiate Contracts
    await loadTokens(provider, chainId, dispatch)

    // Fetch cost
    setNightlyRate(await token.getCost(1))

    // Fetch listing count
    const count = await token.listingCount()
    const items = []

    //Fetch listings
    for(var i = 0; i < count; i++) {
      const listing = await token.listings(i+1)
      items.push(listing)
    }

    setListings(items)

  }

  useEffect(() => {
      loadBlockchainData()
  }, []);

  return(
    <Container>
      <Navigation/>

      <h1 className='my-4 text-center'>Res.Tech</h1>

        <>
          <Row>
            <Col>
              <img src={villa} alt="" style={{ width: '600px', height: '400px' }}/>
            </Col>
            <Col>
              <Data 
                listing={listing[0]}
                nightlyRate={nightlyRate}
              />

              <Mint
                provider={provider}
                token={token}
                nightlyRate={nightlyRate}
              />
            </Col>
          </Row>
        </>
    </Container>
  )
}

export default App;
