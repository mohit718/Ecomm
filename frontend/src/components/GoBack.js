import React from 'react';
import { Link } from 'react-router-dom';

const GoBack = ({ to }) => {
	return (
		<Link to={to} className='btn btn-light my-3'>
			Go Back
		</Link>
	);
};

export default GoBack;
