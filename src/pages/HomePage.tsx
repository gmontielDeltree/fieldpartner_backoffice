import React from 'react';
import { Box, Container } from '@mui/material';

export const HomePage: React.FC = () => {
    return (
        <Container maxWidth="sm"
            sx={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 6
            }}>
            <Box
                component="img"
                src="/assets/qtsagro-logo.png"
                alt="QTS Agro"
                sx={{ width: '100%', maxWidth: 420, height: 'auto' }}
            />
            <Box
                component="img"
                src="/assets/fieldpartner-logo.png"
                alt="FieldPartner"
                sx={{ width: '100%', maxWidth: 360, height: 'auto' }}
            />
        </Container>
    )
}
