import { Link } from 'react-router-dom'

interface props {
	content : {
		date_difference: string,
		post_author: number,
		post_author_name: string,
		post_content: string,
		post_date: string,
		post_id: number,
		post_title: string
	}
}

function PostByUser({content} : props) {
	return (
		<article className="post">
			<div className="link_container">
				<div className="overlay">
					<Link to={`/post/${content.post_id}`}></Link>
				</div>
				<div className="post_content">
					<div className="title_and_date">
						<h3>{content.post_title}</h3>
						<span title={content.post_date.split("T")[0]}>{content.date_difference}</span>
					</div>
					<div className="content">
						<p>{content.post_content.length > 1000 ? content.post_content.slice(0, 1000) + "..." : content.post_content}</p>
					</div>
				</div>
			</div>
		</article>
	)
}

export default PostByUser;