import { useState } from 'react';
import { z, ZodSchema } from 'zod';

export function useZodForm<T extends Record<string, any>>(schema: ZodSchema<T>, initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = () => {
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof T, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path && err.path[0]) fieldErrors[err.path[0] as keyof T] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    validate,
    handleChange,
  };
}
