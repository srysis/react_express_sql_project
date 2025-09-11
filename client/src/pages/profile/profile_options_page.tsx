import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'

import "../../style/profile/profile_options_page.css"

import "../../style/mobile/profile/profile_options_page.css"

interface props {
	isAdmin: boolean
}

function ProfileOptionsPage({isAdmin}: props) {
	const { id } = useParams();

	const navigate = useNavigate();

	useEffect(() => {
		if (window.localStorage.getItem('id') !== id) navigate(`/user/${id}`);
	}, [])

	return(
		<section id="options">
			<div className="edit">
				<div><Link to={`/user/${id}/edit`}>Edit profile</Link></div>
				<p>Change your profile's name, description or avatar</p>
			</div>
			<div className="delete">
				<div><Link to={`/user/${id}/delete`}>Delete profile</Link></div>
				<p>Delete your profile and make it inaccessible</p>
			</div>
		</section>
	)
}

export default ProfileOptionsPage;