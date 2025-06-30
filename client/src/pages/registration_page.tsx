import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import axios from '../api/axios'

const USER_REGEX = /^[a-zA-Z][a-zA-Z-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

function RegistrationPage({isLoggedIn}) {
	const userRef = useRef();
	const errorRef = useRef();

	const [username, setUsername] = useState("");
	const [isUsernameValid, setIsUsernameValid] = useState(false);

	const [password, setPassword] = useState("");
	const [isPasswordValid, setIsPasswordValid] = useState(false);

	const [matchingPassword, setMatchingPassword] = useState("");
	const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);

	const navigate = useNavigate();

	const REQUEST_HEADERS = {
		'Content-Type': 'application/json'
	}

	useEffect(() => {
		userRef.current.focus();

		if (isLoggedIn) navigate('/');
	}, []);

	useEffect(() => {
		setIsUsernameValid(USER_REGEX.test(username));
	}, [username]);

	useEffect(() => {
		setIsPasswordValid(PWD_REGEX.test(password));
		setDoPasswordsMatch(password === matchingPassword);
	}, [password, matchingPassword]);

	function onChangeHandler(event) {
		switch (event.target.id) {
			case "username":
				setUsername(event.target.value);
				break;
			case "password":
				setPassword(event.target.value);
				break;
			case "match_password":
				setMatchingPassword(event.target.value);
				break;
			default:
				console.error("Unexpected error.");
				break;
		}
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		if (!USER_REGEX.test(username) || !PWD_REGEX.test(password)) {
			console.error("Missing credentials.");
			return;
		}

		try {
			const register_response = await axios.post('/register', { username: username, password: password } , { headers: REQUEST_HEADERS });

			console.log(register_response)

			if (register_response.data.success) {
				const set_default_info_response = await axios.post('/set_default_user_info', { username: username }, { headers: REQUEST_HEADERS });

				if (set_default_info_response.data.success) {
					navigate('/login');
				} else {
					navigate('/register');
				}
			}
		} catch (error) {
			if (error.response?.status === 409) {
				console.error("Username was taken")
			} else if (error?.response) {
				console.error("No response");
			} else {
				console.error("Registration failed");
			}
		}
	}

	return(
		<>
			{ !isLoggedIn && 
				<div id="registration_form">
					<h1>Register</h1>
					<form onSubmit={onSubmitHandler}>
						<label htmlFor="username">Username:</label>
						<input type="text" id="username" ref={userRef} autoComplete="off" onChange={onChangeHandler} required />
						<br />
						<label htmlFor="password">Password:</label>
						<input type="password" id="password" onChange={onChangeHandler} required />
						<br />
						<label htmlFor="match_password">Confirm password:</label>
						<input type="password" id="match_password" onChange={onChangeHandler} required />
						<br />
						<button disabled={!isUsernameValid || !isPasswordValid || !doPasswordsMatch ? true : false}>Register!</button>
					</form>
				</div>
			}
		</>
	)
}

export default RegistrationPage;