import { ReactNode } from 'react'
import { useBuilder } from './BuilderContext'
import { cn } from '@/utils'
import {
    Layout, Maximize2, Monitor, Smartphone,
    ArrowLeft, Save, Play, Settings
} from 'lucide-react'
import { Button } from '@/components/ui'

interface BuilderLayoutProps {
    children: ReactNode
    sidebar: ReactNode
    inspector?: ReactNode
}

export function BuilderLayout({ children, sidebar, inspector }: BuilderLayoutProps) {
    const { state, dispatch } = useBuilder()

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
            {/* TOP BAR */}
            <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-50 shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="w-4 h-4 text-slate-500" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-600 rounded-lg">
                            <Layout className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <input
                                value={state.title}
                                onChange={(e) => dispatch({ type: 'UPDATE_TITLE', payload: e.target.value })}
                                className="font-bold text-sm bg-transparent focus:outline-none text-slate-900 dark:text-white w-64"
                            />
                            <div className="text-[10px] text-slate-400 font-medium">Last saved 2m ago</div>
                        </div>
                    </div>
                </div>

                {/* View Toggles */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'flow' })}
                        className={cn(
                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                            state.viewMode === 'flow' ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Visual Flow
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'composer' })}
                        className={cn(
                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                            state.viewMode === 'composer' ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Smart Compose
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'batch' })}
                        className={cn(
                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                            state.viewMode === 'batch' ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Batch Editor
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="h-8 flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 mr-2">
                        <button className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm">
                            <Monitor className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-1.5 rounded-md bg-white dark:bg-slate-700 shadow-sm">
                            <Smartphone className="w-4 h-4 text-slate-900 dark:text-white" />
                        </button>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 gap-2">
                        <Settings className="w-3.5 h-3.5" /> settings
                    </Button>
                    <Button size="sm" className="h-8 gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                        Publish <Play className="w-3.5 h-3.5 fill-current" />
                    </Button>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex overflow-hidden">
                {/* LEFT SIDEBAR */}
                <aside
                    className={cn(
                        "w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300",
                        !state.isSidebarOpen && "w-0 opacity-0 overflow-hidden"
                    )}
                >
                    {sidebar}
                </aside>

                {/* CANVAS / WORKSPACE */}
                <main className="flex-1 relative bg-slate-50/50 dark:bg-black/20 overflow-hidden">
                    {children}
                </main>

                {/* RIGHT INSPECTOR */}
                <aside
                    className={cn(
                        "w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 box-border z-20",
                        !state.selectedNodeId && "w-0 opacity-0 overflow-hidden border-none"
                    )}
                >
                    {inspector}
                </aside>
            </div>
        </div>
    )
}
