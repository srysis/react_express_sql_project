import { useNavigate } from 'react-router'

import axios from '../../api/axios'

import like_icon from "../../assets/like.png"
import like_icon_filled from "../../assets/like_filled.png"

interface props {
	post_id: number,
	forceUpdate: Function,
	likes: number,
	isLiked: boolean | null,
	isLoggedIn: boolean,
	setNotificationMessage: Function,
	setNotificationType: Function
}

function LikePostButton({post_id, forceUpdate, likes, isLiked, isLoggedIn, setNotificationMessage, setNotificationType}: props) {
	const navigate = useNavigate();

	async function onClickHandler() {
		if (isLoggedIn) {
			try {
				const response: any = await axios.post(`/post/${post_id}/${window.localStorage.getItem('id')}/like`);

				if (response.data.post_ownership) {
					setNotificationType("error");
					setNotificationMessage(response.data.message);
				}

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
		<button onClick={onClickHandler}><img src={isLiked ? like_icon_filled : like_icon}/>{likes}</button>
	)
}

export default LikePostButton;