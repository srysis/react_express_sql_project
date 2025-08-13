import { Link } from 'react-router-dom'

interface props {
	content : {
		date_difference: string,
		post_author: number,
		post_author_name: string,
		post_content: string,
		post_date: string,
		post_id: number,
		post_title: string,
		post_type: string
	}
}

function PostByUser({content} : props) {
	const { date_difference, post_content, post_date, post_id, post_title, post_type } = content;

	return (
		<article className="post">
			<div className="link_container">
				<div className="overlay">
					<Link to={`/post/${post_id}`}></Link>
				</div>
				<div className="post_content">
					<div className="title_and_date">
						<h3>{post_title}</h3>
						<span title={post_date.split("T")[0]}>{date_difference}</span>
					</div>
					<div className="content">
						<div className={post_type === "image" ? "image_container" : "text_container"}>
							{post_type === "text" && <p>{post_content}</p>}
							{post_type === "image" && <img src={`${import.meta.env.VITE_POST_IMAGE_STORAGE}${post_content}`} />}
						</div>
					</div>
				</div>
			</div>
		</article>
	)
}

export default PostByUser;