import { useState } from 'react'
import { Search, Plus, Star, Users, ArrowRight } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import { TemplatePreviewModal } from './TemplatePreviewModal'

const templates = [
    { id: 1, name: 'Home Loan Eligibility', category: 'Finance', rating: 4.8, users: '1.2k', tags: ['Pre-qual', 'Income'], color: 'bg-emerald-500' },
    { id: 2, name: 'Property Preference', category: 'Real Estate', rating: 4.5, users: '850', tags: ['BHK', 'Location'], color: 'bg-blue-500' },
    { id: 3, name: 'Post-Visit Feedback', category: 'Feedback', rating: 4.2, users: '2.1k', tags: ['Site Visit', 'NPS'], color: 'bg-amber-500' },
    { id: 4, name: 'NRI Investment', category: 'Finance', rating: 4.9, users: '500', tags: ['High Value', 'Tax'], color: 'bg-purple-500' },
    { id: 5, name: 'General Inquiry', category: 'Support', rating: 4.0, users: '5k', tags: ['Contact'], color: 'bg-slate-500' },
    { id: 6, name: 'Project Launch RSVP', category: 'Marketing', rating: 4.6, users: '300', tags: ['Event'], color: 'bg-pink-500' },
]

export function SurveyTemplatesGallery() {
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Template Gallery</h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-xl">
                        Jumpstart your data collection with battle-tested templates designed for high conversion rates.
                    </p>
                </div>
                <div className="w-full md:w-auto flex gap-2">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 rounded-none"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['All Templates', 'Real Estate', 'Finance', 'Feedback', 'Marketing'].map((cat, i) => (
                    <button
                        key={cat}
                        className={`
                            px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors whitespace-nowrap
                            ${i === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Create Custom Card */}
                <button className="group flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50 hover:bg-white min-h-[280px] transition-all">
                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <Plus className="w-8 h-8 text-slate-900" />
                    </div>
                    <h3 className="font-bold text-slate-900 uppercase tracking-wide">Start from Scratch</h3>
                    <p className="text-xs text-slate-500 mt-1">Build your own custom logic</p>
                </button>

                {templates.map(template => (
                    <Card
                        key={template.id}
                        className="group relative overflow-hidden border-t-0 hover:shadow-xl transition-all duration-300 min-h-[280px] flex flex-col"
                    >
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${template.color}`} />

                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant="outline" className="rounded-none text-[10px] uppercase font-bold bg-slate-50 border-slate-200">
                                    {template.category}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                                    <Star className="w-3 h-3 fill-current" /> {template.rating}
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-purple-600 transition-colors">
                                {template.name}
                            </h3>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {template.tags.map(tag => (
                                    <span key={tag} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 pt-0 mt-auto border-t border-slate-100 bg-slate-50/50 flex justify-between items-center group-hover:bg-white transition-colors">
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase">
                                <Users className="w-3 h-3" /> {template.users} Uses
                            </div>
                            <Button
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 rounded-none bg-slate-900 text-white gap-2"
                                onClick={() => setSelectedTemplate(template.id)}
                            >
                                Preview <ArrowRight className="w-3 h-3" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <TemplatePreviewModal
                isOpen={!!selectedTemplate}
                onClose={() => setSelectedTemplate(null)}
            />
        </div>
    )
}
