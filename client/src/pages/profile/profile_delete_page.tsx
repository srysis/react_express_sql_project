import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import axios from '../../api/axios'

import "../../style/shared.css"
import "../../style/profile/profile_delete_page.css"

interface props {
	logOff: Function
}

function ProfileDeletePage({logOff}: props) {
	const REQUEST_HEADERS : any = {
		'Content-Type': 'application/json'
	}

	const navigate = useNavigate();

	const { id } = useParams();

	const [confirm_delete_action, setConfirmDeleteAction] = useState<boolean>(false);

	const [user_credentials, setUserCredentials] = useState<{username: string, password: string} | {}>({});

	useEffect(() => {
		if (window.localStorage.getItem('id') !== id) {
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
				navigate(`/user/${id}`);
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
			const response = await axios.delete(`/user/${id}/delete`, {
				headers: REQUEST_HEADERS,
				data: user_credentials
			});

			if (response.data.success) {
				logOff();

				navigate('/');
			} else if (!response.data.success) {
				navigate(`/user/${id}`);
			}
		} catch (error: any) {
			if (error?.status === 403) {
				navigate(`/user/${id}`);
			}
		}
	}

	return(
		<section id="authorize_delete">
			<section id="first_check">
				<h1>Warning!</h1>
				{/*<h2>You about to delete "!PROFILE NAME HERE!"</h2>*/}
				<p>This is an irreverseable action. Deleting your account will make it inaccessible. Any posts made by you, will still be viewable through search.</p>
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

export default ProfileDeletePage;