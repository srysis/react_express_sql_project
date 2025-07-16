import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import axios from '../../api/axios'

import dots_icon from "../../assets/v_dots-icon.png"

import "../../style/post_page/post_page.css"

function PostPage({isLoggedIn}) {
	const { post_id } = useParams();

	const [post_content, setPostContent] = useState(null);
	const [isPostRetrieved, setIsPostRetrieved] = useState(false);

	const [post_ownership, setPostOwnership] = useState(false);

	useEffect(() => {
		axios.get(`/post/${post_id}`)
		.then(response => {

			if (response.data.post != null) { 
				setPostContent(response.data.post);
				setIsPostRetrieved(true);

				setPostOwnership(response.data.post_ownership);
			}

		})
		.catch(error => console.error(error.response.data))
	}, [post_id])

	if (isPostRetrieved) {
		return(
			<section id="post">
				<div className="post_author">
					<p>Author:</p>
					{post_content.post_author_name !== null &&
						<Link to={`/user/${post_content.post_author}`}>{post_content.post_author_name}</Link>
					}
					{post_content.post_author_name === null &&
						<p style={{"fontStyle": "italic"}}>deleted</p>
					}
				</div>
				<div className="wrapper">
					<div className="post_content">
						<div className="title">
							<h1>{post_content.post_title}</h1>
						</div>
						<div className="content">
							<p>{post_content.post_content}</p>
						</div>
					</div>
					{post_ownership && 
						<div className="options_container">
							<div className="icon_container" title="Post options" onClick={(event) => {document.querySelector("div.list_container").classList.toggle("active")}}>
								<img src={dots_icon} />
							</div>
							<div className="list_container">
								<Link to={`/post/${post_id}/edit`}>Edit</Link>
								<Link to={`/post/${post_id}/delete`}>Delete</Link>
							</div>
						</div>
					}
				</div>
			</section>
		)
	}
}

export default PostPage;