import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import axios from '../api/axios'

function ProfilePage({isLoggedIn}) {
	const { id } = useParams();

	const [hasUserData, setHasUserData] = useState(false);
	const [userData, setUserData] = useState({});
	const [ownership, setOwnership] = useState(false);

	useEffect(() => {
		if (!hasUserData) {
			axios.get(`/user/${id}`)
			.then(response => {
				setUserData(response.data.user_info);
				setHasUserData(true);

				if (response.data.ownership) {
					setOwnership(true);
				} else {
					setOwnership(false);
				}
			})
			.catch(error => {
				setHasUserData(false);
				setUserData({});
			}) 
		}
	}, []);

	useEffect(() => {
		if (isLoggedIn) {
			setOwnership(true);
		} else {
			setOwnership(false);
		}
	}, [isLoggedIn]);

	useEffect(() => {
		axios.get(`/user/${id}`)
		.then(response => {
			setUserData(response.data.user_info);
			setHasUserData(true);

			if (response.data.ownership) {
				setOwnership(true);
			} else {
				setOwnership(false);
			}
		})
		.catch(error => {
			setHasUserData(false);
			setUserData({});
		}) 
	}, [id])

	if (hasUserData) {
		return(
			<div>
				<h1>{`${userData.name}'s profile`}</h1>
				<h3>{userData.description}</h3>
				{ ownership && <p>this is your profile</p> }
				{ ownership && <Link to={`/user/${id}/edit`}>Edit profile</Link> }
			</div>
		)
	}
	
}

export default ProfilePage;