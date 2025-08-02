import acknowledge_icon from "../assets/success-icon.png"

import "../style/notification.css"

interface props {
	message: string
}

function NotificationMessage({message}: props) {
	return (
		<div id="notification">
			<div className="icon_container">
				<img src={acknowledge_icon} />
			</div>
			<div className="text_container">
				<p>{message}</p>
			</div>
		</div>
	);
}

export default NotificationMessage;
