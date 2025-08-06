import { Link } from 'react-router-dom'

interface props {
	content : {
		date_difference: string,
		post_author_name: string,
		post_author_avatar: string,
		post_id: number,
		post_title: string,
		post_content: string,
		post_date: string,
		post_author: number
	}
}

function Post({content}: props) {
	return (
		<article className="post">
			<div className="link_container">
				<div className="overlay">
					<Link to={`/post/${content.post_id}`}></Link>
				</div>
				<div className="post_author">
					<div className="image_container">
						{/*<Link to={`/user/${content.post_author}`}><img src={`http://localhost:8081/${content.post_author_avatar}`} /></Link>*/}
					<Link to={`/user/${content.post_author}`}><img src={`${process.env.VITE_IMAGE_STORAGE}${content.post_author_avatar}`} /></Link>
					</div>
					<div className="name_and_date">
						<div className="name">
							<Link to={`/user/${content.post_author}`}>{content.post_author_name}</Link>
						</div>
						<div className="date">
							<span>{content.date_difference}</span>
						</div>
					</div>
					
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