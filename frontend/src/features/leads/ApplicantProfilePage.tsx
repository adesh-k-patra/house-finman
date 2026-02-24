import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Users, Mail, Phone, MapPin, Building, Calendar, FileText, Bot, Activity, ArrowRight, Copy } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { LeadMergeModal } from '@/features/leads/components/LeadMergeModal'
import { ResponseTimeline } from '@/features/surveys/components/ResponseTimeline'

export function ApplicantProfilePage() {
    const { id } = useParams()
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false)

    // Dummy Data
    const applicant = {
        name: 'Rahul Varma',
        email: 'rahul.varma@example.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        employer: 'TCS - Tata Consultancy Services',
        designation: 'Senior Consultant',
        income: '₹ 1.8 Lakhs / Month',
        score: 85,
        status: 'high_intent',
        surveys: [
            { id: 101, name: 'Home Loan Eligibility', date: '2 days ago', status: 'Completed', score: 92 },
            { id: 102, name: 'Project Preferences', date: '1 week ago', status: 'Partial', score: 45 },
        ]
    }

    const duplicates = [
        { id: 'L-1024', name: 'Rahul Varma', email: 'rahul.v@tcs.com', phone: '+91 98765 43210', source: 'Website', score: 85 },
        { id: 'L-9921', name: 'Rahul Kumar Varma', email: 'rahul.varma@example.com', phone: '+91 98765 00000', source: 'Facebook', score: 40 },
    ]

    return (
        <div className="w-full mx-auto p-4 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex gap-4">
                    <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl font-black text-slate-400 dark:text-slate-600 rounded-none border border-slate-300 dark:border-slate-700">
                        RV
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{applicant.name}</h1>
                            <Badge variant="high-intent" className="rounded-none text-sm px-3 py-1">High Intent</Badge>
                            <span className="text-sm font-mono text-slate-400 border border-slate-200 px-2 py-0.5 ml-2">ID: {id || 'L-1024'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {applicant.email}</span>
                            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {applicant.phone}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {applicant.location}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="rounded-none border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 gap-2"
                        onClick={() => setIsMergeModalOpen(true)}
                    >
                        <Copy className="w-4 h-4" /> Merge Duplicates (1)
                    </Button>
                    <Button className="rounded-none bg-slate-900 text-white gap-2">
                        <ArrowRight className="w-4 h-4" /> Move to Application
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                {/* Left Column: Details */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    {/* Employment Card */}
                    <Card className="rounded-none border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider flex items-center gap-2">
                                <Building className="w-4 h-4" /> Employment
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Employer</label>
                                <p className="font-bold text-slate-900 dark:text-white">{applicant.employer}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
                                    <p className="font-medium text-slate-700 dark:text-slate-300">{applicant.designation}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase">Income</label>
                                    <p className="font-medium text-slate-700 dark:text-slate-300">{applicant.income}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* AI Insights */}
                    <Card className="rounded-none border-purple-200 dark:border-purple-900 shadow-sm bg-purple-50/50 dark:bg-purple-900/10">
                        <div className="p-4 border-b border-purple-100 dark:border-purple-800">
                            <h3 className="font-bold text-purple-900 dark:text-purple-300 uppercase text-xs tracking-wider flex items-center gap-2">
                                <Bot className="w-4 h-4" /> AI Analysis
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Conversion Prob.</span>
                                <span className="text-xl font-black text-emerald-600">85%</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic border-l-2 border-purple-300 pl-3">
                                "High intent detected based on income level and immediate detailed responses. Verified employer via LinkedIn."
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Activity & Surveys */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* Survey History */}
                    <Card className="rounded-none border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Survey Responses
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {applicant.surveys.map(survey => (
                                <div key={survey.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-10 ${survey.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{survey.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                <Calendar className="w-3 h-3" /> {survey.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={survey.status === 'Completed' ? 'default' : 'secondary'} className="rounded-none">
                                            {survey.status}
                                        </Badge>
                                        <p className="text-[10px] font-bold text-slate-400 mt-2">Score: {survey.score}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Timeline */}
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider mb-6 pl-2 border-l-4 border-slate-900 dark:border-slate-100">
                            Activity Timeline
                        </h3>
                        <ResponseTimeline events={[
                            { id: '1', type: 'call_logged', title: 'Outbound Call', subtitle: 'Spoke with Priya. Interested in 3BHK.', timestamp: '2 hours ago', user: 'Priya S.' },
                            { id: '2', type: 'survey_complete', title: 'Survey Completed', subtitle: 'Home Loan Eligibility Check', timestamp: '2 days ago' },
                            { id: '3', type: 'email_sent', title: 'Welcome Email Sent', timestamp: '2 days ago', user: 'System' },
                            { id: '4', type: 'survey_start', title: 'Started Application', timestamp: '3 days ago' },
                        ]} />
                    </div>
                </div>
            </div>

            <LeadMergeModal
                isOpen={isMergeModalOpen}
                onClose={() => setIsMergeModalOpen(false)}
                duplicates={duplicates}
            />
        </div>
    )
}
