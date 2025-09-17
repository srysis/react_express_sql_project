import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import axios from '../../api/axios'

import LoadingSpinnerInline from "../../components/LoadingSpinnerInline"

interface props {
	USER_ID: string | number | null,
	logOut: Function
}

function RegularPostForm({USER_ID, logOut}: props) {
	const navigate = useNavigate();

	const [initial_post_content_field_height, setInitialPostContentFieldHeight] = useState<number| null>(null);
	const [current_post_content_field_height, setCurrentPostContentFieldHeight] = useState<number| null>(null);
	
	const [post_content, setPostContent] = useState<{post_content: string, post_title: string}>({post_content: "", post_title: ""});

	const [posting_in_progress, setPostingInProgress] = useState<boolean>(false);

	useEffect(() => {
		const post_content_field: HTMLElement | null = document.querySelector("textarea#post_content");

		if (post_content_field != null) {
			setInitialPostContentFieldHeight(post_content_field.clientHeight);
			setCurrentPostContentFieldHeight(post_content_field.clientHeight);
		}
	}, [])

	function onChangeHandler(event: any) {
		setPostContent({
			...post_content,
			[event.target.id]: event.target.value
		})

		event.target.style.height = "auto";
		event.target.style.height = `${event.target.scrollHeight}px`;

		setCurrentPostContentFieldHeight(event.target.scrollHeight);
	}

	function onBlurHandler(event: any) {
		event.target.style.height = `${initial_post_content_field_height}px`;
	}

	function onFocusHandler(event: any) {
		event.target.style.height = `${current_post_content_field_height}px`;
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		setPostingInProgress(true);

		const button = document.querySelector("div.button_container > button.submit");
		if (button) { 
			button.setAttribute("disabled", true.toString());
		}

		try {
			/*
				to make sure that user is allowed to post, make a 'verify' call to check
				if user's client does not contain modified token or changed 'id'
			*/
			const verification_response = await axios.get(`/auth/verify/${window.localStorage.getItem('id')}`);

			if (verification_response.data.success) {
				// if user has been verified, create a post
				const create_post_response = await axios.post(`/user/${USER_ID}/create_text_post`, { post: post_content });

				if (create_post_response.data.success) {
					navigate(`/post/${create_post_response.data.post_id}`);
				}
			}
		} catch (error: any) {
			if (!error.response.data.success) {
				logOut();
			}
		}
	}

	return(
		<form id="regular_post_form" onSubmit={onSubmitHandler}>
			<div className="input_container">
				<label htmlFor="post_title"><span>Title</span></label>
				<input type="text" id="post_title" placeholder="Title" onChange={onChangeHandler} required />
			</div>
			<div className="textarea_container">
				<label htmlFor="post_content"><span>Content</span></label>
				<textarea id="post_content" rows={4} cols={50} maxLength={10000} placeholder="Share your opinions..." onChange={onChangeHandler} onFocus={onFocusHandler} onBlur={onBlurHandler} required></textarea>
			</div>
			<div className="button_container">
				<button className="submit" disabled={(!post_content.post_content || !post_content.post_title)}>{ posting_in_progress ? <LoadingSpinnerInline /> : "Post" }</button>
			</div>
		</form>
	)
}

export default RegularPostForm;