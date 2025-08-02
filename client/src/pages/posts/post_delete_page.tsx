import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import axios from '../../api/axios'

import "../../style/post_page/post_delete_page.css"

interface props {
	USER_ID: string | number | null
}

function PostDeletePage({USER_ID}: props) {
	const REQUEST_HEADERS = {
		'Content-Type': 'application/json'
	}

	const navigate = useNavigate();

	const { post_id } = useParams();

	const [confirm_delete_action, setConfirmDeleteAction] = useState<boolean>(false);

	const [user_credentials, setUserCredentials] = useState<{username: string, password: string} | {}>({});

	useEffect(() => {
		if (window.localStorage.getItem('id') !== USER_ID) {
			navigate(`/`);
		}
	}, []);

	function onConfirmDeleteClickHandler(event: any) {
		switch (event.target.value) {
			case "Y":
				setConfirmDeleteAction(true);
				break;
			case "N":
				setConfirmDeleteAction(false);
				navigate(`/user/${USER_ID}`);
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

		try {
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
		} catch (error: any) {
			if (error?.response.status === 403) {
				navigate(`/post/${post_id}`);
			}
		}
	}

	return(
		<section id="delete_post">
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
							<button>Confirm</button>
						</div>
					</form>
				</section>
			}
		</section>
	)
}

export default PostDeletePage;