import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router';

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
	const { userInfo } = useSelector((state) => state.userLogin);
	return (
		<Route
			{...rest}
			render={(props) => {
				if (!userInfo) {
					return <Redirect to={`/login?redirect=${props.location.pathname}`} />;
				}
				return Component ? <Component {...props} /> : render(props);
			}}
		/>
	);
};

export default ProtectedRoute;
