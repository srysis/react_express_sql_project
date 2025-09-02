import { useState, useEffect } from 'react'

import axios from '../api/axios'

import SearchResult from "../components/search_page/SearchResult"

import half_circle from "../assets/half-circle.png"

import "../style/search_page/search_page.css"
import "../style/search_page/search_result.css"

type User = {
	description: string,
	name: string,
	profile_picture: string,
	user_id: number
}

function SearchPage() {
	const [search_queue, setSearchQueue] = useState<string>("");
	const [search_results, setSearchResults] = useState<Array<User>>([]);
	const [search_in_progress, setSearchInProgress] = useState<boolean>(false);
	const [isSearchFinished, setSearchFinished] = useState<boolean>(false);

	useEffect(() => {
		document.querySelector("input[type='search']")?.addEventListener("blur", onBlurHandler, {once: true});
	}, [])

	function onBlurHandler(event: any) {
		setSearchQueue(event.target.value);
	}

	async function onSubmitHandler(event: any) {
		event.preventDefault();

		setSearchFinished(false);
		setSearchInProgress(true);
		setSearchResults([]);

		const button = document.querySelector("div.button_container > button");
		if (button) { 
			button.setAttribute("disabled", true.toString());
		}

		setSearchQueue(() => {
			const new_search_queue : string = event.target.elements[0].value;

			axios.get(`/search/${new_search_queue}`)
			.then((response: any) => {
				setSearchResults(response.data.results);
				setSearchFinished(true);

				if (button) button.removeAttribute("disabled");
			})
			.catch((error: any) => {
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
							{search_results.map((user, index) => <SearchResult key={index} user={user} />)}
						</>
					}
					{!search_results.length && <h3>No users found.</h3>}
				</section>
			}

			{ search_in_progress && !search_results.length && 
				<section id="loading">
					<div className="loading_spinner"><img src={half_circle}/></div>
				</section>
			}

			</div>
		</section>
	)
}

export default SearchPage;