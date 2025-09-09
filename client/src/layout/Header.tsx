import { Link } from 'react-router-dom'

import User from "../components/layout/User"

import bars_solid from "../assets/bars-solid.png"

import "../style/layout/header.css"
import "../style/mobile/layout/header.css"

interface props {
	DEVICE_TYPE: string,
	isLoggedIn: boolean,
	logOff: Function,
	setAsideVisibility: Function
}

function Header({DEVICE_TYPE, isLoggedIn, logOff, setAsideVisibility}: props) {
	const stored_user_id : string | null = window.localStorage.getItem('id');

	return(
		<header>
			{ DEVICE_TYPE === "mobile" && 
				<div id="toggle_aside">
					<button type="button" onTouchStart={() => {setAsideVisibility(true)}}><img src={bars_solid} /></button>
				</div>
			}
			<div id="logo_container">
				<h1><Link to="/">Forum</Link></h1>
			</div>
			{ DEVICE_TYPE === "desktop" &&
				<nav>
					<Link to="/search">Search</Link>
					
					{!isLoggedIn && 
						<> 
							<Link id="log_in_button" to="/login">Log In</Link>
						</> 
					}

					{isLoggedIn && 
						<> 
							<Link to={`/user/${stored_user_id}/create_post`}>Create a post</Link>
							<User DEVICE_TYPE={DEVICE_TYPE} USER_ID={stored_user_id} logOff={logOff} />
						</>
					}
				</nav>
			}
		</header>
	)
}

export default Header;