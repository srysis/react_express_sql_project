import { Link } from 'react-router-dom'

import create_post_icon from "../assets/create-post-icon.png"
import search_icon from "../assets/search-icon.png"
import login_icon from "../assets/login-icon.png"
import logout_icon from "../assets/logout.png"

import "../style/mobile/layout/aside.css"

interface props {
	isLoggedIn: boolean,
	logOut: Function,
	visibility: boolean,
	setAsideVisibility: Function
}

function Aside({isLoggedIn, logOut, visibility, setAsideVisibility}: props) {
	const stored_user_id : string | null = window.localStorage.getItem('id');

	function onInteractHandler() {
		setAsideVisibility(false);
	}

	return(
		<aside className={visibility ? "active" : ""}>
			<div className="overlay" onTouchStart={onInteractHandler}></div>
			<div id="content">
				{!isLoggedIn && 
					<span> 
						<Link id="log_in_button" to="/login" onClick={onInteractHandler}><img src={login_icon} />Log In</Link>
					</span> 
				}
				
				{ isLoggedIn && 
					<> 
						<span><Link to={`/user/${stored_user_id}/create_post`} onClick={onInteractHandler}><img src={create_post_icon} />Create a post</Link></span>
					</>
				}
				<span><Link to="/search" onClick={onInteractHandler}><img src={search_icon} />Search users</Link></span>
				{ isLoggedIn && <span><button id="log_off_button" onClick={() => { logOut(); }}><img src={logout_icon}/>Log Out</button></span> }
			</div>
		</aside>
	)
}

export default Aside;