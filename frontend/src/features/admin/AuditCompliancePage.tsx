
/**
 * Audit & Compliance Page for House FinMan
 * 
 * Features:
 * - System Audit Logs
 * - Compliance Checklist
 * - Security Alerts
 */

import { useState } from 'react'
import { Download, Filter, Search, CheckCircle2, AlertTriangle, User, Clock, FileJson, AlertOctagon } from 'lucide-react'
import { Button, WizardModal } from '@/components/ui'
import { cn } from '@/utils'

import { dummyLogs } from './data/dummyLogs'

const complianceChecklist = [
    { id: '1', item: 'RBI Data Localization', status: 'compliant', lastCheck: 'Jan 1, 2026' },
    { id: '2', item: 'User Consent (GDPR/DPDP)', status: 'compliant', lastCheck: 'Jan 5, 2026' },
    { id: '3', item: 'Encryption at Rest', status: 'compliant', lastCheck: 'Jan 1, 2026' },
    { id: '4', item: 'Vendor Risk Assessment', status: 'pending', lastCheck: 'Dec 15, 2025' },
    { id: '5', item: 'Access Control Review', status: 'compliant', lastCheck: 'Jan 1, 2026' },
]

export default function AuditCompliancePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLog, setSelectedLog] = useState<typeof dummyLogs[0] | null>(null)
    const [currentStep, setCurrentStep] = useState(1)

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit & Compliance</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">System logs, security alerts, and compliance tracking</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="rounded-none" leftIcon={<Filter className="w-4 h-4" />}>Filter Logs</Button>
                    <Button variant="primary" className="rounded-none" leftIcon={<Download className="w-4 h-4" />}>Export Logs</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Compliance Status Card - Sharp */}
                <div className="col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-0">
                    <div className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                        <h3 className="font-bold text-slate-900 dark:text-white">Compliance Status</h3>
                    </div>
                    <div className="space-y-3">
                        {complianceChecklist.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 hover:border-primary-500/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    {item.status === 'compliant' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.item}</p>
                                        <p className="text-xs text-slate-500">Checked: {item.lastCheck}</p>
                                    </div>
                                </div>
                                <span className={cn('text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider border',
                                    item.status === 'compliant'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                                        : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                                )}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audit Logs Card - Sharp */}
                <div className="col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-0 flex flex-col">
                    <div className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white">System Audit Logs</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-primary-500 rounded-none"
                            />
                        </div>
                    </div>

                    <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm flex-1">
                        <table className="w-full">
                            <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Action</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">User</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">IP Address</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Timestamp</th>
                                    <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {dummyLogs.filter(log => log.action.toLowerCase().includes(searchQuery.toLowerCase()) || log.user.toLowerCase().includes(searchQuery.toLowerCase())).map(log => (
                                    <tr
                                        key={log.id}
                                        className="group relative hover:z-20 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:ring-1 hover:ring-slate-900/5 dark:hover:ring-white/10"
                                        onClick={() => setSelectedLog(log)}
                                    >
                                        <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 border-r border-slate-300 dark:border-slate-700">{log.action}</td>
                                        <td className="px-4 py-4 text-center text-sm text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">{log.user}</td>
                                        <td className="px-4 py-4 text-center text-sm font-mono text-slate-500 border-r border-slate-300 dark:border-slate-700">{log.ip}</td>
                                        <td className="px-4 py-4 text-center text-xs text-slate-500 border-r border-slate-300 dark:border-slate-700">{log.timestamp}</td>
                                        <td className="px-4 py-4 text-center border-slate-300 dark:border-slate-700">
                                            <span className={cn('px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm inline-block',
                                                log.status === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    log.status === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            )}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Log Detail Modal (Wizard Style) */}
            <WizardModal
                isOpen={!!selectedLog}
                onClose={() => { setSelectedLog(null); setCurrentStep(1); }}
                title="Audit Log Details"
                subtitle={`ID: ${selectedLog?.id}`}
                sidebarWidth="w-[300px]"
                currentStep={currentStep}
                steps={[
                    { id: 1, label: 'Log Overview', description: 'Action & Status' },
                    { id: 2, label: 'Technical Data', description: 'Payload & Headers' }
                ]}
                onStepClick={(stepId) => setCurrentStep(Number(stepId))}
                contentTitle={currentStep === 1 ? (selectedLog?.action || 'Log Entry') : 'Technical Details'}
                footer={
                    <div className="flex justify-between w-full">
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => { setSelectedLog(null); setCurrentStep(1); }}>Close</Button>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => alert('Log downloaded!')}>Download JSON</Button>
                            <Button variant="primary" leftIcon={<AlertOctagon className="w-4 h-4" />} onClick={() => alert('Issue reported to Security Team!')}>Report Issue</Button>
                        </div>
                    </div>
                }
            >
                {selectedLog && (
                    <div className="space-y-6 animate-fade-in pb-10">
                        {currentStep === 1 && (
                            <>
                                {/* Header Stats */}
                                <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-100 dark:border-white/5">
                                    <div className={cn('px-3 py-1 rounded-sm text-sm font-bold flex items-center gap-2 uppercase tracking-wide',
                                        selectedLog.status === 'success' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                                            selectedLog.status === 'warning' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                                                "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                    )}>
                                        {selectedLog.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                        {selectedLog.status} Event
                                    </div>
                                    <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-sm text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
                                        <Clock className="w-4 h-4" /> {selectedLog.timestamp}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* Sidebar Info - Moved to main view for step 1 */}
                                    <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 rounded-sm">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><User className="w-3 h-3" /> Actor Details</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase">User</p>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedLog.user}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase">IP Address</p>
                                                <p className="font-mono font-medium text-slate-700 dark:text-slate-300 text-sm">{selectedLog.ip}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><FileJson className="w-3 h-3" /> Log Payload</h4>
                                    <div className="bg-slate-900 text-slate-300 rounded-sm font-mono text-xs overflow-x-auto border border-slate-800 relative group">
                                        <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">HTTP Headers</h4>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-sm border border-slate-100 dark:border-white/5 font-mono text-xs text-slate-600 dark:text-slate-400">
                                        User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...<br />
                                        Referer: https://app.housefinman.com/login<br />
                                        X-Request-ID: req_123456789
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </WizardModal>
        </div>
    )
}
