import { Link } from 'react-router-dom'

function SearchResult({item}) {
	return(
		<div className="search_result">
			<div className="link_container">
				<div className="overlay">
					<Link to={`/user/${item.user_id}`}></Link>
				</div>
				<div className="user">
					<p>{item.name}</p>
				</div>
			</div>

		</div>
	)
}

export default SearchResult;