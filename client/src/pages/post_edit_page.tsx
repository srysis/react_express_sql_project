import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams, Link } from 'react-router-dom'

import axios from '../api/axios'

function PostEditPage() {
	const navigate = useNavigate();

	const { post_id } = useParams();

	const [post_data, setPostData] = useState(null);
	const [isPostRetrieved, setIsPostRetrieved] = useState(false);

	const [wasPostChanged, setWasPostChanged] = useState(false);

	const [new_post_content, setNewPostContent] = useState("");

	useEffect(() => {
		axios.get(`/post/${post_id}`)
		.then(response => {

			if (response.data.post != null) { 
				setPostData(response.data.post);
				setIsPostRetrieved(true);
			}

		})
		.catch(error => console.error(error.response.data))
	}, [post_id]);

	function onChangeHandler(event) {
		setNewPostContent(event.target.value);

		setWasPostChanged(true);
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		try {
			const response = await axios.patch(`/post/${post_id}/edit`, {new_post_content: new_post_content});

			if (response.data.success) {
				navigate(`/post/${post_id}`);
			}
		} catch (error) {
			console.error(error.response.data.message);
		}
	}

	if (isPostRetrieved) {
		return(
			<section id="edit_post">
				<form onSubmit={onSubmitHandler}>
					<div className="input_container">
						<label htmlFor="post_title"><span>Title</span></label>
						<input type="text" id="post_title" value={post_data.post_title} readOnly />
					</div>
					<div className="textarea_container">
						<label htmlFor="post_content"><span>Content</span></label>
						<textarea id="post_content" rows="4" cols="50" placeholder="Share your opinions..." defaultValue={post_data.post_content} onChange={onChangeHandler}></textarea>
					</div>
					<div className="button_container">
						<button disabled={!wasPostChanged}>Apply changes</button>
					</div>
				</form>
			</section>
		)
	}
}

export default PostEditPage;