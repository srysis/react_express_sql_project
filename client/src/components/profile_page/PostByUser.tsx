import { Link } from 'react-router-dom'

function PostByUser({content}) {
	return (
		<article className="post">
			<div className="link_container">
				<div className="overlay">
					<Link to={`/post/${content.post_id}`}></Link>
				</div>
				<div className="post_content">
					<div className="title">
						<h3>{content.post_title}</h3>
					</div>
					<div className="content">
						<p>{content.post_content}</p>
					</div>
				</div>
			</div>
		</article>
	)
}

export default PostByUser;