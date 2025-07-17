import Comment from "./Comment"

import "../../style/post_page/comments_section.css"

function CommentsSection({comments}) {
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