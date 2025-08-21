import { useState, useEffect, useReducer } from 'react'

import axios from '../../api/axios'

import LikePostButton from "./LikePostButton"
import DislikePostButton from "./DislikePostButton"

interface props {
	post_id: number,
	isLoggedIn: boolean
}

function Rating({post_id, isLoggedIn}: props) {
	const [update_count, forceUpdate] = useReducer(x => x + 1, 0);

	const [likes, setLikes] = useState<number>(0);
	const [dislikes, setDislikes] = useState<number>(0);

	const [isLiked, setIsLiked] = useState<boolean | null>(null);
	const [isDisliked, setIsDisliked] = useState<boolean | null>(null);

	useEffect(() => {
		axios.get(`post/${post_id}/get_rating`)
		.then((response: any) => {
			if (response.data.success) {
				setLikes(response.data.likes);
				setDislikes(response.data.dislikes);

				if (isLoggedIn) {
					axios.get(`post/${post_id}/${window.localStorage.getItem('id')}/check_if_rated`)
					.then((response: any) => {
						setIsLiked(response.data.liked);
						setIsDisliked(response.data.disliked);
					})
				}
			}
		})
		.catch((error: any) => { console.error(error); })
	}, [update_count])

	return (
		<>
			<p>{likes}<LikePostButton post_id={post_id} forceUpdate={forceUpdate} isLiked={isLiked} isLoggedIn={isLoggedIn}/></p>
			<p>{dislikes}<DislikePostButton post_id={post_id} forceUpdate={forceUpdate} isDisliked={isDisliked} isLoggedIn={isLoggedIn}/></p>
		</>
	)
}

export default Rating;