import { Globe, X, ZoomIn, Download, CheckSquare } from 'lucide-react'
import { useState } from 'react'
import { Button, Badge } from '@/components/ui'
import { cn } from '@/utils'

// B.44 / B.61 Localization UI
export function LocalizationToggle({ languages = ['English', 'Hindi', 'Marathi'], active = 'English', onChange }: any) {
    return (
        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 rounded-none">
            <Globe className="w-4 h-4 text-slate-400 ml-2" />
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
            {languages.map((lang: string) => (
                <button
                    key={lang}
                    onClick={() => onChange?.(lang)}
                    className={cn(
                        "px-3 py-1 text-xs font-bold uppercase transition-colors",
                        active === lang
                            ? "bg-slate-900 text-white"
                            : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    )}
                >
                    {lang}
                </button>
            ))}
        </div>
    )
}

// B.63 Filter Chips
export function FilterChips({ filters, onRemove, onClearAll }: any) {
    if (!filters?.length) return null
    return (
        <div className="flex flex-wrap items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
            <span className="text-xs font-bold text-slate-400 uppercase mr-1">Active Filters:</span>
            {filters.map((filter: any) => (
                <Badge key={filter.id} variant="secondary" className="rounded-none bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100 pr-1 gap-1">
                    {filter.label}
                    <button onClick={() => onRemove(filter.id)} className="p-0.5 hover:bg-purple-200 rounded-full">
                        <X className="w-3 h-3" />
                    </button>
                </Badge>
            ))}
            <button onClick={onClearAll} className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-wide underline ml-2">
                Clear All
            </button>
        </div>
    )
}

// B.55 Consent Checkbox
export function ConsentCheckbox({ required = true }: { required?: boolean }) {
    return (
        <label className="flex items-start gap-3 p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 cursor-pointer group">
            <div className="relative flex items-center mt-0.5">
                <input type="checkbox" required={required} className="peer sr-only" />
                <div className="w-4 h-4 border-2 border-slate-300 peer-checked:bg-slate-900 peer-checked:border-slate-900 transition-colors" />
                <CheckSquare className="w-4 h-4 text-white absolute top-0 left-0 opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                I agree to the <a href="#" className="font-bold underline decoration-slate-300 hover:text-slate-900">Privacy Policy</a> and authorize HouseFin Man to contact me via SMS/WhatsApp/Email for loan offers.
                {required && <span className="text-red-500 ml-1">*</span>}
            </div>
        </label>
    )
}

// B.53 Survey Tags
export function SurveyTags({ tags, readOnly }: any) {
    return (
        <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag: string) => (
                <span key={tag} className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 uppercase tracking-wide">
                    #{tag}
                </span>
            ))}
            {!readOnly && (
                <button className="text-[10px] text-slate-400 border border-dashed border-slate-300 px-1.5 py-0.5 hover:border-slate-400 hover:text-slate-600 uppercase font-bold">
                    + Tag
                </button>
            )}
        </div>
    )
}

// B.62 File Viewer Modal
export function FileViewerModal({ file, onClose }: any) {
    if (!file) return null
    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/95 flex flex-col animate-fade-in">
            <div className="h-16 border-b border-white/10 flex justify-between items-center px-6">
                <h3 className="text-white font-bold truncate pr-4">{file.name}</h3>
                <div className="flex gap-2">
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-none gap-2">
                        <ZoomIn className="w-4 h-4" /> Zoom
                    </Button>
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-none gap-2">
                        <Download className="w-4 h-4" /> Download
                    </Button>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 ml-4">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <div className="flex-1 p-8 flex items-center justify-center overflow-auto">
                {/* Mock Content */}
                <div className="bg-white w-[800px] h-[1000px] shadow-2xl p-12 text-slate-900">
                    <div className="h-full border-2 border-dashed border-slate-200 flex items-center justify-center">
                        <p className="text-slate-300 font-black text-4xl uppercase -rotate-45">Preview Not Available</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
