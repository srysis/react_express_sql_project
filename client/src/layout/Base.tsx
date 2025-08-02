import { Outlet } from 'react-router-dom'

import Header from "./Header"

import Notification from "../components/NotificationMessage"

interface props {
	isLoggedIn: boolean,
	logOff: Function,
	notification_visible: boolean,
	notification_message: string
}

function Base({isLoggedIn, logOff, notification_visible, notification_message}: props) {
	return(
		<>
			<Header isLoggedIn={isLoggedIn} logOff={logOff} />
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