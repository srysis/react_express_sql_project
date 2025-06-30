import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams, Link } from 'react-router-dom'

import axios from '../api/axios'

function ProfileEditPage({isLoggedIn}) {
	const navigate = useNavigate();

	const { id } = useParams();

	const [userData, setUserData] = useState({});
	const [hasUserData, setHasUserData] = useState(false);

	const [wasUserDataChanged, setWasNewUserDataChanged] = useState(false);

	const [newUsername, setNewUsername] = useState("");
	const [newDescription, setNewDescription] = useState("");

	useEffect(() => {
		if (window.localStorage.getItem('id') !== id) {
			navigate('/');
		}

		if (!hasUserData) {
			axios.get(`/user/${id}`)
			.then(response => {
				setHasUserData(true);

				let data = response.data.user_info;

				setUserData(data);
				setNewUsername(data.name);
				setNewDescription(data.description);
			})
			.catch(error => {
				console.error(error)
				setHasUserData(false);
				setUserData({});
			}) 
		}
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
			const response = await axios.patch(`/user/${id}/edit`, {username: newUsername, description: newDescription});

			if (response.data.success) {
				navigate(`/user/${id}`);
			}
		} catch (error) {
			console.error(error.response.data.message);
		}
	}

	if (hasUserData) {
		return(
			<form onSubmit={onSubmitHandler}>
				<div className="input_container">
					<label htmlFor="username">Username:</label>
					<input type="text" id="username" defaultValue={userData.name} placeholder="New name" autoComplete="off" onChange={onChangeHandler} />
				</div>
				<div className="input_container">
					<label htmlFor="description">Description</label>
					<textarea id="description" defaultValue={userData.description} rows="4" cols="50" placeholder="Content" onChange={onChangeHandler}></textarea>
				</div>
				<div className="input_container">
					<button disabled={!wasUserDataChanged}>Apply changes</button>
				</div>
			</form>
		)
	}

}

export default ProfileEditPage;