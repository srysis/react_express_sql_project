import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import RegularPostForm from "../components/create_post_page/RegularPostForm"
import ImagePostForm from "../components/create_post_page/ImagePostForm"

interface props {
	USER_ID: string | number | null,
	logOff: Function,
	setNotificationMessage: Function,
	setNotificationType: Function
}

function CreatePostPage({USER_ID, logOff, setNotificationMessage, setNotificationType}: props) {
	const navigate = useNavigate();

	const { id } = useParams();

	const [post_type, setPostType] = useState<string>("text");

	useEffect(() => {
		if (window.localStorage.getItem('id') !== id || window.localStorage.getItem('id') !== USER_ID) {
			navigate(`/`);
		}
	}, [])

	function onClickHandler(event: any) {
		switch (event.target.value) {
			case "text":
				setPostType("text");
				break;
			case "image":
				setPostType("image");
				break;
			default:
				console.error("Unexpected parameter in 'onClickHandler'");
				break;
		}
	}

	return (
		<section id="create_post">
			<div id="post_type_switch">
				<button type="button" value="text" onClick={onClickHandler}>Text</button>
				<button type="button" value="image" onClick={onClickHandler}>Image</button>
			</div>
			{post_type === "text" && <RegularPostForm USER_ID={USER_ID} logOff={logOff} />}
			{post_type === "image" && <ImagePostForm USER_ID={USER_ID} setNotificationMessage={setNotificationMessage} setNotificationType={setNotificationType} />}
		</section>
	)
}

export default CreatePostPage;