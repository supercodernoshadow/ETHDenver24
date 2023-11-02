import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { ethers } from 'ethers'

import villa from '../Villa.png'

// Components
import Navigation from './Navigation';
import Loading from './Loading';

// ABIs: Import your contract ABIs here
import TOKEN_ABI from '../abis/ResToken.json'

// Config: Import your network config here
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const[token, setToken] = useState(null)

  const [account, setAccount] = useState(null)

  const [nightlyRate, setNightlyRate] = useState(0)
  const [balance, setBalance] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    // Initiate token
    const token = new ethers.Contract(config[31337].token.address, TOKEN_ABI, provider)
    setToken(token)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Fetch cost
    setNightlyRate(await token.getCost(1))

    // Fetch account balance
    setBalance(await token.balanceOf(account, 1))

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation account={account} />

      <h1 className='my-4 text-center'>Res.Tech</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Row>
            <Col>
              <img src={villa} alt="" style={{ width: '600px', height: '400px' }}/>
            </Col>
            <Col>
            
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default App;
