import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { DataTableUser, Loading } from '../../components';
import { Box, Typography, Grid, Button, TextField, InputAdornment, Container } from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { ColumnProps } from '../../types';
import { useForm, useUser } from '../../hooks';

const columns: ColumnProps[] = [
    { text: 'Apellido', align: 'left' },
    { text: 'Nombre', align: 'center' },
    { text: 'Email', align: 'center' }];

export const ListUserPage: React.FC = () => {

    const {
        isLoading,
        users,
        getUsers,
        setUsers
    } = useUser();
    const {
        filterText,
        handleInputChange,
    } = useForm({ filterText: '' });

    const onClickSearch = (): void => {
        if (filterText === '') {
            getUsers();
            return;
        }
        const filtedUsers = users.filter(
            ({ lastName: apellido, name: nombre }) =>
                (apellido && apellido.toLowerCase().includes(filterText.toLowerCase())) ||
                (nombre && nombre.toLowerCase().includes(filterText.toLowerCase()))
        );
        setUsers(filtedUsers);
    }

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container maxWidth="md" sx={{ pl: 0, m: 0 }}>
            {
                isLoading && (<Loading loading={true} />)
            }
            <Box
                component="div"
                display="flex"
                alignItems="center"
                sx={{ ml: { sm: 2 }, pt: 2 }}>
                <PersonIcon />
                <Typography variant='h5' sx={{ ml: { sm: 2 } }} >
                    Usuarios-Backoffice
                </Typography>
            </Box>
            <Box component="div" sx={{ mt: 7 }}>
                <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ p: 2, mt: { sm: 2 } }}
                >
                    <Grid item xs={6} sm={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            component={RouterLink}
                            to="/user/new"
                            startIcon={<AddIcon />}
                        >
                            Nuevo
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        <Grid container justifyContent="flex-end" >
                            <Grid item xs={8} sm={4} >
                                <TextField
                                    variant="outlined"
                                    type='text'
                                    size='small'
                                    placeholder='Nombre/Razon Social'
                                    autoComplete='off'
                                    name="filterText"
                                    value={filterText}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" />,
                                    }}
                                    fullWidth />
                            </Grid>
                            <Grid item xs={4} sm={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="medium"
                                    fullWidth
                                    sx={{
                                        height: '98%',
                                        margin: 'auto',
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0
                                    }}
                                    onClick={() => onClickSearch()}
                                    startIcon={<SearchIcon />}>
                                    Buscar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Box
                    component="div"
                    sx={{ p: 1, mt: 2 }}>
                    <DataTableUser
                        key="datatable-user"
                        columns={columns}
                        rows={users}
                        isLoading={isLoading}
                    />
                </Box>
            </Box>
        </Container>
    )
}
