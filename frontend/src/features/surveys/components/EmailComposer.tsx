import { useState, useEffect } from 'react'
import { X, Send, Paperclip } from 'lucide-react'

interface EmailComposerProps {
    isOpen: boolean
    onClose: () => void
    recipientCount: number
    recipientName?: string // Optional, if single recipient
}

const TEMPLATES = [
    { id: 't1', name: 'Welcome Email', subject: 'Welcome to our community!', body: 'Hi {{name}},\n\nThanks for joining us. We are excited to have you on board.' },
    { id: 't2', name: 'Survey Invitation', subject: 'We value your feedback', body: 'Hi {{name}},\n\nPlease take a moment to fill out this survey.' },
    { id: 't3', name: 'Follow-up', subject: 'Checking in', body: 'Hi {{name}},\n\nJust wanted to follow up on our last conversation.' },
]

export function EmailComposer({ isOpen, onClose, recipientCount, recipientName }: EmailComposerProps) {
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState('')

    useEffect(() => {
        if (selectedTemplate) {
            const template = TEMPLATES.find(t => t.id === selectedTemplate)
            if (template) {
                setSubject(template.subject)
                setBody(template.body.replace('{{name}}', recipientName || 'there'))
            }
        }
    }, [selectedTemplate, recipientName])

    if (!isOpen) return null

    const handleSend = () => {
        // Logic to send email
        onClose()
        setSubject('')
        setBody('')
        setSelectedTemplate('')
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">New Message</h3>
                        <p className="text-xs text-slate-500">
                            To: <span className="font-bold text-slate-700 dark:text-slate-300">{recipientName ? recipientName : `${recipientCount} Recipients`}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto space-y-4">
                    <div className="flex gap-4 items-center">
                        <select
                            className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-600"
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                        >
                            <option value="">Load Template...</option>
                            {TEMPLATES.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <input
                        className="w-full text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2 focus:outline-none focus:border-blue-500 bg-transparent placeholder:text-slate-400"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />

                    <textarea
                        className="w-full h-64 resize-none text-sm text-slate-700 dark:text-slate-300 focus:outline-none bg-transparent placeholder:text-slate-400"
                        placeholder="Write your message here..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <button className="text-slate-500 hover:text-slate-700">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Discard</button>
                        <button onClick={handleSend} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
                            <Send className="w-4 h-4" /> Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
