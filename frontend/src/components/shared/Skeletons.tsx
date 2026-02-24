import { cn } from '@/utils'

// B.57 Page-level Skeletons
export function DashboardSkeleton() {
    return (
        <div className="p-8 space-y-8 animate-pulse">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-none" />
                    <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800 rounded-none" />
                </div>
                <div className="flex gap-4">
                    <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-none" />
                    <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-none" />
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 border-t-4 border-slate-200 dark:border-slate-700" />
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-8">
                <div className="h-80 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
                <div className="h-80 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800" />
            </div>
        </div>
    )
}

export function ListSkeleton() {
    return (
        <div className="space-y-4 animate-pulse p-4">
            <div className="flex justify-between mb-8">
                <div className="h-8 w-48 bg-slate-200 rounded-none" />
                <div className="h-8 w-32 bg-slate-200 rounded-none" />
            </div>
            <div className="space-y-1">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-16 w-full bg-slate-50 border-b border-slate-100" />
                ))}
            </div>
        </div>
    )
}
