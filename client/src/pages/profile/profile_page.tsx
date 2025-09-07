import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import axios from '../../api/axios'

import PostByUser from "../../components/profile_page/PostByUser"

import half_circle from "../../assets/half-circle.png"
import options_icon from "../../assets/gear-icon.png"

import "../../style/profile/profile_page.css"
import "../../style/profile/posts.css"

import "../../style/mobile/profile/profile_page.css"
import "../../style/mobile/profile/posts.css"

interface props {
	DEVICE_TYPE: string,
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

function ProfilePage({DEVICE_TYPE, isLoggedIn} : props) {
	function isVisibleInViewport(element: any, percentage: number) {
		let rect = element.getBoundingClientRect();
		let windowHeight = (window.innerHeight || document.documentElement.clientHeight);

		return !(
			Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)) < percentage ||
			Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentage
		)
	}

	const { id } = useParams();

	const [hasUserData, setHasUserData] = useState<boolean>(false);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [ownership, setOwnership] = useState<boolean>(false);

	const [arePostsRetrieved, setArePostsRetrieved] = useState<boolean>(false);
	const [user_posts, setUserPosts] = useState<Array<Post> | null>([]);
	const [isLoadingNewPosts, setIsLoadingNewPosts] = useState<boolean>(false);
	const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);

	const POST_LIMIT = 5;

	const [offset, setOffset] = useState<number>(0);

	useEffect(() => {
		return () => { window.removeEventListener("scroll", loadMorePosts) }
	}, [])

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

				axios.get(`/user/${id}/posts?limit=${POST_LIMIT}&offset=${offset}`)
				.then((response: any) => {
					if (response.data.posts) {
						setUserPosts([...(user_posts as []), ...response.data.posts]);

						const button = document.querySelector("button#load_more");

						if (button != null) {
							button.removeAttribute("disabled");
						}

						setIsLoadingNewPosts(false);
					} else {
						setIsLoadingNewPosts(false);
						setHasReachedEnd(true);
					}

					if (!arePostsRetrieved) setArePostsRetrieved(true);
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
	}, [id, offset]);

	function loadMorePosts() {
		const button = document.querySelector("button#load_more") as HTMLButtonElement;

		if (button != null) {
			if (isVisibleInViewport(button, 1)) {
				button.click();

				button.setAttribute("disabled", "");

				setIsLoadingNewPosts(true);
			}
		}
	}

	function increaseOffset() {
		const new_offset = offset + 5;

		setOffset(new_offset);
	}

	useEffect(() => {
		if (!hasReachedEnd) window.addEventListener("scroll", loadMorePosts);
		if (hasReachedEnd) window.removeEventListener("scroll", loadMorePosts);
	}, [hasReachedEnd]);

	if (hasUserData && userData !== null) {
		return(
			<section id="profile_page">

				{ 
					DEVICE_TYPE === "desktop" &&
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
						{ ownership &&
							<div id="options">
								<div title="Profile options">
									<Link to={`/user/${id}/options`}><img src={options_icon} /></Link>
								</div>
							</div>
						}
					</div>
				}

				{
					DEVICE_TYPE === "mobile" &&
					<div className="wrapper">
						<div id="profile_picture_and_name">
							<div className="picture_container">
								<div className="profile_picture_container">
									<img src={`${import.meta.env.VITE_IMAGE_STORAGE}${userData.profile_picture}`} />
								</div>
							</div>
							<div id="name">
								<h1>{userData.name}</h1>
							</div>
						</div>
						<div id="profile_info">
							<div id="description">
								<p>{userData.description ? userData.description : "No description."}</p>
							</div>
						</div>
						{
							ownership &&
							<div id="options">
								<div title="Profile options">
									<Link to={`/user/${id}/options`}>Profile options</Link>
								</div>
							</div>
						}
					</div>
				}
				
				{/* if posts are being loaded */}
				{
					!arePostsRetrieved && 
					<section id="loading">
						<div className="loading_spinner"><img src={half_circle}/></div>
					</section>
				}

				{/* if request has been completed and posts exist */}
				{ 
					arePostsRetrieved && (user_posts != undefined) && 
					<section id="posts_by_user">
						<h2>Recent posts</h2>
						{user_posts.map((post, index) => <PostByUser key={index} content={post} />)}
						<button type="button" id="load_more" onClick={increaseOffset} disabled={hasReachedEnd}>Load more posts</button>
						{(isLoadingNewPosts && !hasReachedEnd) && <div className="loading_spinner"><img src={half_circle}/></div>}
					</section> 
				}

				{/* if request has been completed, but posts do not exist */}
				{
					arePostsRetrieved && (user_posts == undefined) &&
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
	} else {
		return(
			<section id="loading">
				<div className="loading_spinner"><img src={half_circle}/></div>
			</section>
		)
	}
}

export default ProfilePage;