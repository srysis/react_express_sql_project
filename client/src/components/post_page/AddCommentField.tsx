import { useState } from 'react'

import axios from '../../api/axios'

import LoadingSpinnerInline from "../../components/LoadingSpinnerInline"

import "../../style/post_page/add_comment_field.css"
import "../../style/mobile/post_page/add_comment_field.css"

interface props {
	post_id: string | undefined
}

function AddCommentField({post_id}: props) {
	const [comment, setComment] = useState<string>("");

	const [action_in_progress, setActionInProgress] = useState<boolean>(false);

	function onChangeHandler(event: any) {
		setComment(event.target.value);
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
					<textarea id="description" placeholder="Comment on this post" onChange={onChangeHandler}></textarea>
				</div>
				<div className="button_container" style={!comment ? {"display": "none"} : undefined}>
					<button disabled={!comment}>{ action_in_progress ? <LoadingSpinnerInline /> : "Comment" }</button>
				</div>
			</form>
		</section>
	)
}

export default AddCommentField;