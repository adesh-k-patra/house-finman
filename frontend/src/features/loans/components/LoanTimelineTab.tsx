/**
 * Loan Timeline Tab
 * Comprehensive audit trail with expandable entries, diff views, and exports
 */

import { useState } from 'react';
import { Loan } from '../types';
import { Button } from '@/components/ui/Button';
import { KPICard } from '@/components/ui/KPICard';
import { cn, formatCurrency } from '@/utils';
import {
    Clock, User, FileText, CheckCircle2, XCircle, AlertCircle, CreditCard,
    Send, Settings, ChevronDown, ChevronUp, Download, Search,
    Paperclip, RotateCcw, ArrowRight, Eye, Activity
} from 'lucide-react';

interface LoanTimelineTabProps {
    loan: Loan;
}

const getActionIcon = (actionType: string) => {
    switch (actionType) {
        case 'create': return <FileText className="w-4 h-4" />;
        case 'approve': return <CheckCircle2 className="w-4 h-4" />;
        case 'reject': return <XCircle className="w-4 h-4" />;
        case 'payment': return <CreditCard className="w-4 h-4" />;
        case 'document': return <FileText className="w-4 h-4" />;
        case 'notification': return <Send className="w-4 h-4" />;
        case 'escalation': return <AlertCircle className="w-4 h-4" />;
        case 'system': return <Settings className="w-4 h-4" />;
        case 'update': return <RotateCcw className="w-4 h-4" />;
        default: return <Clock className="w-4 h-4" />;
    }
};

const getActionColor = (actionType: string) => {
    switch (actionType) {
        case 'create': return 'bg-blue-100 text-blue-600 border-blue-200';
        case 'approve': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
        case 'reject': return 'bg-red-100 text-red-600 border-red-200';
        case 'payment': return 'bg-purple-100 text-purple-600 border-purple-200';
        case 'document': return 'bg-cyan-100 text-cyan-600 border-cyan-200';
        case 'notification': return 'bg-amber-100 text-amber-600 border-amber-200';
        case 'escalation': return 'bg-orange-100 text-orange-600 border-orange-200';
        case 'system': return 'bg-slate-100 text-slate-600 border-slate-200';
        case 'update': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
        default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
};

export function LoanTimelineTab({ loan }: LoanTimelineTabProps) {
    const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedEntries);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedEntries(newExpanded);
    };

    // Filter and search
    const filteredEntries = loan.auditTrail.filter(entry => {
        const matchesFilter = filter === 'all' || entry.actionType === filter;
        const matchesSearch = !searchQuery ||
            entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.actorName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Sort by timestamp descending
    const sortedEntries = [...filteredEntries].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const filterOptions = [
        { value: 'all', label: 'All Events' },
        { value: 'create', label: 'Created' },
        { value: 'approve', label: 'Approvals' },
        { value: 'reject', label: 'Rejections' },
        { value: 'payment', label: 'Payments' },
        { value: 'document', label: 'Documents' },
        { value: 'notification', label: 'Notifications' },
        { value: 'update', label: 'Updates' },
        { value: 'system', label: 'System' },
    ];

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                    </div>
                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                        {filterOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>Export CSV</Button>
                    <Button variant="secondary" leftIcon={<FileText className="w-4 h-4" />}>Export PDF</Button>
                </div>
            </div>

            {/* Stats Summary - Premium KPICards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-white/10 mb-6">
                <KPICard
                    title="Total Events"
                    value={loan.auditTrail.length}
                    variant="slate"
                    icon={Activity}
                    compact
                />
                <KPICard
                    title="Approvals"
                    value={loan.auditTrail.filter(e => e.actionType === 'approve').length}
                    variant="emerald"
                    icon={CheckCircle2}
                    compact
                />
                <KPICard
                    title="Payments"
                    value={loan.auditTrail.filter(e => e.actionType === 'payment').length}
                    variant="purple"
                    icon={CreditCard}
                    compact
                />
                <KPICard
                    title="Documents"
                    value={loan.auditTrail.filter(e => e.actionType === 'document').length}
                    variant="cyan"
                    icon={FileText}
                    compact
                />
                <KPICard
                    title="Updates"
                    value={loan.auditTrail.filter(e => e.actionType === 'update').length}
                    variant="indigo"
                    icon={RotateCcw}
                    compact
                />
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[27px] top-0 bottom-0 w-px bg-slate-200 dark:bg-white/10" />

                <div className="space-y-4">
                    {sortedEntries.map((entry) => {
                        const { date, time } = formatTimestamp(entry.timestamp);
                        const isExpanded = expandedEntries.has(entry.id);
                        const hasDetails = entry.changes || entry.attachments || entry.metadata;

                        return (
                            <div key={entry.id} className="relative pl-16">
                                {/* Timeline Node */}
                                <div className={cn(
                                    'absolute left-3 w-12 h-12 rounded-sm flex items-center justify-center border',
                                    getActionColor(entry.actionType || 'update')
                                )}>
                                    {getActionIcon(entry.actionType || 'update')}
                                </div>

                                {/* Entry Card */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                                    {/* Header */}
                                    <div
                                        className={cn(
                                            'px-5 py-4 flex items-start justify-between',
                                            hasDetails && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        )}
                                        onClick={() => hasDetails && toggleExpand(entry.id)}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{entry.action}</h4>
                                                <span className={cn(
                                                    'px-2 py-0.5 text-[9px] font-bold uppercase rounded-sm',
                                                    getActionColor(entry.actionType || 'update')
                                                )}>
                                                    {entry.actionType || 'update'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{entry.description}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" /> {entry.actorName}
                                                </span>
                                                <span className="text-slate-400">•</span>
                                                <span>{entry.role}</span>
                                                {entry.attachments && entry.attachments.length > 0 && (
                                                    <>
                                                        <span className="text-slate-400">•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Paperclip className="w-3 h-3" /> {entry.attachments.length} files
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right flex items-start gap-3">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{date}</p>
                                                <p className="text-xs text-slate-500">{time}</p>
                                            </div>
                                            {hasDetails && (
                                                isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && hasDetails && (
                                        <div className="px-5 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950">
                                            {/* Changes Diff */}
                                            {entry.changes && entry.changes.length > 0 && (
                                                <div className="mb-4">
                                                    <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Changes</h5>
                                                    <div className="space-y-2">
                                                        {entry.changes.map((change, i) => (
                                                            <div key={i} className="flex items-center gap-3 text-sm">
                                                                <span className="font-medium text-slate-700 dark:text-slate-300 w-32">{change.field}</span>
                                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs line-through rounded-sm">{String(change.oldValue)}</span>
                                                                <ArrowRight className="w-4 h-4 text-slate-400" />
                                                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-sm">{String(change.newValue)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Metadata */}
                                            {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                                                <div className="mb-4">
                                                    <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Details</h5>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {Object.entries(entry.metadata).map(([key, value]) => (
                                                            <div key={key} className="text-sm">
                                                                <span className="text-slate-500">{key}: </span>
                                                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                                                    {typeof value === 'number' && key.toLowerCase().includes('amount')
                                                                        ? formatCurrency(value)
                                                                        : String(value)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Attachments */}
                                            {entry.attachments && entry.attachments.length > 0 && (
                                                <div>
                                                    <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Attachments</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {entry.attachments.map((file) => (
                                                            <a
                                                                key={file.id}
                                                                href={file.url}
                                                                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                            >
                                                                <FileText className="w-4 h-4 text-slate-400" />
                                                                <span className="text-slate-700 dark:text-slate-300">{file.name}</span>
                                                                <Eye className="w-4 h-4 text-primary-500" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Revert Button */}
                                            {entry.isReversible && !entry.reversedAt && (
                                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                                                        <RotateCcw className="w-4 h-4 mr-2" /> Revert This Action
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Empty State */}
            {sortedEntries.length === 0 && (
                <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No events found matching your criteria</p>
                </div>
            )}
        </div>
    );
}
