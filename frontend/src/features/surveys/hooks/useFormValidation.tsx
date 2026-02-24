import { useState, useCallback } from 'react'
import { AlertCircle } from 'lucide-react'

interface ValidationRule {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => boolean
    message: string
}

interface UseFormValidationProps {
    [key: string]: ValidationRule[]
}

export function useFormValidation(initialValues: any, rules: UseFormValidationProps) {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

    const validateField = useCallback((name: string, value: any) => {
        const fieldRules = rules[name]
        if (!fieldRules) return ''

        for (const rule of fieldRules) {
            if (rule.required && !value) return rule.message
            if (rule.minLength && value.length < rule.minLength) return rule.message
            if (rule.maxLength && value.length > rule.maxLength) return rule.message
            if (rule.pattern && !rule.pattern.test(value)) return rule.message
            if (rule.custom && !rule.custom(value)) return rule.message
        }
        return ''
    }, [rules])

    const handleChange = (name: string, value: any) => {
        setValues((prev: any) => ({ ...prev, [name]: value }))
        if (touched[name]) {
            const error = validateField(name, value)
            setErrors(prev => ({ ...prev, [name]: error }))
        }
    }

    const handleBlur = (name: string) => {
        setTouched(prev => ({ ...prev, [name]: true }))
        const error = validateField(name, values[name])
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const isValid = Object.keys(errors).every(key => !errors[key])

    return { values, errors, touched, handleChange, handleBlur, isValid }
}

export function FieldError({ message }: { message?: string }) {
    if (!message) return null
    return (
        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium animate-in slide-in-from-top-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {message}
        </div>
    )
}
