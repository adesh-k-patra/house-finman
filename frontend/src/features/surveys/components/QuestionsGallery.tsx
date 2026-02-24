import { useState } from 'react';
import { FileUpload, SliderRating, ShortTextInput, LongTextInput, ChoiceGroup } from './questions';
import { Home, Banknote, Building2 } from 'lucide-react';

export function QuestionsGallery() {
    const [formData, setFormData] = useState({
        name: '',
        feedback: '',
        budget: 50,
        nps: 9,
        propertyType: 'apartment',
        amenities: [] as string[],
        files: [] as File[]
    });

    return (
        <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-[600px] space-y-8 animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Question Components Gallery</h2>
                    <p className="text-slate-500">Testing the sharp UI inputs for the survey builder.</p>
                </div>

                <div className="grid gap-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    {/* Text Inputs */}
                    <div className="space-y-6">
                        <ShortTextInput
                            label="What is your full name?"
                            placeholder="e.g. Rahul Sharma"
                            required
                            value={formData.name}
                            onChange={(val) => setFormData({ ...formData, name: val })}
                        />

                        <LongTextInput
                            label="Please describe your ideal home"
                            description="Mention location, size, and specific requirements."
                            value={formData.feedback}
                            onChange={(val) => setFormData({ ...formData, feedback: val })}
                        />
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800" />

                    {/* Sliders */}
                    <div className="space-y-6">
                        <SliderRating
                            label="What is your maximum budget?"
                            min={20}
                            max={500}
                            step={5}
                            unit="L"
                            value={formData.budget}
                            onChange={(val) => setFormData({ ...formData, budget: val })}
                            labels={{ 20: '20L', 250: '2.5Cr', 500: '5Cr+' }}
                        />

                        <SliderRating
                            label="How likely are you to recommend us?"
                            min={0}
                            max={10}
                            step={1}
                            value={formData.nps}
                            onChange={(val) => setFormData({ ...formData, nps: val })}
                            labels={{ 0: 'Not Likely', 10: 'Very Likely' }}
                        />
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800" />

                    {/* Choice Groups */}
                    <div className="space-y-6">
                        <ChoiceGroup
                            label="Preferred Property Type"
                            options={[
                                { id: 'apartment', label: 'Apartment', icon: <Building2 className="w-4 h-4" /> },
                                { id: 'villa', label: 'Villa', icon: <Home className="w-4 h-4" /> },
                                { id: 'plot', label: 'Plot / Land', icon: <Banknote className="w-4 h-4" /> }
                            ]}
                            value={formData.propertyType}
                            onChange={(val) => setFormData({ ...formData, propertyType: val as string })}
                            layout="grid"
                        />

                        <ChoiceGroup
                            label="Must-have Amenities"
                            multiSelect
                            options={[
                                { id: 'pool', label: 'Swimming Pool', description: 'Olympic size preferred' },
                                { id: 'gym', label: 'Gymnasium', description: 'Equipped with cardio' },
                                { id: 'park', label: 'Children\'s Park' },
                                { id: 'parking', label: 'Covered Parking' }
                            ]}
                            value={formData.amenities}
                            onChange={(val) => setFormData({ ...formData, amenities: val as string[] })}
                        />
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800" />

                    {/* File Upload */}
                    <div>
                        <FileUpload
                            label="Upload Income Proof"
                            description="Salary slips or ITR acknowledgement (Max 5MB)"
                            required
                            allowMultiple
                            onChange={(files) => setFormData({ ...formData, files })}
                        />
                    </div>
                </div>

                {/* State Debugger */}
                <div className="p-4 bg-slate-900 text-slate-300 font-mono text-xs overflow-auto max-h-40 rounded-none">
                    <pre>{JSON.stringify({ ...formData, files: formData.files.map(f => f.name) }, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}
