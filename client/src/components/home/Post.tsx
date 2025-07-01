import { Link } from 'react-router-dom'


function Post({content}) {
	return (
		<article className="post">
			<div className="post_author">
				<Link to={`/user/${content.post_author}`}>{content.post_author_name}</Link>
			</div>
			<div className="link_container">
				<div className="overlay">
					<Link to={`/post/${content.post_id}`}></Link>
				</div>
				<div className="post_content">
					<div className="post_title">
						<h1>{content.post_title}</h1>
					</div>
				</div>
			</div>
		</article>
	)
}

export default Post;