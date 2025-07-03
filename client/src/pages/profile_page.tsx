import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import axios from '../api/axios'

import PostByUser from "../components/profile_page/PostByUser"

import "../style/profile_page/profile_page.css"
import "../style/profile_page/posts.css"

function ProfilePage({isLoggedIn, isAdmin}) {
	const { id } = useParams();

	const [hasUserData, setHasUserData] = useState(false);
	const [userData, setUserData] = useState({});
	const [ownership, setOwnership] = useState(false);

	const [arePostsRetrieved, setArePostsRetrieved] = useState(false);
	const [user_posts, setUserPosts] = useState([]);

	useEffect(() => {
		if (!hasUserData) {
			axios.get(`/user/${id}`)
			.then(response => {
				setUserData(response.data.user_info);
				
				if (response.data.ownership) {
					setOwnership(true);
				} else {
					setOwnership(false);
				}

				axios.get(`/user/${id}/posts`)
				.then(response => {
					setUserPosts(response.data.results);

					setArePostsRetrieved(true);
				})
				.catch(error => console.log(error.response.data))

				setHasUserData(true);
			})
			.catch(error => {
				setHasUserData(false);
				setUserData({});
			}) 
		}
	}, []);

	useEffect(() => {
		if (isLoggedIn) {
			setOwnership(true);
		} else {
			setOwnership(false);
		}
	}, [isLoggedIn]);

	useEffect(() => {
		axios.get(`/user/${id}`)
		.then(response => {
			setUserData(response.data.user_info);
			
			if (response.data.ownership) {
				setOwnership(true);
			} else {
				setOwnership(false);
			}

			axios.get(`/user/${id}/posts`)
			.then(response => {
				setUserPosts(response.data.results);

				setArePostsRetrieved(true);
			})
			.catch(error => console.log(error.response.data))

			setHasUserData(true);
		})
		.catch(error => {
			setHasUserData(false);
			setUserData({});
		}) 
	}, [id])

	if (hasUserData) {
		return(
			<section id="profile_page">
				<div className="flex_wrapper">
					<div id="profile_info">
						<div id="name">
							<h1>{userData.name}</h1>
						</div>
						<div id="description">
							<p>{userData.description}</p>
						</div>
					</div>
					<div id="options">
						{ 
							ownership && 
							<div>
								<Link to={`/user/${id}/edit`}>Edit profile</Link>
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
	}
	
}

export default ProfilePage;