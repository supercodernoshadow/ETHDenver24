import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from 'ethers'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import villa from '../Villa.png'

// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Data from './Data';
import Mint from './Mint';
import Listings from './Listings';
import Reservations from './Reservations';

import {
  loadProvider,
  loadNetwork,
  loadTokens,
  loadListings,
  loadRates
} from '../store/interactions'

function App() {
  let provider, token, listings, rates

  const dispatch = useDispatch()

  const loadBlockchainData = useCallback(async () => {
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
      //await loadAccount(provider, dispatch)
    })

    // Initiate Contracts
    token = await loadTokens(provider, chainId, dispatch)

    // Load listings
    listings = await loadListings(provider, chainId, dispatch, token)
    //console.log(listings)

    // Load rates
    rates = await loadRates(provider, chainId, dispatch, token)

  }, [dispatch]);

  useEffect(() => {
      loadBlockchainData()
  }, [loadBlockchainData]);

  return(
    <Container>

      <HashRouter>
        <Navigation/>

        <hr />

        <Tabs />

        <Routes>
          <Route exact path="/" element={<Listings />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>  

      </HashRouter>


    </Container>
  )
}

export default App;
