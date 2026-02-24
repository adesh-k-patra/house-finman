
import { useState } from 'react'
import { Mail, MessageCircle, Smartphone, Bell, Calendar, Target, ArrowRight, Check, DollarSign } from 'lucide-react'
import { Button, WizardModal, WizardStep, KPICard } from '@/components/ui'
import { CampaignType } from '../data/dummyCampaigns'
import { cn } from '@/utils'

interface CreateCampaignModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (campaign: any) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Strategy', description: 'Define campaign goal and channel.' },
    { id: 2, label: 'Execution', description: 'Budget, schedule and audience.' }
]

export function CreateCampaignModal({ isOpen, onClose, onSave }: CreateCampaignModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        type: 'email' as CampaignType,
        startDate: '',
        budget: '',
        audience: '',
        content: ''
    })

    const handleClose = () => {
        setStep(1)
        onClose()
    }

    const handleCreate = () => {
        if (!formData.name) return

        onSave({
            ...formData,
            budget: Number(formData.budget),
            audience: Number(formData.audience) || 0,
            status: 'draft',
            sent: 0,
            opened: 0,
            clicked: 0,
            converted: 0,
            spent: 0,
            endDate: new Date(new Date(formData.startDate || Date.now()).setDate(new Date(formData.startDate || Date.now()).getDate() + 30)).toISOString().split('T')[0]
        })
        handleClose()
        setFormData({
            name: '',
            type: 'email' as CampaignType,
            startDate: '',
            budget: '',
            audience: '',
            content: ''
        })
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Campaign Name <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                    placeholder="e.g., Summer Sale 2026"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    autoFocus
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Campaign Channel</label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'email', icon: Mail, label: 'Email Blast', desc: 'Newsletter & Promos' },
                        { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', desc: 'Direct Engagement' },
                        { id: 'sms', icon: Smartphone, label: 'SMS', desc: 'Urgent Updates' },
                        { id: 'push', icon: Bell, label: 'Push Notification', desc: 'App Users' }
                    ].map(channel => (
                        <KPICard
                            key={channel.id}
                            title={channel.desc}
                            value={channel.label}
                            icon={<channel.icon className="w-4 h-4" />}
                            variant={formData.type === channel.id ? 'blue' : 'default'}
                            onClick={() => setFormData({ ...formData, type: channel.id as CampaignType })}
                            className="cursor-pointer hover:opacity-90 transition-opacity"
                            compact
                        />
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description / Notes</label>
                <textarea
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium min-h-[80px] resize-none"
                    placeholder="Campaign objective and target audience notes..."
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                />
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            autoFocus
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Budget</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="number"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                            placeholder="0.00"
                            value={formData.budget}
                            onChange={e => setFormData({ ...formData, budget: e.target.value })}
                        />
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Audience Size</label>
                <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="number"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium"
                        placeholder="Est. recipients"
                        value={formData.audience}
                        onChange={e => setFormData({ ...formData, audience: e.target.value })}
                    />
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                    Estimated reach based on current segmentation.
                </p>
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create Campaign"
            subtitle="Marketing Automation"
            steps={STEPS}
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            contentTitle={step === 1 ? 'Campaign Strategy' : 'Execution Details'}
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}
            footer={
                <>
                    {step === 1 ? (
                        <Button variant="primary" className="rounded-none" onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />} disabled={!formData.name}>
                            Next Step
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="secondary" className="rounded-none" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button variant="primary" className="rounded-none" onClick={handleCreate} leftIcon={<Check className="w-4 h-4" />}>
                                Launch Campaign
                            </Button>
                        </div>
                    )}
                </>
            }
        >
            {step === 1 ? renderStep1() : renderStep2()}
        </WizardModal>
    )
}
