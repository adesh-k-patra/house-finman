
import { useState, useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui'

interface EditCampaignModalProps {
    campaign: any
    isOpen: boolean
    onClose: () => void
    onSave: (updatedCampaign: any) => void
}

export function EditCampaignModal({ campaign, isOpen, onClose, onSave }: EditCampaignModalProps) {
    const [formData, setFormData] = useState<any>(null)

    useEffect(() => {
        if (campaign) {
            setFormData({ ...campaign })
        }
    }, [campaign])

    if (!isOpen || !formData) return null

    const handleSave = () => {
        onSave(formData)
        onClose()
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white dark:bg-slate-900 rounded-sm shadow-xl z-50 animate-fade-in border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Campaign</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Warning Banner if Active */}
                    {formData.status === 'active' && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-3 rounded-sm flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Campaign is Active</h4>
                                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Changes to content will not affect messages already sent. Changing budget or end date will apply immediately.</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campaign Name</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                            <select
                                className="input"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.budget}
                                onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Line</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.subject || ''}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="Email subject or message header"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content / Message</label>
                        <textarea
                            className="input min-h-[120px]"
                            value={formData.content || ''}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-white/10 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </>
    )
}
