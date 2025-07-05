import { Outlet, Navigate } from 'react-router-dom'

function ProtectedRoutes({isLoggedIn}) {
	return isLoggedIn ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutes;