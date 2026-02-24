import { useState } from 'react'
import { FileText, Image as ImageIcon, Check, ArrowRight, Upload, X, Type, Globe, Lock } from 'lucide-react'
import { Button, WizardModal, WizardStep } from '@/components/ui'
import { cn } from '@/utils'

interface CreateArticleModalProps {
    isOpen: boolean
    onClose: () => void
    onSave?: (article: any) => void
}

const STEPS: WizardStep[] = [
    { id: 1, label: 'Basics', description: 'Title & Category' },
    { id: 2, label: 'Content', description: 'Body & Media' },
    { id: 3, label: 'Settings', description: 'Visibility & Tags' }
]

export function CreateArticleModal({ isOpen, onClose, onSave }: CreateArticleModalProps) {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        category: 'products',
        type: 'article',
        description: '',
        content: '',
        image: null as string | null,
        tags: [] as string[],
        visibility: 'public' as 'public' | 'internal' | 'private'
    })

    const [newTag, setNewTag] = useState('')

    const handleClose = () => {
        setStep(1)
        onClose()
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API
        setIsLoading(false)
        if (onSave) onSave({
            ...formData,
            id: `art_${Date.now()}`,
            lastUpdated: new Date().toISOString(),
            views: 0
        })
        handleClose()
        // Reset form
        setFormData({
            title: '',
            category: 'products',
            type: 'article',
            description: '',
            content: '',
            image: null,
            tags: [],
            visibility: 'public'
        })
    }

    const addTag = () => {
        if (newTag && !formData.tags.includes(newTag)) {
            setFormData({ ...formData, tags: [...formData.tags, newTag] })
            setNewTag('')
        }
    }

    const removeTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
    }

    const renderStep1 = () => (
        <div className="space-y-6 animate-fade-in">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Article Title <span className="text-red-500">*</span></label>
                <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        required
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium transition-all"
                        placeholder="e.g. How to Process Home Loans"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        autoFocus={step === 1}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <select
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium appearance-none"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="products">Products & Services</option>
                        <option value="processes">Processes & SOPs</option>
                        <option value="training">Training Materials</option>
                        <option value="compliance">Compliance & Legal</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                    <select
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium appearance-none"
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="guide">Guide</option>
                        <option value="faq">FAQ</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Short Description</label>
                <textarea
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 font-medium min-h-[100px] resize-none"
                    placeholder="Brief summary of what this article covers..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-none p-8 text-center hover:border-primary-500 hover:bg-primary-50/10 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-none bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-600 transition-colors">
                    <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-white" />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Cover Image (Optional)</p>
                <p className="text-xs text-slate-500 mt-1">Drag & drop or click to upload</p>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Article Content</label>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none min-h-[300px] relative">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
                        <span className="text-sm">Rich Text Editor Placeholder</span>
                    </div>
                    <textarea
                        className="w-full h-full min-h-[300px] bg-transparent p-4 focus:outline-none relative z-10"
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                    />
                </div>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6 animate-fade-in">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tags & Keywords</label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none focus:outline-none focus:border-primary-500 text-sm font-medium"
                        placeholder="Add tags..."
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button onClick={addTag} variant="secondary" className="rounded-none px-4" disabled={!newTag}>
                        <Upload className="w-4 h-4 rotate-90" />
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-primary-50 text-primary-700 border border-primary-100 rounded-none text-xs font-bold flex items-center gap-1">
                            #{tag}
                            <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Visibility</label>
                <div className="space-y-3">
                    {[
                        { id: 'public', label: 'Public', desc: 'Visible to all users and partners', icon: Globe },
                        { id: 'internal', label: 'Internal Only', desc: 'Visible to employees only', icon: Lock },
                        { id: 'private', label: 'Private', desc: 'Visible only to you', icon: FileText }
                    ].map(opt => (
                        <div
                            key={opt.id}
                            onClick={() => setFormData({ ...formData, visibility: opt.id as any })}
                            className={cn(
                                "flex items-center gap-4 p-4 border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                                formData.visibility === opt.id
                                    ? "border-primary-500 bg-primary-50/10"
                                    : "border-slate-200 dark:border-slate-800"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-none",
                                formData.visibility === opt.id ? "bg-primary-100 text-primary-600" : "bg-slate-100 text-slate-500"
                            )}>
                                <opt.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className={cn("text-sm font-bold", formData.visibility === opt.id ? "text-primary-900" : "text-slate-900")}>{opt.label}</h4>
                                <p className="text-xs text-slate-500">{opt.desc}</p>
                            </div>
                            {formData.visibility === opt.id && <Check className="w-5 h-5 text-primary-500" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <WizardModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create Article"
            subtitle="Knowledge Base"
            steps={STEPS}
            currentStep={step}
            onStepClick={(id) => setStep(Number(id))}
            contentTitle={STEPS[step - 1].label}
            showBackButton={step > 1}
            onBack={() => setStep(step - 1)}
            footer={
                <>
                    {step < 3 ? (
                        <Button variant="primary" className="rounded-none px-8" onClick={() => setStep(step + 1)} rightIcon={<ArrowRight className="w-4 h-4" />} disabled={!formData.title}>
                            Next Step
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <Button variant="secondary" className="rounded-none px-6" onClick={() => setStep(1)}>
                                Back
                            </Button>
                            <Button variant="primary" className="rounded-none px-8" isLoading={isLoading} onClick={handleSubmit} leftIcon={<Check className="w-4 h-4" />}>
                                Publish Article
                            </Button>
                        </div>
                    )}
                </>
            }
        >
            {step === 1 ? renderStep1() : step === 2 ? renderStep2() : renderStep3()}
        </WizardModal>
    )
}
