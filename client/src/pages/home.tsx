import axios from '../api/axios'
import { useState, useEffect } from 'react'

import Post from "../components/home/Post"

import "../style/home/posts.css"

type Post = {
	date_difference: string,
	post_author: number,
	post_author_avatar: string,
	post_author_name: string,
	post_content: string,
	post_date: string,
	post_id: number
	post_title: string,
	post_type: string
}

function Home() {
	const [arePostsRetrieved, setArePostsRetrieved] = useState<boolean>(false);
	const [retrieved_posts, setRetrievedPosts] = useState<Array<Post>>([]);

	useEffect(() => {
		axios.get('/posts')
		.then((response: any) => {
			setRetrievedPosts(response.data.posts);
			setArePostsRetrieved(true);
		})
		.catch((error: any) => console.log(error.response.data));
	}, []);

	if (arePostsRetrieved && retrieved_posts != undefined) {
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