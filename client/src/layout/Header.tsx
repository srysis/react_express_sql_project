import { Link } from 'react-router-dom'

import { setAuthorizationHeader } from '../tools/setHeaders'

import "../style/layout/header.css"

function Header({isLoggedIn, logOff}) {
	const stored_user_id = window.localStorage.getItem('id');

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