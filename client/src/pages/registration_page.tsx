import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import axios from '../api/axios'

function RegistrationPage({isLoggedIn}) {
	const [user_credentials, setUserCredentials] = useState({});

	const navigate = useNavigate();

	const REQUEST_HEADERS = {
		'Content-Type': 'application/json'
	}

	useEffect(() => {
		if (isLoggedIn) navigate('/');
	}, [])

	function onChangeHandler(event) {
		setUserCredentials({
			...user_credentials,
			[event.target.name]: event.target.value
		})
	}

	function onSubmitHandler(event) {
		event.preventDefault();

		axios.post('/register', user_credentials, { headers: REQUEST_HEADERS })
		.then(response => {
			if (response.data.success) {

				axios.post('/set_default_user_info', { username: user_credentials.username }, { headers: REQUEST_HEADERS })
				.then(response => {
					if (response.data.success) {
						navigate('/login');
					} else {
						navigate('/register');
					}
				})
				.catch(error => console.error(error.response.data))

			} else {
				navigate('/register');
			}
		})
		.catch(error => console.error(error.response.data));
	}

	return(
		<>
			{ !isLoggedIn && 
				<div id="registration_form">
					<h1>Register</h1>
					<form onSubmit={onSubmitHandler}>
						<input type="text" name="username" autocomplete="off" onChange={onChangeHandler} />
						<input type="password" name="password" onChange={onChangeHandler} />
						<button>Register!</button>
					</form>
				</div>
			}
		</>
	)
}

export default RegistrationPage;