import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import axios from '../../api/axios'

interface props {
	USER_ID: string | undefined,
	defaultUserData: UserData,
	setNotificationMessage: Function,
	setNotificationType: Function
}

type UserData = {
	user_id: number,
	name: string,
	description: string,
	profile_picture: string
}

function ChangeUserInfoForm({USER_ID, defaultUserData, setNotificationMessage, setNotificationType}: props) {
	const navigate = useNavigate();
	
	const [wasUserDataChanged, setWasNewUserDataChanged] = useState<boolean>(false);

	const [newUsername, setNewUsername] = useState<string>("");
	const [newDescription, setNewDescription] = useState<string>("");

	useEffect(() => {
		setNewUsername(defaultUserData.name);
		setNewDescription(defaultUserData.description);
	}, []);

	function onChangeHandler(event: any) {
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

	function discardChanges() {
		setNewUsername(defaultUserData.name);
		setNewDescription(defaultUserData.description);
		setWasNewUserDataChanged(false);

		(document.querySelector("input[id='username']") as HTMLInputElement).value = defaultUserData.name;
		(document.querySelector("input[id='description']") as HTMLInputElement).value = defaultUserData.description;
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		try {
			const response = await axios.patch(`/user/${USER_ID}/edit`, {username: newUsername, description: newDescription});

			if (response.data.success) {
				setNotificationType(true);
				setNotificationMessage("Changes have been applied.")

				navigate(`/user/${USER_ID}`);
			}
		} catch (error: any) {
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
					<textarea id="description" defaultValue={defaultUserData.description} rows={4} cols={50} placeholder="Content" onChange={onChangeHandler}></textarea>
				</div>
				<div className="button_container">
					<button type="button" disabled={!wasUserDataChanged} onClick={discardChanges}>Discard changes</button>
					<button type="submit" disabled={!wasUserDataChanged}>Apply changes</button>
				</div>
			</form>
		</section>
	)
}

export default ChangeUserInfoForm;