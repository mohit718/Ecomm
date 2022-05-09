import axios from 'axios';

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete
};
