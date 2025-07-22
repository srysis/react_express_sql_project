import { useState, useEffect } from 'react'

import axios from '../../api/axios'

function UploadProfilePictureForm({USER_ID}) {
	const [image, setImage] = useState(null);


	function onChangeHandler(event) {
		if (event.target.files.length === 0) {
			setImage(null);
		} else {
			const formData = new FormData();
			formData.append('image-name', event.target.files[0], event.target.files[0].name);
			setImage(formData);
		}
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		try {
			const response = await axios.post(`/user/${USER_ID}/upload_profile_picture`, image);

			console.log(response);
		} catch (error) {
			console.error(error);
		}
	}

	return(
		<section id="upload_profile_picture">
			<form encType="multipart/form-data" onSubmit={onSubmitHandler}>
				<div className="input_container">
					<input type="file" accept=".jpg" name="profile_picture" onChange={onChangeHandler} />
				</div>
				<div className="button_container">
					<button disabled={!image}>Apply changes</button>
				</div>
			</form>
		</section>
	)
}

export default UploadProfilePictureForm;