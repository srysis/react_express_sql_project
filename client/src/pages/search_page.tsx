import { useState } from 'react'
import { Link } from 'react-router-dom'

import axios from '../api/axios'

function SearchPage() {
	const [search_queue, setSearchQueue] = useState("");
	const [search_results, setSearchResults] = useState([]);
	const [isSearchFinished, setSearchFinished] = useState(false);

	function onChangeHandler(event) {
		setSearchQueue(event.target.value);
	}

	function onSubmitHandler(event) {
		event.preventDefault();

		axios.get(`/search/${search_queue}`,)
		.then(response => {
			setSearchResults(response.data.results);
			setSearchFinished(true);
		})
		.catch(error => {
			console.error(error.response.data)
		})
	}

	return(
		<div>
			<h1>Search</h1>
			<form onSubmit={onSubmitHandler}>
				<input type="search" name="search_queue" placeholder="Enter a name" autoComplete="off" onChange={onChangeHandler} />
				<button>Search</button>
			</form>

			{ isSearchFinished && 
				<div>
					{search_results.map((user, index) => {
						return <>
							<Link to={`/user/${user.user_id}`} key={index}>{user.name}</Link>
							<br />
						</>
					})}
					{!search_results.length && <div>No results.</div>}
				</div>
			}
		</div>
	)
}

export default SearchPage;