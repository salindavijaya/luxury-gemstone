import { computed, reactive, readonly } from "vue";

export type ValidationRule = (value: any, ...args: any[]) => string;
export type ValidationRules = Record<string, ValidationRule[]>;

export interface FieldState {
  value: any;
  isDirty: boolean;
  isTouched: boolean;
  errors: string[];
}

export const validationRules = {
  required:
    (message = "This field is required"): ValidationRule =>
    // Keep signature compatible: some callers passed (value, label)
    (value: any, _label?: string) => {
      if (value === null || value === undefined || value === "") return message;
      if (typeof value === "string" && value.trim() === "") return message;
      if (Array.isArray(value) && value.length === 0) return message;
      return "";
    },

  email:
    (message = "Please enter a valid email address"): ValidationRule =>
    (value: any) => {
      if (!value) return "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value)) ? "" : message;
    },

  phone:
    (message = "Please enter a valid phone number"): ValidationRule =>
    (value: any) => {
      if (!value) return "";
      const phoneRegex = /^[\+]?[-\d\s()]{10,}$/;
      return phoneRegex.test(String(value)) ? "" : message;
    },

  passwordStrength:
    (message = "Password must be stronger"): ValidationRule =>
    (value: any) => {
      if (!value) return "";
      const v = String(value);
      const ok =
        v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v);
      return ok ? "" : message;
    },
};

export const useValidation = (
  initialData: Record<string, any> = {},
  rules: ValidationRules = {}
) => {
  const formData = reactive({ ...initialData });
  const fieldStates = reactive<Record<string, FieldState>>({});

  Object.keys(initialData).forEach((k) => {
    fieldStates[k] = {
      value: (initialData as any)[k],
      isDirty: false,
      isTouched: false,
      errors: [],
    };
  });

  const validateField = (fieldName: string, value: any): string[] => {
    const fieldRules = rules[fieldName] || [];
    const errors: string[] = [];
    for (const r of fieldRules) {
      const e = r(value);
      if (e) errors.push(e);
    }
    return errors;
  };

  const validateForm = (): boolean => {
    let valid = true;
    Object.keys(fieldStates).forEach((k) => {
      const errors = validateField(k, (formData as any)[k]);
      fieldStates[k].errors = errors;
      if (errors.length) valid = false;
    });
    return valid;
  };

  const setFieldValue = (fieldName: string, value: any) => {
    if (!fieldStates[fieldName]) {
      fieldStates[fieldName] = {
        value,
        isDirty: false,
        isTouched: false,
        errors: [],
      };
    }
    (formData as any)[fieldName] = value;
    fieldStates[fieldName].value = value;
    fieldStates[fieldName].isDirty = true;
    if (fieldStates[fieldName].isTouched) {
      fieldStates[fieldName].errors = validateField(fieldName, value);
    }
  };

  const touchField = (fieldName: string) => {
    if (!fieldStates[fieldName]) return;
    fieldStates[fieldName].isTouched = true;
    fieldStates[fieldName].errors = validateField(
      fieldName,
      (formData as any)[fieldName]
    );
  };

  const resetForm = () => {
    Object.keys(initialData).forEach((k) => {
      (formData as any)[k] = (initialData as any)[k];
      if (fieldStates[k]) {
        fieldStates[k].value = (initialData as any)[k];
        fieldStates[k].isDirty = false;
        fieldStates[k].isTouched = false;
        fieldStates[k].errors = [];
      }
    });
  };

  const resetField = (fieldName: string) => {
    if (!fieldStates[fieldName]) return;
    const initial = (initialData as any)[fieldName];
    (formData as any)[fieldName] = initial;
    fieldStates[fieldName].value = initial;
    fieldStates[fieldName].isDirty = false;
    fieldStates[fieldName].isTouched = false;
    fieldStates[fieldName].errors = [];
  };

  const getFieldError = (fieldName: string) => {
    const s = fieldStates[fieldName];
    return s && s.errors.length ? s.errors[0] : null;
  };

  const hasFieldError = (fieldName: string) => {
    const s = fieldStates[fieldName];
    return !!(s && s.errors && s.errors.length);
  };

  const isFieldValid = (fieldName: string) => !hasFieldError(fieldName);

  const isFormValid = computed(() =>
    Object.values(fieldStates).every((f) => f.errors.length === 0)
  );
  const isFormDirty = computed(() =>
    Object.values(fieldStates).some((f) => f.isDirty)
  );
  const isFormTouched = computed(() =>
    Object.values(fieldStates).some((f) => f.isTouched)
  );

  const formErrors = computed(() => {
    return Object.keys(fieldStates).reduce(
      (acc, key) => {
        acc[key] = fieldStates[key].errors;
        return acc;
      },
      {} as Record<string, string[]>
    );
  });

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
    isFieldValid,

    // Backward-compatible simple validators (return '' when valid)
    validateRequired: validationRules.required(),
    validateEmail: validationRules.email(),
    validatePhone: validationRules.phone(),
    validatePassword: validationRules.passwordStrength(),
    // compatibility helper used by older forms
    validatePasswordMatch: (pass: any, confirm: any) =>
      pass === confirm ? "" : "Passwords do not match",
  };
};
