/**
 * Security Test Setup
 * Initialize test environment
 */

import { beforeAll, afterAll, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// Mock Prisma
const prisma = new PrismaClient();

beforeAll(async () => {
    // console.log('Starting security tests...');
});

afterAll(async () => {
    await prisma.$disconnect();
    // console.log('Security tests completed.');
});

export { prisma };
