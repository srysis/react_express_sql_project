import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import axios from '../api/axios'

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
			<div>
				<h1>{`${userData.name}'s profile`}</h1>
				<h3>{userData.description}</h3>
				{ 
					ownership && 
					<>
						<p>this is your profile</p>
						<Link to={`/user/${id}/edit`}>Edit profile</Link>
						<br />
						<Link to={`/user/${id}/create_post`}>Create a post</Link>
					</>
				}
				{ ownership && isAdmin && <p>You are an admin. Rejoice.</p> }
				<br />
				{ 
					arePostsRetrieved && (user_posts != undefined) && 
					user_posts.map((post, index) => <h1 key={index}>{post.post_title}</h1>) 
				}
			</div>
		)
	}
	
}

export default ProfilePage;