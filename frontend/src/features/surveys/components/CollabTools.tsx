import { useState } from 'react'
import { MoreHorizontal, MessageCircle, X, Send, User, Edit3, Trash, Copy, Eye } from 'lucide-react'
import { Button } from '@/components/ui'

// B.69 Live Edit Indicators
export function LiveEditIndicators({ users }: { users: { id: string, name: string, color: string }[] }) {
    if (!users?.length) return null

    return (
        <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Editing:</span>
            <div className="flex -space-x-2">
                {users.map(user => (
                    <div
                        key={user.id}
                        className={`w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white font-bold ${user.color}`}
                        title={`${user.name} is editing`}
                    >
                        {user.name[0]}
                    </div>
                ))}
            </div>
        </div>
    )
}

// B.66 Quick Action Menu
export function QuickActionMenu() {
    return (
        <div className="group relative">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-none hover:bg-slate-100">
                <MoreHorizontal className="w-4 h-4 text-slate-500" />
            </Button>

            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 hidden group-hover:block z-20 animate-in fade-in slide-in-from-top-1">
                <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-slate-400" /> Preview
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Edit3 className="w-3.5 h-3.5 text-slate-400" /> Rename
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Copy className="w-3.5 h-3.5 text-slate-400" /> Duplicate
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                        <Trash className="w-3.5 h-3.5" /> Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

// B.75 Help Chatbot
export function HelpChatbot() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {isOpen && (
                <div className="w-[320px] h-[450px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-bottom-5">
                    <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                        <h4 className="font-bold flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            HouseFin Assistant
                        </h4>
                        <button onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></button>
                    </div>

                    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 overflow-y-auto">
                        <div className="flex gap-2">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="bg-white p-3 shadow-sm border border-slate-100 rounded-tr-lg rounded-br-lg rounded-bl-lg text-sm text-slate-700">
                                Hi! How can I help you build your survey today?
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 text-sm outline-none bg-transparent"
                            placeholder="Type your question..."
                        />
                        <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 rounded-full"
            >
                <MessageCircle className="w-6 h-6" />
            </button>
        </div>
    )
}
