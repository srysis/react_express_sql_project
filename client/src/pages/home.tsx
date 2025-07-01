import axios from '../api/axios'
import { useState, useEffect } from 'react'

import Post from "../components/posts/Post"

import "../style/home/posts.css"

function Home() {
	const [arePostsRetrieved, setArePostsRetrieved] = useState(false);
	const [retrieved_posts, setRetrievedPosts] = useState([]);

	useEffect(() => {
		axios.get('/posts')
		.then(response => {
			setRetrievedPosts(response.data.posts);
			setArePostsRetrieved(true);
		})
		.catch(error => console.log(error.response.data));
	}, []);

	if (arePostsRetrieved) {
		return(
			<section id="home">
				<section id="posts">
					{retrieved_posts.map((post, index) => <Post key={index} content={post} />)}
				</section>
			</section>
		)
	}
	
}

export default Home;