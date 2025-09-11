import { useState, useEffect } from 'react'
import { useNavigate } from "react-router"
import { Link } from 'react-router-dom'

import axios from '../../api/axios'

import down_arrow from "../../assets/down-arrow.png"
import up_arrow from "../../assets/up-arrow.png"
import gear_icon from "../../assets/gear-icon.png"
import logout_icon from "../../assets/logout.png"

interface props {
	DEVICE_TYPE: string,
	USER_ID: string,
	isAdmin: boolean,
	logOut: Function
}

type UserData = {
	user_id: number,
	name: string,
	description: string,
	profile_picture: string
}

function User({DEVICE_TYPE, USER_ID, isAdmin, logOut}: props) {
	const [hasUserData, setHasUserData] = useState<boolean>(false);
	const [userData, setUserData] = useState<UserData | null>(null);

	const [list_active, setListActive] = useState<boolean>(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (USER_ID) {
			axios.get(`/user/${USER_ID}`)
			.then((response: any) => {
				if (response.data.user_info != null) {
					setUserData(response.data.user_info);
					setHasUserData(true);
				} else {
					setUserData(null);
					setHasUserData(false);
				}
			})
		}
	}, [USER_ID])

	function toggleOptionsList() {
		const list_element: any = document.querySelector("div.user_actions_list");

		if (list_element) {
			list_element.classList.toggle("active");
			setListActive(!list_active);
		}
	}

	if (hasUserData && userData != null) {
		return(
			<div id="user">
				{ DEVICE_TYPE === "desktop" && <div className={list_active ? "list_overlay active" : "list_overlay"} onClick={toggleOptionsList}></div> }
				<div className="user_picture">
					<Link to={`/user/${USER_ID}`}><img src={`${import.meta.env.VITE_IMAGE_STORAGE}${userData.profile_picture}`} /></Link>
					{ isAdmin && (DEVICE_TYPE === "mobile") && <p className="admin_tag">Admin</p> }
				</div>
				
				{ DEVICE_TYPE === "desktop" &&
					<>
						<div className="user_name">
							<p><Link to={`/user/${USER_ID}`}>{userData.name}</Link></p>
							{ isAdmin && <p className="admin_tag">Administrator</p> }
						</div> 
						<div className="user_actions">
							<button onClick={toggleOptionsList}><img src={list_active ? up_arrow : down_arrow} /></button>
							<div className="user_actions_list">
								<button onClick={() => { navigate(`/user/${USER_ID}/options`); toggleOptionsList(); }}><img src={gear_icon} />Options</button>
								<button onClick={() => { logOut() }}><img src={logout_icon} />Log Out</button>
							</div>
						</div>
					</>
				}
			</div>
		)
	}
	
}

export default User;