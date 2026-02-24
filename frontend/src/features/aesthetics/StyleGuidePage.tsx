import { useState } from 'react'
import {
    Check, AlertTriangle, Info, XCircle, Moon, Sun,
    Home, CreditCard, MapPin, Calendar, Users, Building2,
    Search, Filter, Download, Trash2, Edit, MoreVertical,
    ChevronDown, ChevronRight, FileText, PieChart
} from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { cn } from '@/utils'

export function StyleGuidePage() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    return (
        <div className={cn("min-h-screen p-4 transition-colors", isDarkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900")}>

            {/* Header */}
            <div className="flex items-center justify-between mb-12 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight uppercase">Sharp UI / Style Guide</h1>
                    <p className="text-slate-500 font-medium mt-2">Living documentation for HouseFin Man Design System</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="gap-2 rounded-none"
                >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    Toggle Theme
                </Button>
            </div>

            <div className="space-y-16 w-full mx-auto">

                {/* 1. Accessibility & Colors (A.31) */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-4xl font-black text-slate-200 dark:text-slate-800 select-none">01</span>
                        <h2 className="text-2xl font-bold uppercase tracking-wide">Accessibility & Contrast</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Semantic Colors (WCAG AA Compliant)</h3>
                            <div className="space-y-4">
                                <ColorSwatch name="Primary / Slate 900" bg="bg-slate-900" text="text-white" label="#0f172a" check="Pass" />
                                <ColorSwatch name="Success / Emerald 600" bg="bg-emerald-600" text="text-white" label="#059669" check="Pass" />
                                <ColorSwatch name="Warning / Amber 500" bg="bg-amber-500" text="text-slate-900" label="#f59e0b" check="Pass" />
                                <ColorSwatch name="Destructive / Red 600" bg="bg-red-600" text="text-white" label="#dc2626" check="Pass" />
                                <ColorSwatch name="Info / Blue 600" bg="bg-blue-600" text="text-white" label="#2563eb" check="Pass" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Surface Contrast</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-slate-50 border border-slate-200">
                                    <h4 className="font-bold text-slate-900">Light Surface</h4>
                                    <p className="text-sm text-slate-600 mt-2">Text-slate-600 on Slate-50 passes 4.5:1 ratio.</p>
                                </div>
                                <div className="p-6 bg-slate-900 border border-slate-700">
                                    <h4 className="font-bold text-white">Dark Surface</h4>
                                    <p className="text-sm text-slate-400 mt-2">Text-slate-400 on Slate-900 passes 4.5:1 ratio.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-200 dark:border-slate-800" />

                {/* 2. Iconography (A.32) */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-4xl font-black text-slate-200 dark:text-slate-800 select-none">02</span>
                        <h2 className="text-2xl font-bold uppercase tracking-wide">Iconography</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Navigation</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <IconBox icon={Home} label="Home" />
                                <IconBox icon={PieChart} label="Dashboard" />
                                <IconBox icon={Users} label="Users" />
                                <IconBox icon={FileText} label="Surveys" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Entities</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <IconBox icon={Building2} label="Prop" />
                                <IconBox icon={CreditCard} label="Loan" />
                                <IconBox icon={MapPin} label="Loc" />
                                <IconBox icon={Calendar} label="Date" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Actions</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <IconBox icon={Search} label="Search" />
                                <IconBox icon={Filter} label="Filter" />
                                <IconBox icon={Download} label="Export" />
                                <IconBox icon={Edit} label="Edit" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Status</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <IconBox icon={Check} label="OK" className="text-emerald-500" />
                                <IconBox icon={AlertTriangle} label="Warn" className="text-amber-500" />
                                <IconBox icon={XCircle} label="Err" className="text-red-500" />
                                <IconBox icon={Info} label="Info" className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-200 dark:border-slate-800" />

                {/* 3. Table Designs (A.33) */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-4xl font-black text-slate-200 dark:text-slate-800 select-none">03</span>
                        <h2 className="text-2xl font-bold uppercase tracking-wide">Table Standardization</h2>
                    </div>

                    <Card className="rounded-none overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold uppercase text-xs tracking-wider">Leads Data</h3>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="rounded-none h-8 bg-white dark:bg-slate-800">
                                    <Filter className="w-3 h-3 mr-2" /> Filter
                                </Button>
                                <Button size="sm" variant="outline" className="rounded-none h-8 bg-white dark:bg-slate-800">
                                    <MoreVertical className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold tracking-widest">
                                    <tr>
                                        <th className="px-4 py-4 border-r border-white/10 w-16 text-center">
                                            <input type="checkbox" className="rounded-none bg-slate-800 border-slate-600" />
                                        </th>
                                        <th className="px-4 py-4 border-r border-white/10 cursor-pointer hover:bg-slate-800 transition-colors">
                                            Lead Name <ChevronDown className="w-3 h-3 inline ml-1 opacity-50" />
                                        </th>
                                        <th className="px-4 py-4 border-r border-white/10">Status</th>
                                        <th className="px-4 py-4 border-r border-white/10">Value</th>
                                        <th className="px-4 py-4 border-r border-white/10">Assigned To</th>
                                        <th className="px-4 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                    {[1, 2, 3].map((i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-colors">
                                            <td className="px-4 py-4 text-center">
                                                <input type="checkbox" className="rounded-none" />
                                            </td>
                                            <td className="px-4 py-4 font-bold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800">
                                                Rahul Varma
                                                <div className="text-xs font-normal text-slate-400 mt-0.5">+91 98765 43210</div>
                                            </td>
                                            <td className="px-4 py-4 border-r border-slate-100 dark:border-slate-800">
                                                <Badge variant={i === 1 ? 'high-intent' : i === 2 ? 'warning' : 'secondary'} className="rounded-none">
                                                    {i === 1 ? 'High Intent' : i === 2 ? 'Follow Up' : 'New Lead'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4 font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                                                ₹ 2.5 Cr
                                            </td>
                                            <td className="px-4 py-4 border-r border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                                                        JD
                                                    </div>
                                                    <span className="text-xs">John Doe</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-none text-slate-400 hover:text-slate-900">
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </section>

            </div>
        </div>
    )
}

function ColorSwatch({ name, bg, text, label, check }: { name: string, bg: string, text: string, label: string, check: string }) {
    return (
        <div className={cn("p-4 flex items-center justify-between rounded-none border border-black/10 dark:border-white/10", bg, text)}>
            <div>
                <p className="font-bold text-sm">{name}</p>
                <p className="opacity-80 text-xs font-mono">{label}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 dark:bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <Check className="w-3 h-3" /> {check}
            </div>
        </div>
    )
}

function IconBox({ icon: Icon, label, className }: { icon: any, label: string, className?: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
            <Icon className={cn("w-6 h-6 mb-2 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform", className)} />
            <span className="text-[10px] uppercase font-bold text-slate-500">{label}</span>
        </div>
    )
}
