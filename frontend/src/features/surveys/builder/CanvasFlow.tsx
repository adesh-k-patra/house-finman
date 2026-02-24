import { GitBranch, Plus } from 'lucide-react'
import { Button } from '@/components/ui'

export function CanvasFlow() {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
            <div className="text-center space-y-4 max-w-md">
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <GitBranch className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Visual Flow Builder</h2>
                <p className="text-slate-500">
                    Drag and drop questions to build your survey logic. Connect nodes to create complex branching paths.
                </p>
                <Button className="gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    <Plus className="w-4 h-4" /> Add Start Node
                </Button>
            </div>
        </div>
    )
}
