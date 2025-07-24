import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams, Link } from 'react-router-dom'

import axios from '../../api/axios'

import ChangeUserInfoForm from "../../components/profile_page/ChangeUserInfoForm"
import UploadProfilePictureForm from "../../components/profile_page/UploadProfilePictureForm"

import "../../style/profile/profile_edit_page.css"

function ProfileEditPage({setNotificationMessage}) {
	const navigate = useNavigate();

	const { id } = useParams();

	const [userData, setUserData] = useState({});
	const [hasUserData, setHasUserData] = useState(false);

	useEffect(() => {
		if (window.localStorage.getItem('id') !== id) {
			navigate(`/`);
		}

		if (!hasUserData) {
			axios.get(`/user/${id}`)
			.then(response => {
				setHasUserData(true);

				let data = response.data.user_info;

				setUserData(data);
			})
			.catch(error => {
				console.error(error)
				setHasUserData(false);
				setUserData({});
			}) 
		}
	}, []);

	

	if (hasUserData) {
		return(
			<>
				<ChangeUserInfoForm USER_ID={id} defaultUserData={userData} setNotificationMessage={setNotificationMessage} />
				<UploadProfilePictureForm USER_ID={id} defaultUserData={userData} setNotificationMessage={setNotificationMessage} />
			</>
		)
	}

}

export default ProfileEditPage;