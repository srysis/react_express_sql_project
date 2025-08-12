import acknowledge_icon from "../assets/success-icon.png"
import error_icon from "../assets/error-icon.png"

import "../style/notification.css"

interface props {
	message: string,
	type: string
}

function NotificationMessage({message, type}: props) {
	return (
		<div id="notification" className={type === "success" ? "success" : "error"}>
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
