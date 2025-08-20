import axios from '../../api/axios'

interface props {
	post_id: number,
	forceUpdate: Function
}

function LikePostButton({post_id, forceUpdate}: props) {

	async function onClickHandler() {
		try {
			const response: any = await axios.post(`/post/${post_id}/${window.localStorage.getItem('id')}/like`);

			console.log(response.data);

			if (response.data.success) {
				forceUpdate();
			}
		} catch (error: any) {
			console.error(error.response.data.message);
		}
	}

	return(
		<button onClick={onClickHandler}>Like</button>
	)
}

export default LikePostButton;