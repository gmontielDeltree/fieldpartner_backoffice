import React, { lazy, Suspense, useState } from 'react';
import * as MuiIcons from '@mui/icons-material';
import { TextField, InputAdornment, IconButton, CircularProgress, Tooltip } from '@mui/material';
import { CloseRounded as CloseIcon, SearchRounded as SearchIcon } from '@mui/icons-material';

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
  label = 'Seleccionar ícono',
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
        sx={{ '& .MuiInputBase-root, & .MuiInputBase-input': { cursor: 'pointer' } }}
        InputProps={{
          readOnly: true,
          startAdornment: Icon && (
            <InputAdornment position='start' sx={{ color: 'var(--ink-2)' }}>
              <Icon sx={{ fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              {value && (
                <Tooltip title='Quitar ícono'>
                  <IconButton
                    aria-label='Quitar ícono'
                    onClick={handleClearIcon}
                    size='small'
                    sx={{
                      mr: 0.25,
                      color: 'var(--ink-3)',
                      '&:hover': { color: 'var(--red)', backgroundColor: 'var(--red-tint)' },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title='Elegir ícono'>
                <IconButton
                  aria-label='Elegir ícono'
                  onClick={() => setIsModalOpen(true)}
                  size='small'
                  edge='end'
                  sx={{ color: 'var(--ink-2)' }}
                >
                  <SearchIcon sx={{ fontSize: 19 }} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      <Suspense fallback={<CircularProgress size={20} />}>
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
