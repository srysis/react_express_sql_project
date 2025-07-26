import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams, Link } from 'react-router-dom'

import axios from '../api/axios'
import { setAuthorizationHeader } from '../tools/setHeaders'

import "../style/create_post_page/create_post_page.css"

function CreatePostPage({isLoggedIn, USER_ID, logOff}) {
	const navigate = useNavigate();

	const { id } = useParams();

	const [post_content, setPostContent] = useState({});

	useEffect(() => {
		if (window.localStorage.getItem('id') !== id) {
			navigate(`/user/${window.localStorage.getItem('id')}/create_post`);
		}
	}, [])

	async function onSubmitHandler(event) {
		event.preventDefault();

		try {
			/*
				to make sure that user is allowed to post, make a 'verify' call to check
				if user's client does not contain modified token or changed 'id'
			*/
			const verification_response = await axios.get(`/verify/${window.localStorage.getItem('id')}`);

			if (verification_response.data.success) {
				// if user has been verified, create a post
				const create_post_response = await axios.post(`/user/${USER_ID}/create_post`, { post: post_content });

				if (create_post_response.data.success) {
					navigate(`/post/${create_post_response.data.post_id}`);
				}
			}
		} catch (error) {
			if (!error.response.data.success) {
				logOff();

				console.error(error.response.data.message);
			}
		}
	}

	function onChangeHandler(event) {
		setPostContent({
			...post_content,
			[event.target.id]: event.target.value
		})
	}

	return (
		<section id="create_post">
			<form onSubmit={onSubmitHandler}>
				<div className="input_container">
					<label htmlFor="post_title"><span>Title</span></label>
					<input type="text" id="post_title" placeholder="Title" onChange={onChangeHandler} required />
				</div>
				<div className="textarea_container">
					<label htmlFor="post_content"><span>Content</span></label>
					<textarea id="post_content" rows="4" cols="50" placeholder="Share your opinions..." onChange={onChangeHandler} required></textarea>
				</div>
				<div className="button_container">
					<button>Post</button>
				</div>
			</form>
		</section>
	)
}

export default CreatePostPage;