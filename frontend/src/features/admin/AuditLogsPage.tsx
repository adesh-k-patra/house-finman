import { useState } from 'react'
import {
    Search, Filter, Download, User, Clock, Shield,
    FileText, Database, Settings, LogIn, Trash2, Edit, Plus
} from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui' // Assuming Badge is exported from ui index
import { cn } from '@/utils'

export function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const logs = [
        { id: 1, action: 'survey_created', actor: 'Sarah Admin', resource: 'NPS Survey Q1', ip: '192.168.1.1', time: '2 mins ago', details: 'Created new survey template', type: 'create' },
        { id: 2, action: 'user_login', actor: 'John Agent', resource: 'System', ip: '10.0.0.45', time: '15 mins ago', details: 'Successful login via SSO', type: 'info' },
        { id: 3, action: 'survey_updated', actor: 'Sarah Admin', resource: 'Post-Disbursement', ip: '192.168.1.1', time: '1 hour ago', details: 'Updated question logic for Q3', type: 'update' },
        { id: 4, action: 'response_deleted', actor: 'Mike Supervisor', resource: 'Response #1240', ip: '10.0.0.12', time: '2 hours ago', details: 'Deleted test response', type: 'delete' },
        { id: 5, action: 'settings_changed', actor: 'System', resource: 'Global Config', ip: '127.0.0.1', time: '5 hours ago', details: 'Auto-scaled database capacity', type: 'system' },
        { id: 6, action: 'export_downloaded', actor: 'Sarah Admin', resource: 'Q1 Report.pdf', ip: '192.168.1.1', time: '1 day ago', details: 'Downloaded full implementation report', type: 'info' },
    ]

    const getIcon = (type: string) => {
        switch (type) {
            case 'create': return Plus
            case 'update': return Edit
            case 'delete': return Trash2
            case 'info': return LogIn
            case 'system': return Settings
            default: return FileText
        }
    }

    const getBadgeVariant = (type: string) => {
        switch (type) {
            case 'create': return 'success'
            case 'update': return 'info'
            case 'delete': return 'destructive'
            case 'system': return 'warning'
            default: return 'secondary'
        }
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Shield className="w-8 h-8 text-slate-900 dark:text-white" />
                        System Audit Logs
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 ml-11">
                        Track and monitor all system activities and security events
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 rounded-none">
                        <Download className="w-4 h-4" /> Export Logs
                    </Button>
                    <Button variant="outline" className="gap-2 rounded-none">
                        <Settings className="w-4 h-4" /> Log Retention
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="rounded-none border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by actor, resource, or IP..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                        <select className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm min-w-[140px]">
                            <option>All Activities</option>
                            <option>User Login</option>
                            <option>Data Export</option>
                            <option>System Config</option>
                        </select>
                        <select className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm min-w-[140px]">
                            <option>Last 24 Hours</option>
                            <option>Last 7 Days</option>
                            <option>Custom Range</option>
                        </select>
                        <Button variant="ghost" size="sm" className="rounded-none gap-2">
                            <Filter className="w-4 h-4" /> More Filters
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Logs Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-none">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="px-4 py-4 uppercase text-xs tracking-wider">Timestamp</th>
                            <th className="px-4 py-4 uppercase text-xs tracking-wider">Actor</th>
                            <th className="px-4 py-4 uppercase text-xs tracking-wider">Action</th>
                            <th className="px-4 py-4 uppercase text-xs tracking-wider">Resource</th>
                            <th className="px-4 py-4 uppercase text-xs tracking-wider">Details</th>
                            <th className="px-4 py-4 uppercase text-xs tracking-wider">IP Address</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {logs.map(log => {
                            const Icon = getIcon(log.type)
                            return (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 opacity-50" />
                                            {log.time}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">
                                                {log.actor.charAt(0)}
                                            </div>
                                            {log.actor}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <Badge variant={getBadgeVariant(log.type) as any} className="gap-1 rounded-none px-2 py-1">
                                            <Icon className="w-3 h-3" />
                                            {log.action}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300 font-mono text-xs">
                                        {log.resource}
                                    </td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                                        {log.details}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                                        {log.ip}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
                    <span>Showing 1-6 of 2,450 events</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled className="rounded-none">Previous</Button>
                        <Button variant="outline" size="sm" className="rounded-none">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
