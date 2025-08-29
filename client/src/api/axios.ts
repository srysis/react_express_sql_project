import axios from 'axios'

const axiosInstance : any = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	withCredentials: true
})

// axios request interceptor to enforce 'Authorization' header from local storage, if present
axiosInstance.interceptors.request.use(
	(request: any) => {
		const access_token : any = window.localStorage.getItem('t');

		if (access_token) {
			request.headers['Authorization'] = access_token;
		} else {
			delete request.headers['Authorization'];
		}

		return request;
	}, (error: any) => {
		return Promise.reject(error);
	}
);


// axios response interceptor to refresh access token, if authorization fails due to expired access token
axiosInstance.interceptors.response.use(
	(response: any) => {
		return response;
	},
	async (error: any) => {
		if (error.response.status === 401 && error.response.data.refreshable) {
			try {
				const refresh_access_response = await axiosInstance.post(`/auth/refresh/${window.localStorage.getItem('id')}`);

				if (refresh_access_response.data?.success) {
					error.config.headers['Authorization'] = refresh_access_response.data.token;

					window.localStorage.setItem('t', refresh_access_response.data.token);

					return axiosInstance.request(error.config);

				// for some incredibly stupid and unknown to me reason, the flow does not switch to 'catch' block
				// after failing to fetch a new token. that's why we check if refresh failed here in 'try' block
				// Stupid? Yes, but it works as far as I am concerned.
				} else if (refresh_access_response.response?.status === 401 && !refresh_access_response.response.data?.success) {
					return Promise.reject(refresh_access_response);
				}

			// we still send a rejected promise if some other unknown error occurs, just to be safe.
			} catch (error: any) {
				return Promise.reject(error.response);
			}
		}
		return Promise.reject(error.response);
	}
);

export default axiosInstance;