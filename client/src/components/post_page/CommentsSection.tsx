import Comment from "./Comment"

import "../../style/post_page/comments_section.css"

interface props {
	comments : {
		comment_id: number,
		content: string,
		comment_date: string,
		post_id: number,
		comment_author: number,
		comment_author_name: string,
		comment_author_profile_picture: string,
		date_difference: string
	}[]
}

function CommentsSection({comments}: props) {
	if (comments.length) {
		return(
			<section id="comments">
				{comments.map((comment, index) => <Comment key={index} comment={comment} />)}
			</section>
		)
	} else {
		return(
			<section id="comments" className="empty">
				<p>No comments yet.</p>
			</section>
		)
	}
	
}

export default CommentsSection;