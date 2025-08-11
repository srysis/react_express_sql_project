import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import axios from '../../api/axios'

import error_icon from "../../assets/exclamation-mark-2.png"

import "../../style/shared.css"
import "../../style/auth_pages/registration_page.css"

const USER_REGEX : RegExp = /^[a-zA-Z][a-zA-Z-_]{3,23}$/;
const PWD_REGEX : RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

interface props {
	isLoggedIn: boolean
}


function RegistrationPage({isLoggedIn}: props) {
	const userRef = useRef<HTMLInputElement | null>(null);

	const [registration_failed, setRegistrationFailed] = useState<boolean>(false);

	const [username, setUsername] = useState<string>("");
	const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
	const [username_focus, setUsernameFocus] = useState<boolean>(false);

	const [password, setPassword] = useState<string>("");
	const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
	const [password_focus, setPasswordFocus] = useState<boolean>(false);

	const [matching_password, setMatchingPassword] = useState<string>("");
	const [doPasswordsMatch, setDoPasswordsMatch] = useState<boolean>(false);
	const [matching_password_focus, setMatchingPasswordFocus] = useState<boolean>(false);

	const [error_message, setErrorMessage] = useState<string>("");

	const navigate = useNavigate();

	const REQUEST_HEADERS: any = {
		'Content-Type': 'application/json'
	}

	useEffect(() => {
		userRef.current?.focus();

		if (isLoggedIn) navigate('/');
	}, []);

	useEffect(() => {
		setIsUsernameValid(USER_REGEX.test(username));
	}, [username]);

	useEffect(() => {
		setIsPasswordValid(PWD_REGEX.test(password));
		setDoPasswordsMatch(password === matching_password);
	}, [password, matching_password]);

	useEffect(() => {
		setErrorMessage("");
	}, [username, password, matching_password])

	function onChangeHandler(event: any) {
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

	async function onSubmitHandler(event: any) {
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
		} catch (error: any) {
			if (error.response?.status === 409) {
				setErrorMessage("Username was taken");
			} else if (error.response) {
				setErrorMessage("No response");
			} else {
				setErrorMessage("Registration failed");
			}

			setRegistrationFailed(true);
		}
	}

	return(
		<>
			{ !isLoggedIn && 
				<section id="registration">
					<h1>Register</h1>
					{ registration_failed && 
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
							<input 
								type="text" 
								id="username" 
								ref={userRef} 
								autoComplete="off" 
								onChange={onChangeHandler} 
								onFocus={() => setUsernameFocus(true)} 
								onBlur={() => setUsernameFocus(false)} 
								required 
							/>
							<div id="username_note" className={username_focus && !isUsernameValid ? "visible" : ""}>
								<h3>Username must:</h3>
								<p>Be 4 to 24 characters long</p>
								<p>Start with a letter(regardless of case)</p>
							</div>
						</div>
						<div className="input_container">
							<label htmlFor="password"><span>Password</span></label>
							<input 
								type="password" 
								id="password" 
								onChange={onChangeHandler} 
								onFocus={() => setPasswordFocus(true)} 
								onBlur={() => setPasswordFocus(false)} 
								required 
							/>
							<div id="password_note" className={password_focus && !isPasswordValid ? "visible" : ""}>
								<h3>Password must:</h3>
								<p>Be 8 to 24 characters long</p>
								<p>Contain one uppercase and one lowercase letters and a number</p>
							</div>
						</div>
						<div className="input_container">
							<label htmlFor="match_password"><span>Confirm password</span></label>
							<input 
								type="password" 
								id="match_password" 
								onChange={onChangeHandler} 
								onFocus={() => setMatchingPasswordFocus(true)} 
								onBlur={() => setMatchingPasswordFocus(false)} 
								required 
							/>
							<div id="matching_password_note" className={matching_password_focus && password && !doPasswordsMatch ? "visible" : ""}>
								<p>Must match the password in the "Password" field</p>
							</div>
						</div>
						<div className="submit_container">
							<button disabled={!isUsernameValid || !isPasswordValid || !doPasswordsMatch ? true : false}>Register!</button>
						</div>
					</form>
				</section>
			}
		</>
	)
}

export default RegistrationPage;