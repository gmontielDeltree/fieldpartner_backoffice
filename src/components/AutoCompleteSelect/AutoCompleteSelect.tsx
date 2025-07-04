import Autocomplete, {
  AutocompleteProps,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// Tipo genérico para las opciones
export interface OptionType {
  id: number | string;
  label: string;
}

// Props del componente con tipado seguro
interface AutoCompleteSelectProps<T extends OptionType>
  extends Omit<
    AutocompleteProps<T, false, false, false>,
    'onChange' | 'options' | 'renderInput' | 'value' | 'renderOption'
  > {
  options: T[];
  label: string;
  value: T | null;
  onChange: (value: T | null) => void;
  error?: boolean;
  helperText?: string;
  getOptionLabel?: (option: T) => string;
  renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: T) => React.ReactNode;
}

export const AutoCompleteSelect = <T extends OptionType>({
  options,
  label,
  value,
  onChange,
  error = false,
  helperText,
  getOptionLabel,
  renderOption,
  ...restProps
}: AutoCompleteSelectProps<T>) => {
  // Función para manejar cambios
  const handleChange = (
    _: React.SyntheticEvent,
    newValue: T | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T>,
  ) => {
    if (reason !== 'clear' || details?.option) {
      onChange(newValue);
    } else {
      onChange(null);
    }
  };

  return (
    <Autocomplete<T, false, false, false>
      options={options}
      getOptionLabel={getOptionLabel || (option => option.label)}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      value={value}
      onChange={handleChange}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          variant='outlined'
          error={error}
          helperText={helperText}
        />
      )}
      renderOption={renderOption || ((props, option) => <li {...props}>{option.label}</li>)}
      {...restProps}
    />
  );
};
