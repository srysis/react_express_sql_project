import { Link } from 'react-router-dom'

import dots_icon from "../../assets/v_dots-icon.png"

interface props {
	post: Post,
	post_ownership: boolean,
	date_difference: string
}

type Post = {
	post_author_name: string,
	post_author_avatar: string,
	post_id: number,
	post_title: string,
	post_content: string,
	post_date: string,
	post_author: number,
	post_type: string
}

function TextPost({post, post_ownership, date_difference}: props) {
	const { post_author_name, post_author_avatar, post_id, post_title, post_content, post_date, post_author, post_type } = post;

	return(
		<section id="post" className="text">
			<div className="post_author">
				<p className="header">Author:</p>
				<div className="image_container">
					<img src={`${import.meta.env.VITE_IMAGE_STORAGE}${post_author_avatar}`} />
				</div>
				{post_content.post_author_name !== null &&
					<Link to={`/user/${post_author}`}>{post_author_name}</Link>
				}
				{post_content.post_author_name === null &&
					<p style={{"fontStyle": "italic"}}>[deleted]</p>
				}
				<p className="date" title={post_date.split("T")[0]}>Posted: {date_difference}</p>
			</div>
			<div className="wrapper">
				<div className="post_content">
					<div className="title">
						<h1>{post_title}</h1>
					</div>
					<div className="content">
						<p>{post_content}</p>
					</div>
				</div>
				{post_ownership && 
					<div className="options_container">
						<div className="icon_container" title="Post options" 
							 onClick={() => {
							 	const element = document.querySelector("div.list_container");
								if (element) element.classList.toggle("active");
							 }}>
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

export default TextPost;