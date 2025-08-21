import { useNavigate } from 'react-router'

import axios from '../../api/axios'

interface props {
	post_id: number,
	forceUpdate: Function,
	isLiked: boolean,
	isLoggedIn: boolean
}

function LikePostButton({post_id, forceUpdate, isLiked, isLoggedIn}: props) {
	const navigate = useNavigate();

	async function onClickHandler() {
		if (isLoggedIn) {
			try {
				const response: any = await axios.post(`/post/${post_id}/${window.localStorage.getItem('id')}/like`);

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
		<button onClick={onClickHandler}>Like</button>
	)
}

export default LikePostButton;