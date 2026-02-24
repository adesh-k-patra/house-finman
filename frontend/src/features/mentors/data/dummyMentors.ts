export type MentorStatus = 'available' | 'busy' | 'offline'
export type Expertise = 'home_loans' | 'documentation' | 'legal' | 'investment' | 'tax'

export interface Mentor {
    id: string
    name: string
    title: string
    expertise: Expertise[]
    city: string
    location: string
    status: MentorStatus
    rating: number
    totalSessions: number
    studentsMentored: number
    hourlyRate: number
    languages: string[]
    experience: number
    bio: string
    email: string
    phone: string
    availability: string
    tags: string[]
    specialization: string
}

export const statusConfig: Record<MentorStatus, { label: string; color: string }> = {
    available: { label: 'Available', color: 'bg-emerald-500' },
    busy: { label: 'In Session', color: 'bg-amber-500' },
    offline: { label: 'Offline', color: 'bg-slate-400' },
}

export const expertiseConfig: Record<Expertise, { label: string; color: string }> = {
    home_loans: { label: 'Home Loans', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
    documentation: { label: 'Documentation', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
    legal: { label: 'Legal', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' },
    investment: { label: 'Investment', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' },
    tax: { label: 'Tax Planning', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600' },
}

export const dummyMentors: Mentor[] = [
    {
        id: '1',
        name: 'Dr. Rajesh Sharma',
        title: 'Senior Mortgage Consultant',
        expertise: ['home_loans', 'investment'],
        city: 'Mumbai',
        location: 'Mumbai, MH',
        status: 'available',
        rating: 4.9,
        totalSessions: 456,
        studentsMentored: 120,
        hourlyRate: 1500,
        languages: ['Hindi', 'English', 'Marathi'],
        experience: 15,
        bio: 'Ex-banker with 15+ years of experience in housing finance and investment strategies.',
        email: 'rajesh.sharma@housefinman.com',
        phone: '+91 98765 43210',
        availability: 'Mon-Fri, 10 AM - 5 PM',
        tags: ['Finance', 'Mortgage', 'Loans'],
        specialization: 'Home Loans & Investment'
    },
    {
        id: '2',
        name: 'Adv. Priya Nair',
        title: 'Real Estate Legal Advisor',
        expertise: ['legal', 'documentation'],
        city: 'Delhi',
        location: 'Delhi, NCR',
        status: 'available',
        rating: 4.8,
        totalSessions: 324,
        studentsMentored: 85,
        hourlyRate: 2000,
        languages: ['Hindi', 'English'],
        experience: 12,
        bio: 'Property law specialist with expertise in title verification and dispute resolution.',
        email: 'priya.nair@housefinman.com',
        phone: '+91 91234 56789',
        availability: 'Mon-Sat, 11 AM - 6 PM',
        tags: ['Legal', 'Property Law', 'Documentation'],
        specialization: 'Legal Documentation'
    },
    {
        id: '3',
        name: 'CA Vikram Patel',
        title: 'Taxation Expert',
        expertise: ['tax', 'investment'],
        city: 'Ahmedabad',
        location: 'Ahmedabad, GJ',
        status: 'busy',
        rating: 4.7,
        totalSessions: 289,
        studentsMentored: 200,
        hourlyRate: 1800,
        languages: ['Hindi', 'English', 'Gujarati'],
        experience: 10,
        bio: 'Chartered Accountant specializing in real estate taxation and capital gains.',
        email: 'vikram.patel@housefinman.com',
        phone: '+91 99887 76655',
        availability: 'Tue-Fri, 2 PM - 7 PM',
        tags: ['Tax', 'CA', 'Investment'],
        specialization: 'Real Estate Taxation'
    },
    {
        id: '4',
        name: 'Sunita Reddy',
        title: 'Loan Process Consultant',
        expertise: ['home_loans', 'documentation'],
        city: 'Hyderabad',
        location: 'Hyderabad, TS',
        status: 'available',
        rating: 4.6,
        totalSessions: 198,
        studentsMentored: 60,
        hourlyRate: 1200,
        languages: ['Hindi', 'English', 'Telugu'],
        experience: 8,
        bio: 'Former loan officer with deep knowledge of loan processes and bank policies.',
        email: 'sunita.reddy@housefinman.com',
        phone: '+91 88990 01122',
        availability: 'Mon-Fri, 9 AM - 4 PM',
        tags: ['Loans', 'Process', 'Documentation'],
        specialization: 'Loan Processing'
    },
    {
        id: '5',
        name: 'Arun Menon',
        title: 'Legal Consultant',
        expertise: ['legal'],
        city: 'Kochi',
        location: 'Kochi, KL',
        status: 'offline',
        rating: 4.5,
        totalSessions: 156,
        studentsMentored: 45,
        hourlyRate: 1600,
        languages: ['Hindi', 'English', 'Malayalam'],
        experience: 14,
        bio: 'Real estate attorney with focus on affordable housing and land acquisition.',
        email: 'arun.menon@housefinman.com',
        phone: '+91 77665 54433',
        availability: 'Weekends Only',
        tags: ['Legal', 'Affordable Housing'],
        specialization: 'Land Acquisition'
    },
    {
        id: '6',
        name: 'Dr. Meera Kapoor',
        title: 'Investment Strategist',
        expertise: ['investment', 'tax'],
        city: 'Bangalore',
        location: 'Bangalore, KA',
        status: 'available',
        rating: 4.9,
        totalSessions: 512,
        studentsMentored: 300,
        hourlyRate: 2500,
        languages: ['Hindi', 'English', 'Kannada'],
        experience: 18,
        bio: 'PhD in Finance with expertise in real estate investments and portfolio management.',
        email: 'meera.kapoor@housefinman.com',
        phone: '+91 55443 32211',
        availability: 'Mon-Thu, 1 PM - 6 PM',
        tags: ['Investment', 'Finance', 'Portfolio'],
        specialization: 'Investment Strategy'
    },
]
