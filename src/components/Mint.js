import { useSelector } from 'react-redux'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers'

//import { loadProvider, loadTokens, loadRates } from '../store/interactions'


const Mint = ( { id } ) => {

  	const provider = useSelector(state => state.provider.connection)
  	const token = useSelector(state => state.tokens.contracts)
  	console.log(token)
  	const rates = useSelector(state => state.tokens.rates)

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
	const [isWaiting, setIsWaiting] = useState(false)

	const deploymentDate = new Date('2023-01-01')

    const getNightsFromDeployment = (date) => {
        const selectedDate = new Date(date);
        return Math.floor((selectedDate - deploymentDate) / (1000 * 60 * 60 * 24));
    }

	const mintHandler = async (e) => {
		e.preventDefault()
		setIsWaiting(true)

		const startNight = getNightsFromDeployment(startDate);
        const endNight = getNightsFromDeployment(endDate);

		try{
		  const signer = await provider.getSigner()
		  const transaction = await token.connect(signer).reserve(id, 
		  	startNight, 
		  	endNight, 
		  	{ value: ethers.utils.parseUnits((rates[1] * (endNight - startNight)).toString(), 'ether') } 
		  	)
		  await transaction.wait()
		} catch(e) {
		  console.error('User rejected or transaction reverted', e)
		}
		setIsWaiting(false)

	}
	return(
		<Form onSubmit={mintHandler} style={{maxWidth: '450px', margin: '50px auto'}}>
		  {isWaiting ? (

		  	<Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
		  ) : (
		  <>
			<Form.Group className="mb-3">
			    <Form.Label htmlFor="startDate">Start Date</Form.Label>
			    <Form.Control type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
			</Form.Group>
			<Form.Group className="mb-3">
			    <Form.Label htmlFor="endDate">End Date</Form.Label>
			    <Form.Control type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
			</Form.Group>


			<Form.Group>
				<Button variant="primary" type="submit" style={{ width: '100%'}}>
					Reserve
				</Button>
			</Form.Group>
		  </>
		  )}
		</Form>
	)
}

export default Mint;
