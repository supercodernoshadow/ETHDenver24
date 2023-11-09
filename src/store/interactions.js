import { ethers } from 'ethers'
import { 
	setProvider,
	setNetwork,
	setAccount 
} from './reducers/provider'

import { setContracts } from './reducers/tokens'

import TOKEN_ABI from '../abis/ResToken.json'
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

    return account
}

// Load contracts

export const loadTokens = async (provider, chainId, dispatch) => {
	const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider)

	dispatch(setContracts(token))

}