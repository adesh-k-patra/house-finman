/**
 * Protected Route Component
 * Redirects unauthenticated users to login
 */

import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
    children?: React.ReactNode
    requiredRoles?: string[]
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
    const location = useLocation()
    const { isAuthenticated, user } = useAuthStore()

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }

    // Role check if required
    if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = user && (
            user.role === 'super_admin' || // Super admin has all access
            requiredRoles.includes(user.role)
        )

        if (!hasRequiredRole) {
            // Redirect to dashboard with insufficient permissions
            return <Navigate to="/dashboard" state={{ error: 'Insufficient permissions' }} replace />
        }
    }

    // Render children or outlet
    return children ? <>{children}</> : <Outlet />
}
