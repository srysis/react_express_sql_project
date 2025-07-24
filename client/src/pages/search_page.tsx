import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import axios from '../api/axios'

import SearchResult from "../components/search_page/SearchResult"

import "../style/search_page/search_page.css"
import "../style/search_page/search_result.css"

function SearchPage() {
	const [search_queue, setSearchQueue] = useState("");
	const [search_results, setSearchResults] = useState([]);
	const [isSearchFinished, setSearchFinished] = useState(false);

	useEffect(() => {
		document.querySelector("input[type='search']").addEventListener("blur", onBlurHandler, {once: true});
	}, [])

	function onBlurHandler(event) {
		setSearchQueue(event.target.value);
	}

	async function onSubmitHandler(event) {
		event.preventDefault();

		setSearchQueue(() => {
			const new_search_queue = event.target.elements[0].value;

			axios.get(`/search/${new_search_queue}`)
			.then(response => {
				setSearchResults(response.data.results);
				setSearchFinished(true);
			})
			.catch(error => {
				console.error(error.response)
			});

			return new_search_queue;
		});
	}

	return(
		<section id="search">
			<div className="container">
				<h1>Search users</h1>
				<form onSubmit={onSubmitHandler}>
					<div className="input_container">
						<input type="search" name="search_field" placeholder="Search for user" autoComplete="off" />
					</div>
					<div className="button_container">
						<button>Search</button>
					</div>
				</form>
		
			{ isSearchFinished && 
				<section id="search_results">
					{search_results.length > 0 && 
						<> 
							<h3>{`Results for "${search_queue}"`}</h3>
							<p style={ {'textAlign': 'left'} }>{`${search_results.length} entries found.`}</p>
						</>
					}
					{search_results?.map((user, index) => <SearchResult key={index} user={user} />)}
					{!search_results.length && <h3>No users found.</h3>}
				</section>
			}

			</div>
		</section>
	)
}

export default SearchPage;