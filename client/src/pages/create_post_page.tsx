import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams, Link } from 'react-router-dom'

import axios from '../api/axios'
import { setAuthorizationHeader } from '../tools/setHeaders'

function CreatePostPage({isLoggedIn, USER_ID, setLoggedIn, setHasAdminRights}) {
	const navigate = useNavigate();

	const { id } = useParams();

	const [post_content, setPostContent] = useState({});

	useEffect(() => {
		if (window.localStorage.getItem('id') !== id) {
			navigate('/');
		}
	}, [])

	function onSubmitHandler(event) {
		event.preventDefault();

		/*
			to make sure that user is allowed to post, make a 'verify' call to check
			if user's client does not contain modified token or changed 'id'
		*/

		axios.get(`/verify/${window.localStorage.getItem('id')}`)
		.then(response => {
			if (response.data.success) {

				/* if user is successfully verified, create a post */
				axios.post(`/user/${USER_ID}/create_post`, { post: post_content })
				.then(response => {
					console.log(response.data)
				})
				.catch(error => error.response.data)

			}
		})
		.catch(error => {
			if (!error.response.data.success) {
				setLoggedIn(false);
				setHasAdminRights(false);

				setAuthorizationHeader(null);

				window.localStorage.removeItem('t');
				window.localStorage.removeItem('id');

				console.error(error.response.data.message);
			}
		})
	}

	function onChangeHandler(event) {
		setPostContent({
			...post_content,
			[event.target.name]: event.target.value
		})
	}

	return (
		<form onSubmit={onSubmitHandler}>
			<input type="text" name="post_title" placeholder="Title" onChange={onChangeHandler} />
			<br /><br />
			<textarea name="post_content" rows="4" cols="50" placeholder="Content" onChange={onChangeHandler}></textarea>
			<br />
			<button>Post</button>
		</form>
	)
}

export default CreatePostPage;