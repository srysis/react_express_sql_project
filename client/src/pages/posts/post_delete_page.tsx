import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import axios from '../../api/axios'

import half_circle from "../../assets/half-circle.png"

import "../../style/shared.css"

import "../../style/mobile/shared.css"

interface props {
	USER_ID: string | number | null,
	setNotificationMessage: Function,
	setNotificationType: Function
}

function PostDeletePage({USER_ID, setNotificationMessage, setNotificationType}: props) {
	const REQUEST_HEADERS = {
		'Content-Type': 'application/json'
	}

	const navigate = useNavigate();

	const { post_id } = useParams();

	const [confirm_delete_action, setConfirmDeleteAction] = useState<boolean>(false);

	const [post_ownership, setPostOwnership] = useState<boolean>(false);
	const [isPostRetrieved, setIsPostRetrieved] = useState<boolean>(false);

	const [user_credentials, setUserCredentials] = useState<{username: string, password: string}>({username: "", password: ""});

	useEffect(() => {
		axios.get(`/post/${post_id}`)
		.then((response: any) => {
			if (response.data.post != null) { 
				if (!response.data.post_ownership) { 
					navigate(`/`); 
				} else {
					setPostOwnership(true);
					setIsPostRetrieved(true);
				}
			} else if (response.data.post == null) {
				navigate(`/`);
			}
		})
		.catch((error: any) => {
			console.error(error);
		})
	}, []);

	function onConfirmDeleteClickHandler(event: any) {
		switch (event.target.value) {
			case "Y":
				setConfirmDeleteAction(true);
				break;
			case "N":
				setConfirmDeleteAction(false);
				navigate(`/post/${post_id}`);
				break;
		}
	}

	function onChangeHandler(event: any) {
		setUserCredentials({
			...user_credentials,
			[event.target.id]: event.target.value
		})
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		setNotificationType("");
		setNotificationMessage("");

		const button = document.querySelector("div.submit_container > button");
		if (button) { 
			button.setAttribute("disabled", true.toString());
			button.innerHTML = `<span class="loading_spinner"><img src=${half_circle} /></span>`;
		}

		try {
			const verify_access = await axios.get(`/auth/verify/${USER_ID}`);

			if (verify_access.data.success) {
				const response = await axios.delete(`/post/${post_id}/delete`, {
					headers: REQUEST_HEADERS,
					data: { 
						user_credentials,
						user_id: USER_ID
					}
				});

				if (response.data.success) {
					navigate('/');
				} else if (!response.data.success) {
					navigate(`/post/${post_id}`);
				}
			}			
		} catch (error: any) {
			if (error?.status === 403) {
				navigate(`/post/${post_id}`);
			} else if (error?.status === 404 || error?.status === 401) {
				if (button) {
					button.removeAttribute("disabled");
					button.innerHTML = "Confirm";
				}

				setNotificationType("error");
				setNotificationMessage("Invaild credentials supplied.");
			}
		}
	}

	if (post_ownership && isPostRetrieved) {
		return(
			<section id="delete">
				<section id="first_check">
					<p id="question">Are you sure?</p>
					<div id="confirm_delete">
						<button type="button" onClick={onConfirmDeleteClickHandler} value="Y" disabled={confirm_delete_action}>Yes</button>
						<button type="button" onClick={onConfirmDeleteClickHandler} value="N" disabled={confirm_delete_action}>No</button>
					</div>
				</section>
				{confirm_delete_action && 
					<section id="second_check">
						<h2>Enter your credentials to confirm your identity.</h2>
						<form onSubmit={onSubmitHandler}>
							<div className="input_container">
								<label htmlFor="username"><span>Username</span></label>
								<input type="text" id="username" name="username" autoComplete="off" onChange={onChangeHandler} required />
							</div>
							<div className="input_container">
								<label htmlFor="password"><span>Password</span></label>
								<input type="password" id="password" name="password" onChange={onChangeHandler} required />
							</div>
							<div className="submit_container">
								<button disabled={!user_credentials.username || !user_credentials.password}>Confirm</button>
							</div>
						</form>
					</section>
				}
			</section>
		)
	} else {
		return(
			<section id="loading">
				<div className="loading_spinner"><img src={half_circle}/></div>
			</section>
		)
	}
}

export default PostDeletePage;