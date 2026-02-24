/**
 * Dashboard Layout Component for House FinMan
 * 
 * Purpose: Main layout wrapper providing fixed sidebar and scrollable content area
 */

import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { Toaster } from '@/components/ui/Toast'
import { cn } from '@/utils'

export default function DashboardLayout() {
    return (
        <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 overflow-hidden flex">
            {/* Sidebar (Fixed width, internal scrolling if needed) */}
            <Sidebar />

            {/* Main Content Area (Scrollable) */}
            <div className={cn(
                "flex-1 flex flex-col h-full ml-[70px] transition-all duration-300 min-w-0"
            )}>
                <Header />

                <main className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 min-w-0">
                    <Outlet />
                </main>
            </div>

            {/* Global Toaster */}
            <Toaster />
        </div>
    )
}
