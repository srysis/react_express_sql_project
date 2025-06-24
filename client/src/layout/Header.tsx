import { Link } from 'react-router-dom'

import { setAuthorizationHeader } from '../tools/setHeaders'

function Header({isLoggedIn, setLoggedIn}) {
	const stored_user_id = window.localStorage.getItem('id');

	function logOff() {
		setAuthorizationHeader(null);

		window.localStorage.removeItem('t');
		window.localStorage.removeItem('id');

		setLoggedIn(false);
	}

	return(
		<header>
			<h1>Header</h1>
			<div>
				<Link to="/">Go home</Link>
				<Link to="/search">Search</Link>
				
				{!isLoggedIn && 
					<> 
						<Link to="/login">Login</Link>
					</> 
				}

				{isLoggedIn && 
					<> 
						<button onClick={logOff}>Logoff</button>
						<Link to={`/user/${stored_user_id}`}>Profile</Link>
					</>
				}


			</div>
		</header>
	)
}

export default Header;