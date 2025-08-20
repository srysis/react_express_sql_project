import axios from '../../api/axios'

interface props {
	post_id: number,
	forceUpdate: Function
}

function DislikePostButton({post_id, forceUpdate}: props) {

	async function onClickHandler() {
		try {
			const response: any = await axios.post(`/post/${post_id}/${window.localStorage.getItem('id')}/dislike`);

			console.log(response.data);

			if (response.data.success) {
				forceUpdate();
			}
		} catch (error: any) {
			console.error(error.response.data.message);
		}
	}

	return(
		<button onClick={onClickHandler}>Dislike</button>
	)
}

export default DislikePostButton;