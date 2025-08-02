import axios from '../api/axios'

export function setAuthorizationHeader(token: string | null) {
	if (token) {
		axios.defaults.headers.common['Authorization'] = token;
	} else {
		delete axios.defaults.headers.common['Authorization'];
	}
}