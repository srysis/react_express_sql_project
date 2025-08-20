import { useState, useEffect, useReducer } from 'react'

import axios from '../../api/axios'

import LikePostButton from "./LikePostButton"
import DislikePostButton from "./DislikePostButton"

interface props {
	post_id: number
}

function Rating({post_id}: props) {
	const [update_count, forceUpdate] = useReducer(x => x + 1, 0);

	const [likes, setLikes] = useState<number>(0);
	const [dislikes, setDislikes] = useState<number>(0);

	useEffect(() => {
		axios.get(`post/${post_id}/get_rating`)
		.then((response: any) => {
			if (response.data.success) {
				setLikes(response.data.likes);
				setDislikes(response.data.dislikes);
			}
		})
		.catch((error: any) => { console.error(error); })
	}, [update_count])

	return (
		<>
			<p>{likes}<LikePostButton post_id={post_id} forceUpdate={forceUpdate}/></p>
			<p>{dislikes}<DislikePostButton post_id={post_id} forceUpdate={forceUpdate}/></p>
		</>
	)
}

export default Rating;