
export type SurveyStatus = 'draft' | 'active' | 'paused' | 'ended' | 'archived';
export type SurveyType = 'nps' | 'csat' | 'ces' | 'product_research' | 'onboarding' | 'churn' | 'custom' | 'buyer_intent' | 'loan_prequal' | 'property_match' | 'site_visit' | 'loan_experience' | 'post_possession';
export type QuestionType = 'rating' | 'nps' | 'text' | 'choice' | 'multi_choice' | 'boolean' | 'date';

export interface SurveyQuestion {
    id: string;
    text: string;
    type: QuestionType;
    order: number;
    isRequired: boolean;
    options?: string[]; // Parsed from JSON
    logic?: Record<string, any>; // Parsed from JSON
}

export interface Survey {
    id: string;
    title: string;
    description?: string;
    type: SurveyType;
    channel: string[]; // Parsed from backend enum/string
    status: SurveyStatus;

    isAnonymous: boolean;
    allowMultiple: boolean;

    campaignId?: string;
    campaign?: {
        id: string;
        name: string;
    };

    tenantId: string;
    createdById: string;

    questions: SurveyQuestion[];

    // Stats
    totalResponses: number;
    completionRate: number;

    createdAt: string;
    updatedAt: string;
}

export interface SurveyResponse {
    id: string;
    surveyId: string;
    status: 'partial' | 'completed';
    respondentEmail?: string;
    respondentPhone?: string;
    answers: SurveyAnswer[];
    createdAt: string;
}

export interface SurveyAnswer {
    id: string;
    questionId: string;
    value: string;
    timeSpent?: number;
}
