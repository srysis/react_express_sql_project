import { Link } from 'react-router-dom'

import "../style/layout/header.css"

interface props {
	isLoggedIn: boolean,
	logOff: Function
}

function Header({isLoggedIn, logOff}: props) {
	const stored_user_id : string | null = window.localStorage.getItem('id');

	return(
		<header>
			<div id="logo_container">
				<h1><Link to="/">Logo</Link></h1>
			</div>
			<nav>
				<Link to="/search">Search</Link>
				
				{!isLoggedIn && 
					<> 
						<Link id="log_in_button" to="/login">Log In</Link>
					</> 
				}

				{isLoggedIn && 
					<> 
						<Link to={`/user/${stored_user_id}`}>Profile</Link>
						<Link to={`/user/${stored_user_id}/create_post`}>Create a post</Link>
						<button id="log_off_button" onClick={() => { logOff(); }}>Log Off</button>
					</>
				}

			</nav>
		</header>
	)
}

export default Header;