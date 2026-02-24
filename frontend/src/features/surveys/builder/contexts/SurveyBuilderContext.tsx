import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef, useMemo } from 'react'

// ============ TYPES ============

export type SurveyMedium = 'mobile_web' | 'desktop_web' | 'sms' | 'whatsapp' | 'email' | 'in_app' | 'qr_code'
export type SurveyStatus = 'draft' | 'active' | 'ended' | 'pending'
export type QuestionType = 'mcq' | 'rating' | 'text' | 'scale' | 'yes_no' | 'dropdown' | 'date' | 'file_upload' | 'nps' | 'file' | 'matrix'
export type CreationMode = 'ai' | 'manual'
export type ViewMode = 'config' | 'followups' | 'analytics' | 'hypotheses' | 'settings'
export type FollowUpViewType = 'qa_list' | 'flowchart' | 'logic_map'
export type AnalyticsViewType = 'chart' | 'graph' | 'table' | 'heatmap' | 'funnel' | 'trend' | 'distribution' | 'comparison' | 'radar' | 'radialbar' | 'scatter'
export type SimulatorMode = 'preview' | 'replay'

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

export interface QuestionOption {
    id: string
    text: string
    score?: number
}

export interface LogicRule {
    id: string
    triggerOptionId: string
    targetQuestionId: string
}

export interface Question {
    id: string
    parentId: string | null
    level: number
    text: string
    type: QuestionType
    options: QuestionOption[]
    logic: LogicRule[]
    required: boolean
    placeholder?: string
    scoreWeight: number
    order: number
    nextQuestionId?: string // For default flow (Question Branch)
    // Visual Customization
    color?: string
    visualization?: 'bar' | 'pie' | 'line' | 'metric' | 'table'
    dataConfig?: {
        source?: string
        metric?: string
    }
    // Deep Customization
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
}

export interface AnalyticsCard {
    id: string
    title: string
    viewType: AnalyticsViewType
    dataLogic: string
    chartData: any
    isAIGenerated: boolean
    isPinned?: boolean
}

export interface Hypothesis {
    id: string
    insight: string
    supportingMetrics: string
    recommendation: string
    dismissed: boolean
}

export interface ChatMessage {
    id: string
    role: 'user' | 'ai'
    content: string
    timestamp: string
    liked?: boolean
    disliked?: boolean
}

export interface SurveyResponse {
    id: string
    answers: Record<string, any>
    completedAt: string
}

// ============ CONTEXT TYPE ============

export interface SurveyBuilderContextType {
    // View State
    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void
    followUpViewType: FollowUpViewType
    setFollowUpViewType: (type: FollowUpViewType) => void

    // AI Panel
    aiPanelOpen: boolean
    setAiPanelOpen: (open: boolean) => void
    chatMessages: ChatMessage[]
    addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
    clearChatMessages: () => void

    // Survey Settings
    settings: SurveySettings
    updateSettings: (updates: Partial<SurveySettings>) => void

    // Questions
    questions: Question[]
    addQuestion: (question: Omit<Question, 'id' | 'order'>) => string
    updateQuestion: (id: string, updates: Partial<Question>) => void
    deleteQuestion: (id: string) => void
    reorderQuestions: (startIndex: number, endIndex: number) => void
    addBranch: (parentId: string, triggerOptionId: string | null) => void
    selectQuestion: (id: string | null) => void
    selectedQuestionId: string | null

    // Question Drawer
    questionDrawerOpen: boolean
    setQuestionDrawerOpen: (open: boolean) => void
    editingQuestionId: string | null
    setEditingQuestionId: (id: string | null) => void
    drawerMode: 'edit' | 'create'
    setDrawerMode: (mode: 'edit' | 'create') => void

    // Modals (Unified)
    deleteConfirm: { isOpen: boolean, type: 'question' | 'branch', id: string | null, optionId?: string | null, triggerOptionId?: string | null }
    setDeleteConfirm: (val: any) => void
    connectModalOpen: boolean
    setConnectModalOpen: (open: boolean) => void

    // Analytics
    analyticsCards: AnalyticsCard[]
    addAnalyticsCard: (card: Omit<AnalyticsCard, 'id'>) => void
    updateAnalyticsCard: (id: string, updates: Partial<AnalyticsCard>) => void
    deleteAnalyticsCard: (id: string) => void
    reorderAnalyticsCards: (cards: AnalyticsCard[]) => void

    // Hypotheses
    hypotheses: Hypothesis[]
    dismissHypothesis: (id: string) => void


    // Simulator
    isSimulatorOpen: boolean
    setSimulatorOpen: (open: boolean) => void
    simulatorMode: SimulatorMode
    setSimulatorMode: (mode: SimulatorMode) => void
    replayResponse: SurveyResponse | null
    setReplayResponse: (response: SurveyResponse | null) => void
    openSimulator: () => void
    closeSimulator: () => void
    startSimulation: (response: SurveyResponse) => void
}

// ============ DEFAULT DATA ============

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

export const DUMMY_QUESTIONS: Question[] = [
    // Root Question 1: Property Type
    {
        id: 'q1',
        parentId: null,
        level: 0,
        text: 'What type of property are you interested in?',
        type: 'mcq',
        options: [
            { id: 'q1-a', text: 'Apartment/Flat', score: 10 },
            { id: 'q1-b', text: 'Villa/Independent House', score: 15 },
            { id: 'q1-c', text: 'Plot/Land', score: 8 },
            { id: 'q1-d', text: 'Commercial Property', score: 12 }
        ],
        logic: [
            { id: 'l1', triggerOptionId: 'q1-a', targetQuestionId: 'q1-1' },
            { id: 'l2', triggerOptionId: 'q1-b', targetQuestionId: 'q1-2' }
        ],
        required: true,
        scoreWeight: 1.5,
        order: 0
    },
    // Branch 1.A: Apartment follow-up - BHK Config
    {
        id: 'q1-1',
        parentId: 'q1',
        level: 1,
        text: 'How many bedrooms are you looking for?',
        type: 'mcq',
        options: [
            { id: 'q1-1-a', text: '1 BHK', score: 5 },
            { id: 'q1-1-b', text: '2 BHK', score: 10 },
            { id: 'q1-1-c', text: '3 BHK', score: 15 },
            { id: 'q1-1-d', text: '4+ BHK', score: 20 }
        ],
        logic: [
            { id: 'l3', triggerOptionId: 'q1-1-b', targetQuestionId: 'q1-1-1' }
        ],
        required: true,
        scoreWeight: 1.2,
        order: 1
    },
    // Branch 1.A.2B: 2BHK specifics
    {
        id: 'q1-1-1',
        parentId: 'q1-1',
        level: 2,
        text: 'What floor preference do you have?',
        type: 'mcq',
        options: [
            { id: 'q1-1-1-a', text: 'Ground floor', score: 5 },
            { id: 'q1-1-1-b', text: 'Low rise (1-4)', score: 8 },
            { id: 'q1-1-1-c', text: 'Mid rise (5-10)', score: 10 },
            { id: 'q1-1-1-d', text: 'High rise (11+)', score: 12 }
        ],
        logic: [],
        required: false,
        scoreWeight: 0.8,
        order: 2
    },
    // Branch 1.B: Villa follow-up
    {
        id: 'q1-2',
        parentId: 'q1',
        level: 1,
        text: 'What plot size are you looking for?',
        type: 'mcq',
        options: [
            { id: 'q1-2-a', text: '1200-2000 sq.ft', score: 10 },
            { id: 'q1-2-b', text: '2000-3000 sq.ft', score: 15 },
            { id: 'q1-2-c', text: '3000-5000 sq.ft', score: 20 },
            { id: 'q1-2-d', text: '5000+ sq.ft', score: 25 }
        ],
        logic: [],
        required: true,
        scoreWeight: 1.3,
        order: 3
    },
    // Root Question 2: Budget
    {
        id: 'q2',
        parentId: null,
        level: 0,
        text: 'What is your budget range?',
        type: 'mcq',
        options: [
            { id: 'q2-a', text: 'Under ₹30 Lakhs', score: 5 },
            { id: 'q2-b', text: '₹30L - ₹50L', score: 10 },
            { id: 'q2-c', text: '₹50L - ₹1 Cr', score: 15 },
            { id: 'q2-d', text: '₹1 Cr - ₹2 Cr', score: 20 },
            { id: 'q2-e', text: 'Above ₹2 Cr', score: 25 }
        ],
        logic: [
            { id: 'l4', triggerOptionId: 'q2-d', targetQuestionId: 'q2-1' },
            { id: 'l5', triggerOptionId: 'q2-e', targetQuestionId: 'q2-1' }
        ],
        required: true,
        scoreWeight: 2,
        order: 4
    },
    // Branch 2.D/E: Premium budget follow-up
    {
        id: 'q2-1',
        parentId: 'q2',
        level: 1,
        text: 'Are you interested in branded developer projects?',
        type: 'yes_no',
        options: [
            { id: 'q2-1-a', text: 'Yes', score: 10 },
            { id: 'q2-1-b', text: 'No', score: 5 }
        ],
        logic: [],
        required: false,
        scoreWeight: 0.9,
        order: 5
    },
    // Root Question 3: Location
    {
        id: 'q3',
        parentId: null,
        level: 0,
        text: 'Which area/locality are you interested in?',
        type: 'mcq',
        options: [
            { id: 'q3-a', text: 'Whitefield', score: 10 },
            { id: 'q3-b', text: 'Electronic City', score: 10 },
            { id: 'q3-c', text: 'Sarjapur Road', score: 12 },
            { id: 'q3-d', text: 'Hebbal', score: 15 },
            { id: 'q3-e', text: 'Other', score: 5 }
        ],
        logic: [],
        required: true,
        scoreWeight: 1.5,
        order: 6
    },
    // Root Question 4: Loan Intent
    {
        id: 'q4',
        parentId: null,
        level: 0,
        text: 'Are you planning to take a home loan?',
        type: 'yes_no',
        options: [
            { id: 'q4-a', text: 'Yes', score: 10 },
            { id: 'q4-b', text: 'No', score: 5 }
        ],
        logic: [
            { id: 'l6', triggerOptionId: 'q4-a', targetQuestionId: 'q4-1' }
        ],
        required: true,
        scoreWeight: 1,
        order: 7
    },
    // Branch 4.A: Loan details
    {
        id: 'q4-1',
        parentId: 'q4',
        level: 1,
        text: 'What is your preferred bank for home loan?',
        type: 'dropdown',
        options: [
            { id: 'q4-1-a', text: 'HDFC Bank', score: 10 },
            { id: 'q4-1-b', text: 'ICICI Bank', score: 10 },
            { id: 'q4-1-c', text: 'SBI', score: 8 },
            { id: 'q4-1-d', text: 'Axis Bank', score: 9 },
            { id: 'q4-1-e', text: 'No preference', score: 5 }
        ],
        logic: [],
        required: false,
        scoreWeight: 0.7,
        order: 8
    },
    // Root Question 5: Timeline
    {
        id: 'q5',
        parentId: null,
        level: 0,
        text: 'When are you planning to make the purchase?',
        type: 'mcq',
        options: [
            { id: 'q5-a', text: 'Immediately (within 1 month)', score: 20 },
            { id: 'q5-b', text: '1-3 months', score: 15 },
            { id: 'q5-c', text: '3-6 months', score: 10 },
            { id: 'q5-d', text: '6-12 months', score: 5 },
            { id: 'q5-e', text: 'Just exploring', score: 2 }
        ],
        logic: [
            { id: 'l7', triggerOptionId: 'q5-a', targetQuestionId: 'q5-1' }
        ],
        required: true,
        scoreWeight: 1.8,
        order: 9
    },
    // Branch 5.A: Immediate buyer follow-up
    {
        id: 'q5-1',
        parentId: 'q5',
        level: 1,
        text: 'Would you like to schedule a site visit?',
        type: 'yes_no',
        options: [
            { id: 'q5-1-a', text: 'Yes, this week', score: 15 },
            { id: 'q5-1-b', text: 'Yes, next week', score: 12 },
            { id: 'q5-1-c', text: 'No, not yet', score: 3 }
        ],
        logic: [],
        required: false,
        scoreWeight: 1.2,
        order: 10
    },
    // Root Question 6: Purpose
    {
        id: 'q6',
        parentId: null,
        level: 0,
        text: 'What is the purpose of this property?',
        type: 'mcq',
        options: [
            { id: 'q6-a', text: 'Self-use (Primary Home)', score: 15 },
            { id: 'q6-b', text: 'Investment (Rental)', score: 12 },
            { id: 'q6-c', text: 'Second Home', score: 10 },
            { id: 'q6-d', text: 'Parents/Family', score: 8 }
        ],
        logic: [],
        required: true,
        scoreWeight: 1,
        order: 11
    },
    // Root Question 7: Amenities
    {
        id: 'q7',
        parentId: null,
        level: 0,
        text: 'Which amenities are most important to you?',
        type: 'mcq',
        options: [
            { id: 'q7-a', text: 'Swimming Pool & Gym', score: 10 },
            { id: 'q7-b', text: 'Clubhouse & Party Hall', score: 8 },
            { id: 'q7-c', text: 'Kids Play Area & Gardens', score: 9 },
            { id: 'q7-d', text: 'Security & Parking', score: 12 },
            { id: 'q7-e', text: 'All of the above', score: 15 }
        ],
        logic: [],
        required: false,
        scoreWeight: 0.8,
        order: 12
    },
    // Root Question 8: Work Location
    {
        id: 'q8',
        parentId: null,
        level: 0,
        text: 'Where is your primary workplace?',
        type: 'text',
        options: [],
        logic: [],
        required: false,
        placeholder: 'Enter company name or area',
        scoreWeight: 0.5,
        order: 13
    },
    // Root Question 9: Rating
    {
        id: 'q9',
        parentId: null,
        level: 0,
        text: 'How would you rate your overall home buying experience so far?',
        type: 'rating',
        options: [
            { id: 'q9-a', text: '1', score: 2 },
            { id: 'q9-b', text: '2', score: 4 },
            { id: 'q9-c', text: '3', score: 6 },
            { id: 'q9-d', text: '4', score: 8 },
            { id: 'q9-e', text: '5', score: 10 }
        ],
        logic: [
            { id: 'l8', triggerOptionId: 'q9-a', targetQuestionId: 'q9-1' },
            { id: 'l9', triggerOptionId: 'q9-b', targetQuestionId: 'q9-1' }
        ],
        required: false,
        scoreWeight: 0.3,
        order: 14
    },
    // Branch 9.A/B: Low rating follow-up
    {
        id: 'q9-1',
        parentId: 'q9',
        level: 1,
        text: 'What challenges have you faced in your home buying journey?',
        type: 'mcq',
        options: [
            { id: 'q9-1-a', text: 'Confusing loan process', score: 5 },
            { id: 'q9-1-b', text: 'Price negotiations', score: 5 },
            { id: 'q9-1-c', text: 'Documentation hassles', score: 5 },
            { id: 'q9-1-d', text: 'Finding the right property', score: 5 }
        ],
        logic: [],
        required: false,
        scoreWeight: 0.5,
        order: 15
    },
    // Root Question 10: NPS Score
    {
        id: 'q10',
        parentId: null,
        level: 0,
        text: 'How likely are you to recommend our services to friends and family?',
        type: 'nps',
        options: [
            { id: 'q10-0', text: '0', score: 0 },
            { id: 'q10-1', text: '1', score: 1 },
            { id: 'q10-2', text: '2', score: 2 },
            { id: 'q10-3', text: '3', score: 3 },
            { id: 'q10-4', text: '4', score: 4 },
            { id: 'q10-5', text: '5', score: 5 },
            { id: 'q10-6', text: '6', score: 6 },
            { id: 'q10-7', text: '7', score: 7 },
            { id: 'q10-8', text: '8', score: 8 },
            { id: 'q10-9', text: '9', score: 9 },
            { id: 'q10-10', text: '10', score: 10 }
        ],
        logic: [
            { id: 'l10', triggerOptionId: 'q10-9', targetQuestionId: 'q10-1' },
            { id: 'l11', triggerOptionId: 'q10-10', targetQuestionId: 'q10-1' }
        ],
        required: true,
        scoreWeight: 1.5,
        order: 16
    },
    // Branch 10.9/10: Promoter follow-up
    {
        id: 'q10-1',
        parentId: 'q10',
        level: 1,
        text: 'Thank you! Would you like to participate in our referral program?',
        type: 'mcq',
        options: [
            { id: 'q10-1-a', text: 'Yes, sign me up!', score: 10 },
            { id: 'q10-1-b', text: 'Maybe later', score: 5 },
            { id: 'q10-1-c', text: 'No thanks', score: 0 }
        ],
        logic: [],
        required: false,
        scoreWeight: 0.5,
        order: 17
    },
    // Root Question 11: Preferred Move-in Date
    {
        id: 'q11',
        parentId: null,
        level: 0,
        text: 'When do you prefer to move into your new home?',
        type: 'date',
        options: [],
        logic: [],
        required: false,
        placeholder: 'Select preferred date',
        scoreWeight: 0.6,
        order: 18
    },
    // Root Question 12: Document Upload
    {
        id: 'q12',
        parentId: null,
        level: 0,
        text: 'Please upload your income proof documents (optional)',
        type: 'file',
        options: [],
        logic: [],
        required: false,
        placeholder: 'Upload PDF, JPG or PNG files',
        scoreWeight: 0.4,
        order: 19
    },
    // Root Question 13: Matrix - Feature Importance
    {
        id: 'q13',
        parentId: null,
        level: 0,
        text: 'Rate the importance of these features (1-5)',
        type: 'matrix',
        options: [
            { id: 'q13-a', text: 'Modern Kitchen', score: 0 },
            { id: 'q13-b', text: 'Balcony/Terrace', score: 0 },
            { id: 'q13-c', text: 'Parking Space', score: 0 },
            { id: 'q13-d', text: 'Power Backup', score: 0 },
            { id: 'q13-e', text: 'Water Supply', score: 0 }
        ],
        logic: [],
        required: false,
        scoreWeight: 0.7,
        order: 20
    },
    // Root Question 14: Contact Preference
    {
        id: 'q14',
        parentId: null,
        level: 0,
        text: 'How would you prefer us to contact you?',
        type: 'mcq',
        options: [
            { id: 'q14-a', text: 'Phone Call', score: 10 },
            { id: 'q14-b', text: 'WhatsApp', score: 10 },
            { id: 'q14-c', text: 'Email', score: 8 },
            { id: 'q14-d', text: 'SMS', score: 6 }
        ],
        logic: [
            { id: 'l12', triggerOptionId: 'q14-a', targetQuestionId: 'q14-1' }
        ],
        required: true,
        scoreWeight: 0.5,
        order: 21
    },
    // Branch 14.A: Phone call timing
    {
        id: 'q14-1',
        parentId: 'q14',
        level: 1,
        text: 'What is the best time to call you?',
        type: 'mcq',
        options: [
            { id: 'q14-1-a', text: 'Morning (9 AM - 12 PM)', score: 5 },
            { id: 'q14-1-b', text: 'Afternoon (12 PM - 4 PM)', score: 5 },
            { id: 'q14-1-c', text: 'Evening (4 PM - 8 PM)', score: 5 },
            { id: 'q14-1-d', text: 'Anytime', score: 10 }
        ],
        logic: [],
        required: false,
        scoreWeight: 0.3,
        order: 22
    },
    // Root Question 15: Additional Comments
    {
        id: 'q15',
        parentId: null,
        level: 0,
        text: 'Any additional requirements or comments?',
        type: 'text',
        options: [],
        logic: [],
        required: false,
        placeholder: 'Share your specific needs or preferences...',
        scoreWeight: 0.2,
        order: 23
    }
]


const DUMMY_ANALYTICS: AnalyticsCard[] = [
    { id: 'a1', title: 'Lead Funnel Analysis', viewType: 'funnel', dataLogic: 'Survey starts → Completed → Prequalified → Site Visit', chartData: {}, isAIGenerated: true },
    { id: 'a2', title: 'Intent by Timeline', viewType: 'chart', dataLogic: 'Buying horizon distribution across respondents', chartData: {}, isAIGenerated: true },
    { id: 'a3', title: 'Budget Distribution', viewType: 'distribution', dataLogic: 'Budget ranges selected by respondents', chartData: {}, isAIGenerated: true },
    { id: 'a4', title: 'Property Type Preference', viewType: 'chart', dataLogic: 'Villa vs Apartment vs Plot preferences', chartData: {}, isAIGenerated: true },
    { id: 'a5', title: 'BHK Configuration Demand', viewType: 'chart', dataLogic: '1BHK/2BHK/3BHK/4BHK preference breakdown', chartData: {}, isAIGenerated: true },
    { id: 'a6', title: 'Loan Intent Rate', viewType: 'comparison', dataLogic: 'Users planning to take loan vs self-funded', chartData: {}, isAIGenerated: true },
    { id: 'a7', title: 'Geographic Heatmap', viewType: 'heatmap', dataLogic: 'Demand by locality in Bangalore', chartData: {}, isAIGenerated: true },
    { id: 'a8', title: 'Survey Drop-off Analysis', viewType: 'funnel', dataLogic: 'Drop-off rate at each question step', chartData: {}, isAIGenerated: true },
    { id: 'a9', title: 'Daily Lead Velocity', viewType: 'trend', dataLogic: 'New leads per day over time', chartData: {}, isAIGenerated: true },
    { id: 'a10', title: 'High-Intent Lead Segment', viewType: 'table', dataLogic: 'Leads with score >= 80 filtered by timeline', chartData: {}, isAIGenerated: true },
    { id: 'a11', title: 'Bank Partner Performance', viewType: 'comparison', dataLogic: 'Approval rate by bank partner', chartData: {}, isAIGenerated: true },
    { id: 'a12', title: 'Site Visit Conversion', viewType: 'funnel', dataLogic: 'Survey → Site Visit → Booking conversion', chartData: {}, isAIGenerated: true },
    { id: 'a13', title: 'Agent Performance', viewType: 'table', dataLogic: 'Leads handled by agent with conversion rates', chartData: {}, isAIGenerated: true },
    { id: 'a14', title: 'Response Time Analysis', viewType: 'trend', dataLogic: 'Average time taken to complete survey', chartData: {}, isAIGenerated: true },
    { id: 'a15', title: 'Channel Effectiveness', viewType: 'comparison', dataLogic: 'Response rate by channel (SMS/Email/WhatsApp)', chartData: {}, isAIGenerated: true },
    { id: 'a16', title: 'Weekend vs Weekday', viewType: 'chart', dataLogic: 'Response patterns by day of week', chartData: {}, isAIGenerated: true },
    { id: 'a17', title: 'Credit Score Distribution', viewType: 'distribution', dataLogic: 'Self-reported credit ranges', chartData: {}, isAIGenerated: true },
    { id: 'a18', title: 'EMI Affordability', viewType: 'chart', dataLogic: 'EMI ranges selected by respondents', chartData: {}, isAIGenerated: true },
    { id: 'a19', title: 'Project Interest Map', viewType: 'heatmap', dataLogic: 'Interest levels by project/property', chartData: {}, isAIGenerated: true },
    { id: 'a20', title: 'NPS Score Trend', viewType: 'trend', dataLogic: 'Net Promoter Score over time', chartData: {}, isAIGenerated: true }
]

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
    },
    {
        id: 'h4',
        insight: '2BHK seekers in Whitefield have 85% loan intent — partner with HDFC for instant approvals.',
        supportingMetrics: '156 leads from Whitefield, 132 seeking loans',
        recommendation: 'Create dedicated HDFC pre-approval flow for Whitefield 2BHK seekers',
        dismissed: false
    },
    {
        id: 'h5',
        insight: 'Leads responding on weekends have 1.8× higher booking rate.',
        supportingMetrics: 'Weekend leads: 23% booking, Weekday leads: 13% booking',
        recommendation: 'Schedule survey campaigns to run on Saturday/Sunday mornings',
        dismissed: false
    },
    {
        id: 'h6',
        insight: 'Surveys completed in under 2 minutes show higher quality scores.',
        supportingMetrics: 'Avg completion time 1:48 correlates with 89% prequalification',
        recommendation: 'Optimize survey to target 2-minute completion time',
        dismissed: false
    },
    {
        id: 'h7',
        insight: 'Villa seekers have 2× higher average budget than apartment seekers.',
        supportingMetrics: 'Villa avg: ₹1.2Cr, Apartment avg: ₹58L',
        recommendation: 'Create premium follow-up sequence for villa intent leads',
        dismissed: false
    },
    {
        id: 'h8',
        insight: '3BHK demand in Electronic City has grown 45% this quarter.',
        supportingMetrics: '234 3BHK inquiries in Q4 vs 161 in Q3',
        recommendation: 'Increase inventory focus on Electronic City 3BHK projects',
        dismissed: false
    },
    {
        id: 'h9',
        insight: 'Users who select "1-3 months" timeline rarely convert without a site visit within 7 days.',
        supportingMetrics: 'Only 12% conversion without site visit in first week',
        recommendation: 'Auto-schedule site visits within 48 hours for 1-3 month intent leads',
        dismissed: false
    },
    {
        id: 'h10',
        insight: 'Post-purchase NPS drops 15 points if handover is delayed beyond commitment.',
        supportingMetrics: 'On-time NPS: 72, Delayed NPS: 57',
        recommendation: 'Implement proactive delay communication to maintain trust',
        dismissed: false
    }
]

// ============ CONTEXT ============

const SurveyBuilderContext = createContext<SurveyBuilderContextType | null>(null)

// ============ PROVIDER ============

export function SurveyBuilderProvider({ children }: { children: ReactNode }) {
    // View State
    const [viewMode, setViewMode] = useState<ViewMode>('config')
    const [followUpViewType, setFollowUpViewType] = useState<FollowUpViewType>('flowchart')

    // AI Panel
    const [aiPanelOpen, setAiPanelOpen] = useState(false)
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

    // Survey Settings
    const [settings, setSettings] = useState<SurveySettings>(DEFAULT_SETTINGS)

    // Questions
    const [questions, setQuestions] = useState<Question[]>(DUMMY_QUESTIONS)
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

    // Question Drawer
    const [questionDrawerOpen, setQuestionDrawerOpen] = useState(false)
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
    const [drawerMode, setDrawerMode] = useState<'edit' | 'create'>('edit')

    // Unified Modals
    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean
        type: 'question' | 'branch'
        id: string | null
        optionId?: string | null
        triggerOptionId?: string | null
    }>({
        isOpen: false,
        type: 'question',
        id: null
    })
    const [connectModalOpen, setConnectModalOpen] = useState(false)

    // Analytics
    const [analyticsCards, setAnalyticsCards] = useState<AnalyticsCard[]>(DUMMY_ANALYTICS)

    // Hypotheses
    const [hypotheses, setHypotheses] = useState<Hypothesis[]>(DUMMY_HYPOTHESES)

    // Hypotheses


    // Simulator
    const [isSimulatorOpen, setSimulatorOpen] = useState(false)
    const [simulatorMode, setSimulatorMode] = useState<SimulatorMode>('preview')
    const [replayResponse, setReplayResponse] = useState<SurveyResponse | null>(null)

    const addChatMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const newMessage: ChatMessage = {
            ...msg,
            id: 'msg-' + Date.now(),
            timestamp: new Date().toISOString()
        }
        setChatMessages(prev => [...prev, newMessage])
    }, [])

    const clearChatMessages = useCallback(() => {
        setChatMessages([])
    }, [])

    const updateSettings = useCallback((updates: Partial<SurveySettings>) => {
        setSettings(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }))
    }, [])

    const addQuestion = useCallback((question: Omit<Question, 'id' | 'order'>) => {
        const newQuestion: Question = {
            ...question,
            id: 'q-' + Date.now(),
            order: questions.length
        }
        setQuestions(prev => [...prev, newQuestion])
        return newQuestion.id
    }, [questions.length])

    const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
        console.log('[Context] updateQuestion called:', id, updates)
        setQuestions(prev => {
            const matchIndex = prev.findIndex(q => q.id === id)
            console.log('[Context] Match found at index:', matchIndex, 'for ID:', id)
            if (matchIndex === -1) {
                console.warn('[Context] WARNING: ID not found in questions list!', prev.map(q => q.id))
            }
            return prev.map(q => q.id === id ? { ...q, ...updates } : q)
        })
    }, [])

    const deleteQuestion = useCallback((id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id && q.parentId !== id))
    }, [])

    const reorderQuestions = useCallback((startIndex: number, endIndex: number) => {
        setQuestions(prev => {
            const result = Array.from(prev)
            const [removed] = result.splice(startIndex, 1)
            result.splice(endIndex, 0, removed)
            return result.map((q, i) => ({ ...q, order: i }))
        })
    }, [])

    const addBranch = useCallback((parentId: string, triggerOptionId: string | null) => {
        const parent = questions.find(q => q.id === parentId)
        if (!parent) return

        const newQuestion: Question = {
            id: 'q-' + Date.now(),
            parentId,
            level: parent.level + 1,
            text: 'New follow-up question',
            type: 'mcq',
            options: [
                { id: 'opt-a-' + Date.now(), text: 'Option A', score: 5 },
                { id: 'opt-b-' + Date.now(), text: 'Option B', score: 5 }
            ],
            logic: [],
            required: false,
            scoreWeight: 1,
            order: questions.length
        }

        if (triggerOptionId) {
            // Option-Specific Branch
            const newLogic: LogicRule = {
                id: 'logic-' + Date.now(),
                triggerOptionId,
                targetQuestionId: newQuestion.id
            }

            setQuestions(prev => [...prev.map(q =>
                q.id === parentId
                    ? { ...q, logic: [...q.logic, newLogic] }
                    : q
            ), newQuestion])
        } else {
            // Question-Level Branch (Default Flow)
            setQuestions(prev => [...prev.map(q =>
                q.id === parentId
                    ? { ...q, nextQuestionId: newQuestion.id }
                    : q
            ), newQuestion])
        }

        // Open drawer for new question
        setEditingQuestionId(newQuestion.id)
        setDrawerMode('create')
        setQuestionDrawerOpen(true)
    }, [questions])

    const selectQuestion = useCallback((id: string | null) => {
        setSelectedQuestionId(id)
    }, [])

    const addAnalyticsCard = useCallback((card: Omit<AnalyticsCard, 'id'>) => {
        const newCard: AnalyticsCard = {
            ...card,
            id: 'analytics-' + Date.now()
        }
        setAnalyticsCards(prev => [...prev, newCard])
    }, [])

    const updateAnalyticsCard = useCallback((id: string, updates: Partial<AnalyticsCard>) => {
        setAnalyticsCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    }, [])

    const deleteAnalyticsCard = useCallback((id: string) => {
        setAnalyticsCards(prev => prev.filter(c => c.id !== id))
    }, [])

    const reorderAnalyticsCards = useCallback((cards: AnalyticsCard[]) => {
        setAnalyticsCards(cards)
    }, [])

    const dismissHypothesis = useCallback((id: string) => {
        setHypotheses(prev => prev.map(h => h.id === id ? { ...h, dismissed: true } : h))
    }, [])

    const openSimulator = useCallback(() => {
        setSimulatorMode('preview')
        setSimulatorOpen(true)
    }, [])

    const closeSimulator = useCallback(() => {
        setSimulatorOpen(false)
        setReplayResponse(null)
        setSimulatorMode('preview')
    }, [])

    const startSimulation = useCallback((response: SurveyResponse) => {
        setReplayResponse(response)
        setSimulatorMode('replay')
        setSimulatorOpen(true)
    }, [])

    // ============ VALUE ============

    const value: SurveyBuilderContextType = {
        viewMode,
        setViewMode,
        followUpViewType,
        setFollowUpViewType,
        aiPanelOpen,
        setAiPanelOpen,
        chatMessages,
        addChatMessage,
        clearChatMessages,
        settings,
        updateSettings,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        addBranch,
        selectQuestion,
        selectedQuestionId,
        questionDrawerOpen,
        setQuestionDrawerOpen,
        editingQuestionId,
        setEditingQuestionId,
        drawerMode,
        setDrawerMode,
        deleteConfirm,
        setDeleteConfirm,
        connectModalOpen,
        setConnectModalOpen,
        analyticsCards,
        addAnalyticsCard,
        updateAnalyticsCard,
        deleteAnalyticsCard,
        reorderAnalyticsCards,
        hypotheses,
        dismissHypothesis,
        isSimulatorOpen,
        setSimulatorOpen,
        simulatorMode,
        setSimulatorMode,
        replayResponse,
        setReplayResponse,
        openSimulator,
        closeSimulator,
        startSimulation
    }

    return (
        <SurveyBuilderContext.Provider value={value}>
            {children}
        </SurveyBuilderContext.Provider>
    )
}

// ============ HOOK ============

export function useSurveyBuilder() {
    const context = useContext(SurveyBuilderContext)
    if (!context) {
        throw new Error('useSurveyBuilder must be used within SurveyBuilderProvider')
    }
    return context
}
