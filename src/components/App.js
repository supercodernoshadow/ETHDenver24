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
  loadTokens,
  loadListings,
  loadRates
} from '../store/interactions'


function App() {
  let provider, token, rate, listings

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    // Initiate provider
    provider = await loadProvider(dispatch)

    // Fetch network chain id
    const chainId = await loadNetwork(provider, dispatch)

    // Reload page when network changes
    window.ethereum.on('chainChanged', async () => {
      window.location.reload()
    })

    // Fetch accounts
    window.ethereum.on('accountsChanged', async () => {
      await loadAccount(provider, dispatch)
    })

    // Initiate Contracts
    token = await loadTokens(provider, chainId, dispatch)

    // Load listings
    listings = await loadListings(provider, chainId, dispatch, token)
    //console.log(listings)

    // Load rates

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
              <Data/>
              <Mint/>
            </Col>
          </Row>
        </>
    </Container>
  )
}

export default App;
