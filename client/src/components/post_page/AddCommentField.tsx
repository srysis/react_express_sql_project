import { useState } from 'react'

import axios from '../../api/axios'

import "../../style/post_page/add_comment_field.css"

function AddCommentField({post_id}) {
	const [comment, setComment] = useState("");

	function onChangeHandler(event) {
		setComment(event.target.value);
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		try {
			const response = await axios.post(`/post/${post_id}/comments/add`, {comment: comment, user_id: window.localStorage.getItem('id')});

			if (response.data.success) {
				window.location.reload();
			}
		} catch (error) {
			console.error(error.response.data.message);
		}
	}

	return(
		<form id="add_comment_form" onSubmit={onSubmitHandler}>
			<div className="input_container">
				<textarea id="description" placeholder="Comment on this post" onChange={onChangeHandler}></textarea>
			</div>
			<div className="button_container">
				<button disabled={!comment}>Comment</button>
			</div>
		</form>
	)
}

export default AddCommentField;