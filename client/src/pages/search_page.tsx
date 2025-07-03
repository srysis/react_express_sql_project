import { useState } from 'react'
import { Link } from 'react-router-dom'

import axios from '../api/axios'

import SearchResult from "../components/search_page/SearchResult"

import "../style/search_page/search_page.css"
import "../style/search_page/search_result.css"

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
		<section id="search">
			<div className="container">
				<h1>Search</h1>
				<form onSubmit={onSubmitHandler}>
					<div className="input_container">
						<input type="search" name="search_field" placeholder="Enter a name" autoComplete="off" onChange={onChangeHandler} />
					</div>
					<div className="button_container">
						<button>Search</button>
					</div>
				</form>
		
			{ isSearchFinished && 
				<section id="search_results">
					{search_results.length > 0 && 
						<> 
							<h3>{`Results for ${search_queue}`}</h3>
							<p style={ {'textAlign': 'left'} }>{`${search_results.length} entries found.`}</p>
						</>
					}
					{search_results?.map((user, index) => <SearchResult key={index} item={user} />)}
					{!search_results.length && <h3>No users found.</h3>}
				</section>
			}

			</div>
		</section>
	)
}

export default SearchPage;