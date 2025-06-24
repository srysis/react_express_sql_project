import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams, Link } from 'react-router-dom'

import axios from '../api/axios'

function ProfileEditPage({isLoggedIn}) {
	const navigate = useNavigate();

	const { id } = useParams();

	const [hasUserData, setHasUserData] = useState(false);
	const [userData, setUserData] = useState({});

	const [wasUserDataChanged, setWasNewUserDataChanged] = useState(false);
	const [new_user_data, setNewUserData] = useState({})

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
				setNewUserData(data);
			})
			.catch(error => {
				setHasUserData(false);
				setUserData({});
			}) 
		}
	}, []);

	function onChangeHandler(event) {
		setNewUserData({
			...new_user_data,
			[event.target.name]: event.target.value
		})

		setWasNewUserDataChanged(true);
	}

	function onSubmitHandler(event) {
		event.preventDefault();

		axios.patch(`/user/${id}/edit`, {new_user_data: new_user_data})
		.then(response => {
			if (response.data.success) {
				navigate(`/user/${id}`);
			}
		})
		.catch(error => {
			console.error(error.response.data.message);
		})
	}

	if (hasUserData) {
		return(
			<form onSubmit={onSubmitHandler}>
				<input type="text" name="name" defaultValue={userData.name} placeholder="New name" autoComplete="off" onChange={onChangeHandler} />
				<input type="text" name="description" defaultValue={userData.description} placeholder="New profile description" autoComplete="off" onChange={onChangeHandler} />
				<button disabled={!wasUserDataChanged}>Apply changes</button>
			</form>
		)
	}

}

export default ProfileEditPage;