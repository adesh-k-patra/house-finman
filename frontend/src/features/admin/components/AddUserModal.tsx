import { useState, useEffect } from 'react'
import { User, Mail, Phone, Shield, Building, ArrowRight, ArrowLeft, Check, Lock, Clock, Trash2, Key } from 'lucide-react'
import { Button, WizardModal } from '@/components/ui'
import { cn } from '@/utils'

interface AddUserModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (user: any) => void
    initialData?: any | null
}

export function AddUserModal({ isOpen, onClose, onSave, initialData }: AddUserModalProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'viewer',
        department: '',
        status: 'active'
    })

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    email: initialData.email || '',
                    phone: initialData.phone || '',
                    role: initialData.role || 'viewer',
                    department: initialData.department || '',
                    status: initialData.status || 'active'
                })
            } else {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    role: 'viewer',
                    department: '',
                    status: 'active'
                })
            }
            setCurrentStep(1)
        }
    }, [isOpen, initialData])

    const steps = [
        { id: 1, label: 'Identity', description: 'Personal Information' },
        { id: 2, label: 'Permissions', description: 'Role & Access' },
        ...(initialData ? [{ id: 3, label: 'Activity Log', description: 'System History' }] : [])
    ]

    const handleSubmit = () => {
        onSave({
            ...formData,
            id: initialData?.id || `new_${Date.now()}`,
            createdAt: initialData?.createdAt || new Date().toISOString(),
            lastActive: initialData?.lastActive || new Date().toISOString()
        })
        onClose()
    }

    const footer = (
        <div className="flex justify-between w-full">
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="rounded-none text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                    Cancel
                </Button>
                {initialData && (
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => { if (confirm('Are you sure you want to deactivate this user?')) onClose() }}
                            className="rounded-none text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            leftIcon={<Lock className="w-4 h-4" />}
                        >
                            Deactivate
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => { if (confirm('Delete user permanently?')) onClose() }}
                            className="rounded-none text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            leftIcon={<Trash2 className="w-4 h-4" />}
                        >
                            Delete
                        </Button>
                    </>
                )}
            </div>
            <div className="flex gap-3">
                {currentStep > 1 && (
                    <Button
                        variant="secondary"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                        className="rounded-none"
                    >
                        Back
                    </Button>
                )}
                {currentStep < steps.length ? (
                    <Button
                        variant="primary"
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="rounded-none px-6"
                    >
                        Next Step
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        leftIcon={<Check className="w-4 h-4" />}
                        className="rounded-none px-8"
                    >
                        {initialData ? 'Save Changes' : 'Create User'}
                    </Button>
                )}
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Edit User Profile" : "Create New User"}
            subtitle={initialData ? `ID: ${initialData.id}` : "onboard a new team member"}
            currentStep={currentStep}
            steps={steps}
            onStepClick={(id) => setCurrentStep(Number(id))}
            contentTitle={
                currentStep === 1 ? "Personal Identity" :
                    currentStep === 2 ? "Access Configuration" :
                        "System Activity"
            }
            footer={footer}
            sidebarWidth="w-64"
        >
            <div className="space-y-6 animate-fade-in pb-4">
                {currentStep === 1 && (
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                            <div className="relative group">
                                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-y border-l border-slate-200 dark:border-slate-700 text-slate-400 group-focus-within:border-primary-500 group-focus-within:text-primary-500 transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-0 transition-all rounded-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-y border-l border-slate-200 dark:border-slate-700 text-slate-400 group-focus-within:border-primary-500 group-focus-within:text-primary-500 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-0 transition-all rounded-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    placeholder="john@housefinman.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                            <div className="relative group">
                                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-y border-l border-slate-200 dark:border-slate-700 text-slate-400 group-focus-within:border-primary-500 group-focus-within:text-primary-500 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <input
                                    required
                                    type="tel"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-0 transition-all rounded-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">System Role</label>
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-y border-l border-slate-200 dark:border-slate-700 text-slate-400 group-focus-within:border-primary-500 group-focus-within:text-primary-500 transition-colors">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <select
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-0 transition-all rounded-none appearance-none cursor-pointer"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="viewer">Viewer</option>
                                        <option value="agent">Agent</option>
                                        <option value="cx">CX Agent</option>
                                        <option value="super_admin">Super Admin</option>
                                        <option value="tenant_admin">Admin</option>
                                        <option value="finance">Finance</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-y border-l border-slate-200 dark:border-slate-700 text-slate-400 group-focus-within:border-primary-500 group-focus-within:text-primary-500 transition-colors">
                                        <Building className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-0 transition-all rounded-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                        placeholder="e.g. Sales"
                                        value={formData.department}
                                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 p-5 relative">
                            <div className="absolute -top-3 left-3 px-2 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Permissions Preview
                            </div>
                            <div className="space-y-3 mt-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-emerald-100 text-emerald-600"><Check className="w-3 h-3" /></div>
                                    <span className="text-sm text-slate-600 dark:text-slate-300">Read access to dashboard</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-1 rounded-full", formData.role === 'viewer' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-600')}>
                                        {formData.role === 'viewer' ? <Lock className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                    </div>
                                    <span className={cn("text-sm", formData.role === 'viewer' ? "text-slate-400" : "text-slate-600 dark:text-slate-300")}>
                                        Create & Edit records
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-1 rounded-full", ['super_admin', 'tenant_admin'].includes(formData.role) ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400')}>
                                        {['super_admin', 'tenant_admin'].includes(formData.role) ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                    </div>
                                    <span className={cn("text-sm", ['super_admin', 'tenant_admin'].includes(formData.role) ? "text-slate-600 dark:text-slate-300" : "text-slate-400")}>
                                        System Configuration & User Management
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && initialData && (
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-white/5 rounded-none flex items-center justify-between">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Last Active</h4>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{new Date(initialData.lastActive).toLocaleString()}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-none border-red-200 text-red-600 hover:bg-red-50"
                                leftIcon={<Key className="w-3.5 h-3.5" />}
                                onClick={() => { if (confirm('Send password reset email?')) alert('Reset email sent.') }}
                            >
                                Reset Password
                            </Button>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-white/5 pb-2">Recent System Activity</h4>
                            <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-3 p-3 border-b last:border-0 border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <div className="w-8 h-8 rounded-none bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Updated system configuration</p>
                                            <p className="text-xs text-slate-500">{i * 2} hours ago • From 192.168.1.{i}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </WizardModal>
    )
}
