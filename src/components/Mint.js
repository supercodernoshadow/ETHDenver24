import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { ethers } from 'ethers'


const Mint = ({ provider, token, nightlyRate, setIsLoading }) => {
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
		  const transaction = await token.connect(signer).reserve(1, 
		  	startNight, 
		  	endNight, 
		  	{ value: ethers.utils.parseUnits((nightlyRate * (endNight - startNight)).toString(), 'ether') } 
		  	)
		  await transaction.wait()
		} catch {
		  window.alert('User rejected or transaction reverted')
		}

		setIsLoading(true)
		//setIsWaiting(false)

	}
	return(
		<Form onSubmit={mintHandler} style={{maxWidth: '450px', margin: '50px auto'}}>
		  {isWaiting ? (

		  	<Spinner animation="border" style={{ display: 'block', margin: '0 auto' }} />
		  ) : (
		  <>
			<Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
				<Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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