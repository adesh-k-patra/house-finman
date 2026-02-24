
import apiClient from './apiClient';
import { Survey, SurveyResponse } from '@/types';

export const surveyService = {
    getSurveys: async (params?: Record<string, string>) => {
        const query = params ? `?${new URLSearchParams(params)}` : '';
        return apiClient.get<Survey[]>(`/surveys${query}`);
    },

    getSurveyById: async (id: string) => {
        return apiClient.get<Survey>(`/surveys/${id}`);
    },

    createSurvey: async (data: Partial<Survey>) => {
        return apiClient.post<Survey>('/surveys', data);
    },

    updateSurvey: async (id: string, data: Partial<Survey>) => {
        return apiClient.put<Survey>(`/surveys/${id}`, data);
    },

    deleteSurvey: async (id: string) => {
        return apiClient.delete(`/surveys/${id}`);
    },

    getSurveyStats: async (id: string) => {
        return apiClient.get<{ totalResponses: number; completionRate: number; completedResponses: number }>(`/surveys/${id}/stats`);
    },

    // Public/Respondent method
    submitResponse: async (surveyId: string, response: Partial<SurveyResponse>) => {
        return apiClient.post<{ id: string; message: string }>(`/surveys/${surveyId}/responses`, response);
    }
};
