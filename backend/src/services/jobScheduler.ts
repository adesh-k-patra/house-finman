import cron from 'node-cron';
import { prisma } from '../models/prisma.js';
import { logger } from '../utils/logger.js';
import { socketService } from './socketService.js';

class JobScheduler {
    public init() {
        // 1. Every midnight: Close expired surveys
        cron.schedule('0 0 * * *', async () => {
            logger.info('🕒 Running job: Close Expired Surveys');
            try {
                const now = new Date();
                const result = await prisma.survey.updateMany({
                    where: {
                        status: 'active',
                        endDate: { lte: now }
                    },
                    data: { status: 'ended' }
                });
                logger.info(`✅ Closed ${result.count} expired surveys`);
            } catch (error) {
                logger.error('❌ Error closing expired surveys:', error);
            }
        });

        // 2. Every hour: Cleanup old export files (Mock logic)
        cron.schedule('0 * * * *', () => {
            logger.info('🕒 Running job: Cleanup Old Exports');
            // In a real app, delete files from /tmp or S3 bucket
            logger.info('✅ Cleanup completed');
        });

        // 3. Every 5 minutes: Real-time Analytics Heartbeat (Demo purposes)
        cron.schedule('*/5 * * * *', async () => {
            logger.info('🕒 Running job: Analytics Heartbeat');
            try {
                // Broadcast current active survey count to all tenants
                const activeCount = await prisma.survey.count({ where: { status: 'active' } });
                socketService.emitToRoom('admin_dashboard', 'stats_update', {
                    activeSurveys: activeCount,
                    timestamp: new Date()
                });
            } catch (error) {
                logger.error('❌ Heartbeat error:', error);
            }
        });

        logger.info('🚀 Job Scheduler initialized');
    }
}

export const jobScheduler = new JobScheduler();
