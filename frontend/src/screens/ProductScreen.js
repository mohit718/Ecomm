import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Button, Card, Col, Form, FormControl, Image, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Rating from '../components/Rating';
import { listProductDetails, reviewProduct } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

export default function ProductScreen({ match, history }) {
	const productId = match.params.id;
	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');

	const dispatch = useDispatch();
	const { loading, error, product } = useSelector((state) => state.productDetails);
	const { loading: loadingReview, error: errorReview, success: successReview } = useSelector(
		(state) => state.productCreateReview
	);
	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		if (successReview) {
			alert('Review Submitted');
			setRating(0);
			setComment('');
			dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
		}
		dispatch(listProductDetails(match.params.id));
	}, [dispatch, match, successReview]);

	const addToCartHandler = () => {
		history.push(`/cart/${match.params.id}?qty=${qty}`);
	};
	const reviewHandler = (e) => {
		e.preventDefault();
		dispatch(
			reviewProduct(productId, {
				rating,
				comment
			})
		);
	};

	return (
		<Fragment>
			<Link className='btn btn-light m-3' to='/'>
				Go Back
			</Link>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					<Row>
						<Col md='6'>
							<Image src={product.image} alt={product.name} fluid />
						</Col>
						<Col md='3'>
							<ListGroup variant='flush'>
								<ListGroupItem>
									<h2>{product.name}</h2>
								</ListGroupItem>
								<ListGroupItem>
									<Rating value={product.rating} text={`${product.numReviews} reviews`}></Rating>
								</ListGroupItem>
								<ListGroupItem>
									<h3>Price: &#8377; {product.price}</h3>
								</ListGroupItem>
								<ListGroupItem>
									<p>Description: {product.description}</p>
								</ListGroupItem>
							</ListGroup>
						</Col>
						<Col md='3'>
							<Card>
								<ListGroup variant='flush'>
									<ListGroupItem>
										<Row>
											<Col>Price:</Col>
											<Col>
												<strong>{product.price}</strong>
											</Col>
										</Row>
									</ListGroupItem>
									<ListGroupItem>
										<Row>
											<Col>Status:</Col>
											<Col>
												<strong>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</strong>
											</Col>
										</Row>
									</ListGroupItem>
									{product.countInStock > 0 && (
										<ListGroupItem>
											<Row>
												<Col>Qty:</Col>
												<Col>
													<FormControl as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
														{[...Array(product.countInStock).keys()].map((x) => (
															<option key={x + 1} value={x + 1}>
																{x + 1}
															</option>
														))}
													</FormControl>
												</Col>
											</Row>
										</ListGroupItem>
									)}
									<ListGroupItem>
										<Button className='btn-block' disabled={product.countInStock < 1} onClick={addToCartHandler}>
											Add To Cart
										</Button>
									</ListGroupItem>
								</ListGroup>
							</Card>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							<h2>Reviews</h2>
							{product.reviews.length === 0 && <Message>No Reviews</Message>}
							<ListGroup variant='flush'>
								{product.reviews.map((review) => (
									<ListGroupItem key={review._id}>
										<strong>{review.name}</strong>
										<Rating value={review.rating} />
										<p>{review.createdAt.substring(0, 10)}</p>
										<p>{review.comment}</p>
									</ListGroupItem>
								))}
								<ListGroupItem>
									<h2>Write your review</h2>
									{errorReview && <Message variant='danger'>{errorReview}</Message>}
									{userInfo ? (
										<Form onSubmit={reviewHandler}>
											<Form.Group controlId='rating'>
												<Form.Label>Rating</Form.Label>
												<Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
													<option value=''>Select...</option>
													<option value='1'>1-Poor</option>
													<option value='2'>2-Fair</option>
													<option value='3'>3-Good</option>
													<option value='4'>4-Very Good</option>
													<option value='5'>5-Excelent</option>
												</Form.Control>
											</Form.Group>
											<Form.Group controlId='comment'>
												<Form.Label>Comment</Form.Label>
												<Form.Control
													as='textarea'
													row='3'
													value={comment}
													onChange={(e) => setComment(e.target.value)}
												/>
											</Form.Group>
											<Button type='submit' variant='primary'>
												Submit
											</Button>
										</Form>
									) : (
										<Message>
											Please <Link to='/login'>SignIn</Link> to write a review.
										</Message>
									)}
								</ListGroupItem>
							</ListGroup>
						</Col>
					</Row>
				</>
			)}
		</Fragment>
	);
}
