import { prisma } from '../models/prisma.js';
import { generateId } from '../utils/index.js';

export const followUpService = {
    async getSequence(surveyId: string) {
        return prisma.followUpSequence.findUnique({
            where: { surveyId },
            include: { steps: { orderBy: { order: 'asc' } } }
        });
    },

    async upsertSequence(surveyId: string, isActive: boolean, steps: any[]) {
        // Find existing or create
        const sequence = await prisma.followUpSequence.upsert({
            where: { surveyId },
            create: {
                id: generateId(),
                surveyId,
                isActive
            },
            update: {
                isActive
            }
        });

        // Replace steps
        await prisma.followUpStep.deleteMany({ where: { sequenceId: sequence.id } });

        if (steps && steps.length > 0) {
            await prisma.$transaction(
                steps.map((step: any, index: number) =>
                    prisma.followUpStep.create({
                        data: {
                            id: generateId(),
                            sequenceId: sequence.id,
                            order: index,
                            delayHours: step.delayHours,
                            channel: step.channel,
                            templateId: step.templateId,
                            content: step.content,
                            condition: step.condition
                        }
                    })
                )
            );
        }

        return this.getSequence(surveyId);
    }
};
