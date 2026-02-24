/**
 * Ticket Detail Page for House FinMan
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Phone,
    Mail,
    User,
    Clock,
    Send,
    Paperclip,
    CheckCircle2,
    Tag,
} from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { cn, formatRelativeTime, getInitials } from '@/utils'

const dummyTicket = {
    id: 'TKT-2026-001',
    subject: 'Incorrect EMI amount deducted',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 9876543210',
    customerEmail: 'rahul.sharma@email.com',
    category: 'payment_issue',
    priority: 'critical',
    status: 'open',
    assignedTo: 'Priya Patel',
    createdAt: '2026-01-05T08:30:00',
    updatedAt: '2026-01-05T10:45:00',
    slaBreached: false,
    slaDueAt: '2026-01-05T12:30:00',
    description: 'My January EMI was deducted incorrectly. The scheduled EMI is ₹32,500 but ₹35,200 was debited from my account. Please look into this urgently.',
}

const conversation = [
    { id: 1, type: 'customer', sender: 'Rahul Sharma', message: 'My January EMI was deducted incorrectly. The scheduled EMI is ₹32,500 but ₹35,200 was debited from my account. Please look into this urgently.', timestamp: '2026-01-05T08:30:00' },
    { id: 2, type: 'agent', sender: 'Priya Patel', message: 'Hello Rahul, thank you for reaching out. I apologize for the inconvenience. Let me check your account details and the recent transaction. Could you please confirm your loan account number?', timestamp: '2026-01-05T09:15:00' },
    { id: 3, type: 'customer', sender: 'Rahul Sharma', message: 'My loan account number is HL2025-0019876. The extra amount of ₹2,700 was debited.', timestamp: '2026-01-05T09:45:00' },
    { id: 4, type: 'agent', sender: 'Priya Patel', message: 'Thank you for the information. I have checked your account. The additional ₹2,700 was the insurance premium renewal that was due. This was mentioned in your loan agreement. However, I understand this was unexpected. Would you like me to set up a call with our finance team to explain the breakdown?', timestamp: '2026-01-05T10:45:00' },
]

const priorityConfig = {
    critical: { label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
    high: { label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
    medium: { label: 'Medium', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    low: { label: 'Low', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-700/30' },
}

const statusConfig = {
    open: { label: 'Open', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
    in_progress: { label: 'In Progress', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
    pending_customer: { label: 'Pending Customer', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
    resolved: { label: 'Resolved', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
    closed: { label: 'Closed', color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-700/30' },
}

export default function TicketDetailPage() {
    // const { id } = useParams()
    const navigate = useNavigate()
    const [newMessage, setNewMessage] = useState('')
    const ticket = dummyTicket
    const priority = priorityConfig[ticket.priority as keyof typeof priorityConfig]
    const status = statusConfig[ticket.status as keyof typeof statusConfig]

    return (
        <div className="w-full space-y-6 animate-fade-in">
            <button onClick={() => navigate('/support/tickets')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Tickets
            </button>

            <div className="grid grid-cols-3 gap-6">
                {/* Main Conversation */}
                <div className="col-span-2 space-y-4">
                    <Card>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-primary-600">{ticket.id}</span>
                                    {ticket.slaBreached && <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-sm">SLA Breached</span>}
                                </div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{ticket.subject}</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn('px-3 py-1 text-sm font-medium rounded-sm', priority.bgColor, priority.color)}>{priority.label}</span>
                                <span className={cn('px-3 py-1 text-sm font-medium rounded-sm', status.bgColor, status.color)}>{status.label}</span>
                            </div>
                        </div>

                        {/* Conversation Thread */}
                        <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
                            {conversation.map((msg, index) => (
                                <div key={msg.id} className={cn('flex gap-3 animate-slide-in', msg.type === 'agent' && 'flex-row-reverse')} style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className={cn('w-10 h-10 rounded-sm flex items-center justify-center text-white text-sm font-medium flex-shrink-0', msg.type === 'customer' ? 'bg-gradient-to-br from-slate-500 to-slate-600' : 'bg-gradient-to-br from-primary-500 to-primary-600')}>
                                        {getInitials(msg.sender)}
                                    </div>
                                    <div className={cn('flex-1 max-w-[70%]', msg.type === 'agent' && 'flex flex-col items-end')}>
                                        <div className={cn('p-4 rounded-sm', msg.type === 'customer' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary-50 dark:bg-primary-900/30')}>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{msg.message}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500">{msg.sender}</span>
                                            <span className="text-xs text-slate-400">{formatRelativeTime(msg.timestamp)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Box */}
                        <div className="border-t border-slate-200 dark:border-white/10 pt-4">
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <textarea
                                        placeholder="Type your reply..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="input min-h-[80px] pr-12 resize-none"
                                    />
                                    <button className="absolute right-3 bottom-3 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm">
                                        <Paperclip className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                <Button variant="primary" className="h-[80px]" leftIcon={<Send className="w-4 h-4" />}>Send</Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <Card title="Customer Details">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-medium">
                                    {getInitials(ticket.customerName)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{ticket.customerName}</p>
                                    <p className="text-xs text-slate-500">{ticket.customerPhone}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="secondary" leftIcon={<Phone className="w-4 h-4" />} className="flex-1">Call</Button>
                                <Button size="sm" variant="secondary" leftIcon={<Mail className="w-4 h-4" />} className="flex-1">Email</Button>
                            </div>
                        </div>
                    </Card>

                    <Card title="Ticket Details">
                        <div className="space-y-3">
                            <div className="flex justify-between"><span className="text-sm text-slate-500">Category</span><span className="text-sm font-medium text-slate-900 dark:text-white">Payment Issue</span></div>
                            <div className="flex justify-between"><span className="text-sm text-slate-500">Assigned To</span><span className="text-sm font-medium text-slate-900 dark:text-white">{ticket.assignedTo}</span></div>
                            <div className="flex justify-between"><span className="text-sm text-slate-500">Created</span><span className="text-sm font-medium text-slate-900 dark:text-white">{formatRelativeTime(ticket.createdAt)}</span></div>
                            <div className="flex justify-between"><span className="text-sm text-slate-500">SLA Due</span><span className="text-sm font-medium text-amber-600">{new Date(ticket.slaDueAt).toLocaleTimeString()}</span></div>
                        </div>
                    </Card>

                    <Card title="Quick Actions">
                        <div className="space-y-2">
                            <Button variant="secondary" className="w-full justify-start" leftIcon={<CheckCircle2 className="w-4 h-4" />}>Mark as Resolved</Button>
                            <Button variant="secondary" className="w-full justify-start" leftIcon={<Clock className="w-4 h-4" />}>Escalate</Button>
                            <Button variant="secondary" className="w-full justify-start" leftIcon={<User className="w-4 h-4" />}>Reassign</Button>
                            <Button variant="secondary" className="w-full justify-start" leftIcon={<Tag className="w-4 h-4" />}>Add Tags</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
