import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, Form, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/userActions';
import FormContainer from '../components/FormContainer';
import queryString from 'query-string';

function LoginScreen({ location, history }) {
	const dispatch = useDispatch();
	const { loading, error, userInfo } = useSelector((state) => state.userLogin);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const redirect = location.search ? queryString.parse(location.search).redirect : '/';

	useEffect(() => {
		if (userInfo) {
			history.push(redirect);
		}
	}, [dispatch, userInfo, history, redirect]);

	const sumbitHandler = (e) => {
		e.preventDefault();
		console.log('Submitted');
		dispatch(login(email, password));
	};

	return (
		<FormContainer>
			<h1>Sign In</h1>
			{error && <Message variant='danger'>{error}</Message>}
			{loading && <Loader />}
			<Form onSubmit={sumbitHandler}>
				<Form.Group controlId='email'>
					<Form.Label>Email Id</Form.Label>
					<FormControl
						type='email'
						placeholder='E-Mail'
						value={email}
						onChange={(e) => setEmail(e.target.value)}></FormControl>
				</Form.Group>
				<Form.Group controlId='password'>
					<Form.Label>Password</Form.Label>
					<FormControl
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}></FormControl>
				</Form.Group>
				<Button type='submit' variant='primary'>
					Sign IN
				</Button>
			</Form>
			<Row className='py-3'>
				<Col>
					New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : `/register`}>Register</Link>
				</Col>
			</Row>
		</FormContainer>
	);
}

export default LoginScreen;
