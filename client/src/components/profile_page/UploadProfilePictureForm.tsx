import { useState, useEffect } from 'react'

import axios from '../../api/axios'

function UploadProfilePictureForm({USER_ID, defaultUserData}) {
	const [image_data, setImageData] = useState(null);

	const [selected_image, setSelectedImage] = useState(null);
	const [preview_image, setPreviewImage] = useState(null);

	useEffect(() => {
		if (!selected_image) {
			setPreviewImage(null);
			return;
		}

		const imageObjectURL = URL.createObjectURL(selected_image);
		setPreviewImage(imageObjectURL);

		return () => URL.revokeObjectURL(imageObjectURL);
	}, [selected_image])


	function onChangeHandler(event) {
		if (event.target.files.length === 0) {
			setImageData(null);
			setSelectedImage(null);

			return;
		} else {
			const formData = new FormData();
			formData.append('image-name', event.target.files[0], event.target.files[0].name);
			setImageData(formData);

			setSelectedImage(event.target.files[0]);
		}
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		try {
			const response = await axios.post(`/user/${USER_ID}/upload_profile_picture`, image_data);

			console.log(response);
		} catch (error) {
			console.error(error);
		}
	}

	return(
		<section id="upload_profile_picture">
			<span className="title"><span>Profile picture</span></span>
			<div id="profile_picture">
				<img src={selected_image ? preview_image : `http://localhost:8081/${defaultUserData.profile_picture}`} />
			</div>
			<form encType="multipart/form-data" onSubmit={onSubmitHandler}>
				<div className="input_container">
					<label htmlFor="image">Upload your avatar</label>
					<input type="file" accept=".jpg, .png" id="image" name="profile_picture" onChange={onChangeHandler} />
				</div>
				<div className="button_container">
					<button disabled={!image_data}>Apply changes</button>
				</div>
			</form>
		</section>
	)
}

export default UploadProfilePictureForm;