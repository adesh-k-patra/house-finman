import { useState } from 'react'
import { User, Phone, Tag, AlertCircle, MessageSquare } from 'lucide-react'
import { Button, WizardModal } from '@/components/ui'

interface CreateTicketModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (ticket: any) => void
}

export function CreateTicketModal({ isOpen, onClose, onSave }: CreateTicketModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        subject: '',
        customerName: '',
        customerPhone: '',
        category: 'loan_query',
        priority: 'medium',
        description: ''
    })

    const handleSave = () => {
        onSave({
            ...formData,
            id: `new_${Date.now()}`,
            ticketNumber: `TKT-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            status: 'open',
            assignedTo: 'Unassigned',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            slaBreached: false
        })
        onClose()
        setStep(1) // Reset step
    }

    // Step definitions
    const steps = [
        { id: 1, label: 'Basics', description: 'Customer & Category' },
        { id: 2, label: 'Details', description: 'Issue Description' }
    ]

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={() => { onClose(); setStep(1); }}
            title="Create Ticket"
            subtitle="New Support Request"
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            steps={steps}
            contentTitle={step === 1 ? 'Customer Information' : 'Issue Details'}
            sidebarWidth="w-[280px]"
            footer={
                <div className="flex justify-between w-full">
                    {step === 1 ? (
                        <div className="ml-auto">
                            <Button variant="primary" className="rounded-none w-32" onClick={() => setStep(2)}>Next</Button>
                        </div>
                    ) : (
                        <>
                            <Button variant="secondary" className="rounded-none" onClick={() => setStep(1)}>Back</Button>
                            <Button variant="primary" className="rounded-none w-32" onClick={handleSave}>Create Ticket</Button>
                        </>
                    )}
                </div>
            }
        >
            <div className="space-y-6 animate-fade-in max-w-2xl">
                {step === 1 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Customer Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-none transition-colors"
                                        placeholder="e.g. Rahul Sharma"
                                        value={formData.customerName}
                                        onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        className="w-full pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-none transition-colors"
                                        placeholder="+91 98765 43210"
                                        value={formData.customerPhone}
                                        onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        className="w-full pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-none transition-colors appearance-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="loan_query">Loan Query</option>
                                        <option value="document_issue">Document Issue</option>
                                        <option value="payment_issue">Payment Issue</option>
                                        <option value="partner_complaint">Partner Complaint</option>
                                        <option value="technical">Technical Issue</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                                <div className="relative">
                                    <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        className="w-full pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-none transition-colors appearance-none"
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-none transition-colors"
                                        placeholder="Brief summary of the issue"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detailed Description</label>
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-none transition-colors resize-none h-32"
                                    placeholder="Provide detailed information about the customer request..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </WizardModal>
    )
}
