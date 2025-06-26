import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import axios from '../api/axios'

function PostPage({isLoggedIn}) {
	const { post_id } = useParams();

	const [post_content, setPostContent] = useState(null);
	const [isPostRetrieved, setIsPostRetrieved] = useState(false);

	useEffect(() => {
		axios.get(`/post/${post_id}`)
		.then(response => {

			if (response.data.post != null) { 
				setPostContent(response.data.post);
				setIsPostRetrieved(true);
			}

		})
		.catch(error => console.error(error.response.data))
	}, [post_id])

	if (isPostRetrieved) {
		return(
			<div id="post">
				<h1>{post_content.post_title}</h1>
				<p>{post_content.post_content}</p>
			</div>
		)
	}
}

export default PostPage;