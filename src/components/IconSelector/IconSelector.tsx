import React, { lazy, Suspense, useState } from 'react';
import * as MuiIcons from '@mui/icons-material';
import { TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';

const IconSelectorModal = lazy(() =>
  import('../IconSelectorModal/IconSelectorModal').then(module => ({
    default: module.IconSelectorModal,
  })),
);

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  label = 'Seleccionar Ícono',
  error,
  helperText,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const Icon = value ? MuiIcons[value as keyof typeof MuiIcons] : null;

  const handleClearIcon = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <>
      <TextField
        fullWidth
        label={label}
        value={value ? value.replace(/([A-Z])/g, ' $1').trim() : ''}
        onClick={() => setIsModalOpen(true)}
        error={error}
        helperText={helperText}
        InputProps={{
          readOnly: true,
          startAdornment: Icon && (
            <InputAdornment position='start'>
              <Icon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              {value && (
                <IconButton
                  onClick={handleClearIcon}
                  size='small'
                  sx={{
                    mr: 0.5,
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'error.dark',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
              <IconButton onClick={() => setIsModalOpen(true)} size='small'>
                {Icon ? <Icon /> : <SearchIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Suspense fallback={<CircularProgress />}>
        {isModalOpen && (
          <IconSelectorModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={onChange}
          />
        )}
      </Suspense>
    </>
  );
};
