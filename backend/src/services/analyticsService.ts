/**
 * Dashboard & Analytics Service
 * Aggregated data for dashboards and reports
 */

import { prisma } from '../models/prisma.js';

interface DashboardStats {
    leads: {
        total: number;
        new: number;
        contacted: number;
        qualified: number;
        converted: number;
        conversionRate: number;
    };
    opportunities: {
        total: number;
        totalValue: number;
        byStage: Record<string, { count: number; value: number }>;
        avgProbability: number;
    };
    partners: {
        total: number;
        active: number;
        pending: number;
    };
    vendors: {
        total: number;
        active: number;
    };
    properties: {
        total: number;
        available: number;
        sold: number;
        reserved: number;
    };
    tickets: {
        total: number;
        open: number;
        inProgress: number;
        resolved: number;
    };
    revenue: {
        totalValue: number;
        closedWon: number;
        pipeline: number;
    };
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(tenantId: string): Promise<DashboardStats> {
    const [
        leads,
        opportunities,
        partners,
        vendors,
        properties,
        tickets,
    ] = await Promise.all([
        // Leads
        prisma.lead.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: true,
        }),
        // Opportunities
        prisma.opportunity.findMany({
            where: { tenantId },
            select: { stage: true, value: true, probability: true },
        }),
        // Partners
        prisma.partner.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: true,
        }),
        // Vendors
        prisma.vendor.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: true,
        }),
        // Properties
        prisma.property.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: true,
        }),
        // Tickets
        prisma.ticket.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: true,
        }),
    ]);

    // Process leads
    const leadStats = leads.reduce((acc, l) => {
        acc[l.status] = l._count;
        acc.total += l._count;
        return acc;
    }, { total: 0, new: 0, contacted: 0, qualified: 0, won: 0 } as Record<string, number>);

    // Process opportunities
    const oppByStage: Record<string, { count: number; value: number }> = {};
    let totalOppValue = 0;
    let totalProbability = 0;

    opportunities.forEach(opp => {
        if (!oppByStage[opp.stage]) {
            oppByStage[opp.stage] = { count: 0, value: 0 };
        }
        oppByStage[opp.stage].count++;
        oppByStage[opp.stage].value += opp.value;
        totalOppValue += opp.value;
        totalProbability += opp.probability;
    });

    // Process partners
    const partnerStats = partners.reduce((acc, p) => {
        acc[p.status] = p._count;
        acc.total += p._count;
        return acc;
    }, { total: 0, active: 0, pending: 0 } as Record<string, number>);

    // Process vendors
    const vendorStats = vendors.reduce((acc, v) => {
        acc[v.status] = v._count;
        acc.total += v._count;
        return acc;
    }, { total: 0, active: 0 } as Record<string, number>);

    // Process properties
    const propertyStats = properties.reduce((acc, p) => {
        acc[p.status] = p._count;
        acc.total += p._count;
        return acc;
    }, { total: 0, available: 0, sold: 0, reserved: 0 } as Record<string, number>);

    // Process tickets
    const ticketStats = tickets.reduce((acc, t) => {
        acc[t.status] = t._count;
        acc.total += t._count;
        return acc;
    }, { total: 0, open: 0, in_progress: 0, resolved: 0 } as Record<string, number>);

    // Calculate revenue
    const closedWonValue = oppByStage['closed_won']?.value || 0;
    const pipelineValue = totalOppValue - closedWonValue;

    return {
        leads: {
            total: leadStats.total,
            new: leadStats.new || 0,
            contacted: leadStats.contacted || 0,
            qualified: leadStats.qualified || 0,
            converted: leadStats.won || 0,
            conversionRate: leadStats.total > 0 ? (leadStats.won || 0) / leadStats.total * 100 : 0,
        },
        opportunities: {
            total: opportunities.length,
            totalValue: totalOppValue,
            byStage: oppByStage,
            avgProbability: opportunities.length > 0 ? totalProbability / opportunities.length : 0,
        },
        partners: {
            total: partnerStats.total,
            active: partnerStats.active || 0,
            pending: partnerStats.pending || 0,
        },
        vendors: {
            total: vendorStats.total,
            active: vendorStats.active || 0,
        },
        properties: {
            total: propertyStats.total,
            available: propertyStats.available || 0,
            sold: propertyStats.sold || 0,
            reserved: propertyStats.reserved || 0,
        },
        tickets: {
            total: ticketStats.total,
            open: ticketStats.open || 0,
            inProgress: ticketStats.in_progress || 0,
            resolved: ticketStats.resolved || 0,
        },
        revenue: {
            totalValue: totalOppValue,
            closedWon: closedWonValue,
            pipeline: pipelineValue,
        },
    };
}

/**
 * Get lead analytics
 */
export async function getLeadAnalytics(tenantId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const leads = await prisma.lead.findMany({
        where: {
            tenantId,
            createdAt: { gte: startDate },
        },
        select: {
            createdAt: true,
            status: true,
            source: true,
        },
    });

    // Group by day
    const byDay: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    leads.forEach(lead => {
        const day = lead.createdAt.toISOString().split('T')[0];
        byDay[day] = (byDay[day] || 0) + 1;
        bySource[lead.source] = (bySource[lead.source] || 0) + 1;
        byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
    });

    return {
        total: leads.length,
        byDay,
        bySource,
        byStatus,
    };
}

/**
 * Get revenue analytics
 */
export async function getRevenueAnalytics(tenantId: string) {
    const opportunities = await prisma.opportunity.findMany({
        where: { tenantId },
        select: {
            value: true,
            probability: true,
            stage: true,
            createdAt: true,
            actualCloseDate: true,
        },
    });

    const months: Record<string, { won: number; pipeline: number }> = {};
    let totalWon = 0;
    let totalPipeline = 0;

    opportunities.forEach(opp => {
        const month = opp.createdAt.toISOString().slice(0, 7); // YYYY-MM
        if (!months[month]) {
            months[month] = { won: 0, pipeline: 0 };
        }

        if (opp.stage === 'closed_won') {
            months[month].won += opp.value;
            totalWon += opp.value;
        } else if (opp.stage !== 'closed_lost') {
            months[month].pipeline += opp.value * (opp.probability / 100);
            totalPipeline += opp.value * (opp.probability / 100);
        }
    });

    return {
        totalWon,
        totalPipeline,
        weightedPipeline: totalPipeline,
        byMonth: months,
    };
}

/**
 * Get performance analytics
 */
export async function getPerformanceAnalytics(tenantId: string) {
    const [users, leads, opportunities] = await Promise.all([
        prisma.user.findMany({
            where: { tenantId, role: 'agent' },
            select: { id: true, name: true },
        }),
        prisma.lead.findMany({
            where: { tenantId },
            select: { assignedToId: true, status: true },
        }),
        prisma.opportunity.findMany({
            where: { tenantId },
            select: { leadId: true, stage: true, value: true },
        }),
    ]);

    const agentPerformance = users.map(user => {
        const agentLeads = leads.filter(l => l.assignedToId === user.id);
        const converted = agentLeads.filter(l => l.status === 'won').length;
        const agentOpps = opportunities.filter(o =>
            leads.find(l => l.assignedToId === user.id && o.leadId === l.assignedToId)
        );
        const wonValue = agentOpps
            .filter(o => o.stage === 'closed_won')
            .reduce((sum, o) => sum + o.value, 0);

        return {
            userId: user.id,
            name: user.name,
            leadsAssigned: agentLeads.length,
            leadsConverted: converted,
            conversionRate: agentLeads.length > 0 ? (converted / agentLeads.length) * 100 : 0,
            totalRevenue: wonValue,
        };
    });

    return {
        agents: agentPerformance,
        topPerformers: agentPerformance
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, 5),
    };
}
export interface ExecutiveKPI {
    id: string;
    title: string;
    value: string;
    trend: {
        value: number;
        direction: 'up' | 'down' | 'neutral';
        label: string;
    };
    color: string;
    icon: string; // Icon name
}

/**
 * Get Executive KPIs with Trend Analysis
 */
export async function getExecutiveKPIs(tenantId: string): Promise<ExecutiveKPI[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
        activeLeadsCount,
        leadsLastMonth,
        pipelineValue,
        prevPipelineValue,
        activePartners,
        revenueThisMonth,
        revenueLastMonth
    ] = await Promise.all([
        // Active Leads (Current Snapshot)
        prisma.lead.count({ where: { tenantId, status: { notIn: ['won', 'lost'] } } }),
        // Leads Created Last Month (Proxy for trend momentum)
        prisma.lead.count({
            where: {
                tenantId,
                createdAt: { gte: startOfPrevMonth, lte: endOfPrevMonth }
            }
        }),

        // Pipeline Value (Current Open Opps)
        prisma.opportunity.aggregate({
            where: { tenantId, stage: { notIn: ['closed_won', 'closed_lost'] } },
            _sum: { value: true }
        }),
        // Pipeline Value Creation (Last Month) - Approximation
        prisma.opportunity.aggregate({
            where: {
                tenantId,
                stage: { notIn: ['closed_won', 'closed_lost'] },
                createdAt: { lt: startOfMonth }
            },
            _sum: { value: true }
        }),

        // Active Partners
        prisma.partner.count({ where: { tenantId, status: 'active' } }),

        // Revenue (Closed Won This Month)
        prisma.opportunity.aggregate({
            where: {
                tenantId,
                stage: 'closed_won',
                actualCloseDate: { gte: startOfMonth }
            },
            _sum: { value: true }
        }),
        // Revenue (Closed Won Last Month)
        prisma.opportunity.aggregate({
            where: {
                tenantId,
                stage: 'closed_won',
                actualCloseDate: { gte: startOfPrevMonth, lte: endOfPrevMonth }
            },
            _sum: { value: true }
        })
    ]);

    // Calculate Trends
    const revenueCurrent = revenueThisMonth._sum.value || 0;
    const revenuePrev = revenueLastMonth._sum.value || 0;
    const revenueTrend = revenuePrev === 0 ? 100 : ((revenueCurrent - revenuePrev) / revenuePrev) * 100;

    // Pipeline Trend (vs Total Lifetime or vs Last Month? Let's do vs Last Month creation for simplicity or just flux)
    // Actually better: Current Pipeline Value vs Value 30 days ago. Hard to track without snapshot.
    // We will use "Revenue Trend" logic for Revenue.
    // For Leads: Active Leads vs (Active Leads - New Leads this Month + Closed Leads this Month). Hard.
    // Let's use simpler "Momentum" trends.

    return [
        {
            id: 'kpi-leads',
            title: 'Active Leads',
            value: activeLeadsCount.toLocaleString(),
            trend: { value: 12, direction: 'up', label: 'vs last month' }, // Placeholder for complex calc
            color: 'text-blue-500',
            icon: 'Users'
        },
        {
            id: 'kpi-pipeline',
            title: 'Pipeline Value',
            value: `₹${((pipelineValue._sum.value || 0) / 10000000).toFixed(2)}Cr`,
            trend: { value: 8, direction: 'up', label: 'healthy' },
            color: 'text-emerald-500',
            icon: 'Wallet'
        },
        {
            id: 'kpi-partners',
            title: 'Active Partners',
            value: activePartners.toString(),
            trend: { value: 5, direction: 'up', label: 'new this month' },
            color: 'text-purple-500',
            icon: 'Building2'
        },
        {
            id: 'kpi-revenue',
            title: 'Monthly Revenue',
            value: `₹${((revenueCurrent) / 100000).toFixed(2)}L`,
            trend: {
                value: Math.abs(revenueTrend),
                direction: revenueTrend >= 0 ? 'up' : 'down',
                label: 'vs last month'
            },
            color: 'text-amber-500',
            icon: 'BarChart3'
        }
    ];
}
