import axios from '../api/axios'
import { useState, useEffect } from 'react'

import Post from "../components/home/Post"

import "../style/home/home.css"
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
	function isVisibleInViewport(element: any, percentage: number) {
		let rect = element.getBoundingClientRect();
		let windowHeight = (window.innerHeight || document.documentElement.clientHeight);

		return !(
			Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)) < percentage ||
			Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentage
		)
	}

	const [arePostsRetrieved, setArePostsRetrieved] = useState<boolean>(false);
	const [retrieved_posts, setRetrievedPosts] = useState<Array<Post>>([]);
	const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);

	const POST_LIMIT = 5;

	const [offset, setOffset] = useState<number>(0);

	useEffect(() => {
		axios.get(`/posts?limit=${POST_LIMIT}&offset=${offset}`)
		.then((response: any) => {
			if (response.data.posts) {
				setRetrievedPosts([...retrieved_posts, ...response.data.posts]);

				const button = document.querySelector("button#load_more");

				if (button != null) {
					button.removeAttribute("disabled");
				}
			} else {
				setHasReachedEnd(true);
			}

			if (!arePostsRetrieved) setArePostsRetrieved(true);
		})
		.catch((error: any) => console.log(error.response.data));
	}, [offset]);

	function loadMorePosts() {
		const button = document.querySelector("button#load_more") as HTMLButtonElement;

		if (button != null) {
			if (isVisibleInViewport(button, 1)) {
				button.click();

				button.setAttribute("disabled", "");
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

	if (arePostsRetrieved && retrieved_posts != undefined) {
		return(
			<section id="home">
				<section id="posts">
					{retrieved_posts.map((post, index) => <Post key={index} content={post} />)}
				</section>
				<button type="button" id="load_more" onClick={increaseOffset} disabled={hasReachedEnd}>Load more posts</button>
			</section>
		)
	}
	
}

export default Home;