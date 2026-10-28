import { Backdrop, Box } from '@mui/material';
import React from 'react';
import { LoadingState } from './ui/LoadingState';

export interface LoadingProps {
    loading: boolean;
    label?: string;
}

/* Carga a pantalla completa con el loader de grilla de pixeles
 * (Beautiful UI: Loading State) en una ficha flotante. */
export const Loading: React.FC<LoadingProps> = ({ loading, label }) => {
    return (
        <Backdrop
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'rgba(var(--page-rgb), 0.55) !important',
                backdropFilter: 'blur(3px)',
            }}
            open={!!loading}
        >
            {loading && (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    pl: 1.25,
                    pr: 2,
                    py: 1.25,
                    borderRadius: '14px',
                    background: 'var(--surface)',
                    boxShadow: 'var(--shadow-overlay)',
                    animation: 'pop-in 200ms var(--ease-out-strong) both',
                }}
            >
                <Box
                    component="img"
                    src="/assets/fieldpartner-simbolo.png"
                    alt=""
                    sx={{ width: 28, height: 28, objectFit: 'contain' }}
                />
                <LoadingState label={label ?? 'Cargando'} showElapsed />
            </Box>
            )}
        </Backdrop>
    )
}
