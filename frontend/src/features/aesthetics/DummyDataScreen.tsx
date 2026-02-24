import { ArrowRight, Layout, Bell, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, Button } from '@/components/ui'
import { AgentDashboardCard } from '../dashboard/components/AgentDashboardCard'
import { AgentLeaderboard } from '../dashboard/components/AgentLeaderboard'
import { SurveyHealthCard } from '../surveys/components/SurveyHealthCard'
import { MultiFileUpload } from '../surveys/components/questions/MultiFileUpload'
import { MobileActionSheet } from '@/components/ui/MobileActionSheet'
import { useState } from 'react'

export function DummyDataScreen() {
    const [showSheet, setShowSheet] = useState(false)

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Design Verification</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mt-2">Phase A • Component Gallery</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-none bg-white">
                        <Layout className="w-4 h-4 mr-2" /> Style Guide
                    </Button>
                    <Link to="/surveys">
                        <Button className="rounded-none bg-slate-900 text-white">
                            View Live App <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">

                {/* Column 1: Widgets */}
                <div className="col-span-12 md:col-span-4 space-y-8">
                    <section>
                        <h3 className="text-xs font-bold uppercase text-slate-400 mb-4">A.30 Agent Dashboard</h3>
                        <div className="h-[400px]">
                            <AgentDashboardCard />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-bold uppercase text-slate-400 mb-4">A.38 Survey Health</h3>
                        <SurveyHealthCard />
                    </section>
                </div>

                {/* Column 2: Data & Complex UI */}
                <div className="col-span-12 md:col-span-5 space-y-8">
                    <section>
                        <h3 className="text-xs font-bold uppercase text-slate-400 mb-4">A.47 Leaderboard</h3>
                        <AgentLeaderboard />
                    </section>

                    <section>
                        <h3 className="text-xs font-bold uppercase text-slate-400 mb-4">A.44 Multi-File Upload</h3>
                        <Card className="p-6 rounded-none shadow-sm">
                            <MultiFileUpload />
                        </Card>
                    </section>
                </div>

                {/* Column 3: Interactions */}
                <div className="col-span-12 md:col-span-3 space-y-8">
                    <section>
                        <h3 className="text-xs font-bold uppercase text-slate-400 mb-4">A.34 Mobile Sheet</h3>
                        <Card className="p-6 rounded-none shadow-sm text-center">
                            <Button onClick={() => setShowSheet(true)} variant="outline" className="w-full rounded-none">
                                Trigger Sheet
                            </Button>
                        </Card>
                        <MobileActionSheet
                            isOpen={showSheet}
                            onClose={() => setShowSheet(false)}
                            title="Quick Actions"
                            options={[
                                { label: 'Edit Survey', onClick: () => console.log('Edit'), icon: Settings },
                                { label: 'Send Reminder', onClick: () => console.log('Send'), icon: Bell },
                                { label: 'Delete', onClick: () => console.log('Delete'), variant: 'destructive' }
                            ]}
                        />
                    </section>
                </div>
            </div>
        </div>
    )
}
