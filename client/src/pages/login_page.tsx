import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import axios from '../api/axios'
import { setAuthorizationHeader } from '../tools/setHeaders'

import "../style/auth_pages/login_page.css"

function LoginPage({ isLoggedIn, setLoggedIn, setHasAdminRights }) {
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

		axios.post('/login', user_credentials, { headers: REQUEST_HEADERS })
		.then(response => {
			const result = response.data;

			if (result.success) {
				const token = result.token;
				const user_id = result.user_id;

				window.localStorage.setItem('t', token);
				window.localStorage.setItem('id', user_id);

				setAuthorizationHeader(token);

				setLoggedIn(true);

				if (result.admin) setHasAdminRights(true);

				navigate('/');
			}
		})
		.catch(error => console.error(error.response.data.message));
	}

	return(
		<>
			{ !isLoggedIn && 
				<section id="login">
					<h1>Login</h1>
					<form onSubmit={onSubmitHandler}>
						<div className="input_container">
							<label htmlFor="username"><span>Username</span></label>
							<input type="text" id="username" name="username" autoComplete="off" onChange={onChangeHandler} />
						</div>
						<div className="input_container">
							<label htmlFor="password"><span>Password</span></label>
							<input type="password" id="password" name="password" onChange={onChangeHandler} />
						</div>
						<div className="submit_container">
							<button>Login</button>
						</div>
					</form>
					<div id="register"><span>Don't have an account?</span><Link to="/register"> Register now.</Link></div>
				</section>
			}
		</>
	)
}

export default LoginPage;