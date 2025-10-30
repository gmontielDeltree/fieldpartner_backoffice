import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { ColumnProps, EnumStatusAccount } from '../../types';
import { Box, Skeleton, Tooltip, IconButton, Chip, Typography } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { setAccountActive } from '../../store/account';
import { useAppDispatch } from '../../hooks';
import { Account } from '../../interfaces/account';

type Order = 'asc' | 'desc';
type OrderBy = keyof Account;


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export interface DataTableProps {
    columns: ColumnProps[];
    rows: Account[];
    isLoading: boolean;
}

// Función para obtener el color del chip según el estado
const getStatusColor = (status: string): { color: 'success' | 'error' | 'warning' | 'default', label: string } => {
    switch (status) {
        case EnumStatusAccount.Activa:
            return { color: 'success', label: 'Activa' };
        case EnumStatusAccount.Inactiva:
            return { color: 'error', label: 'Inactiva' };
        case EnumStatusAccount.Suspendida:
            return { color: 'warning', label: 'Suspendida' };
        case EnumStatusAccount.Cancelada:
            return { color: 'default', label: 'Cancelada' };
        default:
            return { color: 'default', label: status };
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

function getComparator<Key extends keyof Account>(
    order: Order,
    orderBy: Key,
): (a: Account, b: Account) => number {
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

    const onClickEditCustomer = (item: Account): void => {
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

    // Mapeo de columnas a propiedades de Account
    const columnToProperty: { [key: string]: OrderBy } = {
        'Referencia Id': 'accountReference',
        'Status': 'status',
        'Pais': 'country',
        'Denominacion': 'denomination',
        'Tipo': 'licenceType',
        'Licencia': 'licence',
    };

    return (
        <Paper elevation={2}>
            <TableContainer sx={{ maxHeight: "600px" }}>
                {
                    isLoading ? (
                        <Box sx={{ p: 3 }}>
                            <Skeleton variant="rounded" sx={{ width: '100%', height: 60, mb: 2 }} />
                            {[...Array(5)].map((_, index) => (
                                <Skeleton key={index} variant="text" sx={{ width: '100%', height: 50, mb: 1 }} />
                            ))}
                        </Box>
                    ) : rows.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                No se encontraron cuentas
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Intenta ajustar los filtros de búsqueda
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Table stickyHeader sx={{ minWidth: 700 }} aria-label="accounts table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map(({ text, align }) => {
                                            const property = columnToProperty[text];
                                            return (
                                                <StyledTableCell key={text} align={align}>
                                                    {property ? (
                                                        <TableSortLabel
                                                            active={orderBy === property}
                                                            direction={orderBy === property ? order : 'asc'}
                                                            onClick={() => handleRequestSort(property)}
                                                            sx={{
                                                                color: 'white !important',
                                                                '&:hover': {
                                                                    color: 'white !important',
                                                                },
                                                                '&.Mui-active': {
                                                                    color: 'white !important',
                                                                    '& .MuiTableSortLabel-icon': {
                                                                        color: 'white !important',
                                                                    },
                                                                },
                                                                '& .MuiTableSortLabel-icon': {
                                                                    color: 'white !important',
                                                                    opacity: 0.7,
                                                                },
                                                            }}
                                                        >
                                                            {text}
                                                        </TableSortLabel>
                                                    ) : (
                                                        text
                                                    )}
                                                </StyledTableCell>
                                            );
                                        })}
                                        <StyledTableCell key="actions" align="center">
                                            Acciones
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedRows.map((row) => {
                                        const statusInfo = getStatusColor(row.status);
                                        return (
                                            <StyledTableRow key={row.accountId}>
                                                <StyledTableCell component="th" scope="row">
                                                    <Typography fontWeight={500}>{row.accountReference}</Typography>
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    <Chip
                                                        label={statusInfo.label}
                                                        color={statusInfo.color}
                                                        size="small"
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{row.country}</StyledTableCell>
                                                <StyledTableCell align="left">{row.denomination}</StyledTableCell>
                                                <StyledTableCell align="left">{row.licenceType}</StyledTableCell>
                                                <StyledTableCell align="left">{row.licence}</StyledTableCell>
                                                <StyledTableCell align="left">{row.countCampos || "-"}</StyledTableCell>
                                                <StyledTableCell align="left">{row.countLicencias || "-"}</StyledTableCell>
                                                <StyledTableCell align="left">{row.countHectareas || "-"}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Tooltip title="Editar cuenta">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            aria-label='Editar'
                                                            onClick={() => onClickEditCustomer(row)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
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
                            />
                        </>
                    )
                }
            </TableContainer>
        </Paper>
    );
};
