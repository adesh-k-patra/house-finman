import { useState, useEffect } from 'react'
import { Bell, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    type: ToastType
    title: string
    message: string
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([])

    // Simulated event listener for adding toasts
    useEffect(() => {
        const handleAddToast = (e: any) => {
            setToasts(prev => [...prev, e.detail])
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== e.detail.id))
            }, 5000)
        }
        window.addEventListener('add-toast', handleAddToast)
        return () => window.removeEventListener('add-toast', handleAddToast)
    }, [])

    return createPortal(
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={cn(
                        "w-96 p-4 shadow-2xl border-l-4 flex items-start gap-4 animate-in slide-in-from-right",
                        toast.type === 'success' ? "bg-white border-l-emerald-500" :
                            toast.type === 'error' ? "bg-white border-l-red-500" :
                                toast.type === 'warning' ? "bg-white border-l-amber-500" :
                                    "bg-white border-l-blue-500"
                    )}
                >
                    <div className={cn(
                        "p-1 rounded-full",
                        toast.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                            toast.type === 'error' ? "bg-red-100 text-red-600" :
                                toast.type === 'warning' ? "bg-amber-100 text-amber-600" :
                                    "bg-blue-100 text-blue-600"
                    )}>
                        {toast.type === 'success' && <CheckCircle className="w-4 h-4" />}
                        {toast.type === 'error' && <AlertTriangle className="w-4 h-4" />}
                        {toast.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                        {toast.type === 'info' && <Bell className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">{toast.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{toast.message}</p>
                    </div>
                    <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>
                        <X className="w-4 h-4 text-slate-400 hover:text-slate-900" />
                    </button>
                </div>
            ))}
        </div>,
        document.body
    )
}

// B.38 Drop Off Chart
export function DropOffChart() {
    return (
        <div className="relative h-64 w-full">
            {/* Steps */}
            <div className="absolute inset-0 flex items-end justify-between px-8">
                {[100, 85, 60, 45, 20].map((val, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group w-full">
                        <div className="relative w-full h-full flex items-end justify-center">
                            <div
                                style={{ height: `${val}%` }}
                                className="w-full bg-indigo-50 border-t border-indigo-200 relative transition-all group-hover:bg-indigo-100"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-black text-slate-900">{val}%</div>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {i + 1}</span>
                    </div>
                ))}
            </div>
            {/* Overlay Gradient Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <path
                    d="M0,0 L200,50 L400,120 L600,180 L800,250"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                    transform="scale(1, 0.8) translate(50, 20)"
                    className="opacity-50"
                />
            </svg>
        </div>
    )
}

// B.40 Scheduled Reports
export function ScheduledReportsModal({ isOpen, onClose }: any) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="w-[500px] bg-white p-6 shadow-2xl border border-slate-200">
                <h3 className="font-black uppercase text-lg mb-4">Schedule Report</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500">Frequency</label>
                        <select className="w-full p-2 border border-slate-200 bg-slate-50 mt-1 font-medium text-sm">
                            <option>Daily at 9:00 AM</option>
                            <option>Weekly (Mondays)</option>
                            <option>Monthly (1st)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500">Recipients</label>
                        <input type="text" className="w-full p-2 border border-slate-200 bg-slate-50 mt-1 text-sm" placeholder="email@example.com, ..." />
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                        <button className="px-4 py-2 text-sm font-bold bg-slate-900 text-white">Save Schedule</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
