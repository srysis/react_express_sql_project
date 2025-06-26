import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams, Link } from 'react-router-dom'

import axios from '../api/axios'

function CreatePostPage({isLoggedIn, USER_ID}) {
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

		axios.post(`/user/${USER_ID}/create_post`, { post: post_content })
		.then(response => {
			console.log(response.data)
		})
		.catch(error => error.response.data)
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