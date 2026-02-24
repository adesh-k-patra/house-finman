import React, { Suspense, memo } from 'react'
import { Loader2 } from 'lucide-react'

// B.47 Lazy Loading Wrapper
export function LazyComponentWrapper({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
    return (
        <Suspense fallback={fallback || <DefaultLoader />}>
            {children}
        </Suspense>
    )
}

function DefaultLoader() {
    return (
        <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-none h-full min-h-[200px]">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Loading Component...</span>
            </div>
        </div>
    )
}

// B.48 Memoized Heavy List Item
export const MemoizedListItem = memo(function ListItem({ title, subtitle, value, onClick }: any) {
    return (
        <div
            className="flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={onClick}
        >
            <div>
                <h4 className="font-bold text-sm text-slate-900">{title}</h4>
                <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
            <div className="text-right">
                <span className="font-black text-slate-900">{value}</span>
            </div>
        </div>
    )
}, (prev, next) => {
    return prev.title === next.title && prev.value === next.value && prev.subtitle === next.subtitle
})
