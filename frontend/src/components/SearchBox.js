import React, { useState } from 'react';
import { Form, Button, FormControl, Row, Col } from 'react-bootstrap';

const SearchBox = ({ history }) => {
	const [keyword, setKeyword] = useState('');

	const submitHandler = (e) => {
		e.preventDefault();
		if (keyword.trim()) {
			history.push(`/search/${keyword}`);
		} else {
			history.push('/');
		}
	};
	const searchHandler = (keyword) => {
		if (keyword.trim()) {
			history.push(`/search/${keyword}`);
		} else {
			history.push('/');
		}
	};
	return (
		<div className='search-wrapper'>
			<Form onSubmit={submitHandler} className='row w-100 my-3'>
				<div className='col-10 px-1'>
					<FormControl
						type='text'
						name='q'
						placeholder='Search your product..'
						onChange={(e) => {
							setKeyword(e.target.value);
							searchHandler(e.target.value);
						}}
					/>
				</div>
				<div className='col-2 px-1'>
					<Button type='submit' variant='outline-success' className='p-2'>
						Search
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default SearchBox;
