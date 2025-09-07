import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import axios from '../../api/axios'

import ChangeUserInfoForm from "../../components/profile_page/ChangeUserInfoForm"
import UploadProfilePictureForm from "../../components/profile_page/UploadProfilePictureForm"

import "../../style/profile/profile_edit_page.css"

import "../../style/mobile/profile/profile_edit_page.css"

interface props {
	setNotificationMessage: Function,
	setNotificationType: Function
}

type UserData = {
	user_id: number,
	name: string,
	description: string,
	profile_picture: string
}


function ProfileEditPage({setNotificationMessage, setNotificationType} : props) {
	const navigate = useNavigate();

	const { id } = useParams();

	const [userData, setUserData] = useState<UserData>({user_id: 0, name: '', description: '', profile_picture: ''});
	const [hasUserData, setHasUserData] = useState<boolean>(false);

	useEffect(() => {
		if (window.localStorage.getItem('id') !== id) {
			navigate(`/`);
		}

		if (!hasUserData) {
			axios.get(`/user/${id}`)
			.then((response: any) => {
				setUserData(response.data.user_info);
				setHasUserData(true);
			})
			.catch(() => {
				setUserData({user_id: 0, name: '', description: '', profile_picture: ''});
				setHasUserData(false);
			}) 
		}
	}, []);

	

	if (hasUserData) {
		return(
			<>
				<ChangeUserInfoForm USER_ID={id} defaultUserData={userData} setNotificationMessage={setNotificationMessage} setNotificationType={setNotificationType} />
				<UploadProfilePictureForm USER_ID={id} defaultUserData={userData} setNotificationMessage={setNotificationMessage} setNotificationType={setNotificationType} />
			</>
		)
	}

}

export default ProfileEditPage;