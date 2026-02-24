
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed'
export type CampaignType = 'email' | 'sms' | 'whatsapp' | 'push'

export interface Campaign {
    id: string
    name: string
    type: CampaignType
    status: CampaignStatus
    audience: number
    sent: number
    opened: number
    clicked: number
    converted: number
    budget: number
    spent: number
    startDate: string
    endDate: string
}


const campaignNames = [
    'New Year Loan Offers', 'PMAY Awareness Drive', 'Partner Onboarding', 'Document Reminder', 'Festive Season Promo',
    'Low Income Housing', 'Luxury Villa Launch', 'Investment Webinar', 'Tax Saving Tips', 'Referral Bonus Program',
    'First Home Buyer Guide', 'Credit Score Booster', 'Summer Special Rates', 'Monsoon Investment Plan', 'Pre-Approved Loans',
    'Civil Service Loan', 'Doctor Loan Program', 'Teacher Housing Scheme', 'Rental Yield Webinar', 'Property Expo Invite'
]

export const dummyCampaigns: Campaign[] = Array.from({ length: 60 }, (_, i) => {
    const type: CampaignType = Math.random() > 0.7 ? 'email' : Math.random() > 0.5 ? 'whatsapp' : Math.random() > 0.3 ? 'sms' : 'push'
    const status: CampaignStatus = Math.random() > 0.8 ? 'draft' : Math.random() > 0.6 ? 'completed' : Math.random() > 0.4 ? 'paused' : 'active'
    const startDate = new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString().split('T')[0]
    const budget = Math.floor(Math.random() * 100000)
    const spent = status === 'draft' ? 0 : Math.floor(Math.random() * budget)
    const audience = Math.floor(Math.random() * 50000)
    const sent = status === 'draft' ? 0 : Math.floor(audience * (0.5 + Math.random() * 0.5))
    const opened = Math.floor(sent * (0.2 + Math.random() * 0.4))
    const clicked = Math.floor(opened * (0.05 + Math.random() * 0.2))
    const converted = Math.floor(clicked * (0.02 + Math.random() * 0.1))

    return {
        id: `c${i + 1}`,
        name: `${campaignNames[i % campaignNames.length]} ${Math.floor(i / campaignNames.length) + 1}`,
        type,
        status,
        audience,
        sent,
        opened,
        clicked,
        converted,
        budget,
        spent,
        startDate,
        endDate: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 15 + Math.floor(Math.random() * 30))).toISOString().split('T')[0]
    }
})
