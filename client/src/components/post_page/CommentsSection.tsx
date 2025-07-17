import Comment from "./Comment"

import "../../style/post_page/comments_section.css"

function CommentsSection({comments}) {
	return(
		<section id="comments">
			{comments.map((comment, index) => <Comment key={index} comment={comment} />)}
		</section>
	)
}

export default CommentsSection;