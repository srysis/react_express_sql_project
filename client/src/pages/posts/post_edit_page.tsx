import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import axios from '../../api/axios'

import "../../style/post_page/post_edit_page.css"

type Post = {
	post_author_name: string,
	post_author_avatar: string,
	post_id: number,
	post_title: string,
	post_content: string,
	post_date: string,
	post_author: number,
	post_type: string,
	is_editable: number
}	

function PostEditPage() {
	const navigate = useNavigate();

	const { post_id } = useParams();

	const [post_data, setPostData] = useState<Post | null>(null);
	const [isPostRetrieved, setIsPostRetrieved] = useState<boolean>(false);

	const [wasPostChanged, setWasPostChanged] = useState<boolean>(false);

	const [new_post_content, setNewPostContent] = useState<string>("");

	useEffect(() => {
		axios.get(`/post/${post_id}`)
		.then((response: any) => {

			if (response.data.post != null) { 
				if (response.data.post.is_editable != 1 || response.data.post.post_author != window.localStorage.getItem('id')) {
					navigate(`/post/${post_id}`);
				}

				setPostData(response.data.post);
				setIsPostRetrieved(true);
			}

		})
		.catch((error: any) => console.error(error.response.data))
	}, [post_id]);

	function onChangeHandler(event: any) {
		setNewPostContent(event.target.value);

		setWasPostChanged(true);
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		try {
			const response = await axios.patch(`/post/${post_id}/edit`, {new_post_content: new_post_content});

			if (response.data.success) {
				navigate(`/post/${post_id}`);
			}
		} catch (error: any) {
			console.error(error);
			navigate(`/post/${post_id}`);
		}
	}

	if (isPostRetrieved && post_data) {
		return(
			<section id="edit_post">
				<form onSubmit={onSubmitHandler}>
					<div className="input_container">
						<label htmlFor="post_title"><span>Title</span></label>
						<input type="text" id="post_title" value={post_data.post_title} readOnly />
					</div>
					<div className="textarea_container">
						<label htmlFor="post_content"><span>Content</span></label>
						<textarea id="post_content" rows={4} cols={50} placeholder="Share your opinions..." defaultValue={post_data.post_content} onChange={onChangeHandler}></textarea>
					</div>
					<div className="button_container">
						<button disabled={!wasPostChanged}>Apply changes</button>
					</div>
				</form>
			</section>
		)
	}
}

export default PostEditPage;