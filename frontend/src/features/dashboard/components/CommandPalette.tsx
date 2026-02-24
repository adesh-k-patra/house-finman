import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Search,
    Command,
    User,
    Building2,
    Users,
    FileText,
    Settings,
    Calculator,
    LogOut,
    Home,
    Megaphone,
    BarChart3,
    Receipt,
    ArrowRight
} from 'lucide-react'
import { cn } from '@/utils'
import { Dialog } from '@headlessui/react'

type CommandItem = {
    id: string
    title: string
    subtitle?: string
    shortcut?: string[]
    icon: React.ElementType
    path?: string
    action?: () => void
    section: 'Navigation' | 'Actions' | 'Recently Viewed' | 'Tools'
}

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const navigate = useNavigate()
    const inputRef = useRef<HTMLInputElement>(null)

    // Toggle with Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        } else {
            setQuery('')
            setSelectedIndex(0)
        }
    }, [isOpen])

    const commands: CommandItem[] = [
        // Navigation
        { id: 'nav-dashboard', title: 'Dashboard', section: 'Navigation', icon: Home, path: '/' },
        { id: 'nav-leads', title: 'Leads', section: 'Navigation', icon: Users, path: '/leads', shortcut: ['G', 'L'] },
        { id: 'nav-loans', title: 'Loan Applications', section: 'Navigation', icon: FileText, path: '/loans', shortcut: ['G', 'A'] },
        { id: 'nav-partners', title: 'Partners', section: 'Navigation', icon: User, path: '/partners', shortcut: ['G', 'P'] },
        { id: 'nav-properties', title: 'Properties', section: 'Navigation', icon: Building2, path: '/properties' },
        { id: 'nav-campaigns', title: 'Campaigns', section: 'Navigation', icon: Megaphone, path: '/campaigns' },
        { id: 'nav-analytics', title: 'Analytics', section: 'Navigation', icon: BarChart3, path: '/analytics' },

        // Actions
        { id: 'act-new-lead', title: 'Create New Lead', section: 'Actions', icon: Users, action: () => console.log('New Lead') },
        { id: 'act-calc-emi', title: 'Calculate EMI', section: 'Actions', icon: Calculator, action: () => console.log('EMI Tool') },
        { id: 'act-new-invoice', title: 'Generate Invoice', section: 'Actions', icon: Receipt, action: () => navigate('/finance/billing') },

        // Recent
        { id: 'rec-loan-1', title: 'LN-HOM-2023-8892', subtitle: 'Rajesh Kumar • Home Loan', section: 'Recently Viewed', icon: FileText, path: '/loans/LN-HOM-2023-8892' },
        { id: 'rec-partner-1', title: 'Urban Estates', subtitle: 'Gold Partner', section: 'Recently Viewed', icon: Building2, path: '/partners/PT-2021-001' },

        // Tools
        { id: 'tool-settings', title: 'Settings', section: 'Tools', icon: Settings, path: '/admin/settings' },
        { id: 'tool-logout', title: 'Log Out', section: 'Tools', icon: LogOut, action: () => console.log('Logout') },
    ]

    const filteredCommands = commands.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(query.toLowerCase())
    )

    const handleSelect = (item: CommandItem) => {
        setIsOpen(false)
        if (item.path) {
            navigate(item.path)
        } else if (item.action) {
            item.action()
        }
    }

    // Keyboard navigation within the palette
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return

            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
            } else if (e.key === 'Enter') {
                e.preventDefault()
                if (filteredCommands[selectedIndex]) {
                    handleSelect(filteredCommands[selectedIndex])
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, selectedIndex, filteredCommands])


    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" aria-hidden="true" />

            {/* Positioned Modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
                <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-slate-100 dark:divide-white/5 overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 transition-all">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm"
                            placeholder="Type a command or search..."
                            value={query}
                            onChange={e => {
                                setQuery(e.target.value)
                                setSelectedIndex(0)
                            }}
                        />
                        <div className="absolute right-4 top-3.5 flex items-center gap-1">
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">ESC</span>
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="max-h-[60vh] overflow-y-auto py-2">
                        {filteredCommands.length === 0 ? (
                            <div className="px-6 py-14 text-center text-sm sm:px-14">
                                <Command className="mx-auto h-6 w-6 text-slate-400" />
                                <p className="mt-4 font-semibold text-slate-900 dark:text-white">No commands found</p>
                                <p className="mt-2 text-slate-500">We couldn't find anything matching "{query}". Please try again.</p>
                            </div>
                        ) : (
                            Object.entries(
                                filteredCommands.reduce((acc, item) => {
                                    (acc[item.section] = acc[item.section] || []).push(item)
                                    return acc
                                }, {} as Record<string, CommandItem[]>)
                            ).map(([section, items]) => (
                                <div key={section}>
                                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/30">
                                        {section}
                                    </div>
                                    {items.map((item) => {
                                        // Calculate global index for highlighting
                                        const globalIndex = filteredCommands.indexOf(item)
                                        const isSelected = globalIndex === selectedIndex

                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => handleSelect(item)}
                                                className={cn(
                                                    'group flex cursor-pointer items-center justify-between px-4 py-3 mx-2 my-1 rounded-lg transition-colors duration-200',
                                                    isSelected
                                                        ? 'bg-primary-600 text-white'
                                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        'p-2 rounded-md',
                                                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                                    )}>
                                                        <item.icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className={cn("text-sm font-medium", isSelected ? "text-white" : "text-slate-900 dark:text-white")}>
                                                            {item.title}
                                                        </p>
                                                        {item.subtitle && (
                                                            <p className={cn("text-xs", isSelected ? "text-primary-100" : "text-slate-500")}>
                                                                {item.subtitle}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <ArrowRight className="w-4 h-4 text-white opacity-50" />
                                                )}
                                                {!isSelected && item.shortcut && (
                                                    <div className="flex items-center gap-1">
                                                        {item.shortcut.map(key => (
                                                            <kbd key={key} className="hidden sm:inline-block rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                                {key}
                                                            </kbd>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center bg-slate-50 dark:bg-slate-950/50 px-4 py-2.5 text-xs text-slate-500 border-t border-slate-100 dark:border-white/5">
                        <span className="mr-4 flex items-center gap-1">
                            <kbd className="font-sans font-bold">↑↓</kbd> to navigate
                        </span>
                        <span className="mr-4 flex items-center gap-1">
                            <kbd className="font-sans font-bold">↵</kbd> to select
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="font-sans font-bold">esc</kbd> to close
                        </span>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}


