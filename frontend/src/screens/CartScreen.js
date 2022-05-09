import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import { Row, Col, ListGroup, ListGroupItem, Image, FormControl, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import Message from '../components/Message';

export default function CartScreen({ match, location, history }) {
	const productId = match.params.id;
	let { qty } = queryString.parse(location.search);
	qty = Number(qty);
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;
	useEffect(() => {
		if (productId) {
			dispatch(addToCart(productId, qty));
		}
	}, [dispatch, productId, qty]);
	const removeFromCartHandler = (id) => {
		dispatch(removeFromCart(id));
	};
	const checkOutHandler = () => {
		console.log('Checking Out');
		history.push('/login?redirect=shipping');
	};
	return (
		<Row>
			<Col md={9}>
				<h1>Shopping Cart</h1>
				{cartItems.length === 0 ? (
					<Message variant='primary'>
						Your Cart is Empty <Link to='/'> Go Back</Link>
					</Message>
				) : (
					<ListGroup variant='flush'>
						{cartItems.map((item) => (
							<ListGroupItem key={item.product}>
								<Row>
									<Col md={2}>
										<Image src={item.image} alt={item.name} fluid rounded />
									</Col>
									<Col md={3}>
										<Link to={`/product/${item.product}`}>{item.name}</Link>
									</Col>
									<Col md={2}>Price: {item.price}</Col>
									<Col md={2}>
										<FormControl
											as='select'
											value={item.qty}
											onChange={(e) => dispatch(addToCart(item.product, e.target.value))}>
											{[...Array(item.countInStock).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</FormControl>
									</Col>
									<Col md={2}>
										<Button type='button' variant='light' onClick={() => removeFromCartHandler(item.product)}>
											<i className='fas fa-trash'></i>
										</Button>
									</Col>
								</Row>
							</ListGroupItem>
						))}
					</ListGroup>
				)}
			</Col>
			<Col md={3}>
				<Card>
					<ListGroup variant='flush'>
						<ListGroupItem>
							<h2>Sub Total ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}) items</h2>
							<h3>
								&#8377;
								{cartItems.reduce((acc, item) => acc + Number(item.qty) * Number(item.price), 0).toFixed(2)}
							</h3>
						</ListGroupItem>
						<ListGroupItem>
							<Button onClick={checkOutHandler} className='btn-block' disabled={cartItems.length === 0}>
								Procced To Checkout
							</Button>
						</ListGroupItem>
					</ListGroup>
				</Card>
			</Col>
			<Col md={9}>
				<Link to='/' className='d-block text-center'>
					Add More Items
				</Link>
			</Col>
		</Row>
	);
}
