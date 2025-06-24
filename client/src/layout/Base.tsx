import { Outlet } from 'react-router-dom'

import Header from "./Header"

function Base({isLoggedIn, setLoggedIn}) {
	return(
		<>
			<Header isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
			<main>
				<Outlet />
			</main>
		</>
	)
	
}

export default Base;