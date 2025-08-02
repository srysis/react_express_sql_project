import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'

import "../../style/profile/profile_options_page.css"

interface props {
	isAdmin: boolean
}

function ProfileOptionsPage({isAdmin}: props) {
	const { id } = useParams();

	const navigate = useNavigate();

	useEffect(() => {
		if (window.localStorage.getItem('id') !== id) navigate(`/user/${window.localStorage.getItem('id')}/options`);
	}, [])

	return(
		<section id="options">
			<div className="edit">
				<div><Link to={`/user/${id}/edit`}>Edit profile</Link></div>
			</div>
			{!isAdmin && 
				<div className="delete">
					<div><Link to={`/user/${id}/delete`}>Delete profile</Link></div>
				</div>
			}
		</section>
	)
}

export default ProfileOptionsPage;