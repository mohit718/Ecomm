import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import queryString from 'query-string';
import { listProductDetails, updateProduct } from '../actions/productActions';
import GoBack from '../components/GoBack';
import http from '../services/httpService';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

function ProductEditScreen({ match, history }) {
	const productId = match.params.id;

	const [name, setName] = useState('');
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState('');
	const [brand, setBrand] = useState('');
	const [category, setCategory] = useState('');
	const [countInStock, setCountInStock] = useState(0);
	const [description, setDescription] = useState('');
	const [uploading, setUploading] = useState(false);

	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.userLogin);
	const { loading, error, product } = useSelector((state) => state.productDetails);
	const { loading: loadingUpdate, error: errorUpdate, success: successUpdate, product: updatedProduct } = useSelector(
		(state) => state.productUpdate
	);

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET });
			history.push('/admin/productlist');
		} else {
			if (!product || !product.name || product._id !== productId) {
				dispatch(listProductDetails(productId));
			} else {
				setName(product.name);
				setPrice(product.price);
				setImage(product.image);
				setBrand(product.brand);
				setCategory(product.category);
				setCountInStock(product.countInStock);
				setDescription(product.description);
			}
		}
	}, [dispatch, productId, product, successUpdate, history]);

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0];
		console.log(file);
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${userInfo.token}`,
					'Content-Type': 'multipart/form-data'
				}
			};
			const { data } = await http.post('/api/upload', formData, config);
			setImage(data);
			setUploading(false);
		} catch (err) {
			console.error(err);
			setUploading(false);
		}
	};

	const sumbitHandler = (e) => {
		e.preventDefault();
		dispatch(updateProduct({ _id: productId, name, price, brand, image, category, countInStock, description }));
	};

	return (
		<>
			<GoBack to='/admin/productlist' />
			<FormContainer>
				<h1>Edit Product</h1>
				{loadingUpdate && <Loader />}
				{errorUpdate && <Message variant='danger'>{error}</Message>}
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<Form onSubmit={sumbitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<FormControl
								type='text'
								placeholder='Name'
								value={name}
								onChange={(e) => setName(e.target.value)}></FormControl>
						</Form.Group>
						<Form.Group controlId='price'>
							<Form.Label>Price</Form.Label>
							<FormControl
								type='number'
								placeholder='Price'
								value={price}
								onChange={(e) => setPrice(e.target.value)}></FormControl>
						</Form.Group>
						<Form.Group controlId='image'>
							<Form.Label>Image</Form.Label>
							<FormControl
								type='text'
								placeholder='Image'
								value={image}
								onChange={(e) => setImage(e.target.value)}></FormControl>
							<Form.File id='image-file' label='Choose File' custom onChange={uploadFileHandler}></Form.File>
							{uploading && <Loader />}
						</Form.Group>
						<Form.Group controlId='category'>
							<Form.Label>Category</Form.Label>
							<FormControl
								type='text'
								placeholder='Category'
								value={category}
								onChange={(e) => setCategory(e.target.value)}></FormControl>
						</Form.Group>
						<Form.Group controlId='countInStock'>
							<Form.Label>Stock</Form.Label>
							<FormControl
								type='number'
								placeholder='Stock'
								value={countInStock}
								onChange={(e) => setCountInStock(e.target.value)}></FormControl>
						</Form.Group>
						<Form.Group controlId='brand'>
							<Form.Label>Brand</Form.Label>
							<FormControl
								type='text'
								placeholder='Brand'
								value={brand}
								onChange={(e) => setBrand(e.target.value)}></FormControl>
						</Form.Group>
						<Form.Group controlId='description'>
							<Form.Label>Description</Form.Label>
							<FormControl
								type='text'
								placeholder='Description'
								value={description}
								onChange={(e) => setDescription(e.target.value)}></FormControl>
						</Form.Group>

						<Button type='submit' variant='primary'>
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	);
}

export default ProductEditScreen;
