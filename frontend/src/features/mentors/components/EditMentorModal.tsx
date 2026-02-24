import { useState, useEffect } from 'react'
import { Phone, MapPin, Mail } from 'lucide-react'
import { Button, WizardModal } from '@/components/ui'
import { cn } from '@/utils'
import { Mentor, MentorStatus } from '../data/dummyMentors'

interface EditMentorModalProps {
    mentor: Mentor | null
    isOpen: boolean
    onClose: () => void
    onSave: (updatedMentor: Mentor) => void
}

export function EditMentorModal({ mentor, isOpen, onClose, onSave }: EditMentorModalProps) {
    const [formData, setFormData] = useState<Mentor | null>(null)

    useEffect(() => {
        if (mentor) {
            setFormData({ ...mentor })
        }
    }, [mentor])

    const handleSave = () => {
        if (formData) {
            onSave(formData)
            onClose()
        }
    }

    if (!formData) return null

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Mentor"
            subtitle={formData.id}
            sidebarWidth="w-[300px]"
            currentStep={1}
            steps={[
                { id: 1, label: 'Basic Info', description: 'Name, Bio & Location' },
                { id: 2, label: 'Expertise', description: 'Skills & Cost' },
                { id: 3, label: 'Status', description: 'Availability' }
            ]}
            contentTitle={formData.name || 'Edit Mentor'}
            footer={
                <div className="flex justify-between w-full">
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    </div>
                    <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                </div>
            }
        >
            <div className="space-y-6 animate-fade-in pb-10">
                {/* Header Stats */}
                <div className="flex flex-wrap gap-3 pb-6 border-b border-slate-100 dark:border-white/5">
                    <div className={cn('px-3 py-1 rounded-sm text-sm font-bold flex items-center gap-2 uppercase tracking-wide',
                        formData.status === 'available' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                            formData.status === 'busy' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                                "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                    )}>
                        <div className={cn("w-2 h-2 rounded-full",
                            formData.status === 'available' ? "bg-emerald-500" :
                                formData.status === 'busy' ? "bg-amber-500" : "bg-slate-500")} />
                        {formData.status}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Main Content */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border border-slate-200 dark:border-white/10 rounded-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mentor Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        className="w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</label>
                                <textarea
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm min-h-[100px]"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                                <select
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as MentorStatus })}
                                >
                                    <option value="available">Available</option>
                                    <option value="busy">In Session</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hourly Rate (₹)</label>
                                <input
                                    type="number"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                    value={formData.hourlyRate}
                                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience (Years)</label>
                            <input
                                type="number"
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-sm font-medium focus:outline-none focus:border-primary-500 rounded-sm"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </WizardModal>
    )
}
