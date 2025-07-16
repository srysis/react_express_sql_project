import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import axios from './api/axios'
import { setAuthorizationHeader } from './tools/setHeaders'

import ProtectedRoutes from './tools/ProtectedRoutes'

import BaseLayout from './layout/Base'

import Home from './pages/home'

import RegistrationPage from './pages/auth/registration_page'
import LoginPage from './pages/auth/login_page'

import ProfilePage from './pages/profile/profile_page'
import ProfileOptionsPage from './pages/profile/profile_options_page'
import ProfileEditPage from './pages/profile/profile_edit_page'
import ProfileDeletePage from './pages/profile/profile_delete_page'

import CreatePostPage from './pages/create_post_page'

import PostPage from './pages/posts/post_page'
import PostEditPage from './pages/posts/post_edit_page'
import PostDeletePage from './pages/posts/post_delete_page'

import SearchPage from './pages/search_page'

import "./style/shared.css"

function App() {
	const stored_web_token = window.localStorage.getItem('t');
	const stored_user_ID = window.localStorage.getItem('id');

	let logged_in = null;

	if (stored_web_token && stored_user_ID) {
		logged_in = true;
	} else {
		logged_in = false;
	}

	const [isLoggedIn, setLoggedInState] = useState(logged_in);
	const [hasAdminRights, setHasAdminRights] = useState(false);

	const [notification_visible, setNotificationVisible] = useState(false);
	const [notification_message, setNotificationMessage] = useState("");

	useEffect(() => {
		if (stored_web_token && stored_user_ID) {
			setAuthorizationHeader(stored_web_token);

			axios.get(`/verify/${stored_user_ID}`)
			.then(response => {
				if (response.data.success) {
					setLoggedInState(true);

					if (response.data.admin) setHasAdminRights(true);
				} else {
					setLoggedInState(false);
				}
			})
			.catch(error => {
				if (!error.response.data.success) {
					setLoggedInState(false);
					setHasAdminRights(false);

					setAuthorizationHeader(null);

					window.localStorage.removeItem('t');
					window.localStorage.removeItem('id');

					console.error(error.response.data.message);
				}
			});
		} else {
			setLoggedInState(false);
			setHasAdminRights(false);

			setAuthorizationHeader(null);

			window.localStorage.removeItem('t');
			window.localStorage.removeItem('id');
		}
	}, [isLoggedIn])

	useEffect(() => {
		if (notification_message !== "") {
			setNotificationVisible(true);

			setTimeout(() => {
				setNotificationVisible(false);
				setNotificationMessage("");
			}, 3000);
		}

		return () => { setNotificationVisible(false); }
	}, [notification_message])


	function setLoggedInStateWrapper(value) {
		setLoggedInState(value);
	}

	function setHasAdminRightsWrapper(value) {
		setHasAdminRights(value);
	}

	function setNotificationMessageWrapper(message) {
		setNotificationMessage(message)
	}

	return (
		<BrowserRouter basename="/">
			<Routes>
				<Route element={<BaseLayout isLoggedIn={isLoggedIn} setLoggedIn={setLoggedInStateWrapper} notification_visible={notification_visible} notification_message={notification_message} />} >
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} setLoggedIn={setLoggedInStateWrapper} setHasAdminRights={setHasAdminRightsWrapper} />} />
					<Route path="/register" element={<RegistrationPage isLoggedIn={isLoggedIn} />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/user/:id" element={<ProfilePage isLoggedIn={isLoggedIn} isAdmin={hasAdminRights} />} />
					<Route path="/post/:post_id" element={<PostPage isLoggedIn={isLoggedIn} />} />

					<Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
						<Route path="/user/:id/options" element={<ProfileOptionsPage isLoggedIn={isLoggedIn} isAdmin={hasAdminRights} />} />
						<Route path="/user/:id/edit" element={<ProfileEditPage setNotificationMessage={setNotificationMessageWrapper} />} />
						<Route path="/user/:id/delete" element={<ProfileDeletePage isLoggedIn={isLoggedIn} setLoggedIn={setLoggedInStateWrapper} setHasAdminRights={setHasAdminRightsWrapper} />} />
						<Route path="/user/:id/create_post" element={<CreatePostPage isLoggedIn={isLoggedIn} USER_ID={stored_user_ID} setLoggedIn={setLoggedInStateWrapper} setHasAdminRights={setHasAdminRightsWrapper} />} />
						
						<Route path="/post/:post_id/edit" element={<PostEditPage />} />
						<Route path="/post/:post_id/delete" element={<PostDeletePage USER_ID={stored_user_ID} />} />
					</Route>

				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
