
function Home({isLoggedIn}) {
	return(
		<div>
			<h1>Home page</h1>
			<p>Welcome to home page</p>
			{isLoggedIn && <p>You are currently logged in.</p>}
			{!isLoggedIn && <p>You are not logged in.</p>}
		</div>
	)
}

export default Home;