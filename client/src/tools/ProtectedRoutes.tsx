import { Outlet, Navigate } from 'react-router-dom'

function ProtectedRoutes({isLoggedIn}) {
	return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutes;