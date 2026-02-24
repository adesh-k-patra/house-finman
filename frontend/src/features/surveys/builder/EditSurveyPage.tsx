import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SurveyBuilderProvider, useSurveyBuilder } from './contexts/SurveyBuilderContext'
import { SurveyBuilderContent } from './SurveyBuilderPage'
import { Loader2 } from 'lucide-react'

function EditSurveyLoader() {
    const { id } = useParams()
    const { updateSettings, setViewMode } = useSurveyBuilder()
    const [isLoading, setIsLoading] = useState(true)

    // Simulate loading existing data
    useEffect(() => {
        setIsLoading(true)

        // Mock API Call Delay
        setTimeout(() => {
            // 1. Load Settings
            updateSettings({
                name: 'Q3 Home Buyer Intent Survey (Live)',
                status: 'active',
                mediums: ['email', 'whatsapp'],
                industryTags: ['housing', 'real-estate', 'loans'],
                targetResponses: 5000
            })



            // 2. Load Questions (Mock Data) - Note: Context already has dummy data
            // In production, this would replace the dummy data with actual survey data

            // 3. Set View State
            setViewMode('config')

            setIsLoading(false)
            console.log(`Survey ${id} Loaded`)
        }, 800)
    }, [])

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Loading Survey...</h2>
                <p className="text-slate-500 font-medium">Fetching survey data</p>
            </div>
        )
    }

    return (
        <div className="relative h-full w-full flex flex-col">


            {/* Content */}
            <div className="flex-1 relative min-h-0">
                <SurveyBuilderContent />
            </div>
        </div>
    )
}

import { SurveyProvider } from './contexts/SurveyPageContext'

export function EditSurveyPage() {
    return (
        <SurveyProvider>
            <SurveyBuilderProvider>
                <EditSurveyLoader />
            </SurveyBuilderProvider>
        </SurveyProvider>
    )
}
