/**
 * Loan Settings Tab
 * Account controls: Block payments, Freeze account, Block future loans, etc.
 */

import { useState } from 'react';
import { Loan } from '../types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import {
    Lock, Unlock, Ban, Shield, Bell, CreditCard, AlertTriangle, Clock,
    CheckCircle2, XCircle, Settings, FileText, Send, RotateCcw,
    Pause, Play, ShieldAlert, ShieldCheck, UserX, Building2
} from 'lucide-react';

interface LoanSettingsTabProps {
    loan: Loan;
}

interface SettingToggle {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    status: 'active' | 'blocked' | 'frozen' | 'review' | 'approved';
    color: string;
}

export function LoanSettingsTab({ loan }: LoanSettingsTabProps) {
    // Account Controls State
    const [accountSettings, setAccountSettings] = useState({
        paymentBlocked: false,
        futureLoansBlocked: false,
        accountFrozen: false,
        underReview: false,
        autoDebitActive: true,
        notificationsActive: true,
        collectionsActive: false,
        legalHold: false,
    });

    const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null);
    const [confirmReason, setConfirmReason] = useState('');

    const handleToggle = (setting: string) => {
        setShowConfirmModal(setting);
    };

    const confirmAction = () => {
        if (showConfirmModal) {
            setAccountSettings(prev => ({
                ...prev,
                [showConfirmModal]: !prev[showConfirmModal as keyof typeof prev]
            }));
            setShowConfirmModal(null);
            setConfirmReason('');
        }
    };

    // Account Status Cards
    const accountControls: SettingToggle[] = [
        {
            id: 'paymentBlocked',
            label: 'Block Payments',
            description: 'Prevent any payment processing on this account',
            icon: <Ban className="w-5 h-5" />,
            status: accountSettings.paymentBlocked ? 'blocked' : 'approved',
            color: 'red'
        },
        {
            id: 'futureLoansBlocked',
            label: 'Block Future Loans',
            description: 'Prevent borrower from taking additional loans',
            icon: <UserX className="w-5 h-5" />,
            status: accountSettings.futureLoansBlocked ? 'blocked' : 'approved',
            color: 'orange'
        },
        {
            id: 'accountFrozen',
            label: 'Freeze Account',
            description: 'Temporarily suspend all account activities',
            icon: <Lock className="w-5 h-5" />,
            status: accountSettings.accountFrozen ? 'frozen' : 'active',
            color: 'blue'
        },
        {
            id: 'underReview',
            label: 'Under Review',
            description: 'Flag account for compliance review',
            icon: <ShieldAlert className="w-5 h-5" />,
            status: accountSettings.underReview ? 'review' : 'approved',
            color: 'purple'
        },
    ];

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'blocked':
                return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-red-600 bg-red-50 px-2.5 py-1 rounded-sm border border-red-100"><XCircle className="w-3.5 h-3.5" /> Blocked</span>;
            case 'frozen':
                return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100"><Lock className="w-3.5 h-3.5" /> Frozen</span>;
            case 'review':
                return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-purple-600 bg-purple-50 px-2.5 py-1 rounded-sm border border-purple-100"><Clock className="w-3.5 h-3.5" /> Under Review</span>;
            case 'active':
                return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-100"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>;
            case 'approved':
                return <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-100"><ShieldCheck className="w-3.5 h-3.5" /> Allowed</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Account Status Banner */}
            <div className={cn(
                'px-6 py-5 flex items-center justify-between border',
                accountSettings.accountFrozen && 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
                accountSettings.paymentBlocked && !accountSettings.accountFrozen && 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
                accountSettings.underReview && !accountSettings.paymentBlocked && !accountSettings.accountFrozen && 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
                !accountSettings.accountFrozen && !accountSettings.paymentBlocked && !accountSettings.underReview && 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
            )}>
                <div className="flex items-center gap-4">
                    {accountSettings.accountFrozen ? (
                        <Lock className="w-8 h-8 text-blue-600" />
                    ) : accountSettings.paymentBlocked ? (
                        <Ban className="w-8 h-8 text-red-600" />
                    ) : accountSettings.underReview ? (
                        <ShieldAlert className="w-8 h-8 text-purple-600" />
                    ) : (
                        <ShieldCheck className="w-8 h-8 text-emerald-600" />
                    )}
                    <div>
                        <h3 className={cn(
                            'text-lg font-bold',
                            accountSettings.accountFrozen && 'text-blue-700 dark:text-blue-400',
                            accountSettings.paymentBlocked && !accountSettings.accountFrozen && 'text-red-700 dark:text-red-400',
                            accountSettings.underReview && !accountSettings.paymentBlocked && !accountSettings.accountFrozen && 'text-purple-700 dark:text-purple-400',
                            !accountSettings.accountFrozen && !accountSettings.paymentBlocked && !accountSettings.underReview && 'text-emerald-700 dark:text-emerald-400'
                        )}>
                            {accountSettings.accountFrozen ? 'Account Frozen' :
                                accountSettings.paymentBlocked ? 'Payments Blocked' :
                                    accountSettings.underReview ? 'Under Review' :
                                        'Account Active'}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {accountSettings.accountFrozen ? 'All account activities are temporarily suspended' :
                                accountSettings.paymentBlocked ? 'Payment processing is blocked on this account' :
                                    accountSettings.underReview ? 'Account is flagged for compliance review' :
                                        'All account features are operational'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Account Controls Grid */}
            <div className="grid grid-cols-2 gap-4">
                {accountControls.map((control) => (
                    <div key={control.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    'p-2.5 rounded-sm',
                                    control.status === 'blocked' && 'bg-red-100 text-red-600',
                                    control.status === 'frozen' && 'bg-blue-100 text-blue-600',
                                    control.status === 'review' && 'bg-purple-100 text-purple-600',
                                    (control.status === 'active' || control.status === 'approved') && 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                )}>
                                    {control.icon}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{control.label}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{control.description}</p>
                                </div>
                            </div>
                            <StatusBadge status={control.status} />
                        </div>
                        <Button
                            variant={control.status === 'approved' || control.status === 'active' ? 'ghost' : 'primary'}
                            className={cn(
                                'w-full text-xs uppercase font-bold',
                                control.status !== 'approved' && control.status !== 'active' && 'bg-emerald-600 hover:bg-emerald-700'
                            )}
                            onClick={() => handleToggle(control.id)}
                        >
                            {control.status === 'approved' || control.status === 'active' ? (
                                <><Ban className="w-4 h-4 mr-2" /> Enable Block</>
                            ) : (
                                <><Unlock className="w-4 h-4 mr-2" /> Remove Block</>
                            )}
                        </Button>
                    </div>
                ))}
            </div>

            {/* Auto-Debit & Notifications Section */}
            <div className="bg-slate-950 px-6 py-3 border-b border-white/10">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary-400" /> Payment & Notification Settings
                </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {/* Auto-Debit Control */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                'p-2.5 rounded-sm',
                                accountSettings.autoDebitActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                            )}>
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Auto-Debit</h4>
                                <p className="text-xs text-slate-500 mt-0.5">E-mandate/NACH debit</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setAccountSettings(prev => ({ ...prev, autoDebitActive: !prev.autoDebitActive }))}
                            className={cn(
                                'relative w-12 h-6 rounded-sm transition-colors',
                                accountSettings.autoDebitActive ? 'bg-emerald-500' : 'bg-slate-300'
                            )}
                        >
                            <span className={cn(
                                'absolute top-0.5 w-5 h-5 rounded-sm bg-white shadow transition-transform',
                                accountSettings.autoDebitActive ? 'translate-x-6' : 'translate-x-0.5'
                            )} />
                        </button>
                    </div>
                    {accountSettings.autoDebitActive ? (
                        <div className="text-xs text-emerald-600 flex items-center gap-1"><Play className="w-3 h-3" /> Active - Next debit on {loan.financials.nextDueDate || '01/02/2025'}</div>
                    ) : (
                        <div className="text-xs text-slate-500 flex items-center gap-1"><Pause className="w-3 h-3" /> Paused - Manual payments required</div>
                    )}
                </div>

                {/* Notifications Control */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                'p-2.5 rounded-sm',
                                accountSettings.notificationsActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                            )}>
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
                                <p className="text-xs text-slate-500 mt-0.5">EMI reminders, alerts</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setAccountSettings(prev => ({ ...prev, notificationsActive: !prev.notificationsActive }))}
                            className={cn(
                                'relative w-12 h-6 rounded-sm transition-colors',
                                accountSettings.notificationsActive ? 'bg-blue-500' : 'bg-slate-300'
                            )}
                        >
                            <span className={cn(
                                'absolute top-0.5 w-5 h-5 rounded-sm bg-white shadow transition-transform',
                                accountSettings.notificationsActive ? 'translate-x-6' : 'translate-x-0.5'
                            )} />
                        </button>
                    </div>
                    {accountSettings.notificationsActive ? (
                        <div className="text-xs text-blue-600 flex items-center gap-1"><Send className="w-3 h-3" /> Enabled via Email, SMS, WhatsApp</div>
                    ) : (
                        <div className="text-xs text-slate-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> All notifications disabled</div>
                    )}
                </div>

                {/* Collections Control */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                'p-2.5 rounded-sm',
                                accountSettings.collectionsActive ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                            )}>
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Collections Mode</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Soft collection calls</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setAccountSettings(prev => ({ ...prev, collectionsActive: !prev.collectionsActive }))}
                            className={cn(
                                'relative w-12 h-6 rounded-sm transition-colors',
                                accountSettings.collectionsActive ? 'bg-amber-500' : 'bg-slate-300'
                            )}
                        >
                            <span className={cn(
                                'absolute top-0.5 w-5 h-5 rounded-sm bg-white shadow transition-transform',
                                accountSettings.collectionsActive ? 'translate-x-6' : 'translate-x-0.5'
                            )} />
                        </button>
                    </div>
                    {accountSettings.collectionsActive ? (
                        <div className="text-xs text-amber-600 flex items-center gap-1"><Clock className="w-3 h-3" /> Collection workflow active</div>
                    ) : (
                        <div className="text-xs text-slate-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Standard repayment mode</div>
                    )}
                </div>
            </div>

            {/* Legal & Compliance Section */}
            <div className="bg-slate-950 px-6 py-3 border-b border-white/10">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary-400" /> Legal & Compliance Controls
                </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {/* Legal Hold */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                'p-2.5 rounded-sm',
                                accountSettings.legalHold ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                            )}>
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Legal Hold</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Prevent data archival/deletion</p>
                            </div>
                        </div>
                        {accountSettings.legalHold ? (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-red-600 bg-red-50 px-2.5 py-1 rounded-sm border border-red-100">
                                <Lock className="w-3.5 h-3.5" /> Active
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2.5 py-1 rounded-sm border border-slate-200">
                                Inactive
                            </span>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        className={cn(
                            'w-full text-xs uppercase font-bold',
                            accountSettings.legalHold ? '' : 'text-red-600 hover:bg-red-50'
                        )}
                        onClick={() => setAccountSettings(prev => ({ ...prev, legalHold: !prev.legalHold }))}
                    >
                        {accountSettings.legalHold ? (
                            <><Unlock className="w-4 h-4 mr-2" /> Release Hold</>
                        ) : (
                            <><Lock className="w-4 h-4 mr-2" /> Apply Legal Hold</>
                        )}
                    </Button>
                </div>

                {/* Retention Policy Info */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-sm bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Retention Policy</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Data retention period</p>
                            </div>
                        </div>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100">
                            7 Years
                        </span>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between">
                            <span>Archive Date:</span>
                            <span className="font-medium text-slate-900 dark:text-white">{loan.closure?.archiveDate || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Purge Date:</span>
                            <span className="font-medium text-slate-900 dark:text-white">{loan.closure?.purgeDate || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Log */}
            <div className="bg-slate-950 px-6 py-3 border-b border-white/10">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-primary-400" /> Settings Change History
                </h3>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4">
                <div className="space-y-3">
                    {[
                        { action: 'Auto-debit enabled', by: 'System', at: '02/01/2024 10:00 AM' },
                        { action: 'Account activated after approval', by: 'Rahul Verma', at: '02/01/2024 09:30 AM' },
                        { action: 'Notifications configured', by: 'System', at: '01/25/2024 04:00 PM' },
                    ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-b-0">
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{log.action}</p>
                                <p className="text-xs text-slate-500">by {log.by}</p>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">{log.at}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" /> Confirm Action
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Are you sure you want to {accountSettings[showConfirmModal as keyof typeof accountSettings] ? 'disable' : 'enable'} this setting?
                            </p>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">Reason (Required)</label>
                                <textarea
                                    className="w-full h-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-2 text-sm rounded-sm"
                                    placeholder="Enter reason for this change..."
                                    value={confirmReason}
                                    onChange={(e) => setConfirmReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowConfirmModal(null)}>Cancel</Button>
                            <Button
                                variant="primary"
                                disabled={!confirmReason.trim()}
                                onClick={confirmAction}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
