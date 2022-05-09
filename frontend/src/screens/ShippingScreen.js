import React, { useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';

function ShippingScreen({ history }) {
	const { shippingAddress } = useSelector((state) => state.cart);
	const [address, setAddress] = useState(shippingAddress.address);
	const [city, setCity] = useState(shippingAddress.city);
	const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
	const [country, setCountry] = useState(shippingAddress.country);

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(saveShippingAddress({ address, city, postalCode, country }));
		history.push('/payment');
	};

	return (
		<FormContainer>
			<CheckoutSteps step1 step2></CheckoutSteps>
			<h1>SHIPPING</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group controlId='address'>
					<Form.Label>Address</Form.Label>
					<FormControl
						type='address'
						placeholder='Address'
						value={address}
						required
						onChange={(e) => setAddress(e.target.value)}></FormControl>
				</Form.Group>
				<Form.Group controlId='city'>
					<Form.Label>City</Form.Label>
					<FormControl
						type='city'
						placeholder='City'
						value={city}
						required
						onChange={(e) => setCity(e.target.value)}></FormControl>
				</Form.Group>
				<Form.Group controlId='postalCode'>
					<Form.Label>Postal Code</Form.Label>
					<FormControl
						type='postalCode'
						placeholder='Postal Code'
						value={postalCode}
						required
						onChange={(e) => setPostalCode(e.target.value)}></FormControl>
				</Form.Group>
				<Form.Group controlId='country'>
					<Form.Label>Country</Form.Label>
					<FormControl
						type='country'
						placeholder='Country'
						value={country}
						required
						onChange={(e) => setCountry(e.target.value)}></FormControl>
				</Form.Group>
				<Button type='submit' variant='primary'>
					Continue
				</Button>
			</Form>
		</FormContainer>
	);
}

export default ShippingScreen;
