import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

/* ─────────────────────────────────────────────────────────
 * FILTER CHIPS (Beautiful UI: FilterTable)
 * Fichas de estado que filtran una tabla. La activa se levanta
 * como un botón (superficie + anillo); las demás quedan quietas.
 * Cada una puede llevar un punto de color y un contador.
 * ───────────────────────────────────────────────────────── */

export interface FilterChipOption<K extends string = string> {
  key: K;
  label: React.ReactNode;
  dot?: string;
  count?: number;
}

export interface FilterChipsProps<K extends string = string> {
  options: FilterChipOption<K>[];
  value: K;
  onChange: (key: K) => void;
  sx?: SxProps<Theme>;
}

export function FilterChips<K extends string = string>({ options, value, onChange, sx }: FilterChipsProps<K>) {
  return (
    <Box
      role="toolbar"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        overflowX: 'auto',
        mx: -0.5,
        px: 0.5,
        py: 0.5,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        ...((sx as object) || {}),
      }}
    >
      {options.map(opt => {
        const active = opt.key === value;
        return (
          <Box
            key={opt.key}
            component="button"
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.key)}
            sx={{
              all: 'unset',
              boxSizing: 'border-box',
              cursor: 'pointer',
              display: 'flex',
              flexShrink: 0,
              alignItems: 'center',
              gap: '6px',
              height: 27,
              px: '10px',
              borderRadius: 999,
              fontSize: 12.5,
              fontWeight: 500,
              color: active ? 'var(--ink)' : 'var(--ink-2)',
              background: active ? 'var(--surface)' : 'transparent',
              boxShadow: active ? 'var(--shadow-btn)' : 'none',
              transition: 'background-color 200ms ease, box-shadow 200ms ease, color 200ms ease',
              '&:hover': { background: active ? 'var(--surface)' : 'var(--hover)' },
              '&:focus-visible': { outline: '2px solid var(--accent)', outlineOffset: 2 },
            }}
          >
            {opt.dot && <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', background: opt.dot }} />}
            {opt.label}
            {typeof opt.count === 'number' && (
              <Box
                component="span"
                sx={{
                  px: '4px',
                  borderRadius: '4px',
                  fontSize: 10.5,
                  fontVariantNumeric: 'tabular-nums',
                  color: active ? 'var(--ink-2)' : 'var(--ink-3)',
                  background: active ? 'var(--field)' : 'transparent',
                }}
              >
                {opt.count}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default FilterChips;
