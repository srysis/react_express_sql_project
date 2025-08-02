import { Outlet, Navigate } from 'react-router-dom'

interface props {
	isLoggedIn: boolean
}

function ProtectedRoutes({isLoggedIn}: props) {
	return isLoggedIn ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutes;