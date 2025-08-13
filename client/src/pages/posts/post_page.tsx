import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import axios from '../../api/axios'

import TextPost from "../../components/post_page/TextPost"
import ImagePost from "../../components/post_page/ImagePost"

import AddCommentField from "../../components/post_page/AddCommentField"
import CommentsSection from "../../components/post_page/CommentsSection"

import "../../style/post_page/post_page.css"

interface props {
	isLoggedIn: boolean
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


function PostPage({isLoggedIn}: props) {
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

	useEffect(() => {
		if (isPostRetrieved && post_content) {
			const post_container: any = document.querySelector("div.post_content");
			const post_content_element: any = document.querySelector("div.post_content > div.content");

			if (post_content_element.offsetHeight > post_container.offsetHeight) {
				const initial_content: string = post_content.post_content;

				const modified_content: string = initial_content.slice(0, 1800) + "...";

				post_content_element.innerHTML = modified_content;
				post_content_element.classList.add("expandable");
				post_content_element.addEventListener("click", expandContent);
			}
		}
	}, [isPostRetrieved]);

	function expandContent(event: any) {
		if (post_content) {
			event.target.innerHTML = post_content.post_content;

			const section_element : HTMLElement = document.querySelector('section#post') as HTMLElement;
			if (section_element) section_element.style.maxHeight = 'none';
			
			event.target.classList.remove("expandable");
		}
	}

	if (isPostRetrieved && post_content !== null) {
		return(
			<>
				{post_content.post_type === "text" && <TextPost post={post_content} post_ownership={post_ownership} date_difference={date_difference} />}
				{post_content.post_type === "image" && <ImagePost post={post_content} post_ownership={post_ownership} date_difference={date_difference} />}
				{isLoggedIn && <AddCommentField post_id={post_id} />}
				{areCommentsRetrieved && <CommentsSection comments={comments} />}
			</>
		)
	} else if (isPostRetrieved && post_content === null) {
		return(
			<section id="post" className="missing">
				<h1>This post does not exist or was deleted by it's author.</h1>
			</section>
		)
	}
}

export default PostPage;