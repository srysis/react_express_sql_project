import { useState, useEffect } from 'react'

import axios from '../../api/axios'

import LoadingSpinnerInline from "../../components/LoadingSpinnerInline"

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
	const [wasUserDataChanged, setWasNewUserDataChanged] = useState<boolean>(false);

	const [newUsername, setNewUsername] = useState<string>("");
	const [newDescription, setNewDescription] = useState<string>("");

	const [action_in_progress, setActionInProgress] = useState<boolean>(false);

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
		(document.querySelector("textarea[id='description']") as HTMLInputElement).value = defaultUserData.description;
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		setActionInProgress(true);

		const apply_button = document.querySelector("section#change_user_info > form > div.button_container > button[type='submit']");
		const discard_button = document.querySelector("section#change_user_info > form > div.button_container > button[type='button']");

		if (apply_button) { 
			apply_button.setAttribute("disabled", true.toString());
		}

		if (discard_button) {
			discard_button.setAttribute("disabled", true.toString());
		}

		try {
			const response = await axios.patch(`/user/${USER_ID}/edit`, {username: newUsername, description: newDescription});

			if (response.data.success) {
				setNotificationType("success");
				setNotificationMessage("Changes have been applied.");

				setWasNewUserDataChanged(false);

				setActionInProgress(false);
			}
		} catch (error: any) {
			const apply_button = document.querySelector("section#change_user_info > form > div.button_container > button[type='submit']");
			const discard_button = document.querySelector("section#change_user_info > form > div.button_container > button[type='button']");

			if (apply_button) {
				apply_button.removeAttribute("disabled");
			}

			if (discard_button) {
				discard_button.removeAttribute("disabled");
			}
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
					<textarea id="description" defaultValue={defaultUserData.description} maxLength={10000} rows={10} cols={50} placeholder="Content" onChange={onChangeHandler}></textarea>
				</div>
				<div className="button_container">
					<button type="button" disabled={!wasUserDataChanged} onClick={discardChanges}>Discard changes</button>
					<button type="submit" disabled={!wasUserDataChanged}>{ action_in_progress ? <LoadingSpinnerInline /> : "Apply changes" }</button>
				</div>
			</form>
		</section>
	)
}

export default ChangeUserInfoForm;