import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';

const PlaceOrderScreen = ({ history }) => {
	const { cartItems, paymentMethod, shippingAddress } = useSelector((state) => state.cart);
	const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
	const shippingPrice = itemsPrice > 500 ? 0 : 500;
	const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
	const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
	const dispatch = useDispatch();

	const { order, success, error } = useSelector((state) => state.orderCreate);

	useEffect(() => {
		if (success) {
			history.push(`/order/${order._id}`);
		}
	}, [history, success]);

	const placeOrderHandler = () => {
		console.log('Placing Order');
		dispatch(
			createOrder({
				orderItems: cartItems,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				shippingPrice,
				taxPrice,
				totalPrice
			})
		);
	};
	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroupItem>
							<h2>Shipping</h2>
							<p>
								<strong>Address: </strong>
								{shippingAddress.address},{shippingAddress.city},{shippingAddress.postalCode},{shippingAddress.country}
							</p>
						</ListGroupItem>
						<ListGroupItem>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{paymentMethod}
							</p>
						</ListGroupItem>
						<ListGroupItem>
							<h2>Order Items</h2>
							{cartItems.length === 0 ? (
								<Message>Your Cart is Empty</Message>
							) : (
								<ListGroup variant='flush'>
									{cartItems.map((item, index) => (
										<ListGroupItem key={index}>
											<Row>
												<Col md={1}>
													<Image src={item.image} alt={item.name} fluid rounded />
												</Col>
												<Col>
													<Link to={`/products/${item.product}`}>{item.name}</Link>
												</Col>
												<Col md={4}>
													{item.qty} x {item.price} = &#8377;{Number(item.qty) * Number(item.price)}
												</Col>
											</Row>
										</ListGroupItem>
									))}
								</ListGroup>
							)}
						</ListGroupItem>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup>
							<ListGroupItem>
								<h2>Order Summary</h2>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Items</Col>
									<Col>&#8377;{itemsPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Shipping</Col>
									<Col>&#8377;{shippingPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Tax</Col>
									<Col>&#8377;{taxPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Total</Col>
									<Col>&#8377;{totalPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>{error && <Message variant='danger'>{error}</Message>}</ListGroupItem>
							<ListGroupItem>
								<Button onClick={placeOrderHandler} className='btn btn-block' disabled={cartItems === 0}>
									Place Order
								</Button>
							</ListGroupItem>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default PlaceOrderScreen;
