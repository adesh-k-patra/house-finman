
/**
 * Survey Service
 * Handles complex business logic for surveys:
 * - Scoring responses
 * - Classifying intent (High, Medium, Low)
 * - Auto-creating or updating Leads based on responses
 * - Triggering follow-up actions
 */

import { prisma } from '../models/prisma.js';
import { generateId } from '../utils/index.js';
import { logAudit } from '../utils/logger.js';

export const surveyService = {
    /**
     * Process a new survey response
     * Calculates score, determines intent, and syncs with Lead system
     */
    processResponse: async (surveyId: string, responseData: any, respondentInfo: { email?: string, phone?: string, ip?: string }) => {
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            include: { questions: true, campaign: true }
        });

        if (!survey) throw new Error('Survey not found');

        // 1. Calculate Score & Intent
        let score = 0;
        let maxPossibleScore = 0;
        const answersToSave = [];

        for (const ans of responseData.answers) {
            const question = survey.questions.find(q => q.id === ans.questionId);
            if (question && question.logic) {
                // Parse logic/scoring from question (assuming JSON stored in 'logic' field or 'options')
                // For now, simple mock scoring based on value presence
                // In real impl, we'd parse the 'scoring' JSON from the question configuration
                if (ans.value) {
                    score += 10; // Dummy implementation
                }
            }
            answersToSave.push({
                id: generateId(),
                questionId: ans.questionId,
                value: ans.value,
                timeSpent: ans.timeSpent
            });
        }

        // Determine Intent Label
        let intentLabel = 'Low';
        if (score > 50) intentLabel = 'Medium';
        if (score > 80) intentLabel = 'High';

        // 2. Save Response
        const responseId = generateId();
        const response = await prisma.surveyResponse.create({
            data: {
                id: responseId,
                surveyId: survey.id,
                status: 'completed',
                respondentEmail: respondentInfo.email || responseData.respondentEmail,
                respondentPhone: respondentInfo.phone || responseData.respondentPhone,
                score: score,
                intentLabel: intentLabel,
                ipAddress: respondentInfo.ip,
                answers: {
                    create: answersToSave
                }
            }
        });

        // 3. Lead Integration (The "Revenue Engine" part)
        if (respondentInfo.email || respondentInfo.phone) {
            await syncWithLeadSystem(respondentInfo, survey, response, intentLabel);
        }

        // 4. Update Aggregates
        await prisma.survey.update({
            where: { id: survey.id },
            data: {
                totalResponses: { increment: 1 },
                // Update average score logic could go here
            }
        });

        return response;
    },

    /**
     * Get comprehensive stats for a survey
     */
    getSurveyStats: async (surveyId: string) => {
        // Implementation for advanced charts (intent distribution, drop-off, etc.)
        const [total, intentDist] = await Promise.all([
            prisma.surveyResponse.count({ where: { surveyId } }),
            prisma.surveyResponse.groupBy({
                by: ['intentLabel'],
                where: { surveyId },
                _count: true
            })
        ]);

        return {
            total,
            intentDistribution: intentDist
        };
    },

    duplicateSurvey: async (surveyId: string, userId: string) => {
        const original = await prisma.survey.findUnique({
            where: { id: surveyId },
            include: { questions: true }
        });
        if (!original) throw new Error('Survey not found');

        const newId = generateId();

        return prisma.survey.create({
            data: {
                id: newId,
                title: `Copy of ${original.title}`,
                description: original.description,
                type: original.type,
                channel: original.channel,
                status: 'draft',
                theme: original.theme,
                tenantId: original.tenantId,
                createdById: userId,
                questions: {
                    create: original.questions.map(q => ({
                        id: generateId(),
                        text: q.text,
                        type: q.type,
                        order: q.order,
                        options: q.options,
                        logic: q.logic,
                        isRequired: q.isRequired
                    }))
                }
            },
            include: { questions: true }
        });
    },

    exportResponses: async (surveyId: string, format: 'csv' | 'json') => {
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            include: {
                questions: { orderBy: { order: 'asc' } },
                responses: {
                    include: { answers: true },
                    orderBy: { startedAt: 'desc' }
                }
            }
        });

        if (!survey) throw new Error('Survey not found');

        if (format === 'json') return survey.responses;

        // CSV Generation
        const headers = ['Response ID', 'Date', 'Email', 'Phone', 'Status', 'Score', 'Intent', ...survey.questions.map(q => q.text)];
        const rows = survey.responses.map(r => {
            const answerMap = new Map(r.answers.map(a => [a.questionId, a.value]));
            return [
                r.id,
                r.startedAt.toISOString(),
                r.respondentEmail || '',
                r.respondentPhone || '',
                r.status,
                r.score || 0,
                r.intentLabel || '',
                ...survey.questions.map(q => {
                    let val = answerMap.get(q.id) || '';
                    // CSV Injection Protection
                    if (/^[=\+\-@]/.test(val)) {
                        val = "'" + val;
                    }
                    return `"${val.replace(/"/g, '""')}"`;
                })
            ].join(',');
        });

        return [headers.join(','), ...rows].join('\\n');
    }
};

/**
 * Syncs survey response with the Lead system
 * - Finds existing lead or creates new one
 * - Updates lead score and intent
 * - Adds activity log
 */
async function syncWithLeadSystem(userInfo: { email?: string, phone?: string }, survey: any, response: any, intent: string) {
    // 1. Find Lead
    let lead = await prisma.lead.findFirst({
        where: {
            OR: [
                { email: userInfo.email },
                { phone: userInfo.phone }
            ]
        }
    });

    if (lead) {
        // Update existing lead
        await prisma.lead.update({
            where: { id: lead.id },
            data: {
                // Boost score if high intent
                score: { increment: intent === 'High' ? 20 : 5 },
                lastInteractionAt: new Date(),
                // tags is stored as JSON string
                tags: (() => {
                    try {
                        const currentTags = JSON.parse(lead.tags || "[]");
                        if (!currentTags.includes(`survey:${survey.type}`)) {
                            currentTags.push(`survey:${survey.type}`);
                        }
                        return JSON.stringify(currentTags);
                    } catch (e) {
                        return JSON.stringify([`survey:${survey.type}`]);
                    }
                })()
            }
        });

        // Log Activity
        await prisma.leadActivity.create({
            data: {
                id: generateId(),
                leadId: lead.id,
                type: 'SURVEY_RESPONSE',
                title: `Submitted Survey: ${survey.title}`,
                description: `Score: ${response.score}, Intent: ${intent}`,
                metadata: JSON.stringify({ responseId: response.id })
            }
        });

    } else {
        // Create New Lead
        // Note: In real app, we need more fields like Name, which might be in the survey answers
        // forcing a "Partial" lead creation
        lead = await prisma.lead.create({
            data: {
                id: generateId(),
                // Name might be extracted from answers if we had question mapping
                firstName: 'Survey',
                lastName: 'Respondent',
                email: userInfo.email,
                phone: userInfo.phone,
                source: 'Survey',
                status: 'New',
                score: intent === 'High' ? 50 : 10,
                tenantId: survey.tenantId!, // Assert non-null as schema requires it
                assignedToId: survey.createdById ?? null // Auto-assign to survey creator or round-robin
            }
        });
    }
}
