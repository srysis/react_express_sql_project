import { useNavigate } from 'react-router'

import axios from '../../api/axios'

import dislike_icon from "../../assets/dislike.png"
import dislike_icon_filled from "../../assets/dislike_filled.png"

interface props {
	post_id: number,
	forceUpdate: Function,
	dislikes: number,
	isDisliked: boolean | null,
	isLoggedIn: boolean
}

function DislikePostButton({post_id, forceUpdate, dislikes, isDisliked, isLoggedIn}: props) {
	const navigate = useNavigate();

	async function onClickHandler() {
		if (isLoggedIn) {
			try {
				const response: any = await axios.post(`/post/${post_id}/${window.localStorage.getItem('id')}/dislike`);

				if (response.data.success) {
					forceUpdate();
				}
			} catch (error: any) {
				console.error(error.response.data.message);
			}
		} else {
			navigate('/login');
		}
	}

	return(
		<button onClick={onClickHandler}><img src={isDisliked ? dislike_icon_filled : dislike_icon}/>{dislikes}</button>
	)
}

export default DislikePostButton;