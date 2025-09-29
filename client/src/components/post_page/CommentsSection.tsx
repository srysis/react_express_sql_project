import { useState, useEffect } from 'react'

import axios from '../../api/axios'

import Comment from "./Comment"
import LoadingSpinnerBlock from "../../components/LoadingSpinnerBlock"

import "../../style/post_page/comments_section.css"
import "../../style/mobile/post_page/comments_section.css"

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

interface props {
	post_id: string | number | undefined
}

function CommentsSection({ post_id }: props) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [areCommentsRetrieved, setAreCommentsRetrieved] = useState<boolean>(false);
	const [isLoadingNewComments, setIsLoadingNewComments] = useState<boolean>(false);
	const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);

	const COMMENT_LIMIT = 5;

	const [offset, setOffset] = useState<number>(0);

	useEffect(() => {
		axios.get(`/post/${post_id}/comments?limit=${COMMENT_LIMIT}&offset=${offset}`)
		.then((response: any) => {
			if (response.data.comments) {
				setComments([...comments, ...response.data.comments]);

				const button = document.querySelector("button#load_more");

				if (button != null) {
					button.removeAttribute("disabled");
				}

				setIsLoadingNewComments(false);

				if (response.data.comments.length < COMMENT_LIMIT) {
					setHasReachedEnd(true);
					if (button != null) button.setAttribute("disabled", "");
				}

			} else {
				setIsLoadingNewComments(false);
				setHasReachedEnd(true);
			}

			if (!areCommentsRetrieved) setAreCommentsRetrieved(true);
		})
		.catch((error: any) => console.error(error));
	}, [offset]);

	function loadMoreComments(event: any) {
		event.target.setAttribute("disabled", "");

		setIsLoadingNewComments(true);

		increaseOffset();
	}

	function increaseOffset() {
		const new_offset = offset + 5;

		setOffset(new_offset);
	}

	if (areCommentsRetrieved && comments.length != 0) {
		return(
			<>
				<section id="comments">
					{comments.map((comment, index) => <Comment key={index} comment={comment} />)}
				</section>
				<button type="button" id="load_more" onClick={loadMoreComments} disabled={hasReachedEnd}>Load more comments</button>
				{ isLoadingNewComments && <LoadingSpinnerBlock /> }
			</>
		)
	} else if (areCommentsRetrieved && comments.length == 0) {
		return(
			<section id="comments" className="empty">
				<p>No comments yet.</p>
			</section>
		)
	} else {
		return(
			<LoadingSpinnerBlock />
		)
	}
	
}

export default CommentsSection;