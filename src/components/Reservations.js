import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import villa from '../Villa.png'
import balcony from '../Balcony.png'
import { Container, Row, Col } from 'react-bootstrap'

import Data from './Data';
import ResAuction from './ResAuction';

const Reservations = () => {

	return(
        <>
          <Row>
            <Col>
              <img src={villa} alt="" style={{ width: '600px', height: '400px', marginBottom: '20px' }}/>
              <img src={balcony} alt="" style={{ width: '600px', height: '400px' }}/>
            </Col>
            <Col>
            	<ResAuction
            		id={'0'}
            	/>
       
            </Col>
          </Row>
        </>
	)
}

export default Reservations;
