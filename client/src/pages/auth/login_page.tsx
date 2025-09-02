import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import axios from '../../api/axios'

import half_circle from "../../assets/half-circle.png"
import error_icon from "../../assets/exclamation-mark-2.png"

import "../../style/shared.css"
import "../../style/auth_pages/login_page.css"

interface props {
	isLoggedIn: boolean,
	logIn: Function
}

function LoginPage({ isLoggedIn, logIn }: props) {
	const userRef: any = useRef(null);

	const [user_credentials, setUserCredentials] = useState<{username: string, password: string} | {}>({});

	const [login_failed, setLoginFailed] = useState<boolean>(false);
	const [error_message, setErrorMessage] = useState<string>("");

	const navigate = useNavigate();

	const REQUEST_HEADERS = {
		'Content-Type': 'application/json'
	}

	useEffect(() => {
		userRef.current.focus();

		if (isLoggedIn) navigate('/');
	}, [])

	function onChangeHandler(event: any) {
		setUserCredentials({
			...user_credentials,
			[event.target.name]: event.target.value
		})
	}

	function onFocusHandler() {
		setLoginFailed(false);
		setErrorMessage("");
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		const button = document.querySelector("button");
		if (button) { 
			button.setAttribute("disabled", true.toString());
			button.innerHTML = `<span class="loading_spinner"><img src=${half_circle} /></span>`;
		}

		try {
			const response = await axios.post('/auth/login', user_credentials, { headers: REQUEST_HEADERS });

			if (response.data.success) {
				logIn(response.data);

				navigate('/');
			}
		} catch (error: any) {
			if (error.status === 404) {
				setLoginFailed(true);

				const button = document.querySelector("button");
				if (button) { 
					button.removeAttribute("disabled");
					button.innerHTML = "Login";
				}

				setErrorMessage("Invalid username or password.");
			}
		}
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
					<div id="register"><span>Don't have an account? </span><Link to="/register">Register now.</Link></div>
				</section>
			}
		</>
	)
}

export default LoginPage;