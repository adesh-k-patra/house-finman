import React, { useState } from 'react'
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    Plug,
    ChevronLeft,
    ChevronRight,
    FolderOpen,
    PieChart,
    LogOut,
    HelpCircle
} from 'lucide-react'
import { cn } from '@/utils'
import { useNavigate, useLocation } from 'react-router-dom'

interface NavItemProps {
    icon: any
    label: string
    path: string
    isActive?: boolean
    isCollapsed: boolean
    onClick?: () => void
}

function NavItem({ icon: Icon, label, path, isActive, isCollapsed, onClick }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center h-12 transition-all group relative border-l-4",
                isCollapsed ? "justify-center px-0" : "px-5 gap-4",
                isActive
                    ? "bg-[#1e293b] border-blue-500 text-white"
                    : "border-transparent text-slate-400 hover:bg-[#1e293b] hover:text-white hover:border-slate-600"
            )}
        >
            <Icon className={cn("w-5 h-5 min-w-[20px]", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white")} strokeWidth={isActive ? 2.5 : 2} />

            {!isCollapsed && (
                <span className={cn(
                    "text-xs font-bold tracking-[0.15em] uppercase truncate transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                )}>
                    {label}
                </span>
            )}

            {/* Tooltip for Collapsed State */}
            {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {label}
                </div>
            )}
        </button>
    )
}

export function BuilderSideNav() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Surveys', icon: FileText, path: '/surveys' },
        { label: 'Templates', icon: FolderOpen, path: '/templates' },
        { label: 'Audience', icon: Users, path: '/audience' },
        { label: 'Reports', icon: PieChart, path: '/reports' },
        { label: 'Integrations', icon: Plug, path: '/integrations' },
    ]

    return (
        <aside
            className={cn(
                "h-full flex flex-col bg-[#020617] border-r border-[#1e293b] transition-all duration-300 relative z-50 shadow-2xl",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            {/* Brand / Logo Area */}
            <div className={cn(
                "h-20 flex items-center border-b border-[#1e293b] transition-all bg-[#020617]",
                isCollapsed ? "justify-center" : "px-6"
            )}>
                <div className="w-10 h-10 bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
                    <span className="font-black text-white text-sm">CFM</span>
                </div>
                {!isCollapsed && (
                    <div className="ml-4 flex flex-col justify-center">
                        <span className="font-black text-white tracking-widest text-base leading-none">FINMAN<span className="text-blue-500">.</span></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Enterprise</span>
                    </div>
                )}
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-8">
                <div className={cn("mb-2 px-6 text-[10px] font-black text-slate-600 uppercase tracking-widest", isCollapsed && "hidden")}>
                    Main Menu
                </div>
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            isCollapsed={isCollapsed}
                            isActive={location.pathname.startsWith(item.path)}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-[#0f172a] border-t border-[#1e293b]">
                <NavItem icon={Settings} label="Settings" path="/settings" isCollapsed={isCollapsed} onClick={() => { }} />
                <NavItem icon={HelpCircle} label="Support" path="/support" isCollapsed={isCollapsed} onClick={() => { }} />

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full h-12 flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#1e293b] transition-colors border-t border-[#1e293b]"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>
        </aside>
    )
}
