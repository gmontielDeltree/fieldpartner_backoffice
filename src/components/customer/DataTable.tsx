import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ColumnProps, Customer } from '../../types';
import { Box, Skeleton, Tooltip, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { setCustomerActive } from '../../store/customer';
import { useAppDispatch } from '../../hooks';


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
    rows: Customer[];
    isLoading: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
    columns,
    rows,
    isLoading
}) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onClickEditCustomer = (item: Customer): void => {
        dispatch(setCustomerActive(item));
        navigate(`/customer/${item.id}`);
    }

    return (
        <TableContainer component={Paper}>
            {
                isLoading ? (
                    <Box sx={{ p: 1 }}>
                        <Skeleton variant="rounded" sx={{ width: '100%', height: 60 }} />
                        <Skeleton variant="text" sx={{ width: '100%', height: 30 }} />
                        <Skeleton variant="text" sx={{ width: '100%', height: 30 }} />
                        <Skeleton variant="text" sx={{ width: '100%', height: 30 }} />
                    </Box>
                ) : (
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {columns.map(({ text, align }) => (
                                    <StyledTableCell key={text} align={align}>
                                        {text}
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell key="actions" />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.tipoEntidad}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.nombreCompleto || row.razonSocial}</StyledTableCell>
                                    <StyledTableCell align="center">{row.account.tipoLicencia}</StyledTableCell>
                                    <StyledTableCell align="center">{row.contactoPrincipal}</StyledTableCell>
                                    <StyledTableCell align="center">{row.account.finLicencia}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Tooltip title="Editar">
                                            <IconButton
                                                aria-label='Editar'
                                                onClick={() => onClickEditCustomer(row)} >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                )
            }
        </TableContainer>
    );
}