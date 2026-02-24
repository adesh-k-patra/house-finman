
import { useState, useEffect } from 'react'
import { X, MapPin, Bed, Bath, Ruler, Home, Upload } from 'lucide-react'
import { Button } from '@/components/ui'
import { PropertyType } from '../data/dummyProperties'

interface EditPropertyModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (property: any) => void
    property: any
}

export function EditPropertyModal({ isOpen, onClose, onSave, property }: EditPropertyModalProps) {
    if (!isOpen || !property) return null

    const [formData, setFormData] = useState({
        name: '',
        type: 'apartment' as PropertyType,
        location: '',
        price: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        status: 'available'
    })

    useEffect(() => {
        if (property) {
            setFormData({
                name: property.name,
                type: property.type,
                location: property.location,
                price: property.price,
                area: property.area,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                status: property.status || 'available'
            })
        }
    }, [property])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            ...property,
            ...formData,
            price: Number(formData.price),
            area: Number(formData.area),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
        })
        onClose()
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white dark:bg-slate-900 rounded-sm shadow-xl z-50 animate-fade-in border border-slate-200 dark:border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Property</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Name</label>
                            <input
                                required
                                type="text"
                                className="input"
                                placeholder="e.g. Green Valley Apartments"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['apartment', 'villa', 'plot'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: type as PropertyType })}
                                        className={`p-3 rounded-sm border flex flex-col items-center justify-center gap-1 transition-all capitalize
                                            ${formData.type === type
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                                : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                                            }`}
                                    >
                                        <Home className="w-4 h-4" />
                                        <span className="text-xs font-medium">{type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
                            <input
                                required
                                type="number"
                                className="input"
                                placeholder="4500000"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Area (sq.ft)</label>
                            <div className="relative">
                                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    required
                                    type="number"
                                    className="input pl-10"
                                    placeholder="1200"
                                    value={formData.area}
                                    onChange={e => setFormData({ ...formData, area: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    required
                                    type="text"
                                    className="input pl-10"
                                    placeholder="e.g. Whitefield, Bangalore"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        {formData.type !== 'plot' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bedrooms</label>
                                    <div className="relative">
                                        <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="number"
                                            className="input pl-10"
                                            placeholder="2"
                                            value={formData.bedrooms}
                                            onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bathrooms</label>
                                    <div className="relative">
                                        <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="number"
                                            className="input pl-10"
                                            placeholder="2"
                                            value={formData.bathrooms}
                                            onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Property Image</label>
                            <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-sm p-8 text-center hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer">
                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">Click to upload property image</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-white/10">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </div>
                </form>
            </div>
        </>
    )
}
