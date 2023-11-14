import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from "react-router-bootstrap"


const Tabs = () => {

	return(
		<Nav variant="pills" defaultActiveKey='/' className='justify-content-center my-4'>
			<LinkContainer to='/'>
				<Nav.Link>Listings</Nav.Link>
			</LinkContainer>
			<LinkContainer to='/reservations'>
				<Nav.Link>Reservations</Nav.Link>
			</LinkContainer>
		</Nav>

	)
}

export default Tabs;