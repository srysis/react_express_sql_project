import { Link } from 'react-router-dom'

interface props {
	comment: {
		comment_id: number,
		content: string,
		comment_date: string,
		post_id: number,
		comment_author: number,
		comment_author_name: string,
		comment_author_profile_picture: string,
		date_difference: string
	}
}

function Comment({comment}: props) {
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