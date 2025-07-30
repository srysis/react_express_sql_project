import { Link } from 'react-router-dom'

function Comment({comment}) {
	return(
		<article className="comment">
			<div className="comment_info">
				<div className="image_container">
					<img src={`http://localhost:8081/${comment.comment_author_profile_picture}`} />
				</div>
				<div className="author">
					<p><Link to={`/user/${comment.comment_author}`}><span>{comment.comment_author_name}</span></Link></p>
				</div>
				<div className="date">
					<p title={comment.comment_date.split("T")[0]}>{comment.date_difference}</p>
				</div>
				
			</div>
			<div className="comment_content">
				<p>{comment.content}</p>
			</div>
		</article>
	)
}

export default Comment;