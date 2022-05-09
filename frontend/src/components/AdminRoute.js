import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router';

const AdminRoute = ({ component: Component, render, ...rest }) => {
	const { userInfo } = useSelector((state) => state.userLogin);
	return (
		<Route
			{...rest}
			render={(props) => {
				if (!userInfo) {
					return <Redirect to='/login' />;
				}
				if (!userInfo.isAdmin) {
					return <Redirect to='/' />;
				}
				return Component ? <Component {...props} /> : render(props);
			}}
		/>
	);
};

export default AdminRoute;
