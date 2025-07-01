import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import axios from '../api/axios'

import "../style/post_page/post_page.css"

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
				<div className="post_author">
					<p>Author:</p>
					<Link to={`/user/${post_content.post_author}`}>{post_content.post_author_name}</Link>
				</div>
				<div className="post_content">
					<div className="title">
						<h1>{post_content.post_title}</h1>
					</div>
					<div className="content">
						<p>{post_content.post_content}</p>
					</div>
				</div>
			</div>
		)
	}
}

export default PostPage;