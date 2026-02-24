import { X, Calendar, MapPin, Building2, RotateCcw, Filter, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { SideDrawer } from '@/components/ui/SideDrawer'

interface SurveyFilterDrawerProps {
    isOpen: boolean
    onClose: () => void
    onApply: (filters: any) => void
    currentFilters: any
}

export function SurveyFilterDrawer({ isOpen, onClose, onApply, currentFilters }: SurveyFilterDrawerProps) {
    return (
        <SideDrawer isOpen={isOpen} onClose={onClose} title="Advanced Filters" size="md">
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Date Range */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Date Range
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">From</label>
                                <input type="date" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">To</label>
                                <input type="date" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month'].map(range => (
                                <button key={range} className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-xs hover:border-blue-500 hover:text-blue-500 transition-colors">
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800" />

                    {/* Location & Property */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Location & Project
                        </label>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Region / City</label>
                                <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm">
                                    <option>All Locations</option>
                                    <option>Mumbai</option>
                                    <option>Pune</option>
                                    <option>Bangalore</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Project Name</label>
                                <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm">
                                    <option>All Projects</option>
                                    <option>Skyline Towers</option>
                                    <option>Green Valley</option>
                                    <option>Ocean View</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800" />

                    {/* Customer Segment */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> Demographics
                        </label>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Budget Range</label>
                                <div className="flex items-center gap-2">
                                    <input type="number" placeholder="Min" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                                    <span className="text-slate-400">-</span>
                                    <input type="number" placeholder="Max" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Customer Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['First-time Buyer', 'Investor', 'NRI', 'Existing Customer'].map(type => (
                                        <label key={type} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <input type="checkbox" className="rounded-none border-slate-300" />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800" />

                    {/* Metadata */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Other</label>
                        <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="text-sm font-medium">Show Archived Surveys</span>
                            <input type="checkbox" className="rounded-none border-slate-300" />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="text-sm font-medium">Include Deleted</span>
                            <input type="checkbox" className="rounded-none border-slate-300" />
                        </label>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1 rounded-none gap-2">
                        <RotateCcw className="w-4 h-4" /> Reset
                    </Button>
                    <Button onClick={() => { onApply({}); onClose() }} className="flex-[2] rounded-none gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                        <CheckCircle className="w-4 h-4" /> Apply Filters
                    </Button>
                </div>
            </div>
        </SideDrawer>
    )
}
