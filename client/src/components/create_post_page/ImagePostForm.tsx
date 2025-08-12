import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import axios from '../../api/axios'

interface props {
	USER_ID: string | number | null,
	logOff: Function
}

function ImagePostForm({USER_ID, logOff}: props) {
	const navigate = useNavigate();

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

	function onImageChangeHandler(event: any) {
		if (event.target.files.length === 0) {
			setImageData(null);
			setSelectedImage(null);

			return;
		} else {
			const image_formData = new FormData();

			image_formData.append('post_image', event.target.files[0], event.target.files[0].name);
			setImageData(image_formData);

			setSelectedImage(event.target.files[0]);
		}
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		const image = document.querySelector("input#post_image") as HTMLInputElement;
		const title = document.querySelector("input#post_title") as HTMLInputElement;

		const formData = new FormData();

		formData.append('post_image', image.files[0], image.files[0].name);
		formData.append('post_title', title.value);

		try {
			const response = await axios.post(`/user/${USER_ID}/create_image_post`, formData);

			if (response.data.success) {
				navigate(`/post/${response.data.post_id}`);
			}
		} catch (error: any) {
			if (error.status == 400) {
				setNotificationType("error");
				setNotificationMessage("Only .png files are allowed!");
			}
		}
	}

	return(
		<>
			
			<form id="image_post_form" encType="multipart/form-data" onSubmit={onSubmitHandler}>
				<div className="input_container">
					<label htmlFor="post_title"><span>Title</span></label>
					<input type="text" id="post_title" placeholder="Title" required />
				</div>
				<div className="input_container">
					<label htmlFor="image"><span>Upload your picture</span></label>
					<input type="file" accept="image/png" id="post_image" name="post_image" onChange={onImageChangeHandler} />
				</div>
				<div className="button_container">
					<button type="submit" disabled={!image_data}>Post</button>
				</div>
			</form>
			{
				selected_image &&
				<div>
					<img src={selected_image ? preview_image : ""} />
				</div>
			}
			
		</>
	)
}

export default ImagePostForm;