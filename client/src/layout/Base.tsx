import { Outlet } from 'react-router-dom'

import Header from "./Header"

import Notification from "../components/NotificationMessage"

function Base({isLoggedIn, setLoggedIn, notification_visible, notification_message}) {
	return(
		<>
			<Header isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
			{notification_visible && 
				<Notification message={notification_message} />
			}
			<main>
				<Outlet />
			</main>
		</>
	)
	
}

export default Base;