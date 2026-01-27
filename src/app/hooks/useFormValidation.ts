import { useState, useCallback } from 'react';
import { ValidationRules, FormErrors } from '@/app/types/auth';

interface UseFormValidationReturn<T> {
  values: T;
  errors: FormErrors;
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (name: keyof T, value: string) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
  setFieldError: (field: keyof T, error: string) => void;
  clearErrors: () => void;
  reset: () => void;
}

export function useFormValidation<T extends Record<string, unknown>>(
  initialValues: T,
  validationRules: ValidationRules
): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateField = useCallback((name: string, value: string): string => {
    const rule = validationRules[name];
    if (!rule) return '';

    // Required validation
    if (rule.required && !value.trim()) {
      return `${name} zorunludur.`;
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return `${name} en az ${rule.minLength} karakter olmalıdır.`;
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${name} en fazla ${rule.maxLength} karakter olmalıdır.`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return getPatternErrorMessage(name, rule.pattern);
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) return customError;
    }

    return '';
  }, [validationRules]);

  const getPatternErrorMessage = (fieldName: string, pattern: RegExp): string => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10,15}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (pattern.toString() === emailPattern.toString()) {
      return 'Geçerli bir e-posta adresi giriniz.';
    }
    if (pattern.toString() === phonePattern.toString()) {
      return 'Geçerli bir telefon numarası giriniz (10-15 rakam).';
    }
    if (pattern.toString() === passwordPattern.toString()) {
      return 'Şifre en az 6 karakter olmalı, bir büyük harf ve bir rakam içermelidir.';
    }
    return `${fieldName} geçerli formatta değil.`;
  };

  const validateAllFields = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const value = (values[fieldName] as string) || '';
      const error = validateField(fieldName, value);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    return newErrors;
  }, [values, validateField, validationRules]);

  // Handle input change
  const handleChange = useCallback((name: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: '' }));
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit: (values: T) => Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate all fields
      const validationErrors = validateAllFields();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validateAllFields]);

  // Set field error manually
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field as string]: error }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Check if form is valid
  const isValid = Object.keys(validateAllFields()).length === 0;

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldError,
    clearErrors,
    reset,
  };
}

// Predefined validation rules
export const authValidationRules = {
  // Login rules
  loginRules: {
    identifier: { required: true },
    password: { required: true, minLength: 6 },
  },

  // Register rules
  registerRules: {
    name: { required: true, minLength: 2, maxLength: 50 },
    lastName: { required: true, minLength: 2, maxLength: 50 },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      required: true,
      pattern: /^[0-9]{10,15}$/
    },
    password: {
      required: true,
      pattern: /^(?=.*[A-Z])(?=.*\d).{6,}$/
    },
    confirmPassword: {
      required: true,
      custom: (value: string, formValues?: any) => {
        if (formValues && value !== formValues.password) {
          return 'Şifreler eşleşmiyor.';
        }
        return null;
      }
    },
  },

  // Reset password rules
  resetPasswordRules: {
    password: {
      required: true,
      pattern: /^(?=.*[A-Z])(?=.*\d).{6,}$/
    },
    confirmPassword: {
      required: true,
      custom: (value: string, formValues?: any) => {
        if (formValues && value !== formValues.password) {
          return 'Şifreler eşleşmiyor.';
        }
        return null;
      }
    },
  },
};
