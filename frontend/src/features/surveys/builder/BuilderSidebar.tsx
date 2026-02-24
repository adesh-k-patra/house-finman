import {
    LayoutGrid, MessageSquare, Zap, GitBranch,
    Database, Settings, ChevronDown, Plus
} from 'lucide-react'
import { cn } from '@/utils'

export function BuilderSidebar() {
    const navItems = [
        { id: 'questions', label: 'Questions', icon: MessageSquare, count: 12 },
        { id: 'logic', label: 'Logic & Branching', icon: GitBranch, count: 3 },
        { id: 'design', label: 'Design & Style', icon: LayoutGrid },
        { id: 'ai', label: 'AI Copilot', icon: Zap, badge: 'New' },
        { id: 'integrations', label: 'Integrations', icon: Database },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <button className="w-full flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200">
                    <span>Buyer Intent Survey</span>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                <nav className="space-y-0.5 px-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors group",
                                item.id === 'questions'
                                    ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn(
                                    "w-4 h-4",
                                    item.id === 'questions' ? "text-purple-600" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                )} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {item.count && (
                                <span className="text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-500">
                                    {item.count}
                                </span>
                            )}
                            {item.badge && (
                                <span className="text-[9px] font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white px-1.5 py-0.5 rounded uppercase tracking-wide">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-500 hover:border-purple-500 hover:text-purple-600 transition-all">
                    <Plus className="w-4 h-4" /> Add Element
                </button>
            </div>
        </div>
    )
}
