import { useState } from 'react'

import axios from '../../api/axios'

import "../../style/post_page/add_comment_field.css"

interface props {
	post_id: string | undefined
}

function AddCommentField({post_id}: props) {
	const [comment, setComment] = useState<string>("");

	function onChangeHandler(event: any) {
		setComment(event.target.value);
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		try {
			const response: any = await axios.post(`/post/${post_id}/comments/add`, {comment: comment, user_id: window.localStorage.getItem('id')});

			if (response.data.success) {
				window.location.reload();
			}
		} catch (error: any) {
			console.error(error.response.data.message);
		}
	}

	return(
		<section id="add_comment">
			<form onSubmit={onSubmitHandler}>
				<div className="input_container">
					<textarea id="description" placeholder="Comment on this post" onChange={onChangeHandler}></textarea>
				</div>
				<div className="button_container">
					<button disabled={!comment}>Comment</button>
				</div>
			</form>
		</section>
	)
}

export default AddCommentField;