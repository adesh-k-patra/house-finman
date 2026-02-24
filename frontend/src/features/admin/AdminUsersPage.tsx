/**
 * Admin Users Page for House FinMan
 */



import { useState } from 'react'
import { Search, Plus, Shield, Edit, Trash2, Clock, Users, UserCheck } from 'lucide-react'
import { Button, KPICard } from '@/components/ui'
import { cn, formatRelativeTime, getInitials } from '@/utils'
import { AddUserModal } from './components/AddUserModal'

// Types
type UserRole = 'admin' | 'manager' | 'agent' | 'support'
type UserStatus = 'active' | 'inactive' | 'pending'

interface SystemUser {
    id: string
    name: string
    email: string
    phone: string
    role: UserRole
    status: UserStatus
    department: string
    lastActive: string
    createdAt: string
}

// Configs
const roleConfig: Record<UserRole, { label: string; color: string; bgColor: string }> = {
    admin: { label: 'Admin', color: 'text-purple-700 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    manager: { label: 'Manager', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    agent: { label: 'Agent', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
    support: { label: 'Support', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
}

const statusConfig: Record<UserStatus, { label: string; color: string }> = {
    active: { label: 'Active', color: 'bg-emerald-500' },
    inactive: { label: 'Inactive', color: 'bg-slate-400' },
    pending: { label: 'Pending', color: 'bg-amber-500' },
}

// Dummy Data
const dummyUsers: SystemUser[] = [
    {
        id: '1',
        name: 'Alex Morgan',
        email: 'alex.m@housefinman.com',
        phone: '+91 98765 43210',
        role: 'admin',
        status: 'active',
        department: 'Executive',
        lastActive: new Date().toISOString(),
        createdAt: '2023-01-15T10:00:00Z'
    },
    {
        id: '2',
        name: 'Sarah Chen',
        email: 'sarah.c@housefinman.com',
        phone: '+91 98765 43211',
        role: 'manager',
        status: 'active',
        department: 'Sales',
        lastActive: new Date(Date.now() - 3600000).toISOString(),
        createdAt: '2023-02-20T14:30:00Z'
    },
    {
        id: '3',
        name: 'Mike Ross',
        email: 'mike.r@housefinman.com',
        phone: '+91 98765 43212',
        role: 'agent',
        status: 'active',
        department: 'Partnerships',
        lastActive: new Date(Date.now() - 86400000).toISOString(),
        createdAt: '2023-03-10T09:15:00Z'
    },
    {
        id: '4',
        name: 'Jessica Pearson',
        email: 'j.pearson@housefinman.com',
        phone: '+91 98765 43213',
        role: 'manager',
        status: 'inactive',
        department: 'Operations',
        lastActive: new Date(Date.now() - 604800000).toISOString(),
        createdAt: '2023-01-05T11:20:00Z'
    },
    {
        id: '5',
        name: 'Rachel Zane',
        email: 'rachel.z@housefinman.com',
        phone: '+91 98765 43214',
        role: 'support',
        status: 'pending',
        department: 'Customer Service',
        lastActive: new Date(Date.now() - 7200000).toISOString(),
        createdAt: '2023-05-12T16:45:00Z'
    },
    {
        id: '6',
        name: 'Amit Patel',
        email: 'amit.p@housefinman.com',
        phone: '+91 98765 43215',
        role: 'agent',
        status: 'active',
        department: 'Sales',
        lastActive: new Date(Date.now() - 1200000).toISOString(),
        createdAt: '2023-06-01T09:00:00Z'
    },
    {
        id: '7',
        name: 'Priya Sharma',
        email: 'priya.s@housefinman.com',
        phone: '+91 98765 43216',
        role: 'manager',
        status: 'active',
        department: 'Finance',
        lastActive: new Date(Date.now() - 4000000).toISOString(),
        createdAt: '2023-04-15T11:30:00Z'
    },
    {
        id: '8',
        name: 'Rohan Gupta',
        email: 'rohan.g@housefinman.com',
        phone: '+91 98765 43217',
        role: 'support',
        status: 'active',
        department: 'IT Support',
        lastActive: new Date(Date.now() - 900000).toISOString(),
        createdAt: '2023-07-20T10:15:00Z'
    },
    {
        id: '9',
        name: 'Sneha Reddy',
        email: 'sneha.r@housefinman.com',
        phone: '+91 98765 43218',
        role: 'agent',
        status: 'pending',
        department: 'Partnerships',
        lastActive: new Date(Date.now() - 86400000 * 2).toISOString(),
        createdAt: '2023-08-05T14:45:00Z'
    },
    {
        id: '10',
        name: 'Vikram Singh',
        email: 'vikram.s@housefinman.com',
        phone: '+91 98765 43219',
        role: 'admin',
        status: 'active',
        department: 'Compliance',
        lastActive: new Date(Date.now() - 300000).toISOString(),
        createdAt: '2023-01-20T08:00:00Z'
    },
    {
        id: '11',
        name: 'Anjali Kumar',
        email: 'anjali.k@housefinman.com',
        phone: '+91 98765 43220',
        role: 'manager',
        status: 'inactive',
        department: 'HR',
        lastActive: new Date(Date.now() - 86400000 * 5).toISOString(),
        createdAt: '2023-03-01T12:00:00Z'
    },
    {
        id: '12',
        name: 'Arjun Mehta',
        email: 'arjun.m@housefinman.com',
        phone: '+91 98765 43221',
        role: 'agent',
        status: 'active',
        department: 'Sales',
        lastActive: new Date(Date.now() - 1800000).toISOString(),
        createdAt: '2023-09-10T15:30:00Z'
    },
    {
        id: '13',
        name: 'Kavita Das',
        email: 'kavita.d@housefinman.com',
        phone: '+91 98765 43222',
        role: 'support',
        status: 'active',
        department: 'Customer Service',
        lastActive: new Date(Date.now() - 60000).toISOString(),
        createdAt: '2023-05-25T13:45:00Z'
    },
    {
        id: '14',
        name: 'Sanjay Verma',
        email: 'sanjay.v@housefinman.com',
        phone: '+91 98765 43223',
        role: 'manager',
        status: 'pending',
        department: 'Operations',
        lastActive: new Date(Date.now() - 86400000 * 3).toISOString(),
        createdAt: '2023-10-01T09:30:00Z'
    },
    {
        id: '15',
        name: 'Neha Nair',
        email: 'neha.n@housefinman.com',
        phone: '+91 98765 43224',
        role: 'agent',
        status: 'active',
        department: 'Partnerships',
        lastActive: new Date(Date.now() - 43200000).toISOString(),
        createdAt: '2023-06-15T11:00:00Z'
    }
]

export default function AdminUsersPage() {
    const [users, setUsers] = useState<SystemUser[]>(dummyUsers)
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null)

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const handleSaveUser = (userData: any) => {
        if (selectedUser) {
            // Update existing
            setUsers(prev => prev.map(u => u.id === userData.id ? { ...u, ...userData } : u))
        } else {
            // Create new
            const newUser: SystemUser = {
                id: (users.length + 1).toString(),
                ...userData,
                lastActive: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                status: 'active' as UserStatus
            }
            setUsers([...users, newUser])
        }
        setIsAddUserOpen(false)
        setSelectedUser(null)
    }

    const openAddModal = () => {
        setSelectedUser(null)
        setIsAddUserOpen(true)
    }

    const openEditModal = (user: SystemUser) => {
        setSelectedUser(user)
        setIsAddUserOpen(true)
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Users</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage access and permissions for team members</p>
                </div>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={openAddModal}>Add User</Button>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Total Users"
                    value={users.length}
                    trend={{ value: 12, direction: 'up' }}
                    variant="blue"
                    icon={<Users className="w-5 h-5" />}
                />
                <KPICard
                    title="Active Users"
                    value={users.filter(u => u.status === 'active').length}
                    trend={{ value: 5, direction: 'up' }}
                    variant="green"
                    icon={<UserCheck className="w-5 h-5" />}
                />
                <KPICard
                    title="Pending Approvals"
                    value={users.filter(u => u.status === 'pending').length}
                    trend={{ value: 2, direction: 'down' }}
                    variant="orange"
                    icon={<Clock className="w-5 h-5" />}
                />
                <KPICard
                    title="Admin Roles"
                    value={users.filter(u => u.role === 'admin').length}
                    variant="purple"
                    icon={<Shield className="w-5 h-5" />}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                        className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                    >
                        <option value="all">All Roles</option>
                        <option value="manager">Manager</option>
                        <option value="agent">Agent</option>
                        <option value="support">Support</option>
                    </select>
                </div>
            </div>

            <div className="border border-slate-200 dark:border-white/10 rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-900 dark:bg-slate-800 text-white backdrop-blur-md sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">User</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Role</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Department</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Status</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600 border-r border-slate-600">Last Active</th>
                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase tracking-widest border-b border-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredUsers.map(user => {
                            const role = roleConfig[user.role]
                            const status = statusConfig[user.status]
                            return (
                                <tr
                                    key={user.id}
                                    className="group relative hover:z-20 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:ring-1 hover:ring-slate-900/5 dark:hover:ring-white/10"
                                    onClick={() => openEditModal(user)}
                                >
                                    <td className="px-4 py-4 border-r border-slate-300 dark:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div className={cn('absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white dark:border-slate-800', status.color)} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{user.name}</p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                        <span className={cn('inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm', role.bgColor, role.color)}>
                                            <Shield className="w-3 h-3" />{role.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm font-medium text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700">{user.department}</td>
                                    <td className="px-4 py-4 text-center border-r border-slate-300 dark:border-slate-700">
                                        <span className={cn("inline-block w-2 h-2 rounded-full mr-2", status.color)}></span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">{status.label}</span>
                                    </td>
                                    <td className="px-4 py-4 text-center text-xs font-medium text-slate-400 border-r border-slate-300 dark:border-slate-700 font-mono tracking-tight">{formatRelativeTime(user.lastActive)}</td>
                                    <td className="px-4 py-4 text-center border-slate-300 dark:border-slate-700">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-sm text-slate-400 hover:text-primary-600 transition-colors"
                                                onClick={(e) => { e.stopPropagation(); openEditModal(user) }}
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-sm text-slate-400 hover:text-red-500 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (confirm('Deactivate this user?')) console.log('Deactivate user', user.id)
                                                }}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <AddUserModal
                isOpen={isAddUserOpen}
                onClose={() => { setIsAddUserOpen(false); setSelectedUser(null); }}
                onSave={handleSaveUser}
                initialData={selectedUser}
            />
        </div>
    )
}

