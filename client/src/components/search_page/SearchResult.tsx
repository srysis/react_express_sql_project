import { Link } from 'react-router-dom'

function SearchResult({user}) {
	return(
		<div className="search_result">
			<div className="link_container">
				<div className="overlay">
					<Link to={`/user/${user.user_id}`}></Link>
				</div>
				<div className="profile_picture">
					<img src={`http://localhost:8081/${user.profile_picture}`} />
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