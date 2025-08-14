import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { disableReactDevTools } from '@fvilers/disable-react-devtools'

import axios from './api/axios.js'
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

if (import.meta.env.PROD) {
	disableReactDevTools();
}

class UnexpectedParameterError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnexpectedParameterError";
	}
}

function App() {
	const stored_web_token: string | number | null = window.localStorage.getItem('t');
	const stored_user_ID: string | number | null = window.localStorage.getItem('id');

	let logged_in = null;

	if (stored_web_token && stored_user_ID) {
		logged_in = true;
	} else {
		logged_in = false;
	}

	const [isLoggedIn, setLoggedInState] = useState<boolean>(logged_in);
	const [hasAdminRights, setHasAdminRights] = useState<boolean>(false);

	const [notification_visible, setNotificationVisible] = useState<boolean>(false);
	const [notification_type, setNotificationType] = useState<string>("");
	const [notification_message, setNotificationMessage] = useState<string>("");


	useEffect(() => {
		if (stored_web_token && stored_user_ID) {
			setAuthorizationHeader(stored_web_token);

			axios.get(`/auth/verify/${stored_user_ID}`)
			.then((response: any) => {
				if (!response.data.success) {
					logOff();
				}
			})
			.catch((error: any) => {
				if (!error.response.data.success && error.response.data.refreshable) {
					axios.post(`/auth/refresh/${stored_user_ID}`)
					.then((response: any) => {
						if (response.data.success) {
							const token = response.data.token;

							window.localStorage.setItem('t', token);

							setAuthorizationHeader(token);
						} else {
							logOff();
						}
					})
					.catch(() => { logOff(); })
				} else {
					logOff();
				}
			});
		} else {
			logOff();
		}
	}, [isLoggedIn])


	useEffect(() => {
		if (notification_message !== "") {
			setNotificationVisible(true);

			setTimeout(() => {
				setNotificationVisible(false);
				setNotificationMessage("");
				setNotificationType("");
			}, 3000);
		}

		return () => { setNotificationVisible(false); }
	}, [notification_message])


	function setNotificationMessageWrapper(message: string) {
		setNotificationMessage(message)
	}

	function setNotificationTypeWrapper(type: string) {
		switch(type) {
			case "success":
				setNotificationType("success");
				break;
			case "error":
				setNotificationType("error");
				break;
			case "":
				setNotificationType("");
				break;
			default:
				throw new UnexpectedParameterError(`Values 'success' or 'error' are expected, but instead '${type}' was received`);
				break;
		}
	}

	function logIn(login_data: any) {
		const token = login_data.token;
		const user_id = login_data.user_id;

		window.localStorage.setItem('t', token);
		window.localStorage.setItem('id', user_id);

		setAuthorizationHeader(token);

		setLoggedInState(true);

		if (login_data.admin) setHasAdminRights(true);
	}

	function logOff() {
		if (stored_web_token && stored_user_ID) {
			axios.post('/auth/logoff')
			.then((response: any) => {
				if (response.data.success) {
					setLoggedInState(false);
					setHasAdminRights(false);

					setAuthorizationHeader(null);

					window.localStorage.removeItem('t');
					window.localStorage.removeItem('id');
				}
			})
		}
	}

	return (
		<BrowserRouter basename="/">
			<Routes>
				<Route element={<BaseLayout isLoggedIn={isLoggedIn} logOff={logOff} notification_visible={notification_visible} notification_message={notification_message} notification_type={notification_type} />} >
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} logIn={logIn} />} />
					<Route path="/register" element={<RegistrationPage isLoggedIn={isLoggedIn} />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/user/:id" element={<ProfilePage isLoggedIn={isLoggedIn} />} />
					<Route path="/post/:post_id" element={<PostPage isLoggedIn={isLoggedIn} />} />

					<Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
						<Route path="/user/:id/options" element={<ProfileOptionsPage isAdmin={hasAdminRights} />} />
						<Route path="/user/:id/edit" element={<ProfileEditPage setNotificationMessage={setNotificationMessageWrapper} setNotificationType={setNotificationTypeWrapper} />} />
						<Route path="/user/:id/delete" element={<ProfileDeletePage logOff={logOff} />} />
						<Route path="/user/:id/create_post" element={<CreatePostPage USER_ID={stored_user_ID} logOff={logOff} setNotificationMessage={setNotificationMessageWrapper} setNotificationType={setNotificationTypeWrapper} />} />
						
						<Route path="/post/:post_id/edit" element={<PostEditPage />} />
						<Route path="/post/:post_id/delete" element={<PostDeletePage USER_ID={stored_user_ID} />} />
					</Route>

				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
