import { List, MoreHorizontal } from 'lucide-react'

export function BatchEditor() {
    return (
        <div className="h-full p-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Batch Question Editor</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50">
                            Export CSV
                        </button>
                        <button className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50">
                            Import
                        </button>
                    </div>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Question Text</th>
                            <th className="px-6 py-3">Options</th>
                            <th className="px-6 py-3">Required</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {[1, 2, 3].map(i => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 font-mono text-xs text-slate-400">q_{i}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold text-slate-600">
                                        MCQ
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium">Sample Question {i}?</td>
                                <td className="px-6 py-4 text-slate-500">Option A, Option B</td>
                                <td className="px-6 py-4">
                                    <input type="checkbox" checked readOnly className="rounded border-slate-300" />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1 hover:bg-slate-100 rounded">
                                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
