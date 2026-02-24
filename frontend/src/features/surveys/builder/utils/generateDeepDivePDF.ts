import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

// Define the data structure locally to avoid circular dependency
// This matches the DeepDiveData type from the modal
// Define the data structure locally to avoid circular dependency
// This matches the DeepDiveData type from the modal
interface DeepDiveReportData {
    reportOverview: {
        title: string
        surveyName: string
        hypothesisId: string
        category: string
        generatedOn: string
        dataCoverage: string
        respondentBase: number
        confidenceLevel: number
    }
    executiveSummary: {
        statement: string
        keyFinding: string
        impactSummary: { revenue: string; conversion: string; nps: string; risk: string }
        confidence: number
        urgency: 'High' | 'Medium' | 'Low'
        recommendedAction: string
        expectedOutcome: string
    }
    hypothesisDefinition: {
        name: string
        question: string
        nullHypothesis: string
        alternateHypothesis: string
        businessProblem: string
        stakeholderObjective: string
        assumptions: string[]
    }
    targetSegment: {
        audienceType: string
        demographics: { ageRange: string; gender: string; education: string }
        financialFilters: { budgetRange: string; loanAmount: string; incomeRange: string }
        intentSignals: { timeframe: string; urgency: string }
        geography: string
        channelSource: string
        sampleSize: number
    }
    dataSources: {
        surveyQuestions: string[]
        questionTypes: string[]
        behavioralData: string[]
        integrations: string[]
        avgCompletionTime: string
        dropOffPoints: string[]
    }
    keyMetrics: {
        primaryMetric: string
        secondaryMetrics: string[]
        supportingKPIs: string[]
        baseline: { conversion: number; dropOff: number; avgTime: string }
        variant: { conversion: number; dropOff: number; avgTime: string }
        trendDirection: string
    }
    statisticalAnalysis: {
        method: string
        significance: number
        effectSize: number
        confidenceInterval: number[]
        sampleAdequacy: string
        biasDetection: string
    }
    visualization: {
        chartType: string
        data: { step: string; value: number; variant: number }[]
    }
    coreFindings: {
        primaryInsight: string
        evidence: string[]
        contradictory: string
        pattern: string
        behavioralExplanation: string
        financialInterpretation: string
    }
    aiReasoning: {
        whyGenerated: string
        signalWeighting: { dropOffSignal: number; surveyFeedback: number; behavioral: number }
        featureImportance: string[]
        correlationDrivers: string[]
        confidenceDrivers: string[]
        limitations: string[]
    }
    confidenceScore: {
        overall: number
        dataQuality: number
        sampleStrength: number
        signalConsistency: number
        historicalMatch: number
        falsePositiveRisk: string
    }
    businessImpact: {
        conversionUplift: string
        revenueImpact: string
        costReduction: string
        npsLift: string
        riskReduction: string
        timeToValue: string
    }
    recommendedActions: {
        primary: string
        secondary: string[]
        departmentOwner: string
        channel: string
        automationPotential: string
        priority: string
    }
    experimentPlan: {
        testType: string
        control: string
        test: string
        successMetrics: string[]
        duration: string
        minSample: number
        rollbackCriteria: string
    }
    implementationReadiness: {
        dataReadiness: string
        techDependency: string
        crmMapping: string
        trainingRequired: string
        estimatedEffort: string
        goLiveTimeline: string
    }
    risks: {
        dataLimitations: string
        segmentBias: string
        externalFactors: string
        seasonality: string
        regulatory: string
        overfitting: string
    }
    crossHypothesis: {
        similar: string[]
        conflicting: string[]
        reinforcing: string[]
        priorityRank: number
        netImpactScore: number
    }
    historicalPerformance: {
        pastResults: { id: string; prediction: string; actual: string; accuracy: string }[]
        accuracyHistory: string
        learningFeedback: string
    }
    actionTracking: {
        status: string
        owner: string
        startDate: string
        completionDate: string
        kpiMonitoring: string
        outcomeLogged: string
    }
    aiRecommendations: {
        relatedHypotheses: string[]
        missingData: string[]
        additionalQuestions: string[]
        deeperSegments: string[]
    }
}

// ============ CHART HELPERS ============

type ColorTuple = [number, number, number];

const COLORS: Record<string, ColorTuple> = {
    slate900: [15, 23, 42],
    slate800: [30, 41, 59],
    slate700: [51, 65, 85],
    slate500: [100, 116, 139],
    slate100: [241, 245, 249],
    blue600: [37, 99, 235],
    blue500: [59, 130, 246],
    emerald500: [16, 185, 129],
    purple500: [168, 85, 247],
    orange500: [249, 115, 22],
    rose500: [244, 63, 94]
}

const drawBarChart = (doc: jsPDF, x: number, y: number, w: number, h: number, data: { label: string, value: number, color: number[] }[]) => {
    const margin = 10
    const barWidth = (w - (margin * 2)) / data.length
    const maxVal = Math.max(...data.map(d => d.value))

    // Axis lines
    doc.setDrawColor(226, 232, 240)
    doc.line(x, y + h, x + w, y + h) // X Axis

    data.forEach((d, i) => {
        const barHeight = (d.value / maxVal) * (h - 20)
        const bx = x + margin + (i * barWidth) + (barWidth * 0.15)
        const by = y + h - barHeight
        const bw = barWidth * 0.7

        // Bar with rounded top effect (simulated)
        doc.setFillColor(d.color[0], d.color[1], d.color[2])
        doc.rect(bx, by, bw, barHeight, 'F')

        // Label
        doc.setFontSize(8)
        doc.setTextColor(COLORS.slate500[0], COLORS.slate500[1], COLORS.slate500[2])
        doc.text(d.label, bx + (bw / 2), y + h + 5, { align: 'center', maxWidth: bw })

        // Value
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(COLORS.slate700[0], COLORS.slate700[1], COLORS.slate700[2])
        doc.text(d.value.toString(), bx + (bw / 2), by - 3, { align: 'center' })
    })
}

const drawStackedBar = (doc: jsPDF, x: number, y: number, w: number, h: number, segments: { label: string, value: number, color: number[] }[]) => {
    const total = segments.reduce((acc, s) => acc + s.value, 0)
    let currentX = x

    // Rounded container background
    doc.setFillColor(COLORS.slate100[0], COLORS.slate100[1], COLORS.slate100[2])
    doc.roundedRect(x, y, w, h, 2, 2, 'F')

    segments.forEach((s, i) => {
        const segW = (s.value / total) * w
        doc.setFillColor(s.color[0], s.color[1], s.color[2])

        // Handle rounded corners for first and last
        if (i === 0) {
            doc.rect(currentX, y, segW, h, 'F') // Simplified for now, pure rect
        } else {
            doc.rect(currentX, y, segW, h, 'F')
        }

        // Label inside if wide enough
        if (segW > 15) {
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(8)
            doc.setFont('helvetica', 'bold')
            doc.text(`${Math.round((s.value / total) * 100)}%`, currentX + (segW / 2), y + (h / 2) + 1, { align: 'center', baseline: 'middle' })
        }

        currentX += segW

        // Spacer (white line)
        if (i < segments.length - 1) {
            doc.setDrawColor(255, 255, 255)
            doc.setLineWidth(0.5)
            doc.line(currentX, y, currentX, y + h)
        }
    })

    // Legend below
    let legendX = x
    segments.forEach(s => {
        doc.setFillColor(s.color[0], s.color[1], s.color[2])
        doc.circle(legendX + 2, y + h + 8, 2, 'F')

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(80, 80, 80)
        doc.text(s.label, legendX + 6, y + h + 9)
        legendX += 45
    })
}

export const generateDeepDivePDF = (data: DeepDiveReportData) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Helper: Add Premium Header
    const addHeader = (title: string, subtitle?: string) => {
        // Dark header bar
        doc.setFillColor(COLORS.slate900[0], COLORS.slate900[1], COLORS.slate900[2])
        doc.rect(0, 0, pageWidth, 24, 'F')

        // Accent Line
        doc.setDrawColor(COLORS.blue500[0], COLORS.blue500[1], COLORS.blue500[2])
        doc.setLineWidth(0.5)
        doc.line(0, 24, pageWidth, 24)

        // Title
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text("HOUSEFIN MAN INTELLIGENCE", 15, 16)

        // Date pill
        doc.setFillColor(COLORS.slate800[0], COLORS.slate800[1], COLORS.slate800[2])
        doc.roundedRect(pageWidth - 55, 8, 40, 8, 1, 1, 'F')
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(format(new Date(), 'MMM d, yyyy'), pageWidth - 35, 13, { align: 'center' })

        // Page Title below header
        doc.setTextColor(COLORS.slate900[0], COLORS.slate900[1], COLORS.slate900[2])
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text(title, 15, 42)

        if (subtitle) {
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(COLORS.slate500[0], COLORS.slate500[1], COLORS.slate500[2])
            doc.text(subtitle, 15, 48)
        }

        // Divider
        doc.setDrawColor(COLORS.slate100[0], COLORS.slate100[1], COLORS.slate100[2])
        doc.line(15, 54, pageWidth - 15, 54)
    }

    // Helper: Add Footer
    const addFooter = (pageNo: number) => {
        doc.setFillColor(255, 255, 255)
        doc.rect(0, pageHeight - 15, pageWidth, 15, 'F')
        doc.setDrawColor(COLORS.slate100[0], COLORS.slate100[1], COLORS.slate100[2])
        doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15)

        doc.setTextColor(COLORS.slate500[0], COLORS.slate500[1], COLORS.slate500[2])
        doc.setFontSize(8)
        doc.text(`Page ${pageNo}`, pageWidth - 15, pageHeight - 6, { align: 'right' })
        doc.text(`CONFIDENTIAL - AI Generated Insight Report`, 15, pageHeight - 6)
    }

    let currentPage = 1

    // ============ PAGE 1: COVER PAGE (Redesigned) ============

    // Dark Background Pattern
    doc.setFillColor(COLORS.slate900[0], COLORS.slate900[1], COLORS.slate900[2])
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Abstract decoration
    doc.setFillColor(COLORS.blue600[0], COLORS.blue600[1], COLORS.blue600[2])
    doc.circle(pageWidth, 0, 100, 'F')
    doc.setFillColor(COLORS.purple500[0], COLORS.purple500[1], COLORS.purple500[2])
    doc.circle(0, pageHeight, 80, 'F')

    // Glassmorphic Card
    doc.setFillColor(30, 41, 59) // Slate 800
    doc.roundedRect(20, pageHeight / 3 - 30, pageWidth - 40, 150, 4, 4, 'F')
    doc.setDrawColor(51, 65, 85) // Slate 700 border
    doc.setLineWidth(0.5)
    doc.roundedRect(20, pageHeight / 3 - 30, pageWidth - 40, 150, 4, 4, 'S')

    // Logo Area
    doc.setFillColor(COLORS.blue500[0], COLORS.blue500[1], COLORS.blue500[2])
    doc.roundedRect(40, pageHeight / 3 - 10, 16, 16, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text("AI", 48, pageHeight / 3 + 1, { align: 'center' })

    // Title
    doc.setFontSize(26)
    doc.text("Hypothesis Deep Dive", 40, pageHeight / 3 + 30)
    doc.setTextColor(148, 163, 184) // Slate 400
    doc.text("Comprehensive Analysis Report", 40, pageHeight / 3 + 42)

    doc.setDrawColor(71, 85, 105) // Slate 600
    doc.line(40, pageHeight / 3 + 55, pageWidth - 40, pageHeight / 3 + 55)

    // Details Grid
    const startY = pageHeight / 3 + 75
    doc.setFontSize(9)
    doc.setTextColor(148, 163, 184) // Slate 400
    doc.text("HYPOTHESIS ID", 40, startY)
    doc.text("GENERATED ON", 110, startY)

    doc.setFontSize(12)
    doc.setTextColor(255, 255, 255) // White
    doc.text(data.reportOverview.hypothesisId, 40, startY + 6)
    doc.text(data.reportOverview.generatedOn, 110, startY + 6)

    doc.setFontSize(9)
    doc.setTextColor(148, 163, 184)
    doc.text("CATEGORY", 40, startY + 25)
    doc.text("SURVEY", 110, startY + 25)

    doc.setFontSize(12)
    doc.setTextColor(255, 255, 255)
    doc.text(data.reportOverview.category, 40, startY + 31)
    doc.text(data.reportOverview.surveyName, 110, startY + 31)

    // Confidence Tag
    const confColor = data.reportOverview.confidenceLevel > 80 ? COLORS.emerald500 : COLORS.orange500
    doc.setFillColor(confColor[0], confColor[1], confColor[2])
    doc.roundedRect(pageWidth - 85, pageHeight / 3 - 10, 45, 10, 5, 5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text(`${data.reportOverview.confidenceLevel}% CONFIDENCE`, pageWidth - 62.5, pageHeight / 3 - 3, { align: 'center' })

    addFooter(currentPage++)

    // ============ PAGE 2: EXEC SUMMARY ============
    doc.addPage()
    addHeader("1. Executive Summary", "Strategic overview and key takeaways")

    // Key Finding Hero
    doc.setFillColor(239, 246, 255) // Blue 50
    doc.roundedRect(15, 60, pageWidth - 30, 40, 3, 3, 'F')
    doc.setDrawColor(191, 219, 254) // Blue 200
    doc.roundedRect(15, 60, pageWidth - 30, 40, 3, 3, 'S')

    doc.setTextColor(COLORS.blue600[0], COLORS.blue600[1], COLORS.blue600[2])
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text("PRIMARY INSIGHT", 20, 70)

    doc.setTextColor(COLORS.slate900[0], COLORS.slate900[1], COLORS.slate900[2])
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    const splitFinding = doc.splitTextToSize(`"${data.executiveSummary.keyFinding}"`, pageWidth - 40)
    doc.text(splitFinding, 20, 80)

    // Impact Grid - Styled
    let impactY = 115
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text("Business Impact Projection", 15, impactY)

    autoTable(doc, {
        startY: impactY + 5,
        head: [['Metric', 'Projection', 'Context']],
        body: [
            ['Revenue Impact', data.executiveSummary.impactSummary.revenue, 'Per Quarter'],
            ['Conversion Lift', data.executiveSummary.impactSummary.conversion, 'Target Segment'],
            ['NPS Improvement', data.executiveSummary.impactSummary.nps, 'Customer Sentiment'],
            ['Risk Reduction', data.executiveSummary.impactSummary.risk, 'Churn / Fraud']
        ],
        theme: 'grid',
        headStyles: { fillColor: COLORS.slate900, textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 6 },
        columnStyles: {
            0: { fontStyle: 'bold', textColor: COLORS.slate700 },
            1: { fontStyle: 'bold', textColor: COLORS.blue600 },
            2: { textColor: COLORS.slate500 }
        }
    })

    // Action Plan
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raY = (doc as any).lastAutoTable.finalY + 20

    doc.setFillColor(236, 253, 245) // Emerald 50
    doc.roundedRect(15, raY, pageWidth - 30, 35, 3, 3, 'F')
    doc.setDrawColor(167, 243, 208) // Emerald 200
    doc.roundedRect(15, raY, pageWidth - 30, 35, 3, 3, 'S')

    doc.setTextColor(COLORS.emerald500[0], COLORS.emerald500[1], COLORS.emerald500[2])
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text("RECOMMENDED STRATEGY", 20, raY + 10)

    doc.setTextColor(6, 78, 59) // Emerald 900
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const splitAction = doc.splitTextToSize(data.executiveSummary.recommendedAction, pageWidth - 40)
    doc.text(splitAction, 20, raY + 20)

    addFooter(currentPage++)

    // ============ PAGE 3: HYPOTHESIS & DATA ============
    doc.addPage()
    addHeader("2. Analysis Framework", "Hypothesis definition and data sources")

    // Hypothesis Table
    autoTable(doc, {
        startY: 60,
        body: [
            ['Question', data.hypothesisDefinition.question],
            ['Business Problem', data.hypothesisDefinition.businessProblem],
            ['Null Hypothesis', data.hypothesisDefinition.nullHypothesis],
            ['Alternate Hypothesis', data.hypothesisDefinition.alternateHypothesis]
        ],
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 8 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50, textColor: COLORS.slate700 } },
        alternateRowStyles: { fillColor: COLORS.slate100 }
    })

    // Data Sources - Chips style simulation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dsY = (doc as any).lastAutoTable.finalY + 20
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text("Integrated Data Sources", 15, dsY)

    let chipX = 15
    data.dataSources.integrations.forEach((source) => {
        doc.setFillColor(248, 250, 252)
        doc.setDrawColor(226, 232, 240)
        doc.roundedRect(chipX, dsY + 5, 45, 10, 5, 5, 'FD')

        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(COLORS.slate700[0], COLORS.slate700[1], COLORS.slate700[2])
        doc.text(source, chipX + 22.5, dsY + 11, { align: 'center' })

        chipX += 50
    })

    // Target Segment Table
    autoTable(doc, {
        startY: dsY + 25,
        head: [['Segment Profile', 'Details']],
        body: [
            ['Audience Type', data.targetSegment.audienceType],
            ['Demographics', `${data.targetSegment.demographics.ageRange}, ${data.targetSegment.demographics.gender}`],
            ['Geography', data.targetSegment.geography],
            ['Sample Size', `${data.targetSegment.sampleSize} Respondents`]
        ],
        theme: 'grid',
        headStyles: { fillColor: COLORS.slate800 }
    })

    addFooter(currentPage++)

    // ============ PAGE 4: DETAILED FINDINGS ============
    doc.addPage()
    addHeader("3. Core Findings", "Evidence and pattern recognition")

    // Funnel Chart
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text("Conversion Funnel Analysis", 15, 65)

    // Draw simplified funnel using bars
    drawBarChart(doc, 20, 75, 160, 60, data.visualization.data.map(d => ({
        label: d.step,
        value: d.value,
        color: COLORS.slate500
    })))

    // Overlay variant line (simulated description)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.blue600[0], COLORS.blue600[1], COLORS.blue600[2])
    doc.text("Blue Line: Variant Projection (+Expected Uplift)", 20, 145)

    // Key Evidence List
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.slate900[0], COLORS.slate900[1], COLORS.slate900[2])
    doc.text("Supporting Evidence", 15, 165)

    data.coreFindings.evidence.forEach((item, i) => {
        doc.setFillColor(COLORS.emerald500[0], COLORS.emerald500[1], COLORS.emerald500[2])
        doc.circle(20, 175 + (i * 12), 2, 'F')
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(COLORS.slate700[0], COLORS.slate700[1], COLORS.slate700[2])
        doc.text(item, 26, 176 + (i * 12))
    })

    // Critical Observation
    const obsY = 220
    doc.setFillColor(255, 251, 235) // Amber 50
    doc.roundedRect(15, obsY, pageWidth - 30, 25, 2, 2, 'F')
    doc.setDrawColor(252, 211, 77) // Amber 300
    doc.roundedRect(15, obsY, pageWidth - 30, 25, 2, 2, 'S')

    doc.setTextColor(180, 83, 9) // Amber 700
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text("CRITICAL PATTERN DETECTED", 20, obsY + 8)

    doc.setTextColor(120, 53, 15) // Amber 900
    doc.setFont('helvetica', 'normal')
    doc.text(data.coreFindings.pattern, 20, obsY + 18)

    addFooter(currentPage++)

    // ============ PAGE 5: IMPACT & ACTION ============
    doc.addPage()
    addHeader("4. Impact & Next Steps", "Financial projections and implementation")

    // Business Value Cards simulation

    // Revenue
    doc.setFillColor(236, 253, 245) // Emerald 50
    doc.roundedRect(15, 65, 55, 40, 4, 4, 'F')
    doc.setTextColor(5, 150, 105) // Emerald 600
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text("REVENUE LIFT", 20, 75)
    doc.setFontSize(16)
    doc.text(data.businessImpact.revenueImpact, 20, 88)
    doc.setFontSize(8)
    doc.text("Per Quarter", 20, 98)

    // Cost
    doc.setFillColor(239, 246, 255) // Blue 50
    doc.roundedRect(75, 65, 55, 40, 4, 4, 'F')
    doc.setTextColor(37, 99, 235) // Blue 600
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text("COST SAVINGS", 80, 75)
    doc.setFontSize(16)
    doc.text(data.businessImpact.costReduction, 80, 88)
    doc.setFontSize(8)
    doc.text("Operational Efficiency", 80, 98)

    // NPS
    doc.setFillColor(250, 245, 255) // Purple 50
    doc.roundedRect(135, 65, 55, 40, 4, 4, 'F')
    doc.setTextColor(147, 51, 234) // Purple 600
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text("NPS LIFT", 140, 75)
    doc.setFontSize(16)
    doc.text(data.businessImpact.npsLift, 140, 88)
    doc.setFontSize(8)
    doc.text("Customer Sentiment", 140, 98)

    // Action Plan Table
    doc.setFontSize(12)
    doc.setTextColor(COLORS.slate900[0], COLORS.slate900[1], COLORS.slate900[2])
    doc.text("Implementation Roadmap", 15, 125)

    autoTable(doc, {
        startY: 130,
        body: [
            ['Phase 1: Pilot', 'Sprint 24', 'Engineering'],
            ['Phase 2: Full Rollout', 'Sprint 26', 'Product Ops'],
            ['Phase 3: Impact Review', 'Sprint 28', 'Data Science']
        ],
        head: [['Phase', 'Timeline', 'Owner']],
        theme: 'grid',
        headStyles: { fillColor: COLORS.slate800 }
    })

    // AI Footer Note
    doc.setFontSize(10)
    doc.setTextColor(COLORS.slate500[0], COLORS.slate500[1], COLORS.slate500[2])
    doc.text("Recommended by HouseFin Man AI • Model Version v2.4 • Confidence 94%", pageWidth / 2, pageHeight - 25, { align: 'center' })

    addFooter(currentPage++)

    // ============ PAGE 6: SECTOR BENCHMARKS ============
    doc.addPage()
    addHeader("5. Sector Benchmarks", "Industry comparison")

    drawBarChart(doc, 20, 60, 160, 60, [
        { label: 'Industry Avg', value: 18, color: COLORS.slate500 },
        { label: 'Best in Class', value: 32, color: COLORS.slate500 },
        { label: 'HouseFin Man', value: 35, color: COLORS.emerald500 }
    ])

    doc.setFontSize(10)
    doc.setTextColor(COLORS.slate700[0], COLORS.slate700[1], COLORS.slate700[2])
    doc.text("HouseFin Man outperforms the industry average by 17 points and slightly exceeds best-in-class benchmarks for this specific flow, validating the hypothesis strongly.", 15, 140, { maxWidth: pageWidth - 30 })
    addFooter(currentPage++)

    // ============ PAGE 7: SEASONAL TRENDS ============
    doc.addPage()
    addHeader("6. Seasonal Trends", "Q4 vs Q1 pattern analysis")

    drawBarChart(doc, 20, 60, 160, 60, [
        { label: 'Oct', value: 80, color: COLORS.slate500 },
        { label: 'Nov', value: 95, color: COLORS.slate500 },
        { label: 'Dec', value: 110, color: COLORS.slate500 },
        { label: 'Jan', value: 105, color: COLORS.blue500 }
    ])
    addFooter(currentPage++)

    // ============ PAGE 8: DEVICE BREAKDOWN ============
    doc.addPage()
    addHeader("7. Device Breakdown")
    drawStackedBar(doc, 20, 60, 160, 40, [
        { label: 'Mobile App', value: 55, color: COLORS.blue500 },
        { label: 'Mobile Web', value: 25, color: COLORS.purple500 },
        { label: 'Desktop', value: 20, color: COLORS.slate500 }
    ])
    addFooter(currentPage++)

    // ============ PAGE 9: APPENDIX - VERBATIM RESPONSES ============
    doc.addPage()
    addHeader("Appendix A: Verbatim Responses")

    const verbatims = [
        "The upload process was too slow on my phone.",
        "Why do I need to upload 3 months of statements? One should be enough.",
        "It kept crashing when I tried to take a photo.",
        "Much better than the old system my bank uses.",
        "I didn't have the files ready, so I quit.",
        "Can I email them later instead?",
        "Perfect experience, very fast.",
        "I was confused about which PDF to upload.",
        "My password protected PDF was rejected.",
        "Please add a drag and drop feature."
    ]

    const pageVerbatims = verbatims.map((v, i) => ({
        id: `R-${1000 + i}`,
        segment: i % 2 === 0 ? 'Mobile' : 'Desktop',
        sentiment: i % 3 === 0 ? 'Negative' : 'Neutral',
        text: v
    }))

    autoTable(doc, {
        startY: 60,
        head: [['ID', 'Segment', 'Sentiment', 'Comment']],
        body: pageVerbatims.map(v => [v.id, v.segment, v.sentiment, v.text]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: COLORS.slate800 }
    })
    addFooter(currentPage++)

    // ============ PAGE 10: APPENDIX - RAW DATA ============
    doc.addPage()
    addHeader("Appendix B: Raw Data Sample")
    doc.text("Dataset Extract (Top Rows)", 15, 60)

    const rows = []
    for (let i = 0; i < 15; i++) {
        rows.push([`U-${1000 + i}`, 'Mobile', 'Chrome', '4m 30s', 'Yes'])
    }
    autoTable(doc, {
        startY: 70,
        head: [['User ID', 'Device', 'Browser', 'Time', 'Converted']],
        body: rows,
        styles: { fontSize: 8 },
        headStyles: { fillColor: COLORS.slate800 }
    })
    addFooter(currentPage++)

    // Save
    doc.save(`DeepDive_Report_${data.reportOverview.hypothesisId}_${format(new Date(), 'yyyyMMdd')}.pdf`)
}
