import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import axios from '../../api/axios'

import PostByUser from "../../components/profile_page/PostByUser"

import options_icon from "../../assets/gear-icon.png"

import "../../style/profile/profile_page.css"
import "../../style/profile/posts.css"

interface props {
	isLoggedIn: boolean
}

type UserData = {
	user_id: number,
	name: string,
	description: string,
	profile_picture: string
}

type Post = {
	date_difference: string,
	post_author: number,
	post_author_avatar: string,
	post_author_name: string,
	post_content: string,
	post_date: string,
	post_id: number,
	post_title: string,
	post_type: string
}

function ProfilePage({isLoggedIn} : props) {
	const { id } = useParams();

	const [hasUserData, setHasUserData] = useState<boolean>(false);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [ownership, setOwnership] = useState<boolean>(false);

	const [arePostsRetrieved, setArePostsRetrieved] = useState<boolean>(false);
	const [user_posts, setUserPosts] = useState<Post[] | null>([]);

	useEffect(() => {
		if (isLoggedIn) {
			setOwnership(true);
		} else {
			setOwnership(false);
		}
	}, [isLoggedIn]);

	useEffect(() => {
		axios.get(`/user/${id}`)
		.then((response: any) => {
			if (response.data.user_info !== null) {
				setUserData(response.data.user_info);
			
				if (response.data.ownership) {
					setOwnership(true);
				} else {
					setOwnership(false);
				}

				axios.get(`/user/${id}/posts`)
				.then((response: any) => {
					setUserPosts(response.data.results);

					setArePostsRetrieved(true);
				})
				.catch((error: any) => console.log(error.response.data))

				setHasUserData(true);
			} else if (response.data.user_info === null) {
				setOwnership(false);
				setHasUserData(true);
				setUserData(null);
				setArePostsRetrieved(false);
				setUserPosts([]);
			}
		})
		.catch((error: any) => {
			console.error(error.response.data);

			setHasUserData(false);
			setUserData(null);
		}) 
	}, [id]);

	if (hasUserData && userData !== null) {
		return(
			<section id="profile_page">
				<div className="flex_wrapper">
					<div id="profile_picture">
						<div className="profile_picture_container">
							<img src={`${import.meta.env.VITE_IMAGE_STORAGE}${userData.profile_picture}`} />
						</div>
					</div>
					<div id="profile_info">
						<div id="name">
							<h1>{userData.name}</h1>
						</div>
						<div id="description">
							<p>{userData.description ? userData.description : "No description."}</p>
						</div>
					</div>
					<div id="options">
						{ 
							ownership && 
							<div title="Profile options">
								<Link to={`/user/${id}/options`}><img src={options_icon} /></Link>
							</div>
						}
					</div>
				</div>
				{ 
					arePostsRetrieved && (user_posts != undefined) && 
					<section id="posts_by_user">
						<h2>Recent posts</h2>
						{user_posts.map((post, index) => <PostByUser key={index} content={post} />)}
					</section> 
				}
				{
					user_posts == undefined &&
					<section id="posts_by_user">
						<h2>Recent posts</h2>
						<p style={{'padding': '20px 2vw', 'textAlign': 'left'}}>Seems like this user is not very active here...</p>
					</section> 
				}
			</section>
		)
	} else if (hasUserData && userData === null) {
		return(
			<section id="profile_page" className="missing">
				<h1>This user does not exist or was deleted.</h1>
			</section>
		)
	}
}

export default ProfilePage;