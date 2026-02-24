
import { useSurveyBuilder } from '../contexts/SurveyBuilderContext'
import { UniversalSimulator } from './UniversalSimulator'

export function MobileSimulator() {
    const { isSimulatorOpen, closeSimulator, questions, simulatorMode, replayResponse } = useSurveyBuilder()

    return (
        <UniversalSimulator
            isOpen={isSimulatorOpen}
            onClose={closeSimulator}
            questions={questions}
            mode={simulatorMode}
            replayResponse={replayResponse}
        />
    )
}
