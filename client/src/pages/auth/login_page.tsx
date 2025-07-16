import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import axios from '../../api/axios'
import { setAuthorizationHeader } from '../../tools/setHeaders'

import error_icon from "../../assets/exclamation-mark-2.png"

import "../../style/auth_pages/login_page.css"

function LoginPage({ isLoggedIn, setLoggedIn, setHasAdminRights }) {
	const userRef = useRef();
	const errorRef = useRef();

	const [user_credentials, setUserCredentials] = useState({});

	const [login_failed, setLoginFailed] = useState(false);
	const [error_message, setErrorMessage] = useState("");

	const navigate = useNavigate();

	const REQUEST_HEADERS = {
		'Content-Type': 'application/json'
	}

	useEffect(() => {
		userRef.current.focus();

		if (isLoggedIn) navigate('/');
	}, [])

	function onChangeHandler(event) {
		setUserCredentials({
			...user_credentials,
			[event.target.name]: event.target.value
		})
	}

	function onFocusHandler(event) {
		setLoginFailed(false);
		setErrorMessage("");
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
		.catch(error => {
			if (error.response.status === 404) {
				setLoginFailed(true);
				setErrorMessage("Invalid username or password.");
			}
		});
	}

	return(
		<>
			{ !isLoggedIn && 
				<section id="login">
					<h1>Login</h1>
					{ login_failed && 
						<div id="error_container">
							<div className="image_container">
								<img src={error_icon} />
							</div>
							<div className="text_container">
								<p>{error_message}</p>
							</div>
						</div>
					}
					<form onSubmit={onSubmitHandler}>
						<div className="input_container">
							<label htmlFor="username"><span>Username</span></label>
							<input type="text" id="username" name="username" autoComplete="off" onChange={onChangeHandler} onFocus={onFocusHandler} ref={userRef} required />
						</div>
						<div className="input_container">
							<label htmlFor="password"><span>Password</span></label>
							<input type="password" id="password" name="password" onChange={onChangeHandler} onFocus={onFocusHandler} required />
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