import React, { Fragment, useEffect, useState } from 'react';
import http from '../services/httpService';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { PayPalButton } from 'react-paypal-button-v2';
import Loader from '../components/Loader';
import CheckoutSteps from '../components/CheckoutSteps';
import { Link } from 'react-router-dom';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import Message from '../components/Message';
import { ORDER_DELIVER_RESET, ORDER_DETAILS_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';

const OrderScreen = ({ history, match }) => {
	const dispatch = useDispatch();
	const orderId = match.params.id;
	const [sdkReady, setSdkReady] = useState(false);
	const { userInfo } = useSelector((state) => state.userLogin);
	const { order, loading, error } = useSelector((state) => state.orderDetails);
	const { loading: loadingPay, success: successPay } = useSelector((state) => state.orderPay);
	const { loading: loadingDeliver, success: successDeliver } = useSelector((state) => state.orderDeliver);

	useEffect(() => {
		const addPayPalScript = async () => {
			const { data: clientId } = await http.get('/api/config/paypal');
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
			script.async = true;
			script.onload = () => setSdkReady(true);
			document.body.appendChild(script);
		};
		if (!order || successPay || successDeliver) {
			dispatch({ type: ORDER_PAY_RESET });
			dispatch({ type: ORDER_DELIVER_RESET });
			dispatch(getOrderDetails(orderId));
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPayPalScript();
			} else {
				setSdkReady(true);
			}
		}
	}, [order, orderId, successPay, successDeliver, dispatch]);

	const successPaymentHandler = (paymentResult) => {
		console.log(paymentResult);
		dispatch(payOrder(orderId, paymentResult));
	};

	const deliverHandler = () => {
		dispatch(deliverOrder(orderId));
	};

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<Fragment>
			<h1>Order {order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroupItem>
							<h2>Shipping</h2>
							<p>
								<strong>Name: </strong> {order.user.name}
							</p>
							<p>
								<a href={`mailto:${order.user.email}`}>
									<strong>Email: </strong> {order.user.email}
								</a>
							</p>
							<p>
								<strong>Address: </strong>
								{order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.postalCode},
								{order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Message variant='success'>Delivered On: {order.deliveredAt}</Message>
							) : (
								<Message variant='danger'>Not Delivered</Message>
							)}
						</ListGroupItem>
						<ListGroupItem>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant='success'>Paid On: {order.paidAt}</Message>
							) : (
								<Message variant='danger'>Not Paid</Message>
							)}
						</ListGroupItem>
						<ListGroupItem>
							<h2>Order Items</h2>
							{order.orderItems.length === 0 ? (
								<Message>Order is Empty</Message>
							) : (
								<ListGroup variant='flush'>
									{order.orderItems.map((item, index) => (
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
									<Col>&#8377;{order.itemsPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Shipping</Col>
									<Col>&#8377;{order.shippingPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Tax</Col>
									<Col>&#8377;{order.taxPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Total</Col>
									<Col>&#8377;{order.totalPrice}</Col>
								</Row>
							</ListGroupItem>
							{!order.isPaid && (
								<ListGroupItem>
									{loadingPay && <Loader />}
									{!sdkReady ? (
										<Loader />
									) : (
										<PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
									)}
								</ListGroupItem>
							)}
							{userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
								<ListGroupItem>
									<Button type='button' className='btn btn-block' onClick={deliverHandler}>
										Mark as Delivered
									</Button>
								</ListGroupItem>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</Fragment>
	);
};

export default OrderScreen;
