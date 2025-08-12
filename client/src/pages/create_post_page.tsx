import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import axios from '../api/axios'

import RegularPostForm from "../components/create_post_page/RegularPostForm"

interface props {
	USER_ID: string | number | null,
	logOff: Function
}

function CreatePostPage({USER_ID, logOff}: props) {
	const navigate = useNavigate();

	const { id } = useParams();

	useEffect(() => {
		if (window.localStorage.getItem('id') !== id || window.localStorage.getItem('id') !== USER_ID) {
			navigate(`/`);
		}
	}, [])

	return (
		<section id="create_post">
			<RegularPostForm USER_ID={USER_ID} logOff={logOff} />
		</section>
	)
}

export default CreatePostPage;