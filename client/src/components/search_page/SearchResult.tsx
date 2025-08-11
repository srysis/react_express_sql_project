import { Link } from 'react-router-dom'

interface props {
	user : {
		description : string,
		name: string,
		profile_picture: string,
		user_id: number 
	} 
}

function SearchResult({user} : props) {
	return(
		<div className="search_result">
			<div className="link_container">
				<div className="overlay">
					<Link to={`/user/${user.user_id}`}></Link>
				</div>
				<div className="profile_picture">
					<img src={`${import.meta.env.VITE_IMAGE_STORAGE}${user.profile_picture}`} />
				</div>
				<div className="user_info">
					<p>{user.name}</p>
					<p>{user.description}</p>
				</div>
			</div>
		</div>
	)
}

export default SearchResult;