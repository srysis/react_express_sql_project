import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'

import "../style/profile_page/profile_options_page.css"

function OptionsPage() {
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
			<div className="delete">
				<div><a href="">Delete profile</a></div>
			</div>
		</section>
	)
}

export default OptionsPage;