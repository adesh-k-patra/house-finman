/**
 * Database Seeder
 * Seeds the database with initial/demo data
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Generate UUID-like IDs
function generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function main() {
    console.log('🌱 Starting database seed...');

    // Hash password
    const passwordHash = await bcrypt.hash('Admin@123', 12);

    // Create default tenant
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'default' },
        update: {},
        create: {
            id: generateId(),
            name: 'House FinMan Demo',
            slug: 'default',
            isActive: true,
        },
    });

    console.log('✅ Created tenant:', tenant.name);

    // Create users
    const users = [
        { email: 'admin@housefinman.com', name: 'Rahul Sharma', role: 'super_admin' },
        { email: 'manager@housefinman.com', name: 'Priya Patel', role: 'tenant_admin' },
        { email: 'agent@housefinman.com', name: 'Amit Kumar', role: 'agent' },
        { email: 'finance@housefinman.com', name: 'Deepak Verma', role: 'finance' },
        { email: 'support@housefinman.com', name: 'Sneha Gupta', role: 'cx' },
    ];

    for (const userData of users) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                id: generateId(),
                email: userData.email,
                passwordHash,
                name: userData.name,
                role: userData.role,
                tenantId: tenant.id,
                isActive: true,
                permissions: '[]',
            },
        });
        console.log(`✅ Created user: ${user.name} (${user.role})`);
    }

    // Get admin user for creating leads
    const adminUser = await prisma.user.findUnique({ where: { email: 'admin@housefinman.com' } });
    const agentUser = await prisma.user.findUnique({ where: { email: 'agent@housefinman.com' } });

    if (!adminUser || !agentUser) {
        throw new Error('Users not found');
    }

    // Create leads
    const leadData = [
        { firstName: 'Vikram', lastName: 'Singh', phone: '9876543210', email: 'vikram@example.com', source: 'website', status: 'new', budget: 5000000 },
        { firstName: 'Anita', lastName: 'Desai', phone: '9876543211', email: 'anita@example.com', source: 'referral', status: 'contacted', budget: 7500000 },
        { firstName: 'Rajesh', lastName: 'Khanna', phone: '9876543212', email: 'rajesh@example.com', source: 'partner', status: 'qualified', budget: 3500000 },
        { firstName: 'Meera', lastName: 'Nair', phone: '9876543213', email: 'meera@example.com', source: 'campaign', status: 'negotiation', budget: 10000000 },
        { firstName: 'Suresh', lastName: 'Reddy', phone: '9876543214', email: 'suresh@example.com', source: 'cold_call', status: 'new', budget: 4500000 },
        { firstName: 'Kavita', lastName: 'Sharma', phone: '9876543215', email: 'kavita@example.com', source: 'walk_in', status: 'contacted', budget: 6000000 },
        { firstName: 'Arun', lastName: 'Joshi', phone: '9876543216', email: 'arun@example.com', source: 'website', status: 'qualified', budget: 8000000 },
        { firstName: 'Pooja', lastName: 'Mehta', phone: '9876543217', email: 'pooja@example.com', source: 'referral', status: 'won', budget: 5500000 },
        { firstName: 'Sanjay', lastName: 'Kapoor', phone: '9876543218', email: 'sanjay@example.com', source: 'partner', status: 'lost', budget: 9000000 },
        { firstName: 'Neha', lastName: 'Agarwal', phone: '9876543219', email: 'neha@example.com', source: 'campaign', status: 'new', budget: 4000000 },
    ];

    for (const data of leadData) {
        await prisma.lead.create({
            data: {
                id: generateId(),
                ...data,
                location: 'Mumbai',
                tenantId: tenant.id,
                createdById: adminUser.id,
                assignedToId: agentUser.id,
            },
        });
    }
    console.log(`✅ Created ${leadData.length} leads`);

    // Create properties
    const propertyData = [
        { name: 'Green Valley Apartments', type: 'apartment', status: 'available', address: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', basePrice: 5000000, currentPrice: 5200000, bedrooms: 2, bathrooms: 2 },
        { name: 'Sunrise Villas', type: 'villa', status: 'available', address: '456 Beach Road', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001', basePrice: 12000000, currentPrice: 12500000, bedrooms: 4, bathrooms: 3 },
        { name: 'Metro Heights', type: 'apartment', status: 'reserved', address: '789 Nehru Nagar', city: 'Bangalore', state: 'Karnataka', pincode: '560001', basePrice: 6500000, currentPrice: 6800000, bedrooms: 3, bathrooms: 2 },
        { name: 'Garden View Plot', type: 'plot', status: 'available', address: '101 Green Lane', city: 'Pune', state: 'Maharashtra', pincode: '411001', basePrice: 2500000, currentPrice: 2700000 },
        { name: 'Business Hub', type: 'commercial', status: 'available', address: '202 Corporate Park', city: 'Hyderabad', state: 'Telangana', pincode: '500001', basePrice: 15000000, currentPrice: 15500000 },
    ];

    for (const data of propertyData) {
        await prisma.property.create({
            data: {
                id: generateId(),
                ...data,
                tenantId: tenant.id,
                amenities: JSON.stringify(['parking', 'security', 'gym']),
                specifications: JSON.stringify({ facing: 'East', floor: 5 }),
                approvalStatus: 'approved',
            },
        });
    }
    console.log(`✅ Created ${propertyData.length} properties`);

    // Create partners
    const partnerData = [
        { name: 'Ramesh Builders', type: 'company', email: 'contact@rameshbuilders.com', phone: '9888888801', status: 'active', commissionRate: 2.5 },
        { name: 'Priya Realtors', type: 'individual', email: 'priya@realtors.com', phone: '9888888802', status: 'active', commissionRate: 3 },
        { name: 'Home Finders', type: 'channel_partner', email: 'info@homefinders.in', phone: '9888888803', status: 'pending', commissionRate: 2 },
    ];

    for (const data of partnerData) {
        await prisma.partner.create({
            data: {
                id: generateId(),
                ...data,
                city: 'Mumbai',
                state: 'Maharashtra',
                onboardingStatus: data.status === 'active' ? 'approved' : 'pending',
                tenantId: tenant.id,
            },
        });
    }
    console.log(`✅ Created ${partnerData.length} partners`);

    // Create vendors
    const vendorData = [
        { name: 'BuildRight Materials', type: 'supplier', email: 'sales@buildright.com', phone: '9777777701', status: 'active' },
        { name: 'InteriorPro', type: 'contractor', email: 'contact@interiorpro.in', phone: '9777777702', status: 'active' },
        { name: 'SecureGuard Services', type: 'service_provider', email: 'info@secureguard.com', phone: '9777777703', status: 'active' },
    ];

    for (const data of vendorData) {
        await prisma.vendor.create({
            data: {
                id: generateId(),
                ...data,
                city: 'Mumbai',
                state: 'Maharashtra',
                tenantId: tenant.id,
            },
        });
    }
    console.log(`✅ Created ${vendorData.length} vendors`);

    // Create tickets
    const ticketData = [
        { subject: 'Unable to access property documents', category: 'technical', priority: 'high', status: 'open' },
        { subject: 'Billing inquiry for Q4', category: 'billing', priority: 'medium', status: 'in_progress' },
        { subject: 'Site visit scheduling request', category: 'sales', priority: 'low', status: 'resolved' },
    ];

    const supportUser = await prisma.user.findUnique({ where: { email: 'support@housefinman.com' } });

    for (const data of ticketData) {
        await prisma.ticket.create({
            data: {
                id: generateId(),
                ticketNumber: `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                ...data,
                description: `Detailed description for: ${data.subject}`,
                createdById: adminUser.id,
                assignedToId: supportUser?.id,
                tenantId: tenant.id,
            },
        });
    }
    console.log(`✅ Created ${ticketData.length} tickets`);

    // Create campaigns
    const campaignData = [
        { name: 'New Year Offers 2026', type: 'email', status: 'running', budget: 100000 },
        { name: 'Property Expo March', type: 'event', status: 'scheduled', budget: 500000 },
        { name: 'WhatsApp Lead Campaign', type: 'whatsapp', status: 'completed', budget: 50000 },
    ];

    for (const data of campaignData) {
        await prisma.campaign.create({
            data: {
                id: generateId(),
                ...data,
                description: `Description for ${data.name}`,
                tenantId: tenant.id,
            },
        });
    }
    console.log(`✅ Created ${campaignData.length} campaigns`);

    // Create opportunities from converted leads
    const wonsLead = await prisma.lead.findFirst({ where: { status: 'won' } });
    const properties = await prisma.property.findMany({ take: 2 });

    if (wonsLead && properties.length > 0) {
        // Check if opportunity already exists for this lead
        const existingOpp = await prisma.opportunity.findUnique({
            where: { leadId: wonsLead.id }
        });

        if (!existingOpp) {
            await prisma.opportunity.create({
                data: {
                    id: generateId(),
                    name: `${wonsLead.firstName} ${wonsLead.lastName} - ${properties[0].name}`,
                    value: properties[0].currentPrice,
                    probability: 90,
                    stage: 'closed_won',
                    leadId: wonsLead.id,
                    propertyId: properties[0].id,
                    tenantId: tenant.id,
                    actualCloseDate: new Date(),
                },
            });
            console.log('✅ Created won opportunity');
        } else {
            console.log('ℹ️ Opportunity already exists for won lead');
        }

        // Create more opportunities (only if not existing)
        // Since the second one doesn't link to a specific UNIQUE lead (it's a pipeline deal), 
        // we should make sure we don't spam it. 
        // But the original code didn't link it to a leadId (it was null/undefined in the original code? wait, let me check schema)
        // Schema: leadId String? @unique. So second one MUST have null leadId or unique one.
        // Original code:
        /*
        await prisma.opportunity.create({
            data: {
                id: generateId(),
                name: 'Pipeline Deal - Metro Heights',
                // ... No leadId provided, so it is null. 
                // IF leadId is null, unique constraint doesn't apply? 
                // SQLite treats NULLs as distinct usually, ensuring multiple NULLs are allowed unless specified otherwise.
                // However, let's just check if it exists by name to be cleaner.
            }
        */

        const pipelineDealName = 'Pipeline Deal - Metro Heights';
        const existingPipelineDeal = await prisma.opportunity.findFirst({
            where: { name: pipelineDealName }
        });

        if (!existingPipelineDeal) {
            await prisma.opportunity.create({
                data: {
                    id: generateId(),
                    name: pipelineDealName,
                    value: 6800000,
                    probability: 60,
                    stage: 'proposal',
                    propertyId: properties[1]?.id,
                    tenantId: tenant.id,
                    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
            });
            console.log('✅ Created pipeline opportunity');
        }
    }

    // ===========================================
    // SURVEYS & TEMPLATES (Added)
    // ===========================================

    const templates = [
        {
            title: 'Buyer Intent Survey',
            category: 'Sales',
            description: 'Gauge buyer seriousness and budget.',
            questions: JSON.stringify([
                { id: 'q1', type: 'choice', text: 'When are you planning to buy?', options: ['Immediately', '3-6 Months', 'Just Looking'] },
                { id: 'q2', type: 'range', text: 'What is your budget range?', options: ['30L-50L', '50L-1Cr', '1Cr+'] },
                { id: 'q3', type: 'text', text: 'Preferred Location?' }
            ])
        },
        {
            title: 'Post-Visit Feedback',
            category: 'Feedback',
            description: 'Feedback after property site visit.',
            questions: JSON.stringify([
                { id: 'q1', type: 'rating', text: 'How was the site visit experience?' },
                { id: 'q2', type: 'text', text: 'What did you like the most?' },
                { id: 'q3', type: 'boolean', text: 'Would you like to schedule a meeting?' }
            ])
        },
        {
            title: 'Loan Pre-Qualification',
            category: 'Finance',
            description: 'Check eligibility for home loans.',
            questions: JSON.stringify([
                { id: 'q1', type: 'number', text: 'Monthly Income?' },
                { id: 'q2', type: 'boolean', text: 'Have exisiting loans?' },
                { id: 'q3', type: 'file', text: 'Upload Salary Slip' }
            ])
        }
    ];

    for (const t of templates) {
        await prisma.surveyTemplate.create({
            data: {
                id: generateId(),
                title: t.title,
                description: t.description,
                category: t.category,
                questions: t.questions,
                isPublic: true,
            }
        });
    }
    console.log(`✅ Created ${templates.length} survey templates`);

    // Active Survey
    const activeSurveyId = generateId();
    const q1Id = generateId();
    const q2Id = generateId();

    await prisma.survey.create({
        data: {
            id: activeSurveyId,
            title: 'Q1 Buyer Survey',
            type: 'product_research',
            channel: 'email',
            status: 'active',
            tenantId: tenant.id,
            createdById: adminUser.id,
            questions: {
                create: [
                    { id: q1Id, text: 'Budget Range?', type: 'choice', order: 0, options: JSON.stringify(['High', 'Low']) },
                    { id: q2Id, text: 'Comments', type: 'text', order: 1 }
                ]
            }
        }
    });

    // Follow-up Sequence
    const seqId = generateId();
    await prisma.followUpSequence.create({
        data: {
            id: seqId,
            surveyId: activeSurveyId,
            isActive: true,
            steps: {
                create: [
                    { id: generateId(), order: 0, delayHours: 24, channel: 'email', content: 'Thanks for filling it out!' },
                    { id: generateId(), order: 1, delayHours: 72, channel: 'sms', content: 'Did you check our new offers?' }
                ]
            }
        }
    });

    // Dummy Responses
    for (let i = 0; i < 50; i++) {
        await prisma.surveyResponse.create({
            data: {
                id: generateId(),
                surveyId: activeSurveyId,
                status: 'completed',
                score: Math.floor(Math.random() * 100),
                intentLabel: Math.random() > 0.7 ? 'High' : 'Medium',
                respondentEmail: `user${i}@example.com`,
                answers: {
                    create: [
                        { id: generateId(), questionId: q1Id, value: 'High', timeSpent: 10 }
                    ]
                }
            }
        });
    }
    console.log(`✅ Created active survey with follow-ups & responses`);
    console.log('\n📝 Login credentials:');
    console.log('   Email: admin@housefinman.com');
    console.log('   Password: Admin@123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
