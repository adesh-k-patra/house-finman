import { prisma } from '../models/prisma.js';
import { generateId } from '../utils/index.js';

export const templateService = {
    async findAll(user: any) {
        // Get system templates (tenantId is null) AND user's tenant templates
        return prisma.surveyTemplate.findMany({
            where: {
                OR: [
                    { isPublic: true },
                    { tenantId: user.tenantId }
                ]
            },
            orderBy: { category: 'asc' }
        });
    },

    async create(data: any, user: any) {
        return prisma.surveyTemplate.create({
            data: {
                id: generateId(),
                title: data.title,
                description: data.description,
                category: data.category || 'Custom',
                questions: data.questions || "[]",
                theme: data.theme || "{}",
                tenantId: user.tenantId,
                isPublic: false
            }
        });
    },

    async saveSurveyAsTemplate(surveyId: string, data: any, user: any) {
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            include: { questions: true }
        });

        if (!survey) throw new Error('Survey not found');

        // Transform questions to lightweight JSON structure
        const questionsJson = JSON.stringify(survey.questions.map(q => ({
            text: q.text,
            type: q.type,
            options: q.options,
            logic: q.logic
        })));

        return prisma.surveyTemplate.create({
            data: {
                id: generateId(),
                title: data.title || `Template from ${survey.title}`,
                description: data.description || survey.description,
                category: data.category || 'My Templates',
                questions: questionsJson,
                theme: survey.theme,
                tenantId: user.tenantId,
                isPublic: false
            }
        });
    },

    async applyTemplate(surveyId: string, templateId: string) {
        const template = await prisma.surveyTemplate.findUnique({ where: { id: templateId } });
        if (!template) throw new Error('Template not found');

        const questions = JSON.parse(template.questions);

        // Delete existing questions
        await prisma.surveyQuestion.deleteMany({ where: { surveyId } });

        // Add new questions
        await prisma.$transaction(
            questions.map((q: any, index: number) =>
                prisma.surveyQuestion.create({
                    data: {
                        id: generateId(),
                        surveyId,
                        text: q.text,
                        type: q.type,
                        order: index,
                        options: q.options || "[]",
                        logic: q.logic || "{}"
                    }
                })
            )
        );

        // Update survey metadata
        return prisma.survey.update({
            where: { id: surveyId },
            data: {
                theme: template.theme
            }
        });
    }
};
