import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react'

// ============ TYPES ============

export type ViewMode = 'flow' | 'composer' | 'batch' | 'preview'

export interface Question {
    id: string
    type: string // 'mcq', 'nps', etc.
    text: string
    required: boolean
    options?: { id: string; text: string }[]
    // Add other fields as needed
}

export interface SurveyState {
    id: string
    title: string
    viewMode: ViewMode
    questions: Question[]
    selectedNodeId: string | null
    isSidebarOpen: boolean
    isInspectorOpen: boolean
    history: {
        past: SurveyState[]
        future: SurveyState[]
    }
}

type Action =
    | { type: 'SET_VIEW_MODE'; payload: ViewMode }
    | { type: 'ADD_QUESTION'; payload: Question }
    | { type: 'SELECT_NODE'; payload: string | null }
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'TOGGLE_INSPECTOR' }
    | { type: 'UPDATE_TITLE'; payload: string }
    | { type: 'UNDO' }
    | { type: 'REDO' }

// ============ INITIAL STATE ============

const initialState: SurveyState = {
    id: `srv_${Date.now()}`,
    title: 'New Buyer Intent Survey',
    viewMode: 'flow',
    questions: [],
    selectedNodeId: null,
    isSidebarOpen: true,
    isInspectorOpen: true,
    history: {
        past: [],
        future: []
    }
}

// ============ REDUCER ============

function builderReducer(state: SurveyState, action: Action): SurveyState {
    switch (action.type) {
        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload }
        case 'ADD_QUESTION':
            return {
                ...state,
                questions: [...state.questions, action.payload]
            }
        case 'SELECT_NODE':
            return { ...state, selectedNodeId: action.payload, isInspectorOpen: !!action.payload }
        case 'TOGGLE_SIDEBAR':
            return { ...state, isSidebarOpen: !state.isSidebarOpen }
        case 'TOGGLE_INSPECTOR':
            return { ...state, isInspectorOpen: !state.isInspectorOpen }
        case 'UPDATE_TITLE':
            return { ...state, title: action.payload }
        default:
            return state
    }
}

// ============ CONTEXT ============

const BuilderContext = createContext<{
    state: SurveyState
    dispatch: Dispatch<Action>
} | undefined>(undefined)

export function BuilderProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(builderReducer, initialState)

    return (
        <BuilderContext.Provider value={{ state, dispatch }}>
            {children}
        </BuilderContext.Provider>
    )
}

export function useBuilder() {
    const context = useContext(BuilderContext)
    if (!context) {
        throw new Error('useBuilder must be used within a BuilderProvider')
    }
    return context
}
