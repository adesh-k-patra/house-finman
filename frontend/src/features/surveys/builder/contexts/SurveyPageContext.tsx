
import { createContext, useContext, useState, ReactNode } from 'react'

// ============================================================================
// TYPES
// ============================================================================

export type MainTab = 'overview' | 'analytics' | 'hypotheses' | 'followups' | 'responses' | 'applicants' | 'settings'
export type BuilderView = 'qa' | 'flowchart' | 'tree'
export type QuestionType = 'mcq' | 'text' | 'rating' | 'scale' | 'yes_no' | 'nps' | 'date' | 'file' | 'dropdown' | 'matrix'
export type ChartType = 'bar' | 'pie' | 'line' | 'area' | 'heatmap' | 'scatter' | 'funnel' | 'radar'
export type LogicType = 'independent' | 'dependent' // Independent (Merge) vs Dependent (Split)

export interface QuestionOption {
    id: string
    text: string
    score?: number
    nextQuestionId?: string // Used if logicType is 'dependent'
}

export interface Question {
    id: string
    type: QuestionType
    text: string
    description?: string
    required: boolean
    options: QuestionOption[]
    parentId?: string
    parentOptionId?: string
    level: number
    order: number
    logicType: LogicType
    nextQuestionId?: string // Used if logicType is 'independent'
    children?: Question[]

    // Visual & Advanced
    color?: string
    visualization?: 'bar' | 'pie' | 'line' | 'metric' | 'table' | 'funnel'
    dataConfig?: {
        source?: string
        metric?: string
    }
    validation?: {
        min?: number
        max?: number
        pattern?: string
        errorMessage?: string
    }
    media?: {
        imageUrl?: string
        videoUrl?: string
        altText?: string
    }
    advancedConfig?: {
        identifier?: string
        tags?: string[]
        analyticsCategory?: string
        hidden?: boolean
    }
    // Logic shim for compatibility if needed, though we prefer options-based
    logic?: { id: string; triggerOptionId: string; targetQuestionId: string }[]
}

export interface AnalyticsCardData {
    id: string
    title: string
    viewType: AnalyticsViewType
    dataLogic: string
    chartData: any
    isAIGenerated: boolean
    isPinned?: boolean
    description: string
    metric: string
    trend: string
    type: ChartType // Deprecated in favor of viewType, keeping for compatibility
}

export type IntegrationType = 'google_ads' | 'meta_ads' | 'linkedin_ads' | 'csv' | 'api' | 'manual'
export type ConnectionStatus = 'connected' | 'disconnected' | 'syncing' | 'error'

export interface IntegrationData {
    id: string
    type: IntegrationType
    name: string
    status: ConnectionStatus
    lastSync: string
    audienceSize: number
    campaigns?: string[]
}

export interface SocialProfile {
    platform: 'linkedin' | 'twitter' | 'instagram' | 'facebook' | 'website'
    url: string
}



export interface Response {
    id: string
    user: string
    submittedAt: string
    answers: Record<string, string> // qId -> answer
    completionTime: string
}

export interface CommunicationLog {
    id: string
    type: 'email' | 'sms' | 'whatsapp' | 'system' | 'call'
    direction: 'inbound' | 'outbound'
    content: string
    timestamp: string
    status: 'sent' | 'delivered' | 'read' | 'failed'
    subject?: string
}

export type ChannelPreference = 'email' | 'whatsapp' | 'sms' | 'push'

export interface Applicant {
    id: string
    name: string
    email: string
    phone?: string
    whatsapp?: string
    location: string
    jobTitle?: string
    company?: string

    // Status & Scoring
    status: 'new' | 'contacted' | 'qualified' | 'rejected'
    score: number
    completeness: number // 0-100
    expectedValue: number // Potential revenue in currency units

    // Source Info
    source: IntegrationType
    sourceDetail?: string // e.g. "Campaign A"
    dateAdded: string
    lastActive: string

    // CRM Data
    tags: string[]
    customFields: Record<string, string>
    socialProfiles: SocialProfile[]
    notes: string[]
    contactChannels: ChannelPreference[]
    communications: CommunicationLog[]

    // Targeting
    budget: string
    interests: string[]
}

export interface ChatMessage {
    id: string
    role: 'user' | 'ai'
    content: string
    timestamp: Date
}

// ============================================================================
// EXTENDED TYPES (From Builder Context)
// ============================================================================

export type SurveyMedium = 'mobile_web' | 'desktop_web' | 'sms' | 'whatsapp' | 'email' | 'in_app' | 'qr_code'
export type SurveyStatus = 'draft' | 'active' | 'ended' | 'pending'
export type CreationMode = 'ai' | 'manual'
export type ViewMode = 'config' | 'followups' | 'analytics' | 'hypotheses' | 'settings'
export type FollowUpViewType = 'qa_list' | 'flowchart' | 'logic_map'
export type AnalyticsViewType = 'chart' | 'graph' | 'table' | 'heatmap' | 'funnel' | 'trend' | 'distribution' | 'comparison' | 'radar' | 'radialbar' | 'scatter' | 'donut' | 'treemap' | 'waterfall' | 'pareto' | 'composed'

export interface SurveySettings {
    id: string
    name: string
    description: string
    status: SurveyStatus
    mediums: SurveyMedium[]
    industryTags: string[]
    createdAt: string
    updatedAt: string
    startDate: string | null
    endDate: string | null
    timezone: string
    recurring: 'once' | 'daily' | 'weekly' | 'monthly'
    targetResponses: number
    creationMode: CreationMode
}

export interface AnalyticsCard {
    id: string
    title: string
    viewType: AnalyticsViewType
    dataLogic: string
    chartData: any
    isAIGenerated: boolean
    isPinned?: boolean
    description?: string // Compatibility with AnalyticsCardData
    metric?: string     // Compatibility
    trend?: string      // Compatibility
    type?: ChartType    // Compatibility
}

export interface Hypothesis {
    id: string
    insight: string
    supportingMetrics: string
    recommendation: string
    dismissed: boolean
}

// ============================================================================
// SURVEY CONTEXT
// ============================================================================

interface SurveyContextType {
    // State
    surveyName: string
    activeTab: MainTab
    builderView: BuilderView
    aiDrawerOpen: boolean
    selectedQuestionId: string | null
    questions: Question[]
    chatMessages: ChatMessage[]
    expandedNodes: Set<string>
    isWizardOpen: boolean
    isSimulatorOpen: boolean
    simulatorMode: 'preview' | 'replay'
    replayResponse: Response | null

    // New Advanced Features State
    // New Advanced Features State
    mediums: string[]
    scheduledDate: Date | null
    endDate: Date | null
    region: string
    demography: string
    segment: string
    responseGoal: number
    // Updated to use the unified type
    analyticsCards: AnalyticsCardData[]
    applicants: Applicant[]
    responses: Response[]

    // Actions
    setSurveyName: (name: string) => void
    setActiveTab: (tab: MainTab) => void
    setBuilderView: (view: BuilderView) => void
    toggleAIDrawer: () => void
    selectQuestion: (id: string | null) => void
    toggleNodeExpansion: (nodeId: string) => void
    sendMessage: (content: string, skipAutoReply?: boolean) => void
    sendAIMessage: (content: string) => void
    closeWizard: () => void
    openSimulator: () => void
    closeSimulator: () => void
    startSimulation: (response: Response) => void
    updateSurveySettings: (mediums: string[], date: Date | null, goal: number) => void
    updateAnalyticsCard: (id: string, updates: Partial<AnalyticsCardData>) => void
    reorderQuestions: (newQuestions: Question[]) => void
    addQuestion: (parentId: string | null) => string
    deleteQuestion: (id: string) => void
    duplicateQuestion: (id: string) => void
    updateQuestion: (id: string, updates: Partial<Question>) => void
    deleteAnalyticsCard: (id: string) => void
    addAnalyticsCard: () => void
    addBranch: (parentId: string, triggerOptionId: string) => void
    addApplicant: (applicant: Partial<Applicant>) => void
    setMediums: (mediums: string[]) => void
    setScheduledDate: (date: Date | null) => void
    setEndDate: (date: Date | null) => void
    setRegion: (region: string) => void
    setDemography: (demography: string) => void
    setSegment: (segment: string) => void
    // Unified View State
    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void
    followUpViewType: FollowUpViewType
    setFollowUpViewType: (type: FollowUpViewType) => void

    // Unified Data State
    hypotheses: Hypothesis[]
    settings: SurveySettings // Replaces individual settings if possible, but keeping both for now

    // Actions
    updateSettings: (updates: Partial<SurveySettings>) => void
    dismissHypothesis: (id: string) => void
    reorderAnalyticsCards: (cards: AnalyticsCardData[]) => void // Using the Data type or Unified type? Let's use AnalyticsCardData as it is the current context type

    // Actions
    setResponseGoal: (goal: number) => void
}

export const SurveyContext = createContext<SurveyContextType | null>(null)

export function useSurvey() {
    const ctx = useContext(SurveyContext)
    if (!ctx) throw new Error('useSurvey within Provider')
    return ctx
}

// --- MASSIVE SURVEY DATA ---
// ... (Keep existing data generation code - omitted for brevity in replace block if not changing logic, but tool needs contiguous block. 
// actually I can't skip the middle lines effortlessly without multi_replace or a huge block. 
// I will just target the specific blocks in SurveyProvider components and Context Interface separately if they were far apart, 
// but here I need to change Interface AND Provider. 
// The Interface is at top, Provider at bottom. I should use multi_replace.
// Wait, I can use replace_file_content for the interface, then another for the provider.


// --- MASSIVE SURVEY DATA ---

const INITIAL_QUESTIONS: Question[] = [
    // ROOT: Location
    {
        id: 'q3', type: 'mcq', text: 'Which area/locality are you interested in?', required: true, level: 0, order: 2, logicType: 'dependent',
        options: [
            { id: 'q3-a', text: 'Whitefield', nextQuestionId: 'q3-1' },
            { id: 'q3-b', text: 'Electronic City', nextQuestionId: 'q3-2' },
            { id: 'q3-c', text: 'Sarjapur Road' },
            { id: 'q3-d', text: 'Hebbal' },
            { id: 'q3-e', text: 'Bangalore North' },
            { id: 'q3-f', text: 'Other' }
        ],
        children: [
            { id: 'q3-1', type: 'mcq', text: 'Whitefield zone?', required: false, level: 1, order: 0, parentId: 'q3', parentOptionId: 'q3-a', logicType: 'independent', options: [{ id: 'q3-1-a', text: 'EPIP Zone' }, { id: 'q3-1-b', text: 'Forum Mall area' }, { id: 'q3-1-c', text: 'Varthur side' }], children: [] },
            { id: 'q3-2', type: 'mcq', text: 'EC Phase?', required: false, level: 1, order: 1, parentId: 'q3', parentOptionId: 'q3-b', logicType: 'independent', options: [{ id: 'q3-2-a', text: 'Phase 1' }, { id: 'q3-2-b', text: 'Phase 2' }, { id: 'q3-2-c', text: 'Bommasandra' }], children: [] }
        ]
    },
    // ROOT: Timeline
    {
        id: 'q4', type: 'mcq', text: 'When are you planning to make the purchase?', required: true, level: 0, order: 3, logicType: 'dependent',
        options: [
            { id: 'q4-a', text: 'Immediately (within 1 month)', nextQuestionId: 'q4-1' },
            { id: 'q4-b', text: '1-3 months', nextQuestionId: 'q4-2' },
            { id: 'q4-c', text: '3-6 months' },
            { id: 'q4-d', text: '6-12 months' },
            { id: 'q4-e', text: 'Just exploring' }
        ],
        children: [
            { id: 'q4-1', type: 'yes_no', text: 'Would you like to schedule a site visit this week?', required: true, level: 1, order: 0, parentId: 'q4', parentOptionId: 'q4-a', logicType: 'independent', options: [{ id: 'q4-1-a', text: 'Yes, this week' }, { id: 'q4-1-b', text: 'Next week' }, { id: 'q4-1-c', text: 'Not yet' }], children: [] },
            { id: 'q4-2', type: 'mcq', text: 'What\'s your availability for site visits?', required: false, level: 1, order: 1, parentId: 'q4', parentOptionId: 'q4-b', logicType: 'independent', options: [{ id: 'q4-2-a', text: 'Weekdays' }, { id: 'q4-2-b', text: 'Weekends only' }, { id: 'q4-2-c', text: 'Flexible' }], children: [] }
        ]
    },
    // ROOT: Loan Intent
    {
        id: 'q5', type: 'yes_no', text: 'Are you planning to take a home loan?', required: true, level: 0, order: 4, logicType: 'dependent',
        options: [
            { id: 'q5-a', text: 'Yes', nextQuestionId: 'q5-1' },
            { id: 'q5-b', text: 'No, self-funded' }
        ],
        children: [
            {
                id: 'q5-1', type: 'mcq', text: 'Preferred bank for home loan?', required: false, level: 1, order: 0, parentId: 'q5', parentOptionId: 'q5-a', logicType: 'dependent', options: [
                    { id: 'q5-1-a', text: 'HDFC Bank', nextQuestionId: 'q5-1-1' },
                    { id: 'q5-1-b', text: 'ICICI Bank' },
                    { id: 'q5-1-c', text: 'SBI' },
                    { id: 'q5-1-d', text: 'Axis Bank' },
                    { id: 'q5-1-e', text: 'No preference' }
                ], children: [
                    { id: 'q5-1-1', type: 'yes_no', text: 'Already have HDFC account?', required: false, level: 2, order: 0, parentId: 'q5-1', parentOptionId: 'q5-1-a', logicType: 'independent', options: [{ id: 'q5-1-1-a', text: 'Yes' }, { id: 'q5-1-1-b', text: 'No' }], children: [] }
                ]
            }
        ]
    },
    // ROOT: Purpose
    {
        id: 'q6', type: 'mcq', text: 'What is the purpose of this property?', required: true, level: 0, order: 5, logicType: 'independent',
        options: [
            { id: 'q6-a', text: 'Self-use (Primary Home)' },
            { id: 'q6-b', text: 'Investment (Rental)' },
            { id: 'q6-c', text: 'Second Home' },
            { id: 'q6-d', text: 'Parents/Family' }
        ],
        children: []
    },
    // ROOT: Amenities
    {
        id: 'q7', type: 'mcq', text: 'Which amenities are most important to you?', required: true, level: 0, order: 6, logicType: 'dependent',
        options: [
            { id: 'q7-a', text: 'Swimming Pool & Gym', nextQuestionId: 'q7-1' },
            { id: 'q7-b', text: 'Clubhouse & Party Hall' },
            { id: 'q7-c', text: 'Kids Play Area & Gardens' },
            { id: 'q7-d', text: 'Security & Parking' },
            { id: 'q7-e', text: 'All of the above' }
        ],
        children: [
            { id: 'q7-1', type: 'mcq', text: 'Pool type preference?', required: false, level: 1, order: 0, parentId: 'q7', parentOptionId: 'q7-a', logicType: 'independent', options: [{ id: 'q7-1-a', text: 'Infinity pool' }, { id: 'q7-1-b', text: 'Lap pool' }, { id: 'q7-1-c', text: 'Kids pool' }, { id: 'q7-1-d', text: 'Any' }], children: [] }
        ]
    },
    // ROOT: Work Location
    { id: 'q8', type: 'text', text: 'Where is your primary workplace?', required: false, level: 0, order: 7, logicType: 'independent', options: [], children: [] },
    // ROOT: Rating
    {
        id: 'q9', type: 'rating', text: 'How would you rate your home buying experience so far?', required: false, level: 0, order: 8, logicType: 'dependent',
        options: [
            { id: 'q9-1', text: '1' }, { id: 'q9-2', text: '2', nextQuestionId: 'q9-1' }, { id: 'q9-3', text: '3' }, { id: 'q9-4', text: '4' }, { id: 'q9-5', text: '5' }
        ],
        children: [
            { id: 'q9-1', type: 'mcq', text: 'What challenges have you faced?', required: false, level: 1, order: 0, parentId: 'q9', parentOptionId: 'q9-2', logicType: 'independent', options: [{ id: 'q9-1-a', text: 'Loan process' }, { id: 'q9-1-b', text: 'Price negotiations' }, { id: 'q9-1-c', text: 'Documentation' }, { id: 'q9-1-d', text: 'Finding right property' }], children: [] }
        ]
    },
    // ROOT: NPS
    {
        id: 'q10', type: 'nps', text: 'How likely are you to recommend our services?', required: true, level: 0, order: 9, logicType: 'dependent',
        options: [
            { id: 'q10-0', text: '0' }, { id: 'q10-1', text: '1' }, { id: 'q10-2', text: '2' }, { id: 'q10-3', text: '3' }, { id: 'q10-4', text: '4' },
            { id: 'q10-5', text: '5' }, { id: 'q10-6', text: '6' }, { id: 'q10-7', text: '7' }, { id: 'q10-8', text: '8' },
            { id: 'q10-9', text: '9', nextQuestionId: 'q10-1' }, { id: 'q10-10', text: '10', nextQuestionId: 'q10-1' }
        ],
        children: [
            { id: 'q10-1', type: 'mcq', text: 'Would you like to join our referral program?', required: false, level: 1, order: 0, parentId: 'q10', parentOptionId: 'q10-9', logicType: 'independent', options: [{ id: 'q10-1-a', text: 'Yes, sign me up!' }, { id: 'q10-1-b', text: 'Maybe later' }, { id: 'q10-1-c', text: 'No thanks' }], children: [] }
        ]
    },
    // ROOT: Move-in date
    { id: 'q11', type: 'date', text: 'When do you prefer to move in?', required: false, level: 0, order: 10, logicType: 'independent', options: [], children: [] },
    // ROOT: Document upload
    { id: 'q12', type: 'file', text: 'Upload income proof documents (optional)', required: false, level: 0, order: 11, logicType: 'independent', options: [], children: [] },
    // ROOT: Feature Matrix
    {
        id: 'q13', type: 'matrix', text: 'Rate importance of these features (1-5)', required: false, level: 0, order: 12, logicType: 'independent',
        options: [
            { id: 'q13-a', text: 'Modern Kitchen' }, { id: 'q13-b', text: 'Balcony/Terrace' }, { id: 'q13-c', text: 'Parking Space' },
            { id: 'q13-d', text: 'Power Backup' }, { id: 'q13-e', text: 'Water Supply' }
        ],
        children: []
    },
    // ROOT: Contact Preference
    {
        id: 'q14', type: 'mcq', text: 'How would you prefer us to contact you?', required: true, level: 0, order: 13, logicType: 'dependent',
        options: [
            { id: 'q14-a', text: 'Phone Call', nextQuestionId: 'q14-1' },
            { id: 'q14-b', text: 'WhatsApp' },
            { id: 'q14-c', text: 'Email' },
            { id: 'q14-d', text: 'SMS' }
        ],
        children: [
            { id: 'q14-1', type: 'mcq', text: 'Best time to call?', required: false, level: 1, order: 0, parentId: 'q14', parentOptionId: 'q14-a', logicType: 'independent', options: [{ id: 'q14-1-a', text: 'Morning (9-12)' }, { id: 'q14-1-b', text: 'Afternoon (12-4)' }, { id: 'q14-1-c', text: 'Evening (4-8)' }, { id: 'q14-1-d', text: 'Anytime' }], children: [] }
        ]
    },
    // ROOT: Additional Comments
    { id: 'q15', type: 'text', text: 'Any additional requirements or comments?', required: false, level: 0, order: 14, logicType: 'independent', options: [], children: [] }
]

const GENERATE_ANALYTICS = (): AnalyticsCardData[] => [
    { id: 'a1', title: 'Completion Rate', viewType: 'trend', type: 'line', description: 'Daily completion trend', metric: '68%', trend: '+5%', dataLogic: 'Daily completion rates', chartData: {}, isAIGenerated: false },
    { id: 'a2', title: 'Device Breakdown', viewType: 'distribution', type: 'pie', description: 'User device types', metric: 'Mobile 72%', trend: '+2%', dataLogic: 'Device usage stats', chartData: {}, isAIGenerated: false },
    { id: 'a3', title: 'Avg. Time Spent', viewType: 'chart', type: 'bar', description: 'Time per section', metric: '3m 12s', trend: '-10s', dataLogic: 'Time per section', chartData: {}, isAIGenerated: false },
    { id: 'a4', title: 'Drop-off Points', viewType: 'funnel', type: 'funnel', description: 'Where users leave', metric: 'Q4 (Income)', trend: '-2%', dataLogic: 'Drop-off analysis', chartData: {}, isAIGenerated: true },
    { id: 'a5', title: 'Sentiment Analysis', viewType: 'heatmap', type: 'heatmap', description: 'Open text sentiment', metric: 'Positive', trend: '+12%', dataLogic: 'Sentiment heatmap', chartData: {}, isAIGenerated: true },
    { id: 'a6', title: 'Location Heatmap', viewType: 'heatmap', type: 'heatmap', description: 'User geography', metric: 'Top: Mumbai', trend: 'stable', dataLogic: 'Geographic distribution', chartData: {}, isAIGenerated: false },
    { id: 'a7', title: 'Budget Distribution', viewType: 'chart', type: 'bar', description: 'User budget ranges', metric: '₹50L-1Cr', trend: '+8%', dataLogic: 'Budget range breakdown', chartData: {}, isAIGenerated: false },
    { id: 'a8', title: 'Occupation Mix', viewType: 'distribution', type: 'pie', description: 'User professions', metric: 'Salaried', trend: '+1%', dataLogic: 'Occupation types', chartData: {}, isAIGenerated: false },
    { id: 'a9', title: 'Loan Intent', viewType: 'radar', type: 'radar', description: 'Purpose of loan', metric: 'Home Purchase', trend: '+5%', dataLogic: 'Loan intent analysis', chartData: {}, isAIGenerated: true },
    { id: 'a10', title: 'Credit Score Est.', viewType: 'scatter', type: 'scatter', description: 'Self-reported score', metric: '750+', trend: '+3%', dataLogic: 'Credit score correlation', chartData: {}, isAIGenerated: true },
    { id: 'a11', title: 'Feature Interest', viewType: 'chart', type: 'bar', description: 'Amenities ranked', metric: 'Pool, Gym', trend: 'stable', dataLogic: 'Feature preference', chartData: {}, isAIGenerated: false },
    { id: 'a12', title: 'Contact Preference', viewType: 'distribution', type: 'pie', description: 'Preferred channel', metric: 'WhatsApp', trend: '+15%', dataLogic: 'Contact channels', chartData: {}, isAIGenerated: false },
    { id: 'a13', title: 'NPS Score', viewType: 'trend', type: 'line', description: 'Net Promoter Score trend', metric: '72', trend: '+8', dataLogic: 'NPS over time', chartData: {}, isAIGenerated: false },
    { id: 'a14', title: 'Response Rate', viewType: 'graph', type: 'area', description: 'Daily responses', metric: '156/day', trend: '+23%', dataLogic: 'Response velocity', chartData: {}, isAIGenerated: false },
    { id: 'a15', title: 'Question Engagement', viewType: 'chart', type: 'bar', description: 'Time per question', metric: 'Q3: 45s', trend: '-5s', dataLogic: 'Engagement/time per question', chartData: {}, isAIGenerated: false },
    { id: 'a16', title: 'Age Demographics', viewType: 'distribution', type: 'pie', description: 'User age groups', metric: '25-35: 48%', trend: '+4%', dataLogic: 'Age group distribution', chartData: {}, isAIGenerated: false },
    { id: 'a17', title: 'Income Bracket', viewType: 'chart', type: 'bar', description: 'Annual income distribution', metric: '₹15-25L', trend: '+6%', dataLogic: 'Income bracket distribution', chartData: {}, isAIGenerated: false },
    { id: 'a18', title: 'Property Type', viewType: 'distribution', type: 'pie', description: 'Preferred property', metric: '2BHK: 42%', trend: '+3%', dataLogic: 'Property type preference', chartData: {}, isAIGenerated: false },
    { id: 'a19', title: 'Financing Timeline', viewType: 'funnel', type: 'funnel', description: 'Purchase timeline', metric: '3-6mo: 35%', trend: '+8%', dataLogic: 'Financing timeline funnel', chartData: {}, isAIGenerated: true },
    { id: 'a20', title: 'Channel Performance', viewType: 'chart', type: 'bar', description: 'Response by channel', metric: 'Mobile: 68%', trend: '+12%', dataLogic: 'Channel effectiveness', chartData: {}, isAIGenerated: false },
]

const GENERATE_APPLICANTS = (): Applicant[] => Array.from({ length: 24 }).map((_, i) => {
    const names = ['John Doe', 'Sarah Smith', 'Michael Johnson', 'Emma Wilson', 'James Brown', 'Emily Davis', 'Robert Miller', 'David Garcia']
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai']
    const sources: IntegrationType[] = ['google_ads', 'meta_ads', 'linkedin_ads', 'manual', 'csv']
    const statuses = ['new', 'contacted', 'qualified', 'rejected'] as const

    return {
        id: `app-${i}`,
        name: names[i % names.length] + ` ${i + 1}`,
        email: `applicant${i + 1}@example.com`,
        phone: `+91 98765 ${10000 + i}`,
        whatsapp: `+91 98765 ${10000 + i}`,
        location: cities[i % cities.length],
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',

        status: statuses[Math.floor(Math.random() * 4)],
        score: Math.floor(Math.random() * 50) + 50,
        completeness: Math.floor(Math.random() * 30) + 70,
        expectedValue: (Math.floor(Math.random() * 90) + 10) * 100000, // 10L to 1Cr

        source: sources[i % sources.length],
        sourceDetail: 'Campaign ' + (i % 3 + 1),
        dateAdded: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString(),

        tags: ['High Value', 'Urgent', 'Investor', 'First-time Buyer'].slice(0, Math.floor(Math.random() * 3)),
        customFields: { 'Experience': '5 years', 'Budget': 'High' },
        socialProfiles: [
            { platform: 'linkedin', url: 'https://linkedin.com/in/example' }
        ],
        notes: ['Interested in 3BHK', 'Call back evening'],
        contactChannels: ['email', 'whatsapp'],
        communications: [
            {
                id: `comm-${i}-1`,
                type: 'system',
                direction: 'inbound',
                content: 'Applicant added via Google Ads',
                timestamp: new Date(Date.now() - 100000000).toISOString(),
                status: 'read'
            },
            {
                id: `comm-${i}-2`,
                type: 'email',
                direction: 'outbound',
                content: 'Welcome to our premium property showcase...',
                subject: 'Welcome!',
                timestamp: new Date(Date.now() - 50000000).toISOString(),
                status: 'delivered'
            }
        ],

        budget: `₹${50 + Math.floor(Math.random() * 100)}L`,
        interests: ['Investment', 'Luxury', 'Gated Community']
    }
})

const GENERATE_RESPONSES = (): Response[] => Array.from({ length: 50 }).map((_, i) => ({
    id: `resp-${i}`,
    user: `User-${1000 + i}`,
    submittedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString(),
    answers: { q1: 'Satisfied', q2: 'Budget > 50L' },
    completionTime: `${2 + Math.floor(Math.random() * 5)}m`
}))

const DEFAULT_SETTINGS: SurveySettings = {
    id: 'survey-' + Date.now(),
    name: 'Untitled Survey',
    description: '',
    status: 'draft',
    mediums: ['mobile_web', 'email'],
    industryTags: ['housing'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: null,
    endDate: null,
    timezone: 'Asia/Kolkata',
    recurring: 'once',
    targetResponses: 500,
    creationMode: 'manual'
}

const DUMMY_HYPOTHESES: Hypothesis[] = [
    {
        id: 'h1',
        insight: 'Buyers with budget ₹50L–1Cr and intent 0–3 months convert 3× faster if prequalified.',
        supportingMetrics: '312 prequalified leads, 78% conversion in this segment',
        recommendation: 'Fast-track prequalification for high-budget, short-timeline leads',
        dismissed: false
    },
    {
        id: 'h2',
        insight: 'Top drop-off at question: "Upload salary proof" — propose one-click upload to reduce churn.',
        supportingMetrics: '45% drop-off at document upload step',
        recommendation: 'Implement one-click salary verification via bank statement OCR',
        dismissed: false
    },
    {
        id: 'h3',
        insight: 'WhatsApp channel has 2.5× higher completion rate than SMS for surveys.',
        supportingMetrics: 'WhatsApp: 68% completion, SMS: 27% completion',
        recommendation: 'Prioritize WhatsApp as primary survey distribution channel',
        dismissed: false
    }
]

export function SurveyProvider({ children }: { children: ReactNode }) {
    const [surveyName, setSurveyName] = useState('New Buyer Survey')
    const [activeTab, setActiveTab] = useState<MainTab>('overview')
    const [builderView, setBuilderView] = useState<BuilderView>('flowchart')
    const [aiDrawerOpen, setAIDrawerOpen] = useState(true)
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
    const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS)
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['q1']))
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{ id: '1', role: 'ai', content: 'Hello! I can help you draft questions. Try asking "Add a logic rule for budget".', timestamp: new Date() }])
    const [isWizardOpen, setIsWizardOpen] = useState(true)
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
    const [simulatorMode, setSimulatorMode] = useState<'preview' | 'replay'>('preview')
    const [replayResponse, setReplayResponse] = useState<Response | null>(null)

    // New State
    const [mediums, setMediums] = useState<string[]>([])
    const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [region, setRegion] = useState<string>('All Regions')
    const [demography, setDemography] = useState<string>('All Demographics')
    const [segment, setSegment] = useState<string>('New Users')
    const [responseGoal, setResponseGoal] = useState<number>(100)
    const [analyticsCards, setAnalyticsCards] = useState<AnalyticsCardData[]>(GENERATE_ANALYTICS())
    const [applicants, setApplicants] = useState<Applicant[]>(GENERATE_APPLICANTS())
    const [responses] = useState<Response[]>(GENERATE_RESPONSES())

    // Unified State
    const [viewMode, setViewMode] = useState<ViewMode>('config')
    const [followUpViewType, setFollowUpViewType] = useState<FollowUpViewType>('flowchart')
    const [hypotheses, setHypotheses] = useState<Hypothesis[]>(DUMMY_HYPOTHESES)
    const [settings, setSettings] = useState<SurveySettings>(DEFAULT_SETTINGS)

    // Helper to sync legacy analytics cards with new features if needed
    // For now we assume they are compatible or we just add fields

    const updateSettings = (updates: Partial<SurveySettings>) => {
        setSettings(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }))
    }

    const dismissHypothesis = (id: string) => {
        setHypotheses(prev => prev.map(h => h.id === id ? { ...h, dismissed: true } : h))
    }

    const reorderAnalyticsCards = (cards: AnalyticsCardData[]) => {
        setAnalyticsCards(cards)
    }

    const toggleNodeExpansion = (nodeId: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev)
            if (next.has(nodeId)) next.delete(nodeId)
            else next.add(nodeId)
            return next
        })
    }

    const reorderQuestions = (newQuestions: Question[]) => {
        setQuestions(newQuestions)
    }

    const addQuestion = (parentId: string | null) => {
        const newQ: Question = {
            id: `q-${Date.now()}`,
            type: 'mcq',
            text: 'New Question',
            required: false,
            level: parentId ? 1 : 0,
            order: questions.length,
            logicType: 'independent',
            options: [],
            children: []
        }
        if (!parentId) setQuestions(prev => [...prev, newQ])
        return newQ.id
    }

    const deleteQuestion = (id: string) => {
        const removeRecursive = (qs: Question[]): Question[] =>
            qs.filter(q => q.id !== id).map(q => ({ ...q, children: q.children ? removeRecursive(q.children) : [] }))
        setQuestions(prev => removeRecursive(prev))
    }

    const duplicateQuestion = (id: string) => {
        const findAndDuplicate = (qs: Question[]): Question[] => {
            const result: Question[] = []
            for (const q of qs) {
                result.push({ ...q, children: q.children ? findAndDuplicate(q.children) : [] })
                if (q.id === id) {
                    result.push({ ...q, id: `q-${Date.now()}`, text: q.text + ' (Copy)', children: [] })
                }
            }
            return result
        }
        setQuestions(prev => findAndDuplicate(prev))
    }

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        const updateRecursive = (qs: Question[]): Question[] =>
            qs.map(q => q.id === id ? { ...q, ...updates } : { ...q, children: q.children ? updateRecursive(q.children) : [] })
        setQuestions(prev => updateRecursive(prev))
    }

    const addApplicant = (applicant: Partial<Applicant>) => {
        const newApplicant: Applicant = {
            id: `app-${Date.now()}`,
            name: applicant.name || 'New Applicant',
            email: applicant.email || '',
            location: applicant.location || '',
            status: 'new',
            score: 0,
            completeness: 20,
            expectedValue: 0,
            source: 'manual',
            dateAdded: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            tags: applicant.tags || [],
            customFields: applicant.customFields || {},
            socialProfiles: applicant.socialProfiles || [],
            notes: [],
            contactChannels: applicant.contactChannels || ['email'],
            communications: [],
            budget: applicant.budget || '',
            interests: applicant.interests || [],
            ...applicant
        }
        setApplicants(prev => [newApplicant, ...prev])
    }

    const addBranch = (parentId: string, triggerOptionId: string) => {
        const addBranchRecursive = (qs: Question[]): Question[] => {
            return qs.map(q => {
                if (q.id === parentId) {
                    const newChild: Question = {
                        id: `q-${Date.now()}`,
                        type: 'mcq',
                        text: 'New Follow-up Question',
                        required: false,
                        level: q.level + 1,
                        order: q.children ? q.children.length : 0,
                        logicType: 'independent',
                        parentId: q.id,
                        parentOptionId: triggerOptionId,
                        options: [],
                        children: []
                    }
                    return { ...q, children: [...(q.children || []), newChild] }
                }
                if (q.children) {
                    return { ...q, children: addBranchRecursive(q.children) }
                }
                return q
            })
        }
        setQuestions(prev => addBranchRecursive(prev))
    }

    const deleteAnalyticsCard = (id: string) => {
        setAnalyticsCards(prev => prev.filter(c => c.id !== id))
    }

    const addAnalyticsCard = () => {
        const newCard: AnalyticsCardData = {
            id: `card-${Date.now()}`,
            title: 'New Analytics Card',
            type: 'bar',
            viewType: 'chart',
            description: 'Custom analytics card',
            metric: 'Response Rate',
            trend: '+0%',
            dataLogic: 'New metric logic',
            chartData: {},
            isAIGenerated: false
        }
        setAnalyticsCards(prev => [...prev, newCard])
    }

    return (
        <SurveyContext.Provider value={{
            surveyName, activeTab, builderView, aiDrawerOpen, selectedQuestionId, questions, chatMessages, expandedNodes, isWizardOpen, isSimulatorOpen,
            simulatorMode, replayResponse,
            mediums, scheduledDate, endDate, region, demography, segment, responseGoal, analyticsCards, applicants, responses,
            setSurveyName, setActiveTab, setBuilderView, toggleAIDrawer: () => setAIDrawerOpen(p => !p), selectQuestion: setSelectedQuestionId,
            toggleNodeExpansion,
            sendMessage: (content, skipAutoReply = false) => {
                const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() }
                setChatMessages(p => [...p, userMsg])

                if (!skipAutoReply) {
                    // Simulate AI Response
                    setTimeout(() => {
                        const aiMsg: ChatMessage = {
                            id: (Date.now() + 1).toString(),
                            role: 'ai',
                            content: "I've processed your request. Is there anything else you'd like me to adjust in the survey?",
                            timestamp: new Date()
                        }
                        setChatMessages(p => [...p, aiMsg])
                    }, 1000)
                }
            },
            sendAIMessage: (content: string) => {
                const aiMsg: ChatMessage = {
                    id: Date.now().toString(),
                    role: 'ai',
                    content,
                    timestamp: new Date()
                }
                setChatMessages(p => [...p, aiMsg])
            },
            closeWizard: () => setIsWizardOpen(false),
            openSimulator: () => { setSimulatorMode('preview'); setIsSimulatorOpen(true) },
            closeSimulator: () => { setIsSimulatorOpen(false); setReplayResponse(null); setSimulatorMode('preview') },
            startSimulation: (r) => { setReplayResponse(r); setSimulatorMode('replay'); setIsSimulatorOpen(true) },
            updateSurveySettings: (m, d, g) => { setMediums(m); setScheduledDate(d); setResponseGoal(g) },
            setMediums, setScheduledDate, setEndDate, setRegion, setDemography, setSegment, setResponseGoal,
            updateAnalyticsCard: (id, u) => setAnalyticsCards(p => p.map(c => c.id === id ? { ...c, ...u } : c)),
            reorderQuestions, addQuestion, deleteQuestion, duplicateQuestion, updateQuestion, deleteAnalyticsCard, addAnalyticsCard, addBranch, addApplicant,
            // Unified Exports
            viewMode, setViewMode, followUpViewType, setFollowUpViewType, hypotheses, settings, updateSettings, dismissHypothesis, reorderAnalyticsCards
        }}>
            {children}
        </SurveyContext.Provider>
    )
}
