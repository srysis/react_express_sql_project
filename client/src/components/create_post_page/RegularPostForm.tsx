import { useState } from 'react'
import { useNavigate } from 'react-router'

import axios from '../../api/axios'

import half_circle from "../../assets/half-circle.png"

interface props {
	USER_ID: string | number | null,
	logOut: Function
}

function RegularPostForm({USER_ID, logOut}: props) {
	const navigate = useNavigate();
	
	const [post_content, setPostContent] = useState<{post_content: string, post_title: string}>({post_content: "", post_title: ""});

	function onChangeHandler(event: any) {
		setPostContent({
			...post_content,
			[event.target.id]: event.target.value
		})
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		const button = document.querySelector("div.button_container > button.submit");
		if (button) { 
			button.setAttribute("disabled", true.toString());
			button.innerHTML = `<span class="loading_spinner"><img src=${half_circle} /></span>`;
		}

		try {
			/*
				to make sure that user is allowed to post, make a 'verify' call to check
				if user's client does not contain modified token or changed 'id'
			*/
			const verification_response = await axios.get(`/auth/verify/${window.localStorage.getItem('id')}`);

			if (verification_response.data.success) {
				// if user has been verified, create a post
				const create_post_response = await axios.post(`/user/${USER_ID}/create_text_post`, { post: post_content });

				if (create_post_response.data.success) {
					navigate(`/post/${create_post_response.data.post_id}`);
				}
			}
		} catch (error: any) {
			if (!error.response.data.success) {
				logOut();
			}
		}
	}

	return(
		<form id="regular_post_form" onSubmit={onSubmitHandler}>
			<div className="input_container">
				<label htmlFor="post_title"><span>Title</span></label>
				<input type="text" id="post_title" placeholder="Title" onChange={onChangeHandler} required />
			</div>
			<div className="textarea_container">
				<label htmlFor="post_content"><span>Content</span></label>
				<textarea id="post_content" rows={4} cols={50} placeholder="Share your opinions..." onChange={onChangeHandler} required></textarea>
			</div>
			<div className="button_container">
				<button className="submit" disabled={(!post_content.post_content || !post_content.post_title)}>Post</button>
			</div>
		</form>
	)
}

export default RegularPostForm;