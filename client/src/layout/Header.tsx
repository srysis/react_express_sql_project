import { Link } from 'react-router-dom'

import User from "../components/layout/User"

import bars_solid from "../assets/bars-solid.png"

import "../style/layout/header.css"
import "../style/mobile/layout/header.css"

interface props {
	DEVICE_TYPE: string,
	isLoggedIn: boolean,
	isAdmin: boolean,
	logOut: Function,
	setAsideVisibility: Function
}

function Header({DEVICE_TYPE, isLoggedIn, isAdmin, logOut, setAsideVisibility}: props) {

	const stored_user_id: string | number | null = window.localStorage.getItem('id');

	return(
		<header>
			{ DEVICE_TYPE === "mobile" && 
				<div id="toggle_aside">
					<button type="button" onClick={() => {setAsideVisibility(true)}}><img src={bars_solid} /></button>
				</div>
			}
			<div id="logo_container">
				<h1><Link to="/">Forum</Link></h1>
			</div>
			{ DEVICE_TYPE === "desktop" &&
				<nav>
					<Link to="/search">Search users</Link>
					
					{!isLoggedIn && 
						<> 
							<Link id="log_in_button" to="/login">Log In</Link>
						</> 
					}

					{isLoggedIn && 
						<> 
							<Link to={`/user/${stored_user_id}/create_post`}>Create a post</Link>
							<User DEVICE_TYPE={DEVICE_TYPE} USER_ID={stored_user_id} isAdmin={isAdmin} logOut={logOut} />
						</>
					}
				</nav>
			}
			{ DEVICE_TYPE === "mobile" && 
				<nav>
					<User DEVICE_TYPE={DEVICE_TYPE} USER_ID={stored_user_id} isAdmin={isAdmin} logOut={logOut} />
				</nav>
			}
		</header>
	)
}

export default Header;