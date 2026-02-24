import { useState, useRef } from 'react'
import { cn } from '@/utils'
import {
    Database, Beaker, DollarSign, Shield, Sparkles, CheckCircle,
    TrendingUp, Lightbulb, Zap, Target, X, Download, RefreshCw, Loader2
} from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Hypothesis } from '../contexts/SurveyBuilderContext'
import { generateDeepDivePDF } from '../utils/generateDeepDivePDF'

// ============ TYPES ============

export interface DeepDiveData {
    reportOverview: {
        title: string
        surveyName: string
        hypothesisId: string
        category: string
        generatedOn: string
        dataCoverage: string
        respondentBase: number
        confidenceLevel: number
    }
    executiveSummary: {
        statement: string
        keyFinding: string
        impactSummary: { revenue: string; conversion: string; nps: string; risk: string }
        confidence: number
        urgency: 'High' | 'Medium' | 'Low'
        recommendedAction: string

        expectedOutcome: string
        strategicContext: string
        marketBenchmark: string
        immediateNextSteps: string[]
    }
    hypothesisDefinition: {
        name: string
        question: string
        nullHypothesis: string
        alternateHypothesis: string
        businessProblem: string
        stakeholderObjective: string

        assumptions: string[]
        theoreticalBasis: string
        stakeholderQuotes: string[]
        previousAttempts: string[]
    }
    targetSegment: {
        audienceType: string
        demographics: { ageRange: string; gender: string; education: string }
        financialFilters: { budgetRange: string; loanAmount: string; incomeRange: string }
        intentSignals: { timeframe: string; urgency: string }
        geography: string
        channelSource: string
        sampleSize: number
        psychographics: string[]
        deviceBreakdown: { mobile: number; desktop: number; tablet: number }
        exclusionCriteria: string[]
    }
    dataSources: {
        surveyQuestions: string[]
        questionTypes: string[]
        behavioralData: string[]
        integrations: string[]
        avgCompletionTime: string
        dropOffPoints: string[]
    }
    keyMetrics: {
        primaryMetric: string
        secondaryMetrics: string[]
        supportingKPIs: string[]
        baseline: { conversion: number; dropOff: number; avgTime: string }
        variant: { conversion: number; dropOff: number; avgTime: string }
        trendDirection: string
    }
    statisticalAnalysis: {
        method: string
        significance: number
        effectSize: number
        confidenceInterval: number[]
        sampleAdequacy: string
        biasDetection: string
        powerAnalysis: string
        marginOfError: string
        alternativeTests: string[]
    }
    visualization: {
        chartType: string
        data: { step: string; value: number; variant: number }[]
    }
    coreFindings: {
        primaryInsight: string
        evidence: string[]
        contradictory: string
        pattern: string
        behavioralExplanation: string

        financialInterpretation: string
        segmentSpecifics: string[]
        userVerbatims: string[]
        dayOfWeekTrends: string
    }
    aiReasoning: {
        whyGenerated: string
        signalWeighting: { dropOffSignal: number; surveyFeedback: number; behavioral: number }
        featureImportance: string[]
        correlationDrivers: string[]
        confidenceDrivers: string[]
        limitations: string[]
    }
    confidenceScore: {
        overall: number
        dataQuality: number
        sampleStrength: number
        signalConsistency: number
        historicalMatch: number
        falsePositiveRisk: string
    }
    businessImpact: {
        conversionUplift: string
        revenueImpact: string
        costReduction: string
        npsLift: string
        riskReduction: string
        timeToValue: string
        longTermValue: string
        brandPerception: string
        employeeEfficiency: string
    }
    recommendedActions: {
        primary: string
        secondary: string[]
        departmentOwner: string
        channel: string
        automationPotential: string
        priority: string
    }
    experimentPlan: {
        testType: string
        control: string
        test: string
        successMetrics: string[]
        duration: string
        minSample: number
        rollbackCriteria: string
        resourceRequirements: string[]
        communicationStrategy: string
        detailedTimeline: { phase: string; timing: string }[]
    }
    implementationReadiness: {
        dataReadiness: string
        techDependency: string
        crmMapping: string
        trainingRequired: string
        estimatedEffort: string
        goLiveTimeline: string
    }
    risks: {
        dataLimitations: string
        segmentBias: string
        externalFactors: string
        seasonality: string
        regulatory: string
        overfitting: string
        ethicalConsiderations: string
        modelTrainingInfo: string
        falsePositiveAnalysis: string
    }
    crossHypothesis: {
        similar: string[]
        conflicting: string[]
        reinforcing: string[]
        priorityRank: number
        netImpactScore: number
    }
    historicalPerformance: {
        pastResults: { id: string; prediction: string; actual: string; accuracy: string }[]
        accuracyHistory: string
        learningFeedback: string
    }
    actionTracking: {
        status: string
        owner: string
        startDate: string
        completionDate: string
        kpiMonitoring: string
        outcomeLogged: string
    }
    aiRecommendations: {
        relatedHypotheses: string[]
        missingData: string[]
        additionalQuestions: string[]
        deeperSegments: string[]
    }
}

interface HypothesisDeepDiveModalProps {
    hypothesis: Hypothesis
    onClose: () => void
    onAIAction: (hypothesis: Hypothesis) => void
}

// ============ MOCK DATA GENERATOR ============

const generateMockData = (hypothesis: Hypothesis): DeepDiveData => {
    // Derive category from hypothesis ID or randomly assign one
    const categories = ['Conversion Optimization', 'User Experience (UX)', 'Revenue Growth', 'Risk Management', 'Product Strategy', 'Operational Efficiency']
    const categoryIndex = hypothesis.id ? hypothesis.id.charCodeAt(hypothesis.id.length - 1) % categories.length : 0
    const derivedCategory = categories[categoryIndex]

    return {
        reportOverview: {
            title: `Hypothesis Analysis Report - ${hypothesis.id || 'H-NEW'}`,
            surveyName: 'Customer Satisfaction Survey Q4 2025',
            hypothesisId: hypothesis.id || 'H-NEW',
            category: derivedCategory,
            generatedOn: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
            dataCoverage: 'Oct 1, 2025 - Jan 31, 2026',
            respondentBase: 1240,
            confidenceLevel: 94
        },
        executiveSummary: {
            statement: hypothesis.insight,
            keyFinding: 'Users who face document upload friction are 3.2x more likely to abandon the application process.',
            impactSummary: { revenue: '₹45.2L', conversion: '+12.3%', nps: '+8.4 pts', risk: '-15.2%' },
            confidence: 94,
            urgency: 'High',
            recommendedAction: hypothesis.recommendation,
            expectedOutcome: 'Reduce drop-off rate by 35% and increase completed applications by 180/month',
            strategicContext: 'Aligns with FY26 Goal: "Frictionless Digital Onboarding" to reduce CAC by 15%.',
            marketBenchmark: 'Industry average drop-off at upload is 25% vs our 42%. Best-in-class is 12%.',
            immediateNextSteps: [
                'Approve A/B test budget (₹50k)',
                'Brief Engineering on OCR integration',
                'Design new mobile-optimized upload UI'
            ]
        },
        hypothesisDefinition: {
            name: hypothesis.insight.length > 50 ? hypothesis.insight.substring(0, 50) + '...' : hypothesis.insight,
            question: 'Does simplifying document upload increase conversion rates?',
            nullHypothesis: 'Document upload complexity has no significant effect on conversion rates (p > 0.05).',
            alternateHypothesis: 'Simplified upload increases conversion by >10% with statistical significance (p < 0.01).',
            businessProblem: 'High abandonment rate (42%) observed at the salary proof upload step in the loan application flow.',
            stakeholderObjective: 'Head of Digital Acquisition / Sales Director',
            assumptions: ['Users have access to digital bank statements', 'OCR accuracy >95%', 'Mobile users constitute 65% of traffic'],
            theoreticalBasis: 'Fogg Behavior Model: High friction (Ability) reduces behavior execution despite high Motivation.',
            stakeholderQuotes: [
                '"We lose too many good leads at the document step." - Sales Lead',
                '"The current upload UI is not responsive on older Androids." - QA Team'
            ],
            previousAttempts: ['2024: Added tooltips (No Impact)', '2023: Increased file size limit (Minor Lift)']
        },
        targetSegment: {
            audienceType: 'High-Intent Applicants',
            demographics: { ageRange: '25-45 Years', gender: 'Mixed (60% M, 40% F)', education: 'Graduate & Above' },
            financialFilters: { budgetRange: '₹30L - ₹75L', loanAmount: '₹20L - ₹50L', incomeRange: '₹6L - ₹15L PA' },
            intentSignals: { timeframe: 'Immediate (0-3 months)', urgency: 'High' },
            geography: 'Tier 1 & 2 Cities (Mumbai, Pune, Bangalore, Hyderabad)',
            channelSource: 'Direct (45%), Partners (35%), Digital Ads (20%)',
            sampleSize: 1240,
            psychographics: ['Tech-savvy', 'Time-poor', 'Value convenience over human assistance'],
            deviceBreakdown: { mobile: 65, desktop: 30, tablet: 5 },
            exclusionCriteria: ['Existing customers refinancing', 'Applications flagged as high-risk fraud']
        },
        dataSources: {
            surveyQuestions: [
                'Q5. "How would you rate the document upload process?" (Rating 1-5)',
                'Q7. "What was the primary reason for not completing the application?" (Single Select)',
                'Q12. "Which upload method do you prefer?" (MCQ)'
            ],
            questionTypes: ['Likert Scale', 'Multiple Choice', 'Open Ended'],
            behavioralData: ['Session Recording (Clarity)', 'Drop-off Funnel Events (Mixpanel)', 'Click Heatmaps'],
            integrations: ['Core Banking System (LOS)', 'CRM Events (Salesforce)', 'Google Analytics 4'],
            avgCompletionTime: '4m 32s (Current) vs 8m 15s (Avg)',
            dropOffPoints: ['Step 3: Document Upload (42% Drop)', 'Step 5: Income Verification (18% Drop)']
        },
        keyMetrics: {
            primaryMetric: 'Conversion Rate (%)',
            secondaryMetrics: ['Time to Complete', 'Drop-off Rate at Step 3', 'Document Retry Count'],
            supportingKPIs: ['NPS Score', 'Customer Effort Score (CES)', 'First Call Resolution (FCR)'],
            baseline: { conversion: 23.4, dropOff: 42.0, avgTime: '8m 15s' },
            variant: { conversion: 35.7, dropOff: 27.5, avgTime: '5m 42s' },
            trendDirection: 'Positive Trend'
        },
        statisticalAnalysis: {
            method: 'Chi-Square Test with Bayesian Update',
            significance: 0.003,
            effectSize: 0.42,
            confidenceInterval: [0.38, 0.46],
            sampleAdequacy: 'High (n=1240 > required 384 for 95% CI)',
            biasDetection: 'Low bias risk - stratified sampling applied across demographics',
            powerAnalysis: 'Power = 0.85 (High probability of detecting true effect)',
            marginOfError: '±2.8% at 95% Confidence Level',
            alternativeTests: ['Bayesian A/B Testing', 'Multivariate Testing (MVT) for UI elements']
        },
        visualization: {
            chartType: 'Funnel + Line Trend',
            data: [
                { step: 'Started', value: 100, variant: 100 },
                { step: 'Profile', value: 92, variant: 95 },
                { step: 'Documents', value: 58, variant: 82 },
                { step: 'Verification', value: 48, variant: 75 },
                { step: 'Completed', value: 23, variant: 41 }
            ]
        },
        coreFindings: {
            primaryInsight: hypothesis.insight,
            evidence: [
                '42% of total drop-offs occur specifically at the document upload screen.',
                '78% of drop-off users cited "too many steps" or "technical error" as reasons.',
                'Mobile users are 2.3x more likely to abandon than desktop users at this step.'
            ],
            contradictory: 'Desktop users showed a marginal improvement (5%) compared to mobile users (18%).',
            pattern: 'Mobile-first users aged under 35 years show the highest sensitivity to upload friction.',
            behavioralExplanation: 'High cognitive load and UI friction on smaller screens leading to frustration.',
            financialInterpretation: 'Reducing friction here could unlock an estimated ₹45.2L in monthly disbursed value.',
            segmentSpecifics: ['Android users drop off 15% more than iOS users.', 'Weekend traffic has 5% lower completion rate potentially due to lack of document access.'],
            userVerbatims: [
                '"I tried uploading my slip 3 times but it kept failing."',
                '"Why do I need to upload this if I already gave my PAN?"'
            ],
            dayOfWeekTrends: 'Highest drop-off on Saturdays (48%) vs Weekdays (38%).'
        },
        aiReasoning: {
            whyGenerated: 'Anomaly detection flagged a 15% spike in drop-offs at "Document Upload" for mobile users.',
            signalWeighting: { dropOffSignal: 0.45, surveyFeedback: 0.30, behavioral: 0.25 },
            featureImportance: ['Upload Step Complexity', 'Mobile Device Usage', 'Internet Connection Speed'],
            correlationDrivers: ['Number of required documents is negatively correlated with completion rate (r=-0.65).'],
            confidenceDrivers: ['Large sample size (1240)', 'Consistent feedback across channels', 'Statistical significance (p<0.01)'],
            limitations: ['Analysis limited to digital applicants only', 'Does not account for offline assisted applications'],

        },
        confidenceScore: {
            overall: 94,
            dataQuality: 92,
            sampleStrength: 98,
            signalConsistency: 95,
            historicalMatch: 88,
            falsePositiveRisk: 'Very Low (<6%)'
        },
        businessImpact: {
            conversionUplift: '+12.3%',
            revenueImpact: '₹45.2L / Quarter',
            costReduction: '₹8.5L (Reduced Support calls)',
            npsLift: '+8.4 Points',
            riskReduction: '-15.2% (Fraud Attempts)',
            timeToValue: '3 Weeks',
            longTermValue: '+₹12.5Cr Annual Revenue Impact',
            brandPerception: 'Improved "Ease of Use" scores in App Store reviews',
            employeeEfficiency: 'Reduces manual document review time by 150 hours/month'
        },
        recommendedActions: {
            primary: hypothesis.recommendation,
            secondary: [
                'Implement one-click drag-and-drop upload for desktop.',
                'Integrate "DigiLocker" for instant document fetch.',
                'Enable camera-based OCR for mobile users.'
            ],
            departmentOwner: 'Product Growth & Engineering',
            channel: 'Mobile App & Web Portal',
            automationPotential: 'High (OCR Integration)',
            priority: 'P0 - Critical'
        },
        experimentPlan: {
            testType: 'A/B Test (Split URL)',
            control: 'Current multi-step manual upload flow',
            test: 'New streamlined flow with OCR & DigiLocker',
            successMetrics: ['Conversion Rate > 30%', 'Upload Success Rate > 90%'],
            duration: '4 Weeks',
            minSample: 2000,
            rollbackCriteria: 'If upload errors increase by >2% or conversion drops below baseline.',
            resourceRequirements: ['1 Frontend Dev', '1 QA Engineer', '1 UX Designer'],
            communicationStrategy: 'Internal release notes + Email update to Sales Leadership upon launch.',
            detailedTimeline: [
                { phase: 'Design & Review', timing: 'Week 1' },
                { phase: 'Development', timing: 'Week 2-3' },
                { phase: 'QA & Deployment', timing: 'Week 4' }
            ]
        },
        implementationReadiness: {
            dataReadiness: 'High - APIs Available',
            techDependency: 'Third-party OCR Vendor Integration',
            crmMapping: 'Mapped to Lead Object',
            trainingRequired: 'Minimal (UX Change only)',
            estimatedEffort: '2 Sprints (4 Weeks)',
            goLiveTimeline: 'April 15, 2026'
        },
        risks: {
            dataLimitations: 'Data relies on self-reported survey reasons',
            segmentBias: 'Slight urban bias in respondent data',
            externalFactors: 'Regulatory changes in KYC norms',
            seasonality: 'Q4 typically sees higher impulsive buying behavior',
            regulatory: 'Compliance with Data Privacy Bill 2025',
            overfitting: 'Low - Validated againt control group',
            ethicalConsiderations: 'Model does not use protected class variables (Race, Religion) for prediction.',
            modelTrainingInfo: 'Trained on last 6 months of application logs (n=50,000+). XGBoost Classifier.',
            falsePositiveAnalysis: 'Risk of flagging genuine slow users as "drop-offs" is < 5%.'
        },
        crossHypothesis: {
            similar: ['H-023: Mobile UX Optimization', 'H-019: KYC Simplified Flow'],
            conflicting: ['H-028: Additional Security Layer at Login'],
            reinforcing: ['H-031: Partner Portal Sync'],
            priorityRank: 1,
            netImpactScore: 9.2
        },
        historicalPerformance: {
            pastResults: [
                { id: 'H-015', prediction: '+8%', actual: '+7.2%', accuracy: '90%' },
                { id: 'H-018', prediction: '+15%', actual: '+14.1%', accuracy: '94%' }
            ],
            accuracyHistory: '91% Model Accuracy',
            learningFeedback: 'Model weightage adjusted for mobile behavioral signals.'
        },
        actionTracking: {
            status: 'Approved for Pilot',
            owner: 'Priya Sharma (Product Manager)',
            startDate: '2026-03-01',
            completionDate: '2026-03-31',
            kpiMonitoring: 'Live Dashboard Configured',
            outcomeLogged: 'Pending Execution'
        },
        aiRecommendations: {
            relatedHypotheses: ['Simplify Income Proof requirement', 'Auto-fetch credit score earlier'],
            missingData: ['Competitor benchmarking for document upload', 'Granular error logs for IOS users'],
            additionalQuestions: ['Why did you pause at the upload screen?', 'Did you have the documents handy?'],
            deeperSegments: ['Self-Employed vs Salaried', 'Android vs iOS Users']
        }
    }
}

// ============ SECTION NAVIGATION ============

const SECTIONS = [
    { id: 'executive', label: 'Exec Summary', icon: TrendingUp },
    { id: 'definition', label: 'Hypothesis', icon: Lightbulb },
    { id: 'data', label: 'Data & Target', icon: Database },
    { id: 'findings', label: 'Core Findings', icon: Target },
    { id: 'stats', label: 'Statistical Val.', icon: Beaker },
    { id: 'impact', label: 'Business Impact', icon: DollarSign },
    { id: 'action', label: 'Action Plan', icon: Zap },
    { id: 'risks', label: 'Risks & AI', icon: Shield },
]

// ============ UI COMPONENTS ============

function SectionHeader({ title, icon: Icon, subtitle, color = "blue" }: { title: string, icon: any, subtitle?: string, color?: string }) {
    const colorClassesMap: Record<string, string> = {
        blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/50",
        emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/50",
        purple: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/50",
        orange: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/50",
        rose: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/50",
    }

    const activeColorClass = colorClassesMap[color] || colorClassesMap['blue']

    return (
        <div className="mb-8 relative">
            <div className="flex items-start gap-4">
                <div className={cn("p-3 border shadow-sm rounded-none", activeColorClass)}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h2>
                    {subtitle && <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
                </div>
            </div>
            <div className="absolute -bottom-4 left-0 w-full h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent dark:from-slate-800 dark:via-slate-900" />
        </div>
    )
}

function GradientStatCard({ label, value, subtext, icon: Icon, gradient }: { label: string, value: string | number, subtext?: string, icon?: any, gradient: string }) {
    return (
        <div className={cn(
            "relative overflow-hidden p-5 rounded-none shadow-xl border border-white/10 group hover:-translate-y-1 transition-transform duration-300",
            gradient
        )}>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-white/90 uppercase tracking-widest mb-1">{label}</p>
                    <h3 className="text-2xl font-black text-white">{value}</h3>
                    {subtext && (
                        <p className="text-[10px] text-white/80 mt-1 flex items-center gap-1">
                            {Icon && <Icon className="w-3 h-3" />} {subtext}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className="p-3 bg-white/10 rounded-none backdrop-blur-sm">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>
        </div>
    )
}

function GridCard({ label, value, highlight = false, subtext, icon: Icon }: { label: string, value: string | number, highlight?: boolean, subtext?: string, icon?: React.ElementType }) {
    return (
        <div className={cn(
            "p-5 relative group overflow-hidden transition-all duration-300 backdrop-blur-sm rounded-none border-l-4",
            highlight ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 border-l-white/20" :
                "bg-white dark:bg-slate-900 border-y border-r border-slate-200 dark:border-slate-800 border-l-blue-500 hover:shadow-lg hover:-translate-y-0.5"
        )}>
            {highlight && (
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Sparkles className="w-12 h-12" />
                </div>
            )}
            {Icon && !highlight && (
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon className="w-12 h-12 text-blue-500" />
                </div>
            )}
            <p className={cn("text-xs font-bold uppercase tracking-wider mb-2", highlight ? "text-blue-100" : "text-slate-400")}>{label}</p>
            <p className={cn("text-2xl font-black truncate", highlight ? "text-white" : "text-slate-900 dark:text-white")}>{value}</p>
            {subtext && <p className={cn("text-xs mt-2 font-medium", highlight ? "text-blue-100" : "text-slate-500")}>{subtext}</p>}
        </div>
    )
}

function MiniChart({ data }: { data: DeepDiveData['visualization']['data'] }) {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorVariant" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                    <XAxis dataKey="step" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}
                        cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" name="Baseline" />
                    <Area type="monotone" dataKey="variant" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVariant)" name="Projected" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

// ============ MAIN COMPONENT ============

export function HypothesisDeepDiveModal({ hypothesis, onClose }: HypothesisDeepDiveModalProps) {
    const [activeSection, setActiveSection] = useState('executive')
    const [data, setData] = useState<DeepDiveData>(() => generateMockData(hypothesis))
    const [isRegenerating, setIsRegenerating] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    // Scroll to section handling
    const scrollToSection = (id: string) => {
        setActiveSection(id)
        const element = document.getElementById(`section-${id}`)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const handleDownload = () => {
        generateDeepDivePDF(data)
    }

    const handleRegenerate = () => {
        setIsRegenerating(true)
        // Simulate AI regeneration delay
        setTimeout(() => {
            setData(generateMockData(hypothesis))
            setIsRegenerating(false)
        }, 2000)
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-[1400px] h-[95vh] md:h-[90vh] bg-slate-50 dark:bg-slate-950 shadow-2xl flex overflow-hidden border border-white/10 ring-1 ring-black/5 rounded-none">

                {/* SIDEBAR - Dark Glassmorphic */}
                <div className="w-72 bg-slate-900 text-white flex flex-col relative overflow-hidden shrink-0">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/40 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="p-6 relative z-10">
                        <div className="flex items-center gap-2 text-blue-400 font-bold mb-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-[10px] uppercase tracking-[0.2em]">AI Intelligence</span>
                        </div>
                        <h1 className="text-2xl font-black text-white leading-tight tracking-tight mb-2">Deep Dive<br />Report</h1>
                        <div className="inline-flex items-center px-2 py-1 bg-white/10 border border-white/10 text-[10px] font-mono text-slate-300 rounded-none">
                            ID: {data.reportOverview.hypothesisId}
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1 relative z-10 custom-scrollbar">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all group border mb-2 relative overflow-hidden rounded-none",
                                    activeSection === section.id
                                        ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white border-white/20 shadow-lg shadow-black/40 translate-x-1"
                                        : "bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-white border-white/5 hover:border-white/10 hover:shadow-md hover:translate-x-0.5"
                                )}
                            >
                                <section.icon className={cn("w-4 h-4 transition-colors", activeSection === section.id ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                                {section.label}
                                {activeSection === section.id && (
                                    <>
                                        <div className="absolute inset-y-0 left-0 w-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none" />
                                    </>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="p-6 relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence Score</span>
                            <span className="text-sm font-black text-emerald-400">{data.reportOverview.confidenceLevel}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[94%] shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 text-center">Calculated from 312 data points</p>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 relative">
                    {/* Header - Glassmorphic Dark */}
                    <header className="h-20 px-8 flex items-center justify-between bg-slate-950 border-b border-white/10 sticky top-0 z-50 shadow-md">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Report Generated</span>
                                <span className="text-sm font-bold text-slate-200">{data.reportOverview.generatedOn}</span>
                            </div>
                            <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Status</span>
                                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
                                    Analysis Complete
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRegenerate}
                                disabled={isRegenerating}
                                className="flex items-center gap-2 px-4 py-2.5 text-white hover:text-blue-400 hover:bg-white/5 text-sm font-bold transition-all border border-white/10 hover:border-blue-500/50 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isRegenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                {isRegenerating ? 'Regenerating...' : 'Regenerate Analysis'}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-200 text-slate-900 text-sm font-bold transition-all shadow-lg shadow-white/5 active:scale-95 rounded-none"
                            >
                                <Download className="w-4 h-4" />
                                Export PDF
                            </button>
                            <button onClick={onClose} className="p-2.5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors rounded-none">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    {/* Content Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-16 scroll-smooth custom-scrollbar bg-slate-50/50 dark:bg-slate-950" ref={contentRef}>

                        {/* 1. EXECUTIVE SUMMARY */}
                        <section id="section-executive" className="animate-fade-in space-y-6">
                            <SectionHeader title="Executive Summary" icon={TrendingUp} subtitle="High-level impact analysis and strategic recommendation" color="blue" />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 p-8 bg-gradient-to-br from-indigo-900 to-slate-900 border border-white/10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="flex items-center justify-center w-8 h-8 bg-white/10 text-blue-400 backdrop-blur-md rounded-none">
                                                <Lightbulb className="w-4 h-4" />
                                            </span>
                                            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Primary Insight</h3>
                                        </div>
                                        <p className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-sm">
                                            "{data.executiveSummary.keyFinding}"
                                        </p>
                                        <div className="mt-6 flex flex-wrap gap-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-none backdrop-blur-md border border-white/10">
                                                <Target className="w-3 h-3 text-emerald-400" />
                                                Confidence: {data.executiveSummary.confidence}%
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-none backdrop-blur-md border border-white/10">
                                                <Zap className="w-3 h-3 text-amber-400" />
                                                Urgency: {data.executiveSummary.urgency}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <GradientStatCard
                                        label="Projected Revenue"
                                        value={data.executiveSummary.impactSummary.revenue}
                                        subtext="Per Quarter"
                                        icon={DollarSign}
                                        gradient="bg-gradient-to-br from-emerald-500 to-teal-700"
                                    />
                                    <GradientStatCard
                                        label="Conversion Lift"
                                        value={data.executiveSummary.impactSummary.conversion}
                                        subtext="High Confidence"
                                        icon={TrendingUp}
                                        gradient="bg-gradient-to-br from-blue-500 to-indigo-700"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-900 border border-slate-800 shadow-lg flex items-start gap-4 hover:border-emerald-500/30 transition-colors">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-400 shrink-0 rounded-none border border-emerald-500/20">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-1">Recommended Action</h4>
                                        <p className="text-sm text-white font-medium leading-relaxed">{data.executiveSummary.recommendedAction}</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-900 border border-slate-800 shadow-lg flex items-start gap-4 hover:border-blue-500/30 transition-colors">
                                    <div className="p-3 bg-blue-500/10 text-blue-400 shrink-0 rounded-none border border-blue-500/20">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Expected Outcome</h4>
                                        <p className="text-sm text-white font-medium leading-relaxed">{data.executiveSummary.expectedOutcome}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Strategic Context & Market Benchmark */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">Strategic Context</h4>
                                    <p className="text-sm text-purple-900 dark:text-purple-100 font-medium italic">"{data.executiveSummary.strategicContext}"</p>
                                </div>
                                <div className="p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                                    <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Market Benchmark</h4>
                                    <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">{data.executiveSummary.marketBenchmark}</p>
                                </div>
                            </div>

                            {/* Immediate Next Steps */}
                            <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Immediate Next Steps</h4>
                                <div className="flex flex-wrap gap-4">
                                    {data.executiveSummary.immediateNextSteps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-xs font-bold border border-slate-300 dark:border-slate-700">{i + 1}</div>
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* 2. HYPOTHESIS DEFINITION */}
                        <section id="section-definition" className="space-y-6">
                            <SectionHeader title="Hypothesis Definition" icon={Lightbulb} subtitle="Structured problem statement and assumptions" color="purple" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <GridCard label="Research Question" value={data.hypothesisDefinition.question} />
                                <GridCard label="Business Problem" value={data.hypothesisDefinition.businessProblem} />
                                <GridCard label="Null Hypothesis" value={data.hypothesisDefinition.nullHypothesis} subtext="Baseline assumption" />
                                <GridCard label="Alternate Hypothesis" value={data.hypothesisDefinition.alternateHypothesis} subtext="Proposed impact" highlight />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Key Assumptions</h4>
                                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            Stakeholder: {data.hypothesisDefinition.stakeholderObjective}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {data.hypothesisDefinition.assumptions.map((a, i) => (
                                            <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                                                <div className="w-1.5 h-1.5 bg-purple-500 shadow-[0_0_4px_rgba(168,85,247,0.5)]" />
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Theoretical Basis</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 italic font-medium">{data.hypothesisDefinition.theoreticalBasis}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                                        <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">Stakeholder Quotes</h4>
                                        <ul className="space-y-3">
                                            {data.hypothesisDefinition.stakeholderQuotes.map((q, i) => (
                                                <li key={i} className="text-xs text-blue-900 dark:text-blue-200 italic leading-relaxed pl-3 border-l-2 border-blue-300 dark:border-blue-700">
                                                    {q}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Previous Attempts</h4>
                                        <ul className="space-y-1">
                                            {data.hypothesisDefinition.previousAttempts.map((att, i) => (
                                                <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                    <X className="w-3 h-3 text-slate-400" />
                                                    {att}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. DATA & TARGET */}
                        <section id="section-data" className="space-y-6">
                            <SectionHeader title="Data & Target Segment" icon={Database} subtitle="Source reliability and audience profile" color="emerald" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <GridCard label="Audience" value={data.targetSegment.audienceType} />
                                <GridCard label="Sample Size" value={data.targetSegment.sampleSize} />
                                <GridCard label="Geography" value={data.targetSegment.geography} />
                                <GridCard label="Channel" value={data.targetSegment.channelSource.split(',')[0]} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Demographics</h4>
                                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                        <li className="flex justify-between"><span>Age:</span> <strong className="text-slate-900 dark:text-white">{data.targetSegment.demographics.ageRange}</strong></li>
                                        <li className="flex justify-between"><span>Gender:</span> <strong className="text-slate-900 dark:text-white">{data.targetSegment.demographics.gender}</strong></li>
                                        <li className="flex justify-between"><span>Education:</span> <strong className="text-slate-900 dark:text-white">{data.targetSegment.demographics.education}</strong></li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Financial Profile</h4>
                                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                        <li className="flex justify-between"><span>Income:</span> <strong className="text-slate-900 dark:text-white">{data.targetSegment.financialFilters.incomeRange}</strong></li>
                                        <li className="flex justify-between"><span>Loan Amt:</span> <strong className="text-slate-900 dark:text-white">{data.targetSegment.financialFilters.loanAmount}</strong></li>
                                        <li className="flex justify-between"><span>Budget:</span> <strong className="text-slate-900 dark:text-white">{data.targetSegment.financialFilters.budgetRange}</strong></li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Intent Signals</h4>
                                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                        <li className="flex justify-between"><span>Timeframe:</span> <strong className="text-slate-900 dark:text-white">{data.targetSegment.intentSignals.timeframe}</strong></li>
                                        <li className="flex justify-between"><span>Urgency:</span> <strong className="text-slate-900 dark:text-white">{data.targetSegment.intentSignals.urgency}</strong></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">Psychographics</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.targetSegment.psychographics.map((psy, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/50 dark:bg-white/10 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-800 dark:text-indigo-200 rounded-full">
                                                {psy}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Device Breakdown</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-16 text-xs text-slate-500">Mobile ({data.targetSegment.deviceBreakdown.mobile}%)</span>
                                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${data.targetSegment.deviceBreakdown.mobile}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-16 text-xs text-slate-500">Desktop ({data.targetSegment.deviceBreakdown.desktop}%)</span>
                                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500" style={{ width: `${data.targetSegment.deviceBreakdown.desktop}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Exclusion Criteria</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {data.targetSegment.exclusionCriteria.map((ex, i) => (
                                                <span key={i} className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                    {ex}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Integrated Data Sources</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {data.dataSources.integrations.map((int, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold tracking-wide">
                                                    {int}
                                                </span>
                                            ))}
                                            {data.dataSources.behavioralData.map((beh, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-500/20 text-xs font-bold tracking-wide text-blue-200">
                                                    {beh}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Key Drop-off Points</h4>
                                        <ul className="space-y-2">
                                            {data.dataSources.dropOffPoints.map((pt, i) => (
                                                <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                                    {pt}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-3xl"></div>
                            </div>
                        </section>

                        {/* 4. CORE FINDINGS */}
                        <section id="section-findings" className="space-y-6">
                            <SectionHeader title="Core Findings" icon={Target} subtitle="Detailed breakdown of the analysis" color="blue" />
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Funnel Visualization</h4>
                                        <MiniChart data={data.visualization.data} />
                                        <div className="mt-6 flex items-center justify-center gap-8">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-slate-300 rounded-none"></div>
                                                <span className="text-sm font-medium text-slate-500">Baseline Performance</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded-none shadow-[0_0_4px_rgba(59,130,246,0.6)]"></div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">Variant Projection</span>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Behavioral Explanation</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                                "{data.coreFindings.behavioralExplanation}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* User Verbatims */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.coreFindings.userVerbatims.map((verb, i) => (
                                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-lg relative">
                                                <div className="absolute top-2 left-2 text-slate-300 text-2xl font-serif">"</div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 italic relative z-10 pl-4">{verb.replace(/"/g, '')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Key Evidence</h4>
                                        <ul className="space-y-4">
                                            {data.coreFindings.evidence.map((e, i) => (
                                                <li key={i} className="text-sm text-slate-700 dark:text-slate-200 flex gap-3 leading-relaxed">
                                                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                                    {e}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Segment Specifics</h4>
                                            <ul className="space-y-2">
                                                {data.coreFindings.segmentSpecifics.map((seg, i) => (
                                                    <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                                                        <div className="w-1 h-1 bg-slate-400 rounded-full mt-1.5" />
                                                        {seg}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                                        <h4 className="text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">Critical Observation</h4>
                                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100 leading-relaxed">{data.coreFindings.pattern}</p>
                                    </div>
                                    <div className="p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Temporal Insight</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{data.coreFindings.dayOfWeekTrends}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. STATISTICAL VALIDATION */}
                        <section id="section-stats" className="space-y-6">
                            <SectionHeader title="Statistical Validation" icon={Beaker} subtitle="Confidence intervals and significance tests" color="orange" />
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <GradientStatCard
                                    label="Method"
                                    value={data.statisticalAnalysis.method.split(' ')[0]}
                                    subtext="Bayesian Update"
                                    gradient="bg-slate-800"
                                    icon={Beaker}
                                />
                                <GradientStatCard
                                    label="P-Value"
                                    value={data.statisticalAnalysis.significance.toString()}
                                    subtext="Strong Significance"
                                    gradient="bg-slate-800"
                                    icon={Target}
                                />
                                <GradientStatCard
                                    label="Power"
                                    value={data.statisticalAnalysis.powerAnalysis.split(' ')[2]}
                                    subtext="High Probability"
                                    gradient="bg-slate-800"
                                    icon={Zap}
                                />
                                <GradientStatCard
                                    label="Margin of Error"
                                    value={data.statisticalAnalysis.marginOfError.split(' ')[0]}
                                    subtext="95% Confidence"
                                    gradient="bg-slate-800"
                                    icon={Shield}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="col-span-2 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Confidence Interval</h4>
                                    <div className="h-32 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 relative">
                                        {/* Visualization of CI - simplified */}
                                        <div className="w-[80%] h-1 bg-slate-200 dark:bg-slate-600 rounded-full relative">
                                            <div className="absolute top-1/2 -translate-y-1/2 left-[38%] right-[54%] h-3 bg-blue-500/30 rounded-full"></div>
                                            <div className="absolute top-1/2 -translate-y-1/2 left-[42%] w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10"></div>
                                            <div className="absolute top-6 left-[38%] text-xs text-slate-500">{data.statisticalAnalysis.confidenceInterval[0]}</div>
                                            <div className="absolute top-6 right-[54%] text-xs text-slate-500">{data.statisticalAnalysis.confidenceInterval[1]}</div>
                                            <div className="absolute -top-6 left-[42%] -translate-x-1/2 text-xs font-bold text-blue-500">{data.statisticalAnalysis.effectSize} Effect Size</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                                        <span>Sample Adequacy: <strong className="text-emerald-500">{data.statisticalAnalysis.sampleAdequacy}</strong></span>
                                        <span>Bias: <strong className="text-emerald-500">{data.statisticalAnalysis.biasDetection}</strong></span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-5 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                                        <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">Alternative Tests</h4>
                                        <ul className="space-y-2">
                                            {data.statisticalAnalysis.alternativeTests.map((test, i) => (
                                                <li key={i} className="text-xs text-orange-900 dark:text-orange-200 flex items-center gap-2">
                                                    <Beaker className="w-3 h-3" />
                                                    {test}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 6. BUSINESS IMPACT */}

                        <section id="section-impact" className="space-y-6">
                            <SectionHeader title="Business Impact" icon={DollarSign} subtitle="ROI and long-term value projection" color="emerald" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full group-hover:bg-white/20 transition-all" />
                                    <h4 className="text-xs font-bold text-emerald-100 uppercase tracking-wider mb-2">Projected Revenue</h4>
                                    <div className="text-3xl font-black mb-1">{data.businessImpact.revenueImpact.split(' ')[0]}</div>
                                    <div className="text-xs text-emerald-100 font-medium">Per Quarter (Recurring)</div>
                                </div>
                                <div className="p-6 bg-slate-900 border border-slate-800 shadow-md">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Conversion Uplift</h4>
                                    <div className="text-2xl font-bold text-white mb-1">{data.businessImpact.conversionUplift}</div>
                                    <div className="text-xs text-slate-500">From baseline {data.keyMetrics.baseline.conversion}%</div>
                                </div>
                                <div className="p-6 bg-slate-900 border border-slate-800 shadow-md">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">NPS Impact</h4>
                                    <div className="text-2xl font-bold text-white mb-1">{data.businessImpact.npsLift}</div>
                                    <div className="text-xs text-slate-500">Customer sentiment score</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <GridCard label="Cost Reduction" value={data.businessImpact.costReduction} icon={DollarSign} />
                                <GridCard label="Risk Reduction" value={data.businessImpact.riskReduction} icon={Shield} />
                                <GridCard label="Time to Value" value={data.businessImpact.timeToValue} icon={Zap} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Long Term Value (LTV)</h4>
                                    <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{data.businessImpact.longTermValue}</p>
                                </div>
                                <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Brand Perception</h4>
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{data.businessImpact.brandPerception}</p>
                                </div>
                            </div>
                        </section>

                        {/* 7. ACTION PLAN */}
                        <section id="section-action" className="space-y-6">
                            <SectionHeader title="Action Plan" icon={Zap} subtitle="Execution strategy and experiment design" color="blue" />

                            {/* Experiment Design */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-8 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Beaker className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Experiment Design</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Test Type</h4>
                                            <div className="inline-flex px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-100 dark:border-blue-900/50">
                                                {data.experimentPlan.testType}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Duration</h4>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{data.experimentPlan.duration}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Success Metrics</h4>
                                            <ul className="space-y-2">
                                                {data.experimentPlan.successMetrics.map((m, i) => (
                                                    <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                        {m}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4 md:pt-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-8">
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Control (A)</h4>
                                            <p className="text-sm text-slate-500">{data.experimentPlan.control}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Variant (B)</h4>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-3 border-l-2 border-blue-500">
                                                {data.experimentPlan.test}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Resource Requirements</h4>
                                    <ul className="space-y-2">
                                        {data.experimentPlan.resourceRequirements.map((res, i) => (
                                            <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                                {res}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Communication Strategy</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{data.experimentPlan.communicationStrategy}</p>
                                </div>
                            </div>

                            {/* Implementation Readiness */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Est. Effort</h4>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">{data.implementationReadiness.estimatedEffort}</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tech Dependency</h4>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{data.implementationReadiness.techDependency}</span>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Go-Live</h4>
                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{data.implementationReadiness.goLiveTimeline}</span>
                                </div>
                            </div>

                            {/* Action Tracking */}
                            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-l-4 border-blue-500 shadow-lg">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Owner</h4>
                                    <p className="text-sm font-bold">{data.actionTracking.owner}</p>
                                </div>
                                <div className="text-right">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</h4>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-none">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse rounded-full" />
                                        {data.actionTracking.status}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* 8. RISKS & AI */}
                        <section id="section-risks" className="space-y-6 pb-24">
                            <SectionHeader title="Risks & AI Reasoning" icon={Shield} subtitle="Limitations and model interpretability" color="rose" />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Risk Assessment */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-5 h-5 text-rose-500" />
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Risk Assessment</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30">
                                            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">Data Limitations</h4>
                                            <p className="text-sm text-rose-900 dark:text-rose-100">{data.risks.dataLimitations}</p>
                                        </div>
                                        <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                                            <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">External Factors</h4>
                                            <p className="text-sm text-orange-900 dark:text-orange-100">{data.risks.externalFactors}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ethical Considerations</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">{data.risks.ethicalConsiderations}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Reasoning */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-5 h-5 text-purple-500" />
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">AI Model Reasoning</h3>
                                    </div>
                                    <div className="p-6 bg-slate-900 border border-slate-800 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full"></div>
                                        <div className="relative z-10 space-y-6">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Why Generated?</h4>
                                                <p className="text-sm text-slate-300 italic">"{data.aiReasoning.whyGenerated}"</p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Signal Weighting</h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 text-xs">
                                                        <span className="w-24 text-slate-400">Drop-off Signal</span>
                                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-none overflow-hidden">
                                                            <div className="h-full bg-blue-500" style={{ width: `${data.aiReasoning.signalWeighting.dropOffSignal * 100}%` }}></div>
                                                        </div>
                                                        <span className="text-slate-300 font-bold">{(data.aiReasoning.signalWeighting.dropOffSignal * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs">
                                                        <span className="w-24 text-slate-400">Survey Feedback</span>
                                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-none overflow-hidden">
                                                            <div className="h-full bg-purple-500" style={{ width: `${data.aiReasoning.signalWeighting.surveyFeedback * 100}%` }}></div>
                                                        </div>
                                                        <span className="text-slate-300 font-bold">{(data.aiReasoning.signalWeighting.surveyFeedback * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs">
                                                        <span className="w-24 text-slate-400">Behavioral</span>
                                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-none overflow-hidden">
                                                            <div className="h-full bg-emerald-500" style={{ width: `${data.aiReasoning.signalWeighting.behavioral * 100}%` }}></div>
                                                        </div>
                                                        <span className="text-slate-300 font-bold">{(data.aiReasoning.signalWeighting.behavioral * 100).toFixed(0)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-slate-800">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Model Info</h4>
                                                <p className="text-xs text-slate-400 block mb-1">{data.risks.modelTrainingInfo}</p>
                                                <p className="text-xs text-slate-400 block">{data.risks.falsePositiveAnalysis}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
