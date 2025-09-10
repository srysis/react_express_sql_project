import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Header from "./Header"
import Aside from './Aside'

import Notification from "../components/NotificationMessage"

interface props {
	DEVICE_TYPE: string,
	isLoggedIn: boolean,
	logOut: Function,
	notification_visible: boolean,
	notification_message: string,
	notification_type: string
}

function Base({DEVICE_TYPE, isLoggedIn, logOut, notification_visible, notification_message, notification_type}: props) {
	const [aside_visibility, setAsideVisibility] = useState<boolean>(false);

	function setAsideVisibilityWrapper(value: boolean) {
		setAsideVisibility(value);
	}

	return(
		<>
			<Header DEVICE_TYPE={DEVICE_TYPE} isLoggedIn={isLoggedIn} logOut={logOut} setAsideVisibility={setAsideVisibilityWrapper} />
			{ DEVICE_TYPE === "mobile" && <Aside isLoggedIn={isLoggedIn} logOut={logOut} visibility={aside_visibility} setAsideVisibility={setAsideVisibilityWrapper} /> }
			{notification_visible && 
				<Notification message={notification_message} type={notification_type} />
			}
			<main>
				<Outlet />
			</main>
		</>
	)
	
}

export default Base;