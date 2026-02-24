/**
 * Workflow Builder Page for House FinMan
 * 
 * Features:
 * - List of automated workflows
 * - Visual representation of triggers and actions (Simplified)
 * - Create new workflow wizard
 */

import { useState } from 'react'
import { Plus, Play, Zap, Mail, MessageSquare, Clock, Settings, Pencil, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/utils'
import WorkflowCreateModal from './components/WorkflowCreateModal'

interface Workflow {
    id: string
    name: string
    trigger: string
    actions: string[]
    status: 'active' | 'paused'
    runs: number
    lastRun: string
}

const dummyWorkflows: Workflow[] = [
    { id: '1', name: 'New Lead Auto-Response', trigger: 'New Lead Created', actions: ['Send Welcome Email', 'Create Task for Sales'], status: 'active', runs: 1245, lastRun: '2 mins ago' },
    { id: '2', name: 'KYC Document Reminder', trigger: 'Status = KYC Pending > 3 Days', actions: ['Send WhatsApp Reminder', 'Notify Application Officer'], status: 'active', runs: 850, lastRun: '1 hour ago' },
    { id: '3', name: 'Partner Commission Payout', trigger: 'Disbursement Completed', actions: ['Calculate Commission', 'Create Payment Record', 'Email Partner'], status: 'paused', runs: 320, lastRun: 'Yesterday' },
    { id: '4', name: 'High Value Lead Alert', trigger: 'Loan Amount > 1Cr', actions: ['Slack Notification to Manager', 'Assign to Priority Team'], status: 'active', runs: 45, lastRun: 'Jan 5' },
    { id: '5', name: 'Loan Approval Notification', trigger: 'Status Changed to Approved', actions: ['Send Email to Client', 'Notify Partner', 'Create Disbursement Task'], status: 'active', runs: 560, lastRun: '3 hours ago' },
    { id: '6', name: 'Dormant Lead Re-engagement', trigger: 'No Activity > 30 Days', actions: ['Send Re-engagement Email', 'Add to Retargeting List'], status: 'active', runs: 210, lastRun: 'Today 9:00 AM' },
    { id: '7', name: 'New Partner Onboarding', trigger: 'Partner Registration', actions: ['Send Welcome Kit', 'Assign Relationship Manager'], status: 'active', runs: 89, lastRun: '2 days ago' },
    { id: '8', name: 'Holiday Greetings', trigger: 'Date = Public Holiday', actions: ['Send Bulk Email', 'Post to Social Media'], status: 'paused', runs: 12, lastRun: 'Dec 25' },
    { id: '9', name: 'Credit Score Check Fail', trigger: 'CIBIL < 650', actions: ['Tag as High Risk', 'Send Rejection Template', 'Notify Agent'], status: 'active', runs: 154, lastRun: '5 hours ago' },
    { id: '10', name: 'Task Overdue Escalation', trigger: 'Task Due Date Passed', actions: ['Email Assignee', 'Notify Manager'], status: 'active', runs: 67, lastRun: '10 mins ago' },
]

export default function WorkflowBuilderPage() {
    const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [workflows, setWorkflows] = useState<Workflow[]>(dummyWorkflows)

    const filteredWorkflows = workflows.filter(wf =>
        (filter === 'all' || wf.status === filter) &&
        (wf.name.toLowerCase().includes(searchQuery.toLowerCase()) || wf.trigger.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleCreateWorkflow = (newWfData: any) => {
        const newWorkflow: Workflow = {
            id: (workflows.length + 1).toString(),
            name: newWfData.name,
            trigger: newWfData.trigger === 'new_lead' ? 'New Lead Created' :
                newWfData.trigger === 'status_change' ? 'Status Changed' :
                    newWfData.trigger === 'scheduled_time' ? 'Scheduled Time' : 'Form Submission',
            actions: newWfData.actions || ['Send Notification'],
            status: 'active',
            runs: 0,
            lastRun: 'Just now'
        }
        setWorkflows([newWorkflow, ...workflows])
    }

    return (
        <div className="space-y-6 animate-fade-in md:h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Workflow Automation</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Automate repetitive tasks and communications</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search workflows..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
                        />
                    </div>
                    <Button variant="primary" className="rounded-none px-4" onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
                        Create Workflow
                    </Button>
                </div>
            </div>

            <div className="flex gap-0 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-0 shadow-sm">
                <button onClick={() => setFilter('all')} className={cn('px-4 py-3 text-sm font-bold uppercase tracking-wider relative transition-colors', filter === 'all' ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-500 hover:bg-slate-50')}>
                    All Workflows
                    {filter === 'all' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
                </button>
                <button onClick={() => setFilter('active')} className={cn('px-4 py-3 text-sm font-bold uppercase tracking-wider relative transition-colors', filter === 'active' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-500 hover:bg-slate-50')}>
                    Active
                    {filter === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
                </button>
                <button onClick={() => setFilter('paused')} className={cn('px-4 py-3 text-sm font-bold uppercase tracking-wider relative transition-colors', filter === 'paused' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-500 hover:bg-slate-50')}>
                    Paused
                    {filter === 'paused' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10">
                {filteredWorkflows.map(wf => (
                    <div key={wf.id} className="group relative bg-white dark:bg-slate-900 mt-0 border border-l-4 border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:border-r-primary-500 "
                        style={{ borderLeftColor: wf.status === 'active' ? '#10b981' : '#f59e0b' }}>

                        <div className="flex flex-col gap-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{wf.name}</h3>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">
                                        Trigger: <span className="text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded-sm">{wf.trigger}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-none text-slate-400 hover:text-emerald-600 transition-colors" title="Run Now">
                                        <Play className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-none text-slate-400 hover:text-blue-600 transition-colors" title="Edit Workflow">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-none text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Flow Visualization */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-none flex items-center gap-3">
                                    <Zap className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                                    <span className="text-xs font-bold text-amber-900 dark:text-amber-100 uppercase tracking-wide">Trigger</span>
                                </div>

                                <div className="h-px w-8 bg-slate-300 dark:bg-slate-700" />

                                {wf.actions.map((action, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        {i > 0 && <div className="h-px w-8 bg-slate-300 dark:bg-slate-700" />}
                                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none flex items-center gap-3 shadow-sm hover:border-primary-500 hover:text-primary-600 transition-colors cursor-default min-w-[140px] justify-center">
                                            {action.toLowerCase().includes('email') ? <Mail className="w-4 h-4 text-blue-500" /> :
                                                action.toLowerCase().includes('whatsapp') ? <MessageSquare className="w-4 h-4 text-emerald-500" /> :
                                                    action.toLowerCase().includes('slack') ? <MessageSquare className="w-4 h-4 text-purple-500" /> :
                                                        <Settings className="w-4 h-4 text-slate-500" />}
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{action}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Stats */}
                            <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border',
                                    wf.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800')}>
                                    {wf.status}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Play className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Runs: <span className="text-slate-900 dark:text-white font-bold">{wf.runs.toLocaleString()}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Last run: <span className="text-slate-900 dark:text-white font-bold">{wf.lastRun}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <WorkflowCreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateWorkflow}
            />
        </div>
    )
}
