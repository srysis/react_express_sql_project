import { useState, useEffect, useReducer } from 'react'

import axios from '../../api/axios'

import LikePostButton from "./LikePostButton"
import DislikePostButton from "./DislikePostButton"

import "../../style/post_page/rating.css"

import "../../style/mobile/post_page/rating.css"

interface props {
	post_id: number,
	isLoggedIn: boolean,
	setNotificationMessage: Function,
	setNotificationType: Function
}

function Rating({post_id, isLoggedIn, setNotificationMessage, setNotificationType}: props) {
	const [update_count, forceUpdate] = useReducer(x => x + 1, 0);

	const [likes, setLikes] = useState<number>(0);
	const [dislikes, setDislikes] = useState<number>(0);

	const [isLiked, setIsLiked] = useState<boolean | null>(null);
	const [isDisliked, setIsDisliked] = useState<boolean | null>(null);

	useEffect(() => {
		axios.get(`post/${post_id}/rating`)
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
		<div className="rating_container">
			<div>
				<LikePostButton 
					post_id={post_id} 
					forceUpdate={forceUpdate} 
					likes={likes} 
					isLiked={isLiked} 
					isLoggedIn={isLoggedIn} 
					setNotificationMessage={setNotificationMessage} 
					setNotificationType={setNotificationType}
				/>
			</div>
			<div>
				<DislikePostButton 
					post_id={post_id} 
					forceUpdate={forceUpdate} 
					dislikes={dislikes} 
					isDisliked={isDisliked} 
					isLoggedIn={isLoggedIn} 
					setNotificationMessage={setNotificationMessage} 
					setNotificationType={setNotificationType}
				/>
			</div>
		</div>
	)
}

export default Rating;