import { Grid, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const GridItemStyled = styled(Grid)`
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2);
    // background-color: white;
`;

export interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title = "" }) => {

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            // bgcolor="primary.main"
            sx={{ minHeight: '100vh', backgroundColor: 'primary.light' }} //extension del style 
        >
            <GridItemStyled
                item
                xs={3}
                sm={2}
                bgcolor="white"
                sx={{
                    width: { xs: 300, sm: 350 },
                    padding: 3,
                    borderRadius: 2,
                    pb: 6
                }}
            >
                <Typography variant='h5' textAlign="center" sx={{ mb: 1 }}>{title}</Typography>

                {children}
            </GridItemStyled>
        </Grid>
    )
}
