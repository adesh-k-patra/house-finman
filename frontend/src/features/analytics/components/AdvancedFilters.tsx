import { useState } from 'react'
import { Calendar, Filter, Tag, Check, X } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { cn } from '@/utils'

// B.41 Advanced Chart Filters
export function AdvancedChartFilters({ onApply }: any) {
    return (
        <Card className="p-4 rounded-none shadow-sm border border-slate-200 dark:border-slate-800 mb-6 bg-white dark:bg-slate-900">
            <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Date Range</label>
                    <div className="flex bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1">
                        <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-900">7D</button>
                        <button className="px-3 py-1 text-xs font-bold bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-200 border border-transparent dark:border-slate-700">30D</button>
                        <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-900">90D</button>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Project</label>
                    <select className="h-[34px] pl-2 pr-8 text-sm font-medium border border-slate-200 bg-white dark:bg-slate-800 rounded-none w-40">
                        <option>All Projects</option>
                        <option>Blue Ridge</option>
                        <option>Green Valley</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Bank Partner</label>
                    <select className="h-[34px] pl-2 pr-8 text-sm font-medium border border-slate-200 bg-white dark:bg-slate-800 rounded-none w-40">
                        <option>All Banks</option>
                        <option>HDFC</option>
                        <option>SBI</option>
                        <option>ICICI</option>
                    </select>
                </div>

                <Button className="rounded-none bg-slate-900 text-white gap-2 h-[34px]" onClick={onApply}>
                    <Filter className="w-3 h-3" /> Apply Filters
                </Button>
            </div>
        </Card>
    )
}

// B.42 Lead Tagging Modal
export function LeadTaggingModal({ isOpen, onClose, selectedCount }: any) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="w-[400px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                    <h3 className="font-black uppercase text-sm flex items-center gap-2">
                        <Tag className="w-4 h-4 text-purple-600" />
                        Tag {selectedCount} Leads
                    </h3>
                    <button onClick={onClose}><X className="w-4 h-4" /></button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500">Available Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {['High Intent', 'Follow Up', 'Dead Lead', 'NRI', 'Investor'].map(tag => (
                                <button key={tag} className="px-2 py-1 text-xs border border-slate-200 hover:border-purple-500 hover:text-purple-600 transition-colors bg-slate-50">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-500">Add New Tag</label>
                        <div className="flex gap-2">
                            <input type="text" className="flex-1 border border-slate-200 px-2 py-1 text-sm bg-slate-50" placeholder="Tag name..." />
                            <Button size="sm" variant="outline" className="rounded-none">Add</Button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                        <Button size="sm" className="bg-slate-900 text-white rounded-none gap-2">
                            <Check className="w-3 h-3" /> Apply Tags
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
