/**
 * Loan Risk Dashboard Tab
 * Displays 10+ KPI charts for loan risk analysis
 */

import { Loan } from '../types';
import { Card, KPICard, CustomChartTooltip } from '@/components/ui';
import { ChartDefs } from '@/components/ui/ChartDefs';
import { cn } from '@/utils';
import {
    Activity, AlertTriangle, TrendingUp, TrendingDown, Target, Shield,
    BarChart3, Gauge, AlertCircle, CheckCircle2, ShieldCheck, User, MapPin
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface LoanRiskDashboardTabProps {
    loan: Loan;
}

// Mock data for charts
const creditScoreHistory = [
    { month: 'Jan', score: 750 },
    { month: 'Feb', score: 752 },
    { month: 'Mar', score: 755 },
    { month: 'Apr', score: 760 },
    { month: 'May', score: 765 },
    { month: 'Jun', score: 770 },
    { month: 'Jul', score: 775 },
    { month: 'Aug', score: 778 },
    { month: 'Sep', score: 780 },
    { month: 'Oct', score: 782 },
    { month: 'Nov', score: 780 },
    { month: 'Dec', score: 785 },
];

const paymentBehavior = [
    { month: 'Jan', onTime: 1, late: 0, missed: 0 },
    { month: 'Feb', onTime: 1, late: 0, missed: 0 },
    { month: 'Mar', onTime: 1, late: 0, missed: 0 },
    { month: 'Apr', onTime: 0, late: 1, missed: 0 },
    { month: 'May', onTime: 1, late: 0, missed: 0 },
    { month: 'Jun', onTime: 1, late: 0, missed: 0 },
    { month: 'Jul', onTime: 1, late: 0, missed: 0 },
    { month: 'Aug', onTime: 1, late: 0, missed: 0 },
    { month: 'Sep', onTime: 1, late: 0, missed: 0 },
    { month: 'Oct', onTime: 1, late: 0, missed: 0 },
    { month: 'Nov', onTime: 1, late: 0, missed: 0 },
    { month: 'Dec', onTime: 1, late: 0, missed: 0 },
];

const riskFactorData = [
    { factor: 'Credit Score', score: 92 },
    { factor: 'Income Stability', score: 88 },
    { factor: 'Debt Ratio', score: 85 },
    { factor: 'Payment History', score: 95 },
    { factor: 'Employment', score: 90 },
    { factor: 'Collateral', score: 82 },
];

const ltvHistory = [
    { month: 'Feb-24', ltv: 75 },
    { month: 'Apr-24', ltv: 74 },
    { month: 'Jun-24', ltv: 73 },
    { month: 'Aug-24', ltv: 72 },
    { month: 'Oct-24', ltv: 71 },
    { month: 'Dec-24', ltv: 70 },
];

const collectionBucketData = [
    { name: 'Current', value: 85, color: '#10B981' },
    { name: '1-30 DPD', value: 8, color: '#F59E0B' },
    { name: '31-60 DPD', value: 4, color: '#F97316' },
    { name: '61-90 DPD', value: 2, color: '#EF4444' },
    { name: '90+ DPD', value: 1, color: '#7F1D1D' },
];

const npaProjection = [
    { quarter: 'Q1', probability: 2 },
    { quarter: 'Q2', probability: 3 },
    { quarter: 'Q3', probability: 4 },
    { quarter: 'Q4', probability: 5 },
];

const riskTrendData = [
    { month: 'Jul', riskScore: 88 },
    { month: 'Aug', riskScore: 89 },
    { month: 'Sep', riskScore: 90 },
    { month: 'Oct', riskScore: 91 },
    { month: 'Nov', riskScore: 93 },
    { month: 'Dec', riskScore: 92 },
    { month: 'Jan', riskScore: 95 },
];

const incomeVsEmi = [
    { month: 'Jan', income: 350000, emi: 130186 },
    { month: 'Feb', income: 350000, emi: 130186 },
    { month: 'Mar', income: 375000, emi: 130186 },
    { month: 'Apr', income: 350000, emi: 130186 },
    { month: 'May', income: 380000, emi: 130186 },
    { month: 'Jun', income: 350000, emi: 130186 },
];

const bureauPullData = [
    { date: 'Jan 24', bureau: 'CIBIL', score: 780 },
    { date: 'Jul 24', bureau: 'CIBIL', score: 782 },
    { date: 'Jan 25', bureau: 'CIBIL', score: 785 },
];

export function LoanRiskDashboardTab({ loan }: LoanRiskDashboardTabProps) {
    const commonChartProps = {
        margin: { top: 10, right: 10, left: 0, bottom: 0 }
    };

    // Risk color based on score
    const getRiskColor = (score: number): any => {
        if (score >= 90) return 'emerald';
        if (score >= 70) return 'amber';
        return 'rose';
    };

    const riskScore = loan.riskAssessment?.overallRiskScore || loan.borrower.riskScore || 95;
    const riskGrade = loan.riskAssessment?.riskGrade || 'Low';

    return (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-5 gap-4">
                <KPICard
                    title="Risk Score"
                    value={riskScore.toString()}
                    variant={getRiskColor(riskScore)}
                    icon={Gauge}
                    trend={{ value: 3, direction: 'up', label: 'trend' }}
                />
                <KPICard
                    title="Credit Score"
                    value={loan.borrower.creditScore?.toString() || '780'}
                    variant="indigo"
                    icon={Activity}
                    trend={{ value: 5, direction: 'up', label: 'points' }}
                />
                <KPICard
                    title="DSCR"
                    value={loan.riskAssessment?.dscr?.toFixed(1) || '3.2'}
                    variant="violet"
                    icon={Target}
                    trend={{ value: 0.2, direction: 'up', label: '' }}
                />
                <KPICard
                    title="LTV Ratio"
                    value={`${loan.collateral?.ltvRatio || 70}%`}
                    variant="teal"
                    icon={BarChart3}
                    trend={{ value: 3, direction: 'down', label: 'reduced' }}
                />
                <KPICard
                    title="NPA Risk"
                    value={loan.riskAssessment?.npaRisk || 'Low'}
                    variant="lime"
                    icon={Shield}
                    compact
                />
            </div>

            {/* Risk Grade Banner */}
            <div className={cn(
                'px-6 py-4 flex items-center justify-between border',
                riskGrade === 'Low' && 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
                riskGrade === 'Medium' && 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
                riskGrade === 'High' && 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            )}>
                <div className="flex items-center gap-4">
                    {riskGrade === 'Low' && <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
                    {riskGrade === 'Medium' && <AlertCircle className="w-8 h-8 text-amber-600" />}
                    {riskGrade === 'High' && <AlertTriangle className="w-8 h-8 text-red-600" />}
                    <div>
                        <h3 className={cn(
                            'text-lg font-bold',
                            riskGrade === 'Low' && 'text-emerald-700 dark:text-emerald-400',
                            riskGrade === 'Medium' && 'text-amber-700 dark:text-amber-400',
                            riskGrade === 'High' && 'text-red-700 dark:text-red-400'
                        )}>
                            Risk Grade: {riskGrade}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {riskGrade === 'Low' && 'Excellent risk profile. All parameters within acceptable limits.'}
                            {riskGrade === 'Medium' && 'Moderate risk. Some parameters require monitoring.'}
                            {riskGrade === 'High' && 'High risk. Immediate attention required.'}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Last Assessed</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Chart Grid */}
            <div className="grid grid-cols-3 gap-6">
                {/* 1. Credit Score Trend */}
                <Card
                    title="Credit Score Trend"
                    subtitle="12-month history"
                    headerClassName="bg-black/90 backdrop-blur-sm border-b-white/10 text-white"
                    titleClassName="text-white"
                    subtitleClassName="text-slate-400"
                >
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={creditScoreHistory} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis domain={[700, 800]} stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Area type="linear" dataKey="score" stroke="#3B82F6" strokeWidth={1.5} fill="url(#glass-blue)" filter="url(#shadow)" name="CIBIL Score" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 2. Risk Score Trend */}
                <Card
                    title="Internal Risk Score"
                    subtitle="6-month trend"
                    headerClassName="bg-black/90 backdrop-blur-sm border-b-white/10 text-white"
                    titleClassName="text-white"
                    subtitleClassName="text-slate-400"
                >
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={riskTrendData} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis domain={[80, 100]} stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Line type="linear" dataKey="riskScore" stroke="#10B981" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} filter="url(#shadow)" name="Risk Score" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 3. Risk Factors Radar */}
                <Card
                    title="Risk Factor Analysis"
                    subtitle="Multi-dimensional assessment"
                    headerClassName="bg-black/90 backdrop-blur-sm border-b-white/10 text-white"
                    titleClassName="text-white"
                    subtitleClassName="text-slate-400"
                >
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskFactorData}>
                                <ChartDefs />
                                <PolarGrid stroke="#374151" opacity={0.2} />
                                <PolarAngleAxis dataKey="factor" tick={{ fill: '#6B7280', fontSize: 9 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Score" dataKey="score" stroke="#8B5CF6" strokeWidth={1.5} fill="url(#glass-purple)" filter="url(#shadow)" />
                                <Tooltip content={<CustomChartTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 4. Payment Behavior */}
                <Card
                    title="Payment Behavior"
                    subtitle="12-month payment pattern"
                    headerClassName="bg-black/90 backdrop-blur-sm border-b-white/10 text-white"
                    titleClassName="text-white"
                    subtitleClassName="text-slate-400"
                >
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={paymentBehavior} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar dataKey="onTime" stackId="a" fill="#10B981" name="On Time" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="late" stackId="a" fill="#F59E0B" name="Late" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="missed" stackId="a" fill="#EF4444" name="Missed" radius={[0, 0, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 5. LTV Trend */}
                <Card
                    title="LTV Ratio Trend"
                    subtitle="Loan-to-Value progression"
                    headerClassName="bg-black/90 backdrop-blur-sm border-b-white/10 text-white"
                    titleClassName="text-white"
                    subtitleClassName="text-slate-400"
                >
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ltvHistory} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis domain={[60, 80]} stroke="#6B7280" fontSize={10} unit="%" tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Area type="linear" dataKey="ltv" stroke="#14B8A6" strokeWidth={1.5} fill="url(#glass-teal)" filter="url(#shadow)" name="LTV %" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 6. Collection Bucket Distribution */}
                <Card
                    title="Collection Bucket"
                    subtitle="Portfolio distribution"
                    headerClassName="bg-black/90 backdrop-blur-sm border-b-white/10 text-white"
                    titleClassName="text-white"
                    subtitleClassName="text-slate-400"
                >
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={collectionBucketData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                                    {collectionBucketData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 7. NPA Projection */}
                <Card
                    title="NPA Probability"
                    subtitle="4-quarter projection"
                    headerClassName="bg-black/90 backdrop-blur-sm border-b-white/10 text-white"
                    titleClassName="text-white"
                    subtitleClassName="text-slate-400"
                >
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={npaProjection} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="quarter" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6B7280" fontSize={10} unit="%" tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Bar dataKey="probability" fill="url(#glass-orange)" stroke="#F59E0B" strokeWidth={1} radius={[0, 0, 0, 0]} name="NPA %" filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* 8. Income vs EMI */}
                <Card
                    title="Income vs EMI"
                    subtitle="FOIR analysis"
                    className="col-span-2"
                    headerClassName="bg-black/90 backdrop-blur-sm border-b-white/10 text-white"
                    titleClassName="text-white"
                    subtitleClassName="text-slate-400"
                >
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={incomeVsEmi} {...commonChartProps}>
                                <ChartDefs />
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} vertical={false} />
                                <XAxis dataKey="month" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6B7280" fontSize={10} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomChartTooltip currency />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar dataKey="income" fill="url(#glass-blue)" stroke="#3B82F6" strokeWidth={1} name="Monthly Income" filter="url(#shadow)" />
                                <Bar dataKey="emi" fill="url(#glass-purple)" stroke="#8B5CF6" strokeWidth={1} name="EMI" filter="url(#shadow)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Risk Indicators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard
                    title="AML Status"
                    value="PASS"
                    variant="emerald"
                    icon={ShieldCheck}
                    subtitle="Sanctions/watchlists clear"
                    compact
                />
                <KPICard
                    title="Fraud Check"
                    value="CLEAR"
                    variant="indigo"
                    icon={Shield}
                    subtitle="Fingerprint verified"
                    compact
                />
                <KPICard
                    title="PEP Status"
                    value="NOT PEP"
                    variant="slate"
                    icon={User}
                    subtitle="Not politically exposed"
                    compact
                />
                <KPICard
                    title="Location Risk"
                    value="TIER 1"
                    variant="cyan"
                    icon={MapPin}
                    subtitle="High recovery metro"
                    compact
                />
            </div>

            {/* Bureau Pull History */}
            <Card
                title="Bureau Pull History"
                subtitle="Credit bureau check records"
                headerClassName="bg-black/90 backdrop-blur-sm border-b-white/10 text-white"
                titleClassName="text-white"
                subtitleClassName="text-slate-400"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 text-[10px] uppercase tracking-widest text-slate-500">
                                <th className="px-6 py-3 font-bold">Date</th>
                                <th className="px-6 py-3 font-bold">Bureau</th>
                                <th className="px-6 py-3 font-bold">Score</th>
                                <th className="px-6 py-3 font-bold">Change</th>
                                <th className="px-6 py-3 font-bold">Pulled By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {bureauPullData.map((pull, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">{pull.date}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{pull.bureau}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{pull.score}</td>
                                    <td className="px-6 py-4">
                                        {i > 0 ? (
                                            <span className={cn(
                                                "flex items-center gap-1 text-xs font-bold",
                                                pull.score > bureauPullData[i - 1].score ? "text-emerald-600" : "text-red-600"
                                            )}>
                                                {pull.score > bureauPullData[i - 1].score ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                {Math.abs(pull.score - bureauPullData[i - 1].score)} pts
                                            </span>
                                        ) : <span className="text-xs text-slate-400">—</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">System</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
