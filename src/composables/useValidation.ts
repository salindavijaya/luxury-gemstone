import { ref, computed, reactive, toRefs } from 'vue'

// Validation rule types
export type ValidationRule = (value: any) => string | null
export type ValidationRules = Record<string, ValidationRule[]>

// Field state interface
export interface FieldState {
  value: any
  isDirty: boolean
  isTouched: boolean
  errors: string[]
}

// Form state interface
export interface FormState {
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
  errors: Record<string, string[]>
}

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => {
    return (value: any) => {
      if (value === null || value === undefined || value === '') {
        return message
      }
      if (typeof value === 'string' && value.trim() === '') {
        return message
      }
      if (Array.isArray(value) && value.length === 0) {
        return message
      }
      return null
    }
  },

  email: (message = 'Please enter a valid email address'): ValidationRule => {
    return (value: string) => {
      if (!value) return null // Let required rule handle empty values
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) ? null : message
    }
  },

  minLength: (min: number, message?: string): ValidationRule => {
    return (value: string) => {
      if (!value) return null // Let required rule handle empty values
      const actualMessage = message || `Must be at least ${min} characters long`
      return value.length >= min ? null : actualMessage
    }
  },

  maxLength: (max: number, message?: string): ValidationRule => {
    return (value: string) => {
      if (!value) return null
      const actualMessage = message || `Must be no more than ${max} characters long`
      return value.length <= max ? null : actualMessage
    }
  },

  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => {
    return (value: string) => {
      if (!value) return null
      return regex.test(value) ? null : message
    }
  },

  phone: (message = 'Please enter a valid phone number'): ValidationRule => {
    return (value: string) => {
      if (!value) return null
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
      return phoneRegex.test(value.replace(/\s/g, '')) ? null : message
    }
  },

  passwordStrength: (message = 'Password must contain at least 8 characters, including uppercase, lowercase, and numbers'): ValidationRule => {
    return (value: string) => {
      if (!value) return null
      const hasUpperCase = /[A-Z]/.test(value)
      const hasLowerCase = /[a-z]/.test(value)
      const hasNumbers = /\d/.test(value)
      const hasMinLength = value.length >= 8

      if (hasUpperCase && hasLowerCase && hasNumbers && hasMinLength) {
        return null
      }
      return message
    }
  },

  confirmPassword: (originalPassword: string, message = 'Passwords do not match'): ValidationRule => {
    return (value: string) => {
      if (!value) return null
      return value === originalPassword ? null : message
    }
  },

  min: (minimum: number, message?: string): ValidationRule => {
    return (value: number) => {
      if (value === null || value === undefined) return null
      const actualMessage = message || `Must be at least ${minimum}`
      return value >= minimum ? null : actualMessage
    }
  },

  max: (maximum: number, message?: string): ValidationRule => {
    return (value: number) => {
      if (value === null || value === undefined) return null
      const actualMessage = message || `Must be no more than ${maximum}`
      return value <= maximum ? null : actualMessage
    }
  }
}

// Password strength calculator
export const calculatePasswordStrength = (password: string): {
  score: number
  label: string
  color: string
} => {
  if (!password) {
    return { score: 0, label: 'No password', color: 'bg-gray-200' }
  }

  let score = 0
  
  // Length criteria
  if (password.length >= 8) score += 25
  if (password.length >= 12) score += 25

  // Character variety
  if (/[a-z]/.test(password)) score += 12.5
  if (/[A-Z]/.test(password)) score += 12.5
  if (/[0-9]/.test(password)) score += 12.5
  if (/[^A-Za-z0-9]/.test(password)) score += 12.5

  let label = 'Very Weak'
  let color = 'bg-red-500'

  if (score >= 75) {
    label = 'Strong'
    color = 'bg-green-500'
  } else if (score >= 50) {
    label = 'Medium'
    color = 'bg-yellow-500'
  } else if (score >= 25) {
    label = 'Weak'
    color = 'bg-orange-500'
  }

  return { score: Math.min(score, 100), label, color }
}

// Main validation composable
export const useValidation = (initialData: Record<string, any> = {}, rules: ValidationRules = {}) => {
  // Form data
  const formData = reactive({ ...initialData })
  
  // Field states
  const fieldStates = reactive<Record<string, FieldState>>(
    Object.keys(initialData).reduce((acc, key) => {
      acc[key] = {
        value: initialData[key],
        isDirty: false,
        isTouched: false,
        errors: []
      }
      return acc
    }, {} as Record<string, FieldState>)
  )

  // Validate a single field
  const validateField = (fieldName: string, value: any): string[] => {
    const fieldRules = rules[fieldName] || []
    const errors: string[] = []

    for (const rule of fieldRules) {
      const error = rule(value)
      if (error) {
        errors.push(error)
      }
    }

    return errors
  }

  // Validate all fields
  const validateForm = (): boolean => {
    let isValid = true

    Object.keys(formData).forEach(fieldName => {
      const errors = validateField(fieldName, formData[fieldName])
      fieldStates[fieldName].errors = errors
      if (errors.length > 0) {
        isValid = false
      }
    })

    return isValid
  }

  // Set field value and validate
  const setFieldValue = (fieldName: string, value: any): void => {
    if (!fieldStates[fieldName]) {
      fieldStates[fieldName] = {
        value: value,
        isDirty: false,
        isTouched: false,
        errors: []
      }
    }

    const oldValue = formData[fieldName]
    formData[fieldName] = value
    fieldStates[fieldName].value = value
    fieldStates[fieldName].isDirty = value !== initialData[fieldName]

    // Validate on change if field was already touched
    if (fieldStates[fieldName].isTouched) {
      fieldStates[fieldName].errors = validateField(fieldName, value)
    }
  }

  // Mark field as touched
  const touchField = (fieldName: string): void => {
    if (!fieldStates[fieldName]) return
    
    fieldStates[fieldName].isTouched = true
    // Validate when field loses focus
    fieldStates[fieldName].errors = validateField(fieldName, formData[fieldName])
  }

  // Reset form
  const resetForm = (): void => {
    Object.keys(initialData).forEach(key => {
      formData[key] = initialData[key]
      if (fieldStates[key]) {
        fieldStates[key].value = initialData[key]
        fieldStates[key].isDirty = false
        fieldStates[key].isTouched = false
        fieldStates[key].errors = []
      }
    })
  }

  // Reset field
  const resetField = (fieldName: string): void => {
    if (fieldStates[fieldName]) {
      const initialValue = initialData[fieldName]
      formData[fieldName] = initialValue
      fieldStates[fieldName].value = initialValue
      fieldStates[fieldName].isDirty = false
      fieldStates[fieldName].isTouched = false
      fieldStates[fieldName].errors = []
    }
  }

  // Get field error message (first error only)
  const getFieldError = (fieldName: string): string | null => {
    const fieldState = fieldStates[fieldName]
    return fieldState && fieldState.errors.length > 0 ? fieldState.errors[0] : null
  }

  // Check if field has error
  const hasFieldError = (fieldName: string): boolean => {
    const fieldState = fieldStates[fieldName]
    return fieldState ? fieldState.errors.length > 0 : false
  }

  // Check if field is valid
  const isFieldValid = (fieldName: string): boolean => {
    return !hasFieldError(fieldName)
  }

  // Computed properties
  const isFormValid = computed(() => {
    return Object.values(fieldStates).every(field => field.errors.length === 0)
  })

  const isFormDirty = computed(() => {
    return Object.values(fieldStates).some(field => field.isDirty)
  })

  const isFormTouched = computed(() => {
    return Object.values(fieldStates).some(field => field.isTouched)
  })

  const formErrors = computed(() => {
    return Object.keys(fieldStates).reduce((acc, key) => {
      acc[key] = fieldStates[key].errors
      return acc
    }, {} as Record<string, string[]>)
  })

  return {
    // Reactive data
    formData: readonly(formData),
    fieldStates: readonly(fieldStates),

    // Computed
    isFormValid,
    isFormDirty,
    isFormTouched,
    formErrors,

    // Methods
    validateField,
    validateForm,
    setFieldValue,
    touchField,
    resetForm,
    resetField,
    getFieldError,
    hasFieldError,
    isFieldValid
  }
}