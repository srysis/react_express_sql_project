import acknowledge_icon from "../assets/success-icon.png"
import error_icon from "../assets/error-icon.png"

import "../style/notification.css"
import "../style/mobile/notification.css"

interface props {
	message: string,
	type: string,
	setNotificationMessage: Function, 
	setNotificationType: Function
}

function NotificationMessage({message, type, setNotificationMessage, setNotificationType}: props) {
	return (
		<div id="notification" className={type === "success" ? "success" : "error"}>
			<div className="overlay" onClick={() => { setNotificationMessage(""); setNotificationType("") }}></div>
			<div className="icon_container">
				<img src={type === "success" ? acknowledge_icon : error_icon} />
			</div>
			<div className="text_container">
				<p>{message}</p>
			</div>
		</div>
	);
}

export default NotificationMessage;
