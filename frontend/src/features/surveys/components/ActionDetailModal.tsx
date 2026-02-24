
import { useState } from 'react'
import {
    Mail, Trello, MessageSquare, List, CheckCircle,
    X, AlertCircle, Clock, User, ArrowRight,
    MoreHorizontal, Paperclip, Send,
    AlignLeft, Edit, Trash2
} from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils'
import { AnimatedLogo } from '@/components/logo/AnimatedLogo'
import { Button } from '@/components/ui'

interface ActionDetailModalProps {
    isOpen: boolean
    onClose: () => void
    actionItem: any // Replace with proper type later
    onViewResponses: () => void
}

export function ActionDetailModal({ isOpen, onClose, actionItem, onViewResponses }: ActionDetailModalProps) {
    if (!isOpen || !actionItem) return null

    // State for comments
    const [comments, setComments] = useState([
        { id: 1, user: 'Sarah Connor', role: 'commented', time: '2h ago', text: "I've managed to reproduce this on the staging environment. It seems related to the cookie SAMESITE policy updates." },
        { id: 2, user: 'John Doe', role: 'commented', time: '1h ago', text: "Can we roll back the recent auth deployment?" },
        { id: 3, user: 'Alex Murphy', role: 'commented', time: '30m ago', text: "Investigating the logs now." }
    ])
    const [newMessage, setNewMessage] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editMessage, setEditMessage] = useState('')

    const handleSendMessage = () => {
        if (!newMessage.trim()) return
        const newComment = {
            id: Date.now(),
            user: 'You',
            role: 'commented',
            time: 'Just now',
            text: newMessage
        }
        setComments([...comments, newComment])
        setNewMessage('')
    }

    const handleDeleteComment = (id: number) => {
        setComments(comments.filter(c => c.id !== id))
    }

    const startEditing = (comment: any) => {
        setEditingId(comment.id)
        setEditMessage(comment.text)
    }

    const saveEdit = () => {
        setComments(comments.map(c => c.id === editingId ? { ...c, text: editMessage } : c))
        setEditingId(null)
        setEditMessage('')
    }

    const handleAction = (action: string) => {
        alert(`${action} action triggered successfully!`)
    }

    // Portal to body 
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={cn(
                "relative flex flex-col md:flex-row w-full bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-scale-in",
                "h-[800px] max-w-[1400px]",
                "!rounded-none"
            )}>

                {/* --- Left Sidebar (Dark Theme) --- */}
                <div className={cn(
                    "hidden md:flex flex-col relative",
                    "bg-[#0F172A] text-white p-8",
                    "w-[350px] shrink-0 border-r border-slate-800"
                )}>
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={cn("w-2 h-2 rounded-full",
                                actionItem.priority === 'High' ? "bg-red-500" :
                                    actionItem.priority === 'Medium' ? "bg-amber-500" : "bg-blue-500"
                            )} />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                {actionItem.priority} Priority
                            </span>
                        </div>
                        <h2 className="text-xl font-bold tracking-wide leading-relaxed">
                            {actionItem.title}
                        </h2>
                        <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Created 2 days ago</span>
                        </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex-1 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Quick Actions</p>

                        <button
                            onClick={() => handleAction("Send Email")}
                            className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border-l-2 border-transparent hover:border-blue-500 transition-all flex items-center gap-3 group"
                        >
                            <Mail className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white">Send Email</span>
                        </button>

                        <button
                            onClick={() => handleAction("Add to Jira")}
                            className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border-l-2 border-transparent hover:border-blue-500 transition-all flex items-center gap-3 group"
                        >
                            <Trello className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white">Add to Jira</span>
                        </button>

                        <button
                            onClick={() => handleAction("Start Chat")}
                            className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border-l-2 border-transparent hover:border-blue-500 transition-all flex items-center gap-3 group"
                        >
                            <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white">Start Chat</span>
                        </button>

                        <button
                            onClick={() => {
                                onViewResponses()
                                onClose()
                            }}
                            className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border-l-2 border-transparent hover:border-blue-500 transition-all flex items-center gap-3 group"
                        >
                            <List className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white">View Related Responses</span>
                            <div className="ml-auto bg-slate-900 text-[10px] px-1.5 py-0.5 rounded text-slate-400">12</div>
                        </button>
                    </div>

                    {/* Assignee */}
                    <div className="mt-auto pt-6 border-t border-slate-800/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Assignee</p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                                {actionItem.assignee.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">{actionItem.assignee}</div>
                                <div className="text-[10px] text-slate-400">Product Manager</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Right Content (Light Theme) --- */}
                <div className="flex-1 flex flex-col bg-white dark:bg-[#0B1121] relative">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white z-10 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-none text-xs font-bold uppercase tracking-wider">
                                <AlignLeft className="w-3.5 h-3.5" />
                                {actionItem.status}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                        <div className="max-w-3xl">
                            <section className="mb-8">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4" /> Description
                                </h3>
                                <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed">
                                    <p>
                                        Based on the recent survey responses, specifically highlighting issues with the login flow on mobile devices, we need to investigate the authentication timeout parameters. Several users reported "Session Expired" errors immediately after logging in via iOS Safari.
                                    </p>
                                    <ul className="list-disc pl-4 mt-2 space-y-1">
                                        <li>Investigate token refresh logic</li>
                                        <li>Test on iOS 17.2 Safari</li>
                                        <li>Verify error logs in backend</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <List className="w-4 h-4" /> Activity Stream
                                </h3>

                                <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-0 before:w-px before:bg-slate-200">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="relative pl-10 group/comment">
                                            <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-300" />
                                            <div className="flex items-baseline justify-between mb-1">
                                                <span className="text-sm font-bold text-slate-900">{comment.user} <span className="text-slate-500 font-normal">commented</span></span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-slate-400">{comment.time}</span>
                                                    {/* Actions */}
                                                    <div className="hidden group-hover/comment:flex items-center gap-1">
                                                        <button
                                                            onClick={() => startEditing(comment)}
                                                            className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-sm hover:bg-slate-100" title="Edit"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="p-1.5 text-red-400 hover:text-red-600 transition-colors rounded-sm hover:bg-red-50" title="Delete"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {editingId === comment.id ? (
                                                <div className="flex flex-col gap-2">
                                                    <textarea
                                                        value={editMessage}
                                                        onChange={(e) => setEditMessage(e.target.value)}
                                                        className="w-full p-2 text-sm border border-blue-300 focus:ring-0 rounded-none bg-blue-50/50"
                                                        rows={2}
                                                    />
                                                    <div className="flex gap-2 justify-end">
                                                        <button onClick={() => setEditingId(null)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                                                        <button onClick={saveEdit} className="text-xs font-bold text-blue-600 hover:text-blue-700">Save</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-slate-50 border border-slate-100 text-sm text-slate-600 rounded-none shadow-sm">
                                                    {comment.text}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer Comment Box */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white">
                                ME
                            </div>
                            <div className="flex-1 relative group">
                                <div className="absolute inset-0 bg-white rounded-none shadow-sm border border-slate-200 transition-all group-focus-within:border-blue-400 group-focus-within:shadow-md pointer-events-none" />
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSendMessage()
                                        }
                                    }}
                                    className="relative w-full h-24 p-4 bg-transparent border-none outline-none resize-none text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0 z-10"
                                    placeholder="Write a comment..."
                                />
                                <div className="absolute bottom-3 right-3 flex gap-2 z-20">
                                    <button className="p-2 hover:bg-slate-100 text-slate-400 transition-colors rounded-sm" title="Attach file">
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSendMessage();
                                        }}
                                        disabled={!newMessage.trim()}
                                        className={cn(
                                            "px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 rounded-sm",
                                            !newMessage.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 hover:shadow-lg"
                                        )}
                                    >
                                        <span>Send</span>
                                        <Send className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
