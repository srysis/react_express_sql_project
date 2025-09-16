import { useState, useEffect } from 'react'

import axios from '../../api/axios'

import LoadingSpinnerInline from "../../components/LoadingSpinnerInline"

import "../../style/post_page/add_comment_field.css"
import "../../style/mobile/post_page/add_comment_field.css"

interface props {
	post_id: string | undefined
}

function AddCommentField({post_id}: props) {
	const [initial_comment_field_height, setInitialCommentFieldHeight] = useState<number| null>(null);
	const [current_comment_field_height, setCurrentCommentFieldHeight] = useState<number| null>(null);

	const [comment, setComment] = useState<string>("");

	const [action_in_progress, setActionInProgress] = useState<boolean>(false);

	useEffect(() => {
		const comment_field: HTMLElement | null = document.querySelector("textarea#comment_field");

		if (comment_field != null) {
			setInitialCommentFieldHeight(comment_field.clientHeight);
			setCurrentCommentFieldHeight(comment_field.clientHeight);
		}
	}, [])

	function isOverflowing(element: HTMLElement) {
		return element.scrollHeight > element.clientHeight;
	}

	function isNotOverflowing(element: HTMLElement) {
		return element.scrollHeight <= element.clientHeight;
	}

	function onChangeHandler(event: any) {
		setComment(event.target.value);

		if (isOverflowing(event.target)) {
			event.target.style.height = `${event.target.scrollHeight}px`;
			setCurrentCommentFieldHeight(event.target.scrollHeight);
		} else if (isNotOverflowing(event.target)) {
			event.target.style.height = "auto";
			setCurrentCommentFieldHeight(initial_comment_field_height);
		}
	}

	function onBlurHandler(event: any) {
		event.target.style.height = `${initial_comment_field_height}px`;
	}

	function onFocusHandler(event: any) {
		event.target.style.height = `${current_comment_field_height}px`;
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		setActionInProgress(true);

		const button = document.querySelector("div.button_container > button");
		if (button) { 
			button.setAttribute("disabled", true.toString());
		}

		try {
			const response: any = await axios.post(`/post/${post_id}/comments`, {comment: comment, user_id: window.localStorage.getItem('id')});

			if (response.data.success) {
				window.location.reload();
			}
		} catch (error: any) {
			if (error?.status === 401) {
				window.location.reload();
			}
		}
	}

	return(
		<section id="add_comment">
			<form onSubmit={onSubmitHandler}>
				<div className="input_container" style={!comment ? {"marginBottom": "0"} : undefined}>
					<textarea id="comment_field" maxLength={2048} placeholder="Comment on this post" onChange={onChangeHandler} onFocus={onFocusHandler} onBlur={onBlurHandler}></textarea>
				</div>
				<div className="button_container" style={!comment ? {"display": "none"} : undefined}>
					<button disabled={!comment}>{ action_in_progress ? <LoadingSpinnerInline /> : "Comment" }</button>
				</div>
			</form>
		</section>
	)
}

export default AddCommentField;