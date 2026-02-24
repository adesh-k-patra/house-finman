import { useState } from 'react'
import { Shield, Users, Lock, CheckCircle, Save } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

export function RoleSettings() {
    const [activeRole, setActiveRole] = useState('agent')

    const roles = [
        { id: 'admin', label: 'Administrator', count: 2 },
        { id: 'manager', label: 'Team Manager', count: 5 },
        { id: 'agent', label: 'Support Agent', count: 12 },
        { id: 'viewer', label: 'Viewer', count: 4 },
    ]

    const permissions = [
        {
            category: 'Surveys',
            items: [
                { id: 'survey.create', label: 'Create Surveys' },
                { id: 'survey.edit', label: 'Edit Active Surveys' },
                { id: 'survey.delete', label: 'Delete Surveys' },
                { id: 'survey.publish', label: 'Publish/Pause Surveys' },
            ]
        },
        {
            category: 'Responses',
            items: [
                { id: 'response.view', label: 'View Responses' },
                { id: 'response.export', label: 'Export Data' },
                { id: 'response.delete', label: 'Delete Responses' },
                { id: 'response.pii', label: 'View PII Data' },
            ]
        },
        {
            category: 'System',
            items: [
                { id: 'system.users', label: 'Manage Users' },
                { id: 'system.billing', label: 'Access Billing' },
                { id: 'system.logs', label: 'View Audit Logs' },
            ]
        }
    ]

    return (
        <div className="flex h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-slate-50 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-600" /> Roles & Perms
                    </h3>
                </div>
                <div className="p-2 space-y-1 overflow-y-auto flex-1">
                    {roles.map(role => (
                        <button
                            key={role.id}
                            onClick={() => setActiveRole(role.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors border-l-2",
                                activeRole === role.id
                                    ? "bg-white dark:bg-slate-900 text-purple-600 border-purple-600 shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 opacity-50" />
                                {role.label}
                            </div>
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-none text-slate-500">{role.count}</span>
                        </button>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <Button variant="outline" className="w-full rounded-none gap-2">
                        <Plus className="w-4 h-4" /> Add Role
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {roles.find(r => r.id === activeRole)?.label} Permissions
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Configure access levels for this role</p>
                        </div>
                        <Button className="rounded-none gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                            <Save className="w-4 h-4" /> Save Changes
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {permissions.map((category) => (
                            <div key={category.category} className="space-y-4">
                                <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                                    {category.category}
                                </h4>
                                <div className="space-y-3">
                                    {category.items.map(perm => (
                                        <label key={perm.id} className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={activeRole === 'admin' || (activeRole === 'manager' && !perm.id.includes('delete'))}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-10 h-6 bg-slate-200 rounded-none peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-none after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-purple-600 transition-colors">
                                                    {perm.label}
                                                </span>
                                                <p className="text-[10px] text-slate-400 mt-0.5">{perm.id}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Plus({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
}
