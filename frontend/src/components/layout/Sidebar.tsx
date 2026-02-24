import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    Megaphone,
    Building,
    Briefcase,
    Store,
    Receipt,
    GraduationCap,
    CreditCard,
    Wallet,
    Banknote,
    Ticket,
    MessageSquare,
    Book,
    BarChart3,
    TrendingUp,
    PieChart,
    Shield,
    GitBranch,
    Link,
    FileCheck,
    Settings,
    LogOut,
    ChevronRight,
    UserCircle,
    Database,
    Landmark
} from 'lucide-react'
import { cn } from '@/utils'
import { AnimatedLogo } from '@/components/logo/AnimatedLogo'

// --- Navigation Structure ---

interface NavItem {
    label: string
    path: string
    icon: React.ElementType
    children?: { label: string; path: string }[]
}

interface NavGroup {
    label?: string
    items: NavItem[]
}

const navStructure: NavGroup[] = [
    {
        items: [
            { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
        ]
    },
    {
        label: 'Sales & Growth',
        items: [
            { label: 'Leads', path: '/leads', icon: Users },
            { label: 'Loans', path: '/loans', icon: Landmark },
            { label: 'Campaigns', path: '/campaigns', icon: Megaphone },
            { label: 'Properties', path: '/properties', icon: Building },
        ]
    },
    {
        label: 'Network Management',
        items: [
            {
                label: 'Partners', path: '/partners', icon: Briefcase,
                children: [
                    { label: 'All Partners', path: '/partners' },
                    { label: 'Onboarding', path: '/partners/onboarding' },
                    { label: 'Contracts', path: '/partners/contracts' },
                ]
            },
            {
                label: 'Vendors', path: '/vendors', icon: Store,
                children: [
                    { label: 'All Vendors', path: '/vendors' },
                    { label: 'Purchase Orders', path: '/vendors/purchase-orders' },
                    { label: 'Invoices', path: '/vendors/invoices' },
                ]
            },
            {
                label: 'Mentors', path: '/mentors', icon: GraduationCap,
                children: [
                    { label: 'All Mentors', path: '/mentors' },
                    { label: 'Sessions', path: '/mentors/sessions' },
                ]
            },
        ]
    },
    {
        label: 'Finance Operations',
        items: [
            { label: 'Billing', path: '/finance/billing', icon: Receipt },
            { label: 'Payments', path: '/finance/payments', icon: CreditCard },
            { label: 'Commissions', path: '/commissions', icon: Wallet },
            { label: 'Revenue', path: '/finance/revenue', icon: Banknote },
        ]
    },
    {
        label: 'Support & CX',
        items: [
            {
                label: 'Surveys', path: '/surveys', icon: FileCheck,
                children: [
                    { label: 'Active', path: '/surveys?status=active' },
                    { label: 'Pending', path: '/surveys?status=pending' },
                    { label: 'Ended', path: '/surveys?status=ended' },
                    { label: 'All Surveys', path: '/surveys' },
                ]
            },
            { label: 'Tickets', path: '/support/tickets', icon: Ticket },
            { label: 'Conversations', path: '/support/conversations', icon: MessageSquare },
            { label: 'Knowledge Base', path: '/support/knowledge-base', icon: Book },
        ]
    },
    {
        label: 'Analytics',
        items: [
            { label: 'Overview', path: '/analytics', icon: BarChart3 },
            { label: 'Performance', path: '/analytics/performance', icon: TrendingUp },
            { label: 'Finance', path: '/analytics/finance', icon: PieChart },
        ]
    },
    {
        label: 'System Admin',
        items: [
            { label: 'Users', path: '/admin/users', icon: Shield },
            { label: 'Workflows', path: '/admin/workflows', icon: GitBranch },
            { label: 'Integrations', path: '/admin/integrations', icon: Link },
            { label: 'Audit Log', path: '/admin/audit', icon: FileCheck },
            { label: 'Config', path: '/admin/config', icon: Database },
            { label: 'Settings', path: '/admin/settings', icon: Settings },
        ]
    }
]

export default function Sidebar() {
    const [isHovered, setIsHovered] = useState(false)
    const [isLocked, setIsLocked] = useState(false)
    const location = useLocation()

    // Sidebar is collapsed by default (w-16/w-[70px]), expands on hover (w-64/w-[260px]) unless locked
    const isExpanded = isHovered || isLocked

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-50 h-screen",
                "bg-[#0F172A] text-slate-300", // Dark refined slate
                "border-r border-slate-800",
                "flex flex-col shadow-2xl",
                "transition-all duration-300 ease-out", // Fast smooth transition
                isExpanded ? "w-[260px]" : "w-[70px]"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header / Logo */}
            <div className="h-16 flex items-center justify-between border-b border-slate-800/50 bg-[#0F172A] px-0 relative">
                <div className="flex items-center gap-3 overflow-hidden w-full px-4">
                    <AnimatedLogo size="md" showText={false} className="shrink-0" />
                    <div className={cn(
                        "flex flex-col transition-all duration-200",
                        isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute pointer-events-none"
                    )}>
                        <h1 className="text-xl font-bold text-white tracking-tight whitespace-nowrap">House FinMan</h1>
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest pl-0.5">Enterprise</span>
                    </div>
                </div>
                {/* Pin/Lock Toggle */}
                {isExpanded && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsLocked(!isLocked)
                        }}
                        className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-white transition-colors",
                            isLocked && "text-blue-400 bg-blue-500/10"
                        )}
                        title={isLocked ? "Unpin Sidebar" : "Pin Sidebar"}
                    >
                        {isLocked ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        ) : (
                            <div className="w-1.5 h-1.5 rounded-full border border-slate-500" />
                        )}
                    </button>
                )}
            </div>

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent py-4">
                {navStructure.map((group, idx) => (
                    <div key={idx} className="mb-2">
                        {/* Group Label */}
                        {group.label && (
                            <div className={cn(
                                "px-6 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-opacity duration-200",
                                isExpanded ? "opacity-100" : "opacity-0 h-0 py-0 overflow-hidden"
                            )}>
                                {group.label}
                            </div>
                        )}
                        {!isExpanded && group.label && <div className="h-px bg-slate-800 mx-4 my-2" />}

                        {/* Items */}
                        <div className="space-y-0.5">
                            {group.items.map(item => (
                                <NavItemComponent
                                    key={item.path}
                                    item={item}
                                    isActive={location.pathname.startsWith(item.path)}
                                    isExpanded={isExpanded}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* User Footer */}
            <div className="p-0 border-t border-slate-800 bg-[#0B1120]">
                <div className={cn(
                    "flex items-center gap-3 p-4 hover:bg-slate-800/50 transition-colors cursor-pointer",
                    !isExpanded && "justify-center"
                )}>
                    <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center shrink-0">
                        <UserCircle className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className={cn(
                        "overflow-hidden transition-all duration-200",
                        isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
                    )}>
                        <p className="text-sm font-semibold text-white whitespace-nowrap">Admin User</p>
                        <p className="text-xs text-slate-500 whitespace-nowrap">admin@housefinman.com</p>
                    </div>
                    {isExpanded && (
                        <LogOut className="w-4 h-4 text-slate-500 ml-auto hover:text-white transition-colors" />
                    )}
                </div>
            </div>
        </aside>
    )
}

function NavItemComponent({ item, isActive, isExpanded }: { item: NavItem, isActive: boolean, isExpanded: boolean }) {
    const [isSubOpen, setIsSubOpen] = useState(false)
    const hasChildren = item.children && item.children.length > 0
    const Icon = item.icon

    // Auto expand children if active
    if (isActive && !isSubOpen && isExpanded) {
        // Only valid if we want auto-expansion logic, but controlled is better
    }

    const handleClick = (e: React.MouseEvent) => {
        if (hasChildren && isExpanded) {
            e.preventDefault()
            setIsSubOpen(!isSubOpen)
        }
    }

    const itemClassName = cn(
        "group relative flex items-center h-12 px-0 transition-all duration-200",
        "hover:bg-[#1E293B]", // Darker hover
        isActive && !hasChildren && "bg-blue-600/10", // Active background
        !isExpanded && "justify-center"
    )

    const innerContent = (
        <>
            {/* Active Indicator Bar (Left) */}
            {isActive && (
                <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-[4px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]",
                    "transition-all duration-200"
                )} />
            )}

            {/* Icon */}
            <div className={cn(
                "flex items-center justify-center w-[70px] shrink-0 z-10",
                isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white",
                "transition-colors duration-200"
            )}>
                <Icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    "group-hover:scale-110" // Icon animation
                )} />
            </div>

            {/* Label */}
            <div className={cn(
                "flex-1 flex items-center justify-between pr-4 overflow-hidden transition-all duration-200",
                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
            )}>
                <span className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    isActive ? "text-blue-400" : "text-slate-300 group-hover:text-white"
                )}>
                    {item.label}
                </span>
                {hasChildren && (
                    <ChevronRight className={cn(
                        "w-4 h-4 text-slate-500 transition-transform duration-200",
                        isSubOpen && "rotate-90"
                    )} />
                )}
            </div>
        </>
    )

    return (
        <>
            {hasChildren ? (
                <div onClick={handleClick} className={cn(itemClassName, "cursor-pointer")}>
                    {innerContent}
                </div>
            ) : (
                <NavLink to={item.path} className={itemClassName}>
                    {innerContent}
                </NavLink>
            )}

            {/* Sub Items */}
            {hasChildren && (
                <div className={cn(
                    "bg-[#0B1120] overflow-hidden transition-all duration-300 ease-in-out",
                    isSubOpen && isExpanded ? "max-h-[500px]" : "max-h-0"
                )}>
                    {item.children?.map(child => (
                        <NavLink
                            key={child.path}
                            to={child.path}
                            className={({ isActive }) => cn(
                                "flex items-center h-10 pl-[70px] pr-4 text-sm transition-colors relative",
                                isActive ? "text-blue-400 bg-blue-600/5" : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
                            )}
                        >
                            {isActive && <div className="absolute left-[64px] w-1 h-4 bg-blue-500 rounded-full" />}
                            <span className="truncate">{child.label}</span>
                        </NavLink>
                    ))}
                </div>
            )}
        </>
    )
}
