import { Link } from 'react-router-dom'

function Comment({comment}) {
	return(
		<article className="comment">
			<div className="comment_info">
				<p><Link to={`/user/${comment.comment_author}`}><span>{comment.comment_author_name}</span></Link> - {comment.comment_date}</p>
			</div>
			<div className="comment_content">
				<p>{comment.content}</p>
			</div>
		</article>
	)
}

export default Comment;