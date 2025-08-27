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

				if (refresh_access_response.data.success) {
					error.config.headers['Authorization'] = refresh_access_response.data.token;

					window.localStorage.setItem('t', refresh_access_response.data.token);

					return axiosInstance.request(error.config);
				} else {
					return Promise.reject(error);
				}
			} catch (error: any) {
				if (error.response.status === 401 && !error.response.data.refreshable) {
					return Promise.reject(error);
				}
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;