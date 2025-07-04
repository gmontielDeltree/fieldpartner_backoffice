import React, { useState, useEffect, forwardRef } from 'react';
import { TextField, OutlinedTextFieldProps } from '@mui/material';

interface NumericTextFieldProps extends Omit<OutlinedTextFieldProps, 'value' | 'onChange'> {
  value: number | null;
  onChange: (value: number | null) => void;
  maxLength?: number;
  decimalSeparator?: ',' | '.' | 'auto';
}

export const NumericTextField = forwardRef<HTMLDivElement, NumericTextFieldProps>(
  ({ value, onChange, onBlur, maxLength = 30, decimalSeparator = 'auto', ...props }, ref) => {
    // Determinar el separador decimal basado en el navegador o preferencia
    const getDecimalSeparator = () => {
      if (decimalSeparator !== 'auto') return decimalSeparator;
      return (1.1).toLocaleString().charAt(1) === ',' ? ',' : '.';
    };

    const separator = getDecimalSeparator();
    const [inputValue, setInputValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);

    // Sincronizar con el valor externo
    useEffect(() => {
      if (!isFocused) {
        if (value === null || value === 0) {
          setInputValue('');
        } else {
          // Convertir a string manteniendo el separador decimal
          let stringValue = value.toString();
          if (separator === ',') {
            stringValue = stringValue.replace('.', ',');
          }
          setInputValue(stringValue);
        }
      }
    }, [value, isFocused, separator]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Expresión regular que permite:
      // - Vacío
      // - Números enteros
      // - Números decimales con coma o punto
      // - Máximo un separador decimal
      if (newValue === '' || /^-?\d*([,.]?\d*)?$/.test(newValue)) {
        setInputValue(newValue);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);

      let numericValue: number | null = null;

      if (inputValue !== '') {
        // Normalizar a formato numérico (reemplazar coma por punto)
        const normalizedValue = inputValue.replace(',', '.');
        numericValue = parseFloat(normalizedValue);

        // Manejar valores no válidos
        if (isNaN(numericValue)) {
          numericValue = null;
        }
      }

      // Actualizar valor padre
      onChange(numericValue);

      // Ejecutar onBlur original si existe
      if (onBlur) onBlur(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (props.onFocus) props.onFocus(e);
    };

    return (
      <TextField
        {...props}
        ref={ref}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        inputProps={{ maxLength }}
        fullWidth
      />
    );
  },
);
