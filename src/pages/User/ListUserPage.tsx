import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    DataTableUser,
    EmptyState,
    ListCard,
    ListToolbar,
    Loading,
    PageContainer,
    PageHeader,
    RollingNumber,
    SearchField,
    ValuePill,
} from '../../components';
import { Button } from '@mui/material';
import { AddRounded, PersonOutlineOutlined, SearchRounded } from '@mui/icons-material';
import { ColumnProps } from '../../types';
import { useForm, useUser } from '../../hooks';

const columns: ColumnProps[] = [
    { text: 'Apellido', align: 'left' },
    { text: 'Nombre', align: 'left' },
    { text: 'Email', align: 'left' }];

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
            ({ username, email }) =>
                (username && username.toLowerCase().includes(filterText.toLowerCase())) ||
                (email && email.toLowerCase().includes(filterText.toLowerCase()))
        );
        setUsers(filtedUsers);
    }

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {
                isLoading && (<Loading loading={true} />)
            }
            <PageContainer>
                <PageHeader
                    icon={<PersonOutlineOutlined />}
                    title="Usuarios Backoffice"
                    meta={
                        !isLoading ? (
                            <ValuePill>
                                <RollingNumber value={users.length} />
                            </ValuePill>
                        ) : undefined
                    }
                    actions={
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to="/user/new"
                            startIcon={<AddRounded />}
                        >
                            Nuevo
                        </Button>
                    }
                />
                <ListCard>
                    <ListToolbar>
                        <SearchField
                            value={filterText}
                            onChange={handleInputChange}
                            placeholder="Nombre/Razón social…"
                            onSubmit={onClickSearch}
                        />
                        {/* la búsqueda de esta lista no es en vivo: se aplica con Enter o con este botón */}
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onClickSearch()}
                            startIcon={<SearchRounded />}
                        >
                            Buscar
                        </Button>
                    </ListToolbar>
                    {!isLoading && users.length === 0 ? (
                        filterText ? (
                            <EmptyState title="Sin resultados" hint="Probá con otra búsqueda" />
                        ) : (
                            <EmptyState icon={<PersonOutlineOutlined />} title="No se encontraron usuarios" hint="Cargá el primero con «Nuevo»." />
                        )
                    ) : (
                        <DataTableUser
                            key="datatable-user"
                            columns={columns}
                            rows={users}
                            isLoading={isLoading}
                        />
                    )}
                </ListCard>
            </PageContainer>
        </>
    )
}
