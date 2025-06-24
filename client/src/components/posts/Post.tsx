import { Link } from 'react-router-dom'


function Post({content}) {
	return (
		<article className="post">
			<div className="post_title">
				<p>{content.post_content}</p>
			</div>
			<div className="post_author">
				<Link to={`/user/${content.post_author}`}>{content.post_author_name}</Link>
			</div>
		</article>
	)
}

export default Post;