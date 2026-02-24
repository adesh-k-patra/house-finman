
import { useSurvey } from '../builder/contexts/SurveyPageContext'
import { Users, TrendingUp, BarChart2, Activity, Target } from 'lucide-react'

export function ApplicantsAnalytics() {
    const { applicants } = useSurvey()

    const stats = {
        total: applicants.length,
        new: applicants.filter(a => a.status === 'new').length,
        contacted: applicants.filter(a => a.status === 'contacted').length,
        qualified: applicants.filter(a => a.status === 'qualified').length,
        rejected: applicants.filter(a => a.status === 'rejected').length,
    }

    const conversionRate = Math.round((stats.qualified / stats.total) * 100) || 0

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 font-sans">
            {/* 1. Total Applicants - Sharp Blue */}
            <div className="bg-blue-600 text-white p-0 shadow-lg shadow-blue-900/10 group hover:shadow-xl hover:shadow-blue-900/20 transition-all rounded-none relative overflow-hidden flex flex-col h-32">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <Users className="w-32 h-32" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Total Applicants</p>
                        <div className="px-1.5 py-0.5 bg-blue-500 rounded-none text-[9px] font-bold flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> +12%
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black tracking-tighter">{stats.total}</h3>
                        <span className="text-xs font-bold text-blue-200">Leads</span>
                    </div>
                </div>
                {/* Micro Chart */}
                <div className="h-1 flex gap-px opacity-30 mt-auto">
                    {[40, 60, 30, 80, 50, 90, 70, 40, 60, 80].map((h, i) => (
                        <div key={i} className="flex-1 bg-white hover:bg-blue-100 transition-colors" style={{ height: `${h}%`, marginTop: 'auto' }} />
                    ))}
                </div>
            </div>

            {/* 2. Pipeline Health - Clean White */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm rounded-none flex flex-col justify-between group hover:border-slate-300 transition-colors h-32">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Health</p>
                    <BarChart2 className="w-4 h-4 text-slate-300" />
                </div>
                <div className="flex items-end gap-1 h-full mt-2">
                    {/* Bars with Sharp Edges */}
                    <div className="flex-1 flex flex-col justify-end group/bar h-full">
                        <div className="text-[9px] font-bold text-slate-400 mb-1 text-center opacity-0 group-hover/bar:opacity-100 transition-opacity">{stats.new}</div>
                        <div className="w-full bg-blue-500 rounded-none transition-all duration-500 relative" style={{ height: `${Math.max(10, (stats.new / stats.total) * 100)}%` }}></div>
                        <div className="text-[9px] font-bold text-slate-400 mt-1 text-center uppercase">New</div>
                    </div>
                    <div className="flex-1 flex flex-col justify-end group/bar h-full">
                        <div className="text-[9px] font-bold text-slate-400 mb-1 text-center opacity-0 group-hover/bar:opacity-100 transition-opacity">{stats.contacted}</div>
                        <div className="w-full bg-amber-500 rounded-none transition-all duration-500 relative" style={{ height: `${Math.max(10, (stats.contacted / stats.total) * 100)}%` }}></div>
                        <div className="text-[9px] font-bold text-slate-400 mt-1 text-center uppercase">Ctc</div>
                    </div>
                    <div className="flex-1 flex flex-col justify-end group/bar h-full">
                        <div className="text-[9px] font-bold text-slate-400 mb-1 text-center opacity-0 group-hover/bar:opacity-100 transition-opacity">{stats.qualified}</div>
                        <div className="w-full bg-emerald-500 rounded-none transition-all duration-500 relative" style={{ height: `${Math.max(10, (stats.qualified / stats.total) * 100)}%` }}></div>
                        <div className="text-[9px] font-bold text-slate-400 mt-1 text-center uppercase">Qua</div>
                    </div>
                    <div className="flex-1 flex flex-col justify-end group/bar h-full">
                        <div className="text-[9px] font-bold text-slate-400 mb-1 text-center opacity-0 group-hover/bar:opacity-100 transition-opacity">{stats.rejected}</div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-none transition-all duration-500 relative" style={{ height: `${Math.max(10, (stats.rejected / stats.total) * 100)}%` }}></div>
                        <div className="text-[9px] font-bold text-slate-400 mt-1 text-center uppercase">Rej</div>
                    </div>
                </div>
            </div>

            {/* 3. Conversion Rate - Sharp Emerald */}
            <div className="bg-emerald-600 text-white p-0 shadow-lg shadow-emerald-900/10 group hover:shadow-xl hover:shadow-emerald-900/20 transition-all rounded-none relative overflow-hidden flex flex-col h-32">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <Target className="w-32 h-32" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Conversion Rate</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black tracking-tighter">{conversionRate}%</h3>
                        <span className="text-xs font-bold text-emerald-200">Qual Rate</span>
                    </div>
                    <div className="w-full bg-black/20 h-1.5 rounded-none overflow-hidden backdrop-blur-sm mt-3">
                        <div className="h-full bg-white rounded-none" style={{ width: `${conversionRate}%` }} />
                    </div>
                </div>
            </div>

            {/* 4. Engagement - Sharp Violet */}
            <div className="bg-violet-600 text-white p-0 shadow-lg shadow-violet-900/10 group hover:shadow-xl hover:shadow-violet-900/20 transition-all rounded-none relative overflow-hidden flex flex-col h-32">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <Activity className="w-32 h-32" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black uppercase tracking-widest text-violet-200">Engagement Score</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black tracking-tighter">4.8</h3>
                        <span className="text-lg font-bold text-violet-300">/ 5.0</span>
                    </div>
                    <div className="flex gap-2 mt-auto">
                        <span className="px-2 py-0.5 bg-white/10 rounded-none text-[9px] font-black uppercase tracking-wider backdrop-blur-sm border border-white/10">High Intent</span>
                        <span className="px-2 py-0.5 bg-white/10 rounded-none text-[9px] font-black uppercase tracking-wider backdrop-blur-sm border border-white/10">Top Tier</span>
                    </div>
                </div>
            </div>
        </div>
    )
}


