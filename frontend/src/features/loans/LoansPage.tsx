import { useState, useMemo } from 'react';
import { Filter, Download, Briefcase, Clock, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KPICard } from '@/components/ui/KPICard';
import { LoansTable } from './components/LoansTable';
import { Loan } from './types';
import { mockLoans } from './dummyData';
import { formatCurrency } from '@/utils';

export function LoansPage() {
    // ... (rest of the state/hooks)
    const [activeTab, setActiveTab] = useState<string>('all');
    const [loans] = useState<Loan[]>(mockLoans);

    const tabs = [
        { id: 'all', label: 'All Loans', color: 'blue' },
        { id: 'completed', label: 'Completed', color: 'emerald' },
        { id: 'approved', label: 'Approved', color: 'green' },
        { id: 'pending', label: 'Pending', color: 'amber' },
        { id: 'under-review', label: 'Under Review', color: 'purple' },
        { id: 'rejected', label: 'Rejected', color: 'red' },
        { id: 'ongoing', label: 'Ongoing', color: 'indigo' },
    ];

    const filteredLoans = useMemo(() => activeTab === 'all'
        ? loans
        : loans.filter(loan => loan.status === activeTab), [activeTab, loans]);

    const stats = useMemo(() => {
        const total = loans.length;
        const pending = loans.filter(l => l.status === 'pending').length;
        const approvedVal = loans
            .filter(l => ['approved', 'completed', 'ongoing'].includes(l.status))
            .reduce((sum, l) => sum + l.financials.principalAmount, 0);
        const review = loans.filter(l => l.status === 'under-review').length;
        return { total, pending, approvedVal, review };
    }, [loans]);

    const getTabColor = (color: string, isActive: boolean) => {
        if (!isActive) return 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300';
        switch (color) {
            case 'emerald': return 'border-emerald-500 text-emerald-600 dark:text-emerald-400';
            case 'green': return 'border-green-500 text-green-600 dark:text-green-400';
            case 'amber': return 'border-amber-500 text-amber-600 dark:text-amber-400';
            case 'purple': return 'border-purple-500 text-purple-600 dark:text-purple-400';
            case 'red': return 'border-red-500 text-red-600 dark:text-red-400';
            case 'indigo': return 'border-indigo-500 text-indigo-600 dark:text-indigo-400';
            default: return 'border-blue-500 text-blue-600 dark:text-blue-400';
        }
    };

    const getBadgeColor = (color: string, isActive: boolean) => {
        if (!isActive) return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
        switch (color) {
            case 'emerald': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'green': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
            case 'amber': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
            case 'purple': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
            case 'red': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            case 'indigo': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
            default: return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Loans Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage loan applications, approvals, and portfolio health.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard
                    title="Total Portfolio"
                    value={stats.total}
                    trend={{ value: 12, direction: 'up' }}
                    icon={<Briefcase />}
                    variant="blue"
                />
                <KPICard
                    title="Pending Actions"
                    value={stats.pending}
                    subtitle="Applications"
                    icon={<Clock />}
                    variant="orange"
                />
                <KPICard
                    title="Disbursed Volume"
                    value={formatCurrency(stats.approvedVal, true)}
                    icon={<CheckCircle />}
                    variant="emerald"
                />
                <KPICard
                    title="Under Review"
                    value={stats.review}
                    icon={<Search />}
                    variant="purple"
                />
            </div>

            {/* Main Content Area */}
            <div className="space-y-4">
                {/* Tab Bar & Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center border-b border-slate-200 dark:border-slate-700 pb-1 gap-4">
                    <nav className="flex space-x-1 overflow-x-auto no-scrollbar w-full sm:w-auto" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                     whitespace-nowrap py-3 px-5 border-b-2 font-medium text-sm transition-all
                     ${getTabColor(tab.color, activeTab === tab.id)}
                  `}
                            >
                                {tab.label}
                                <span className={`ml-2 py-0.5 px-2 rounded-full text-[10px] ${getBadgeColor(tab.color, activeTab === tab.id)}`}>
                                    {tab.id === 'all'
                                        ? loans.length
                                        : loans.filter(l => l.status === tab.id).length
                                    }
                                </span>
                            </button>
                        ))}
                    </nav>
                    <div className="flex items-center gap-2 pb-2">
                        <Button variant="ghost" size="sm" className="text-slate-500">
                            <Filter className="w-4 h-4 mr-2" /> Filter
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <Card className="p-0 overflow-hidden border-0 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900">
                    <LoansTable
                        loans={filteredLoans}
                    />
                </Card>
            </div>
        </div>
    );
}
