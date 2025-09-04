import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import axios from '../../api/axios'

import Rating from "../../components/post_page/Rating"

import AddCommentField from "../../components/post_page/AddCommentField"
import CommentsSection from "../../components/post_page/CommentsSection"

import half_circle from "../../assets/half-circle.png"
import dots_icon from "../../assets/v_dots-icon.png"

import "../../style/post_page/post_page.css"

import "../../style/mobile/post_page/post_page.css"

interface props {
	DEVICE_TYPE: string,
	isLoggedIn: boolean,
	setNotificationMessage: Function,
	setNotificationType: Function
}

type Post = {
	post_author_name: string,
	post_author_avatar: string,
	post_id: number,
	post_title: string,
	post_content: string,
	post_date: string,
	post_author: number,
	post_type: string,
	is_editable: number,
	likes_amount: number,
	dislikes_amount: number
}

type Comment = {
	comment_id: number,
	content: string,
	comment_date: string,
	post_id: number,
	comment_author: number,
	comment_author_name: string,
	comment_author_profile_picture: string,
	date_difference: string
}


function PostPage({DEVICE_TYPE, isLoggedIn, setNotificationMessage, setNotificationType}: props) {
	const { post_id } = useParams();

	const [post_content, setPostContent] = useState<Post | null>(null);
	const [isPostRetrieved, setIsPostRetrieved] = useState<boolean>(false);

	const [post_ownership, setPostOwnership] = useState<boolean>(false);

	const [comments, setComments] = useState<Comment[]>([]);
	const [areCommentsRetrieved, setAreCommentsRetrieved] = useState<boolean>(false);

	const [date_difference, setDateDifference] = useState<string | null | undefined>();

	useEffect(() => {
		axios.get(`/post/${post_id}`)
		.then((response: any) => {

			if (response.data.post != null) { 
				setPostContent(response.data.post);
				setIsPostRetrieved(true);

				setPostOwnership(response.data.post_ownership);

				setDateDifference(response.data.date_difference);

				axios.get(`/post/${post_id}/comments`)
				.then((response: any) => {
					setComments(response.data.comments);

					setAreCommentsRetrieved(true);
				})
				.catch((error: any) => console.error(error.response.data));
			} else if (response.data.post == null) {
				setPostContent(null);
				setIsPostRetrieved(true);
			}

		})
		.catch((error: any) => console.error(error.response.data))
	}, [post_id])

	if (isPostRetrieved && post_content !== null) {
		return(
			<>
				<section id="post" className={post_content.post_type === "image" ? "image" : "text"}>
					<div className="post_author">
						<div className="image_container">
							<img src={`${import.meta.env.VITE_IMAGE_STORAGE}${post_content.post_author_avatar}`} />
						</div>
						<span className="name">
						{post_content.post_author_name !== null &&
							<Link to={`/user/${post_content.post_author}`}>{post_content.post_author_name}</Link>
						}
						{post_content.post_author_name === null &&
							<p style={{"fontStyle": "italic"}}>[deleted]</p>
						}
						</span>
						<span className="date_container">
							<p className="date" title={post_content.post_date.split("T")[0]}>{date_difference}</p>
						</span>
						{ DEVICE_TYPE === "desktop" && 
							<Rating post_id={post_content.post_id} isLoggedIn={isLoggedIn} setNotificationMessage={setNotificationMessage} setNotificationType={setNotificationType} /> 
						}
						{post_ownership && (DEVICE_TYPE === "mobile") && 
							<div className="options_container">
								<div className="icon_container" title="Post options" 
									 onClick={() => {
									 	const element = document.querySelector("div.list_container");
										if (element) element.classList.toggle("active");
									 }}>
									<img src={dots_icon} />
								</div>
								<div className="list_container">
									{post_content.is_editable === 1 && <Link to={`/post/${post_id}/edit`}>Edit</Link>}
									<Link to={`/post/${post_id}/delete`}>Delete</Link>
								</div>
							</div>
						}
					</div>
					<div className="wrapper">
						<div className="post_content">
							<div className="title">
								<h1>{post_content.post_title}</h1>
							</div>
							<div className="content">
								<div className={post_content.post_type === "image" ? "image_container" : "text_container"}>
									{post_content.post_type === "text" && <p>{post_content.post_content}</p>}
									{post_content.post_type === "image" && <img src={`${import.meta.env.VITE_POST_IMAGE_STORAGE}${post_content.post_content}`} />}
								</div>
							</div>
							{ DEVICE_TYPE === "mobile" && 
								<Rating post_id={post_content.post_id} isLoggedIn={isLoggedIn} setNotificationMessage={setNotificationMessage} setNotificationType={setNotificationType} /> 
							}
						</div>
						{post_ownership && (DEVICE_TYPE === "desktop") && 
							<div className="options_container">
								<div className="icon_container" title="Post options" 
									 onClick={() => {
									 	const element = document.querySelector("div.list_container");
										if (element) element.classList.toggle("active");
									 }}>
									<img src={dots_icon} />
								</div>
								<div className="list_container">
									{post_content.is_editable === 1 && <Link to={`/post/${post_id}/edit`}>Edit</Link>}
									<Link to={`/post/${post_id}/delete`}>Delete</Link>
								</div>
							</div>
						}
					</div>
				</section>
				{isLoggedIn && <AddCommentField post_id={post_id} />}
				{areCommentsRetrieved ? <CommentsSection comments={comments} /> : 
					<section id="loading">
						<div className="loading_spinner"><img src={half_circle}/></div>
					</section>
			}
			</>
		)
	} else if (isPostRetrieved && post_content === null) {
		return(
			<section id="post" className="missing">
				<h1>This post does not exist or was deleted by it's author.</h1>
			</section>
		)
	} else {
		return(
			<section id="loading">
				<div className="loading_spinner"><img src={half_circle}/></div>
			</section>
		)
	}
}

export default PostPage;