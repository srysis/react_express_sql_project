import { Link } from 'react-router-dom'

interface props {
	content: {
		date_difference: string,
		post_author_name: string,
		post_author_avatar: string,
		post_id: number,
		post_title: string,
		post_content: string,
		post_date: string,
		post_author: number,
		post_type: string
	}
}

function Post({content}: props) {
	const { date_difference, post_author_name, post_author_avatar, post_id, post_title, post_content, post_date, post_author, post_type } = content;

	return (
		<article className="post">
			<div className="link_container">
				<div className="overlay">
					<Link to={`/post/${post_id}`}></Link>
				</div>
				<div className="post_author">
					<div className="image_container">
						<Link to={`/user/${post_author}`}><img src={`${import.meta.env.VITE_IMAGE_STORAGE}${post_author_avatar}`} /></Link>
					</div>
					<div className="name_and_date">
						<div className="name">
							<Link to={`/user/${post_author}`}>{post_author_name}</Link>
						</div>
						<div className="date">
							<span>{date_difference}</span>
						</div>
					</div>
					
				</div>	
				<div className="post_content">
					<div className="title">
						<h1>{post_title}</h1>
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

export default Post;