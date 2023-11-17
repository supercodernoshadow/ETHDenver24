import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import villa from '../Villa.png'
import balcony from '../Balcony.png'
import { Container, Row, Col } from 'react-bootstrap'

import Data from './Data';
import Mint from './Mint';

const Listings = () => {

	return(
        <>
          <Row>
            <Col>
              <img src={villa} alt="" style={{ width: '600px', height: '400px', marginBottom: '20px' }}/>
              
              <img src={balcony} alt="" style={{ width: '600px', height: '400px' }}/>
            </Col>
            <Col>
              <Data
              	id={'0'}
              />
              <Mint
              	id={'0'}
              />
              <div style={{ marginBottom: '100px'}}></div>
              <Data
              	id={'1'}
              />
              <Mint
              	id={'1'}
              />
            </Col>
          </Row>
        </>

	)
}

export default Listings;
