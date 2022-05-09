import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, FormControl } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import queryString from 'query-string';
import { getUserDetails, updateUser } from '../actions/userActions';
import GoBack from '../components/GoBack';
import { USER_UPDATE_RESET } from '../constants/userConstants';

function UserEditScreen({ match, history }) {
	const userId = match.params.id;

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);

	const dispatch = useDispatch();
	const { loading, error, user } = useSelector((state) => state.userDetails);
	const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector(
		(state) => state.userUpdate
	);

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: USER_UPDATE_RESET });
			history.push('/admin/userlist');
		} else {
			if (!user || !user.name || user._id !== userId) {
				dispatch(getUserDetails(userId));
			} else {
				setName(user.name);
				setEmail(user.email);
				setIsAdmin(user.isAdmin);
			}
		}
	}, [dispatch, userId, user, successUpdate, history]);

	const sumbitHandler = (e) => {
		e.preventDefault();
		dispatch(updateUser({ _id: userId, name, email, isAdmin }));
	};

	return (
		<>
			<GoBack to='/admin/userlist' />
			<FormContainer>
				<h1>Edit User</h1>
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
						<Form.Group controlId='isAdmin'>
							<Form.Check
								type='checkbox'
								label='Is Admin'
								checked={isAdmin}
								onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
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

export default UserEditScreen;
