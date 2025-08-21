import { useNavigate } from 'react-router'

import axios from '../../api/axios'

interface props {
	post_id: number,
	forceUpdate: Function,
	isDisliked: boolean,
	isLoggedIn: boolean
}

function DislikePostButton({post_id, forceUpdate, isDisliked, isLoggedIn}: props) {
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
		<button onClick={onClickHandler}>Dislike</button>
	)
}

export default DislikePostButton;