import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// B.33 Keyboard Navigation
export function useKeyboardNav() {
    const navigate = useNavigate()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Global shortcuts
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                // In a real app, this would open a command palette
                console.log('Open Command Palette')
            }

            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault()
                // In a real app, this would focus search
                const searchInput = document.getElementById('global-search')
                if (searchInput) searchInput.focus()
            }

            if (e.key === 'Escape') {
                // Close modals logic would go here via a robust modal manager
                console.log('Escape pressed')
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])
}

// B.54 Role Guard
interface RoleGuardProps {
    children: React.ReactNode
    allowedRoles: string[]
    userRole: string
}

export function RoleGuard({ children, allowedRoles, userRole }: RoleGuardProps) {
    if (!allowedRoles.includes(userRole)) {
        return null // Or return a "Access Denied" component
    }
    return <>{children}</>
}

// B.73 Feature Flags
export const FEATURE_FLAGS = {
    EXPERIMENTAL_CHARTS: true,
    NEW_EXPORT_FLOW: false,
    AI_FOLLOW_UP: true
}

export function FeatureFlag({ flag, children }: { flag: keyof typeof FEATURE_FLAGS, children: React.ReactNode }) {
    if (!FEATURE_FLAGS[flag]) return null
    return <>{children}</>
}
