import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import styled from 'styled-components';

export const BoxStyled = styled(Box)`
    img {
        display: inline-block;
        width: 100%;
        max-width: 250px;
        height: 200px;
    }
`;

export const HomePage: React.FC = () => {
    return (
        <Container maxWidth="sm"
            sx={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
            <Box display="flex" justifyContent="space-evenly" alignItems="center">
                <BoxStyled>
                    <img src="/assets/agrotools_icon.png" alt="agrotools" />
                </BoxStyled>
                <Typography
                    display="inline-block"
                    variant='h2'
                    color="#71d076"
                    fontWeight={600}
                    sx={{
                        textShadow: '0 0 3px black',
                        borderStyle: 'outset',
                    }}
                    letterSpacing="5px">
                    QTS Agro
                </Typography>
            </Box>
            <Box display="flex" justifyContent="center" mt={5}>
                <Typography
                    display="inline-block"
                    variant='h2'
                    color="#388b3c"
                    letterSpacing="5px"
                    sx={{ textShadow: '0 0 2px black' }}
                    margin="auto" >Fieldpartner</Typography>
            </Box>
        </Container>
    )
}
