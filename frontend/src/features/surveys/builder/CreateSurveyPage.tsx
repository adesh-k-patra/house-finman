import { SurveyBuilderProvider, useSurveyBuilder } from './contexts/SurveyBuilderContext'
import { CreateSurveyLayout } from './CreateSurveyLayout'
import { ConfigTab } from './views/ConfigTab'
import { FollowUpTab } from './views/FollowUpTab'
import { AnalyticsTab } from './views/AnalyticsTab'
import { HypothesesTab } from './views/HypothesesTab'
import { SettingsTab } from './views/SettingsTab'

export function SurveyBuilderContent() {
    const { viewMode } = useSurveyBuilder()

    return (
        <CreateSurveyLayout>
            {viewMode === 'config' && <ConfigTab />}
            {viewMode === 'followups' && <FollowUpTab />}
            {viewMode === 'analytics' && <AnalyticsTab />}
            {viewMode === 'hypotheses' && <HypothesesTab />}
            {viewMode === 'settings' && <SettingsTab />}
        </CreateSurveyLayout>
    )
}

export function CreateSurveyPage() {
    return (
        <SurveyBuilderProvider>
            <SurveyBuilderContent />
        </SurveyBuilderProvider>
    )
}
