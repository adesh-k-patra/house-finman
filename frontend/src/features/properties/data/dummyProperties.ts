export type PropertyType = 'apartment' | 'villa' | 'plot' | 'commercial' | 'studio'
export type PropertyStatus = 'available' | 'sold' | 'reserved' | 'under_construction'

export interface Property {
    id: string
    title: string
    location: string
    price: number
    type: PropertyType
    size: number // in sqft
    bedrooms: number
    bathrooms: number
    status: PropertyStatus
    image: string
    agent: string
    listedDate: string
}

export const dummyProperties: Property[] = [
    {
        id: 'PROP-2024-001',
        title: 'Luxury Sea View Apartment',
        location: 'Mumbai, Bandra West',
        price: 45000000,
        type: 'apartment',
        size: 1800,
        bedrooms: 3,
        bathrooms: 3,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
        agent: 'Rohit Sharma',
        listedDate: '2024-02-15'
    },
    {
        id: 'PROP-2024-002',
        title: 'Spacious Garden Villa',
        location: 'Bangalore, Whitefield',
        price: 32000000,
        type: 'villa',
        size: 3500,
        bedrooms: 4,
        bathrooms: 4,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        agent: 'Priya Singh',
        listedDate: '2024-03-01'
    },
    {
        id: 'PROP-2024-003',
        title: 'Premium Office Space',
        location: 'Gurgaon, Cyber City',
        price: 85000000,
        type: 'commercial',
        size: 5000,
        bedrooms: 0,
        bathrooms: 2,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        agent: 'Amit Kumar',
        listedDate: '2024-01-20'
    },
    {
        id: 'PROP-2024-004',
        title: 'Cozy Studio Apartment',
        location: 'Pune, Viman Nagar',
        price: 6500000,
        type: 'studio',
        size: 550,
        bedrooms: 1,
        bathrooms: 1,
        status: 'sold',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        agent: 'Rahul Verma',
        listedDate: '2023-12-10'
    },
    {
        id: 'PROP-2024-005',
        title: 'Residential Plot',
        location: 'Hyderabad, Gachibowli',
        price: 15000000,
        type: 'plot',
        size: 2400,
        bedrooms: 0,
        bathrooms: 0,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
        agent: 'Rohit Sharma',
        listedDate: '2024-03-10'
    },
    {
        id: 'PROP-2024-006',
        title: 'Skyline Penthouse',
        location: 'Mumbai, Worli',
        price: 120000000,
        type: 'apartment',
        size: 4000,
        bedrooms: 5,
        bathrooms: 5,
        status: 'reserved',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        agent: 'Priya Singh',
        listedDate: '2024-02-01'
    },
    {
        id: 'PROP-2024-007',
        title: 'Modern Row House',
        location: 'Chennai, OMR',
        price: 18000000,
        type: 'villa',
        size: 2200,
        bedrooms: 3,
        bathrooms: 3,
        status: 'under_construction',
        image: 'https://images.unsplash.com/photo-1600596542815-e495e6562a53?w=800&q=80',
        agent: 'Amit Kumar',
        listedDate: '2024-03-05'
    },
    {
        id: 'PROP-2024-008',
        title: 'Retail Shop',
        location: 'Delhi, Connaught Place',
        price: 55000000,
        type: 'commercial',
        size: 800,
        bedrooms: 0,
        bathrooms: 0,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=800&q=80',
        agent: 'Rahul Verma',
        listedDate: '2024-01-15'
    },
    {
        id: 'PROP-2024-009',
        title: 'Hill View Villa',
        location: 'Lonavala',
        price: 40000000,
        type: 'villa',
        size: 3000,
        bedrooms: 4,
        bathrooms: 4,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1510627489930-0c1b0dc58e85?w=800&q=80',
        agent: 'Rohit Sharma',
        listedDate: '2024-02-28'
    },
    {
        id: 'PROP-2024-010',
        title: 'Budget Apartment',
        location: 'Kolkata, Salt Lake',
        price: 7500000,
        type: 'apartment',
        size: 1100,
        bedrooms: 2,
        bathrooms: 2,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        agent: 'Priya Singh',
        listedDate: '2024-03-12'
    },
    {
        id: 'PROP-2024-011',
        title: 'Seaside Villa',
        location: 'Goa, Anjuna',
        price: 55000000,
        type: 'villa',
        size: 3200,
        bedrooms: 4,
        bathrooms: 4,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?w=800&q=80',
        agent: 'Rahul Verma',
        listedDate: '2024-03-30'
    },
    {
        id: 'PROP-2024-012',
        title: 'IT Park Office',
        location: 'Bangalore, Electronics City',
        price: 95000000,
        type: 'commercial',
        size: 6000,
        bedrooms: 0,
        bathrooms: 4,
        status: 'reserved',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        agent: 'Amit Kumar',
        listedDate: '2024-03-25'
    },
    {
        id: 'PROP-2024-013',
        title: 'Suburban Home',
        location: 'Pune, Hinjewadi',
        price: 9500000,
        type: 'apartment',
        size: 1400,
        bedrooms: 3,
        bathrooms: 2,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80',
        agent: 'Rohit Sharma',
        listedDate: '2024-03-15'
    },
    {
        id: 'PROP-2024-014',
        title: 'Farmhouse Plot',
        location: 'Karjat',
        price: 6000000,
        type: 'plot',
        size: 10000,
        bedrooms: 0,
        bathrooms: 0,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
        agent: 'Priya Singh',
        listedDate: '2024-03-20'
    },
    {
        id: 'PROP-2024-015',
        title: 'Luxury Studio',
        location: 'Mumbai, Powai',
        price: 18000000,
        type: 'studio',
        size: 650,
        bedrooms: 1,
        bathrooms: 1,
        status: 'sold',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        agent: 'Amit Kumar',
        listedDate: '2024-02-10'
    }
]
