/**
 * Schedule Approval Modal
 * Schedule loan approval for a future time (24h window)
 */

import { useState } from 'react';
import { WizardModal } from '@/components/ui/WizardModal';
import { Button } from '@/components/ui/Button';
import { Loan } from '../../types';
import { cn } from '@/utils';
import {
    Clock, Calendar, Mail, MessageSquare, Phone,
    AlertCircle, ChevronRight, User
} from 'lucide-react';

interface ScheduleApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Loan;
    onSchedule: (scheduledTime: string, notifyChannels: string[]) => void;
}

const steps = [
    { id: 1, label: 'Schedule', description: 'Set approval time' },
    { id: 2, label: 'Notifications', description: 'Configure alerts' },
    { id: 3, label: 'Confirm', description: 'Review schedule' }
];

export function ScheduleApprovalModal({ isOpen, onClose, loan, onSchedule }: ScheduleApprovalModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [scheduleType, setScheduleType] = useState<'24h' | 'custom'>('24h');
    const [customDate, setCustomDate] = useState('');
    const [customTime, setCustomTime] = useState('');
    const [notifyChannels, setNotifyChannels] = useState<string[]>(['email', 'sms']);
    const [notifyBorrower, setNotifyBorrower] = useState(true);
    const [notifyOfficer, setNotifyOfficer] = useState(true);

    const scheduledDateTime = scheduleType === '24h'
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : new Date(`${customDate}T${customTime}`);

    const toggleChannel = (channel: string) => {
        setNotifyChannels(prev =>
            prev.includes(channel)
                ? prev.filter(c => c !== channel)
                : [...prev, channel]
        );
    };

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSchedule = () => {
        onSchedule(scheduledDateTime.toISOString(), notifyChannels);
        onClose();
    };

    const formatCountdown = (endDate: Date) => {
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            {/* Schedule Type Selection */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setScheduleType('24h')}
                    className={cn(
                        "p-6 border text-left transition-all",
                        scheduleType === '24h'
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : "border-slate-200 dark:border-white/10 hover:border-slate-300"
                    )}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <Clock className={cn(
                            "w-8 h-8",
                            scheduleType === '24h' ? "text-primary-600" : "text-slate-400"
                        )} />
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">24 Hour Window</h4>
                            <p className="text-xs text-slate-500">Standard approval window</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Loan will be automatically approved after 24 hours unless cancelled
                    </p>
                </button>

                <button
                    onClick={() => setScheduleType('custom')}
                    className={cn(
                        "p-6 border text-left transition-all",
                        scheduleType === 'custom'
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : "border-slate-200 dark:border-white/10 hover:border-slate-300"
                    )}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <Calendar className={cn(
                            "w-8 h-8",
                            scheduleType === 'custom' ? "text-primary-600" : "text-slate-400"
                        )} />
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Custom Schedule</h4>
                            <p className="text-xs text-slate-500">Pick a specific time</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Choose a specific date and time for approval
                    </p>
                </button>
            </div>

            {/* Custom Date/Time Picker */}
            {scheduleType === 'custom' && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={customDate}
                            onChange={(e) => setCustomDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">
                            Time
                        </label>
                        <input
                            type="time"
                            value={customTime}
                            onChange={(e) => setCustomTime(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                    </div>
                </div>
            )}

            {/* Preview */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400 rounded-sm">
                        <Clock className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-primary-600 tracking-widest">Scheduled For</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                            {scheduledDateTime.toLocaleDateString('en-IN', {
                                weekday: 'short',
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                        <p className="text-sm text-slate-500">Countdown: {formatCountdown(scheduledDateTime)}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            {/* Notification Channels */}
            <div>
                <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-4">Notification Channels</h4>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => toggleChannel('email')}
                        className={cn(
                            "p-4 border text-center transition-all",
                            notifyChannels.includes('email')
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : "border-slate-200 dark:border-white/10"
                        )}
                    >
                        <Mail className={cn(
                            "w-6 h-6 mx-auto mb-2",
                            notifyChannels.includes('email') ? "text-primary-600" : "text-slate-400"
                        )} />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</p>
                    </button>
                    <button
                        onClick={() => toggleChannel('sms')}
                        className={cn(
                            "p-4 border text-center transition-all",
                            notifyChannels.includes('sms')
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : "border-slate-200 dark:border-white/10"
                        )}
                    >
                        <MessageSquare className={cn(
                            "w-6 h-6 mx-auto mb-2",
                            notifyChannels.includes('sms') ? "text-primary-600" : "text-slate-400"
                        )} />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">SMS</p>
                    </button>
                    <button
                        onClick={() => toggleChannel('whatsapp')}
                        className={cn(
                            "p-4 border text-center transition-all",
                            notifyChannels.includes('whatsapp')
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : "border-slate-200 dark:border-white/10"
                        )}
                    >
                        <Phone className={cn(
                            "w-6 h-6 mx-auto mb-2",
                            notifyChannels.includes('whatsapp') ? "text-primary-600" : "text-slate-400"
                        )} />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">WhatsApp</p>
                    </button>
                </div>
            </div>

            {/* Notify Recipients */}
            <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Notify Recipients</h4>

                <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">Borrower</p>
                            <p className="text-xs text-slate-500">{loan.borrower.email}</p>
                        </div>
                    </div>
                    <input
                        type="checkbox"
                        checked={notifyBorrower}
                        onChange={(e) => setNotifyBorrower(e.target.checked)}
                        className="w-5 h-5"
                    />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">Assigned Officer</p>
                            <p className="text-xs text-slate-500">{loan.assignedOfficer}</p>
                        </div>
                    </div>
                    <input
                        type="checkbox"
                        checked={notifyOfficer}
                        onChange={(e) => setNotifyOfficer(e.target.checked)}
                        className="w-5 h-5"
                    />
                </label>
            </div>

            {/* Notification Preview */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3">Notification Preview</h4>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 text-sm">
                    <p className="text-slate-700 dark:text-slate-300">
                        Dear <strong>{loan.borrower.name}</strong>,<br /><br />
                        Your loan application <strong>{loan.referenceId}</strong> has been scheduled for approval on{' '}
                        <strong>{scheduledDateTime.toLocaleDateString()}</strong>.
                        You will receive a confirmation once the loan is approved.
                    </p>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            {/* Confirmation Banner */}
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-6 text-center">
                <Clock className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary-700 dark:text-primary-400 mb-2">Schedule Confirmation</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Loan <strong>{loan.referenceId}</strong> will be approved at the scheduled time
                </p>
            </div>

            {/* Summary */}
            <div className="space-y-3">
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Scheduled Time</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                        {scheduledDateTime.toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Countdown</span>
                    <span className="font-bold text-primary-600">{formatCountdown(scheduledDateTime)}</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Notification Channels</span>
                    <span className="font-bold text-slate-900 dark:text-white">{notifyChannels.join(', ').toUpperCase()}</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">Notify Borrower</span>
                    <span className={cn("font-bold", notifyBorrower ? "text-emerald-600" : "text-slate-400")}>
                        {notifyBorrower ? 'Yes' : 'No'}
                    </span>
                </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                    You can cancel or modify the scheduled approval from the loan detail page before the scheduled time.
                </p>
            </div>
        </div>
    );

    const footer = (
        <div className="flex items-center justify-between">
            {currentStep > 1 ? (
                <Button variant="ghost" onClick={handleBack}>Back</Button>
            ) : (
                <div />
            )}
            <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                {currentStep < 3 ? (
                    <Button
                        variant="primary"
                        onClick={handleNext}
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleSchedule}
                        leftIcon={<Clock className="w-4 h-4" />}
                    >
                        Schedule Approval
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Schedule Approval"
            subtitle="Set approval window"
            steps={steps}
            currentStep={currentStep}
            onStepClick={(id) => setCurrentStep(Number(id))}
            contentTitle={steps.find(s => s.id === currentStep)?.label || ''}
            footer={footer}
        >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
        </WizardModal>
    );
}
