import React, { useEffect } from 'react';
import {} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import Paginate from '../components/Paginate';

const ProductListScreen = ({ match, history }) => {
	const dispatch = useDispatch();
	const pageNumber = match.params.pageNumber || 1;
	const { loading, error, products, pages, page } = useSelector((state) => state.productList);
	const { loading: loadingDelete, error: errorDelete, success: successDelete } = useSelector(
		(state) => state.productDelete
	);
	const { loading: loadingCreate, error: errorCreate, success: successCreate, product } = useSelector(
		(state) => state.productCreate
	);
	// const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		dispatch({ type: PRODUCT_CREATE_RESET });
		if (successCreate) {
			history.push(`/admin/product/${product._id}/edit`);
		} else {
			dispatch(listProducts('', pageNumber));
		}
	}, [dispatch, successDelete, successCreate, history, product, pageNumber]);

	const createProductHandler = () => {
		dispatch(createProduct());
	};
	const deleteHandler = (productId) => {
		if (window.confirm('Are you Sure?')) {
			dispatch(deleteProduct(productId));
		}
	};
	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className='text-right'>
					<Button className='my-3 align-right' onClick={createProductHandler}>
						<i className='fas fa-plus'></i>Create Product
					</Button>
				</Col>
			</Row>
			{loadingCreate && <Loader />}
			{errorCreate && <Message variant='danger'>{errorCreate}</Message>}
			{loadingDelete && <Loader />}
			{errorDelete && <Message variant='danger'>{errorDelete}</Message>}
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					<Paginate pages={pages} page={page} isAdmin='true' />
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>CATEGORY</th>
								<th>BRAND</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr key={product._id}>
									<td>{product._id}</td>
									<td>{product.name}</td>
									<td>{product.price}</td>
									<td>{product.category}</td>
									<td>{product.brand}</td>
									<td>
										<LinkContainer to={`/admin/product/${product._id}/edit`}>
											<Button variant='light' className='btn-sm'>
												<i className='fas fa-edit'></i>
											</Button>
										</LinkContainer>
										<Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
											<i className='fas fa-trash'></i>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</>
			)}
		</>
	);
};

export default ProductListScreen;
