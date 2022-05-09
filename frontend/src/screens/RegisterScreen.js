import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, Form, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/userActions';
import FormContainer from '../components/FormContainer';
import queryString from 'query-string';

function RegisterScreen({ location, history }) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState(null);

	const dispatch = useDispatch();
	const { loading, error, userInfo } = useSelector((state) => state.userRegister);
	const redirect = location.search ? queryString.parse(location.search).redirect : '/';

	useEffect(() => {
		if (userInfo) {
			history.push(redirect);
		}
	}, [dispatch, userInfo, history, redirect]);

	const sumbitHandler = (e) => {
		e.preventDefault();
		console.log('Submitted');
		if (password !== confirmPassword) {
			setMessage('Password donot Match');
		} else {
			setMessage(null);
			dispatch(register(name, email, password));
		}
	};

	return (
		<FormContainer>
			<h1>Sign Up</h1>
			{message && <Message variant='danger'>{message}</Message>}
			{error && <Message variant='danger'>{error}</Message>}
			{loading && <Loader />}
			<Form onSubmit={sumbitHandler}>
				<Form.Group controlId='name'>
					<Form.Label>Name</Form.Label>
					<FormControl
						type='name'
						placeholder='Name'
						value={name}
						onChange={(e) => setName(e.target.value)}></FormControl>
				</Form.Group>
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
				<Form.Group controlId='confirmPassword'>
					<Form.Label>Confirm Password</Form.Label>
					<FormControl
						type='password'
						placeholder='Confirm Password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}></FormControl>
				</Form.Group>
				<Button type='submit' variant='primary'>
					Register
				</Button>
			</Form>
			<Row className='py-3'>
				<Col>
					Already have account? <Link to={redirect ? `/login?redirect=${redirect}` : `/login`}>Login</Link>
				</Col>
			</Row>
		</FormContainer>
	);
}

export default RegisterScreen;
