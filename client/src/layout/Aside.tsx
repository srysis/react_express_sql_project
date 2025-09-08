import { Link } from 'react-router-dom'

import "../style/mobile/layout/aside.css"

interface props {
	isLoggedIn: boolean,
	logOff: Function,
	visibility: boolean,
	setAsideVisibility: Function
}

function Aside({isLoggedIn, logOff, visibility, setAsideVisibility}: props) {
	const stored_user_id : string | null = window.localStorage.getItem('id');

	function onInteractHandler() {
		setAsideVisibility(false);
	}

	return(
		<aside className={visibility ? "active" : ""}>
			<div className="overlay" onClick={onInteractHandler}></div>
			<div id="content">
				{!isLoggedIn && 
					<span> 
						<Link id="log_in_button" to="/login" onClick={onInteractHandler}>Log In</Link>
					</span> 
				}
				<span><Link to="/search" onClick={onInteractHandler}>Search</Link></span>
				{ isLoggedIn && 
					<> 
						<span><Link to={`/user/${stored_user_id}`} onClick={onInteractHandler}>Profile</Link></span>
						<span><Link to={`/user/${stored_user_id}/create_post`} onClick={onInteractHandler}>Create a post</Link></span>
						<span><button id="log_off_button" onClick={() => { logOff(); }}>Log Off</button></span>
					</>
				}
			</div>
		</aside>
	)
}

export default Aside;