import { Users, AlertCircle, CheckCircle, Clock, ChevronRight, Phone, MessageSquare } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { cn } from '@/utils'

export function AgentDashboardCard() {
    const tasks = [
        { id: 1, type: 'call', lead: 'Rajesh Kumar', status: 'pending', time: '10:00 AM', priority: 'high' },
        { id: 2, type: 'email', lead: 'Sneha Gupta', status: 'pending', time: '11:30 AM', priority: 'medium' },
        { id: 3, type: 'meeting', lead: 'Amit Shah', status: 'completed', time: '09:00 AM', priority: 'high' },
    ]

    const stats = {
        assigned: 45,
        contacted: 28,
        pending: 17,
        conversion: 12
    }

    return (
        <Card className="h-full border-l-4 border-l-purple-500 rounded-none shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        My Assigned Leads
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Daily Activity Tracker</p>
                </div>
                <Badge variant="high-intent" className="rounded-none">Live</Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                <div className="bg-white dark:bg-slate-900 p-3 text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold">Assigned</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.assigned}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold text-orange-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                </div>
            </div>

            {/* Tasks List */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Upcoming Tasks</h4>
                    <span className="text-xs text-purple-600 font-medium cursor-pointer hover:underline">View All</span>
                </div>
                <div className="space-y-3">
                    {tasks.map(task => (
                        <div key={task.id} className="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-none",
                                    task.type === 'call' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30" :
                                        task.type === 'email' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30" :
                                            "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                                )}>
                                    {task.type === 'call' && <Phone className="w-4 h-4" />}
                                    {task.type === 'email' && <MessageSquare className="w-4 h-4" />}
                                    {task.type === 'meeting' && <Users className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">{task.lead}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Clock className="w-3 h-3" /> {task.time}
                                        {task.priority === 'high' && <span className="text-red-500 font-bold">• High Priority</span>}
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-none">
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <Button className="w-full justify-between rounded-none bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800">
                    <span>Start Calling Session</span>
                    <Phone className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    )
}
