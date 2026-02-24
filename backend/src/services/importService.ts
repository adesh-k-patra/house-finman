import { parse } from 'csv-parse/sync';
import { prisma } from '../models/prisma.js';
import { generateId } from '../utils/index.js';
import { logger } from '../utils/logger.js';

export const importService = {
    /**
     * Import leads from CSV data
     */
    async importLeads(csvContent: string, user: any) {
        logger.info(`💾 Importing leads for tenant: ${user.tenantId}`);

        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        };

        const batchSize = 50;
        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize) as any[];

            await prisma.$transaction(async (tx) => {
                for (const row of batch) {
                    try {
                        // Sanitize fields to prevent CSV Injection (Formula Injection)
                        // If a field starts with =, +, -, or @, prepend a single quote
                        const sanitizedRow = { ...row };
                        for (const key of Object.keys(sanitizedRow)) {
                            if (typeof sanitizedRow[key] === 'string') {
                                const value = sanitizedRow[key];
                                if (/^[=\+\-@]/.test(value)) {
                                    sanitizedRow[key] = `'${value}`;
                                }
                            }
                        }

                        // Basic validation
                        if (!sanitizedRow.firstName || !sanitizedRow.phone) {
                            throw new Error('Missing required fields (firstName, phone)');
                        }

                        await tx.lead.create({
                            data: {
                                id: generateId(),
                                firstName: sanitizedRow.firstName,
                                lastName: sanitizedRow.lastName || '',
                                email: sanitizedRow.email || null,
                                phone: sanitizedRow.phone,
                                source: sanitizedRow.source || 'Import',
                                status: sanitizedRow.status || 'new',
                                budget: sanitizedRow.budget ? parseFloat(sanitizedRow.budget) : null,
                                location: sanitizedRow.location || null,
                                tenantId: user.tenantId,
                                createdById: user.id
                            }
                        });
                        results.success++;
                    } catch (err: any) {
                        results.failed++;
                        results.errors.push(`Row ${i + batch.indexOf(row) + 1}: ${err.message}`);
                    }
                }
            });
        }

        return results;
    },

    /**
     * Import survey responses (Bulk upload for historical data)
     */
    async importResponses(surveyId: string, csvContent: string, user: any) {
        logger.info(`💾 Importing survey responses for tenant: ${user.tenantId}`);

        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        };

        const batchSize = 50;
        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize) as any[];

            await prisma.$transaction(async (tx) => {
                for (const row of batch) {
                    try {
                        // Sanitize fields to prevent CSV Injection
                        const sanitizedRow = { ...row };
                        for (const key of Object.keys(sanitizedRow)) {
                            if (typeof sanitizedRow[key] === 'string') {
                                const value = sanitizedRow[key];
                                if (/^[=\+\-@]/.test(value)) {
                                    sanitizedRow[key] = `'${value}`;
                                }
                            }
                        }

                        // Logical creation of response (assuming generic structure)
                        await tx.surveyResponse.create({
                            data: {
                                id: generateId(),
                                surveyId,
                                status: (sanitizedRow.status as any) || 'completed',
                                respondentEmail: sanitizedRow.email || null,
                                tenantId: user.tenantId,
                                // Note: Complexity of mapping answers would go here
                            } as any
                        });
                        results.success++;
                    } catch (err: any) {
                        results.failed++;
                        results.errors.push(`Row ${i + batch.indexOf(row) + 1}: ${err.message}`);
                    }
                }
            });
        }

        return results;
    }
};
