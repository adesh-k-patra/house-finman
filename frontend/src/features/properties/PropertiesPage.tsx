/**
 * Properties Page for House FinMan
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Search,
    Plus,
} from 'lucide-react'
import { Button, KPICard } from '@/components/ui'
import { cn, formatCurrency } from '@/utils'
import { dummyProperties, Property, PropertyType } from './data/dummyProperties'
import { AddPropertyModal } from './components/AddPropertyModal'

export default function PropertiesPage() {
    const navigate = useNavigate()
    const [properties, setProperties] = useState<Property[]>(dummyProperties)
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all')
    const [isAddOpen, setIsAddOpen] = useState(false)

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = typeFilter === 'all' || property.type === typeFilter
        return matchesSearch && matchesType
    })

    const handleAddProperty = (newProperty: Property) => {
        setProperties([newProperty, ...properties])
        setIsAddOpen(false)
    }

    return (
        <div className="w-full space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Properties</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {properties.length} properties listed • {properties.filter(p => p.status === 'available').length} available
                    </p>
                </div>
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddOpen(true)}>Add Property</Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-10"
                    />
                </div>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as PropertyType | 'all')}
                    className="input w-auto min-w-[140px]"
                >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                    <option value="studio">Studio</option>
                </select>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties.map((property) => (
                    <div
                        key={property.id}
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className={cn(
                            'group rounded-sm overflow-hidden cursor-pointer flex flex-col',
                            'bg-white dark:bg-slate-900',
                            'border border-slate-200 dark:border-white/10',
                            'shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
                        )}
                    >
                        {/* Image Section */}
                        <div className="aspect-[16/10] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                                src={property.image}
                                alt={property.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-0 left-0 w-full flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
                                <span className={cn(
                                    'px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-none backdrop-blur-md border border-white/20',
                                    property.status === 'available' ? 'bg-emerald-500/90 text-white' : 'bg-slate-500/90 text-white'
                                )}>
                                    {property.status}
                                </span>
                                <button className="p-2 rounded-full bg-black/20 hover:bg-white text-white hover:text-red-500 transition-colors backdrop-blur-md border border-white/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12">
                                <p className="text-2xl font-bold text-white tracking-tight">
                                    {formatCurrency(property.price)}
                                </p>
                                <p className="text-xs text-slate-300 font-medium truncate mt-0.5 opacity-90">{property.location}</p>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary-500 transition-colors line-clamp-1">
                                    {property.title}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                    Experience premium living in this stunning property featuring modern amenities, spacious interiors, and breathtaking views.
                                </p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-3 gap-2">
                                {property.type !== 'plot' && property.type !== 'commercial' ? (
                                    <>
                                        <KPICard
                                            title="Sq Ft"
                                            value={property.size} // Changed from property.area.split(' ')[0] to property.size
                                            variant="blue"
                                            compact
                                        />
                                        <KPICard
                                            title="Beds"
                                            value={property.bedrooms}
                                            variant="emerald"
                                            compact
                                        />
                                        <KPICard
                                            title="Baths"
                                            value={property.bathrooms}
                                            variant="purple"
                                            compact
                                        />
                                    </>
                                ) : (
                                    <KPICard
                                        title="Zone Type"
                                        value={property.type.toUpperCase()}
                                        variant="slate"
                                        compact
                                        className="col-span-3"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Bottom Text Area / Footer requested by user */}
                        <div className="px-5 py-3 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 transition-colors">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">View Details</span>
                            <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AddPropertyModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSave={handleAddProperty}
            />
        </div>
    )
}
