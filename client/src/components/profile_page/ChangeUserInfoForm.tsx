import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import axios from '../../api/axios'

function ChangeUserInfoForm({USER_ID, defaultUserData, setNotificationMessage}) {
	const navigate = useNavigate();
	
	const [wasUserDataChanged, setWasNewUserDataChanged] = useState(false);

	const [newUsername, setNewUsername] = useState("");
	const [newDescription, setNewDescription] = useState("");

	useEffect(() => {
		setNewUsername(defaultUserData.name);
		setNewDescription(defaultUserData.description);
	}, []);

	function onChangeHandler(event) {
		switch (event.target.id) {
			case "username":
				setNewUsername(event.target.value);
				break;
			case "description":
				setNewDescription(event.target.value);
				break;
			default:
				console.error("Unexpected error")
				break;
		}

		setWasNewUserDataChanged(true);
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		try {
			const response = await axios.patch(`/user/${USER_ID}/edit`, {username: newUsername, description: newDescription});

			if (response.data.success) {
				setNotificationMessage("Changes have been applied.")

				navigate(`/user/${USER_ID}`);
			}
		} catch (error) {
			console.error(error.response.data.message);
		}
	}

	return(
		<section id="change_user_info">
			<form onSubmit={onSubmitHandler}>
				<div className="input_container">
					<label htmlFor="username"><span>Username</span></label>
					<input type="text" id="username" defaultValue={defaultUserData.name} placeholder="New name" autoComplete="off" onChange={onChangeHandler} />
				</div>
				<div className="textarea_container">
					<label htmlFor="description"><span>Description</span></label>
					<textarea id="description" defaultValue={defaultUserData.description} rows="4" cols="50" placeholder="Content" onChange={onChangeHandler}></textarea>
				</div>
				<div className="button_container">
					<button disabled={!wasUserDataChanged}>Apply changes</button>
				</div>
			</form>
		</section>
	)
}

export default ChangeUserInfoForm;