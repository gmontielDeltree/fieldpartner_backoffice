import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import { ColumnProps, EnumStatusAccount } from '../../types';
import { Box, Skeleton, Tooltip, IconButton } from '@mui/material';
import { BadgeOutlined, EditOutlined } from '@mui/icons-material';
import { setAccountActive } from '../../store/account';
import { useAppDispatch } from '../../hooks';
import { AccountDto } from '../../interfaces/account';
import { ItemRow, TableCellStyled } from '../DataTable';
import { EmptyState, StatusKind, StatusPill } from '../ui';

type Order = 'asc' | 'desc';
type OrderBy = keyof AccountDto;


export interface DataTableProps {
    columns: ColumnProps[];
    rows: AccountDto[];
    isLoading: boolean;
}

// Estado de la cuenta → tono de la StatusPill
const getStatusColor = (status: string): { color: StatusKind, label: string } => {
    switch (status) {
        case EnumStatusAccount.Activa:
            return { color: 'done', label: 'Activa' };
        case EnumStatusAccount.Inactiva:
            return { color: 'error', label: 'Inactiva' };
        case EnumStatusAccount.Suspendida:
            return { color: 'todo', label: 'Suspendida' };
        case EnumStatusAccount.Cancelada:
            return { color: 'neutral', label: 'Cancelada' };
        default:
            return { color: 'neutral', label: status };
    }
};

// Función de comparación para el ordenamiento
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    const aVal = a[orderBy];
    const bVal = b[orderBy];

    if (bVal === null || bVal === undefined) return -1;
    if (aVal === null || aVal === undefined) return 1;

    if (bVal < aVal) return -1;
    if (bVal > aVal) return 1;
    return 0;
}

function getComparator<Key extends keyof AccountDto>(
    order: Order,
    orderBy: Key,
): (a: AccountDto, b: AccountDto) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export const DataTable: React.FC<DataTableProps> = ({
    columns,
    rows,
    isLoading
}) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<OrderBy>('accountReference');

    const handleRequestSort = (property: OrderBy) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onClickEditCustomer = (item: AccountDto): void => {
        dispatch(setAccountActive(item));
        navigate(`/accounts/${item.accountId}`);
    };

    // Ordenar y paginar los datos
    const sortedRows = useMemo(() => {
        return [...rows].sort(getComparator(order, orderBy));
    }, [rows, order, orderBy]);

    const paginatedRows = useMemo(() => {
        return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedRows, page, rowsPerPage]);

    // Mapeo de columnas a propiedades de Account (por el texto de la columna)
    const columnToProperty: { [key: string]: OrderBy } = {
        'Referencia ID': 'accountReference',
        'Estado': 'status',
        'País': 'country',
        'Denominación': 'denomination',
        'Tipo': 'licenceType',
        'Licencia': 'licence',
    };

    if (isLoading) {
        return (
            <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Skeleton variant="rounded" sx={{ width: '100%', height: 36 }} />
                {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} variant="text" sx={{ width: '100%', height: 28 }} />
                ))}
            </Box>
        );
    }

    if (rows.length === 0) {
        return (
            <EmptyState
                icon={<BadgeOutlined />}
                title="No se encontraron cuentas"
                hint="Intenta ajustar los filtros de búsqueda"
            />
        );
    }

    return (
        <>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader sx={{ minWidth: 700 }} aria-label="accounts table">
                    <TableHead>
                        <TableRow>
                            {columns.map(({ text, align }) => {
                                const property = columnToProperty[text];
                                return (
                                    <TableCellStyled
                                        key={text}
                                        align={align}
                                        sortDirection={property && orderBy === property ? order : false}
                                    >
                                        {property ? (
                                            <TableSortLabel
                                                active={orderBy === property}
                                                direction={orderBy === property ? order : 'asc'}
                                                onClick={() => handleRequestSort(property)}
                                                sx={{
                                                    color: 'inherit',
                                                    '&:hover': { color: 'var(--ink)' },
                                                    '&.Mui-active': { color: 'var(--ink)' },
                                                    '& .MuiTableSortLabel-icon': { fontSize: 15 },
                                                }}
                                            >
                                                {text}
                                            </TableSortLabel>
                                        ) : (
                                            text
                                        )}
                                    </TableCellStyled>
                                );
                            })}
                            <TableCellStyled key="actions" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRows.map((row) => {
                            const statusInfo = getStatusColor(row.status);
                            return (
                                <ItemRow key={row.accountId} hover>
                                    <TableCellStyled component="th" scope="row" sx={{ fontWeight: 500 }}>
                                        {row.accountReference}
                                    </TableCellStyled>
                                    <TableCellStyled align="left">
                                        <StatusPill status={statusInfo.color} size="sm">
                                            {statusInfo.label}
                                        </StatusPill>
                                    </TableCellStyled>
                                    <TableCellStyled align="left">{row.country}</TableCellStyled>
                                    <TableCellStyled align="left">{row.denomination}</TableCellStyled>
                                    <TableCellStyled align="left">{row.licenceType}</TableCellStyled>
                                    <TableCellStyled align="left">{row.licence}</TableCellStyled>
                                    <TableCellStyled align="right">{row.countCampos || "-"}</TableCellStyled>
                                    <TableCellStyled align="right">{row.countLicencias || "-"}</TableCellStyled>
                                    <TableCellStyled align="right">{row.countHectareas || "-"}</TableCellStyled>
                                    <TableCellStyled align="right" sx={{ whiteSpace: 'nowrap' }}>
                                        <Tooltip title="Editar cuenta">
                                            <IconButton
                                                aria-label='Editar'
                                                onClick={() => onClickEditCustomer(row)}
                                            >
                                                <EditOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCellStyled>
                                </ItemRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                sx={{ borderTop: '1px solid var(--line)' }}
            />
        </>
    );
};
