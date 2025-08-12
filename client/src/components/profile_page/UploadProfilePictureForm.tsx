import { useState, useEffect } from 'react'

import axios from '../../api/axios'

interface props {
	USER_ID: string | undefined,
	defaultUserData: {
		user_id: number,
		name: string,
		description: string,
		profile_picture: string
	},
	setNotificationMessage: Function,
	setNotificationType: Function
}

function UploadProfilePictureForm({USER_ID, defaultUserData, setNotificationMessage, setNotificationType}: props) {
	const [image_data, setImageData] = useState<any>(null);

	const [selected_image, setSelectedImage] = useState<any>(null);
	const [preview_image, setPreviewImage] = useState<any>(null);

	useEffect(() => {
		if (!selected_image) {
			setPreviewImage(null);
			return;
		}

		const imageObjectURL = URL.createObjectURL(selected_image);
		setPreviewImage(imageObjectURL);

		return () => URL.revokeObjectURL(imageObjectURL);
	}, [selected_image])


	function onChangeHandler(event: any) {
		if (event.target.files.length === 0) {
			setImageData(null);
			setSelectedImage(null);

			return;
		} else {
			const formData = new FormData();
			formData.append('profile_picture', event.target.files[0], event.target.files[0].name);
			setImageData(formData);

			setSelectedImage(event.target.files[0]);
		}
	}

	function discardChanges() {
		setImageData(null);
		setSelectedImage(null);
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		try {
			const response = await axios.post(`/user/${USER_ID}/upload_profile_picture`, image_data);

			if (response.data.success) {
				const button = document.querySelector("button");
				if (button) button.setAttribute("disabled", "true");
				
				setImageData(null);

				setNotificationType("success");
				setNotificationMessage("Your avatar has been changed.")
			}
		} catch (error: any) {
			if (error.status == 400) {
				setNotificationType("error");
				setNotificationMessage("Only .png files are allowed!");
			}
		}
	}

	return(
		<section id="upload_profile_picture">
			<span className="title"><span>Profile picture</span></span>
			<div id="profile_picture">
				<img src={selected_image ? preview_image : `${import.meta.env.VITE_IMAGE_STORAGE}${defaultUserData.profile_picture}`} className={preview_image ? "preview" : ""} />
			</div>
			<form encType="multipart/form-data" onSubmit={onSubmitHandler}>
				<div className="input_container">
					<label htmlFor="image">Upload your avatar</label>
					<input type="file" accept="image/png" id="image" name="profile_picture" onChange={onChangeHandler} />
				</div>
				<div className="button_container">
					<button type="button" disabled={!image_data} onClick={discardChanges}>Discard changes</button>
					<button type="submit" disabled={!image_data}>Apply changes</button>
				</div>
			</form>
		</section>
	)
}

export default UploadProfilePictureForm;