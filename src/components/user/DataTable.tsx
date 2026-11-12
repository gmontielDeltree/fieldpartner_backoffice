import { ColumnProps, SystemUser } from '../../types';
import { Tooltip, IconButton, Chip } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { useAppDispatch } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { setUserActive } from '../../store/user';
import SharedDataTable, { ItemRow, TableCellStyled } from '../DataTable';

export interface DataTableProps {
    columns: ColumnProps[];
    rows: SystemUser[];
    isLoading: boolean;
}

// Verde para usuarios activos; gris atenuado para el resto (inactivo/suspendido/pendiente…).
const stateColor = (state: string): 'success' | 'default' =>
    state === 'ACTIVE' ? 'success' : 'default';

export const DataTable: React.FC<DataTableProps> = ({
    columns,
    isLoading,
    rows
}) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onClickEditUser = (item: SystemUser): void => {
        // El form de edición trabaja con UserDto; mapeamos lo editable (el resto lo
        // completa el usuario). `_id` lleva el id real para el PATCH.
        dispatch(setUserActive({
            _id: item.id,
            username: item.username,
            email: item.email,
            password: '',
            isAdmin: item.role === 'ADMIN' || item.role === 'GENERAL_ADMIN',
        }));
        navigate(`/user/${item.id}`);
    }

    return (
        <SharedDataTable columns={columns} isLoading={isLoading}>
            {rows.map((row) => (
                <ItemRow key={row.id} hover>
                    <TableCellStyled component="th" scope="row" sx={{ fontWeight: 500 }}>
                        {row.username}
                    </TableCellStyled>
                    <TableCellStyled align="left">{row.email}</TableCellStyled>
                    <TableCellStyled align="left">{row.accountDenomination}</TableCellStyled>
                    <TableCellStyled align="left">{row.role ?? '—'}</TableCellStyled>
                    <TableCellStyled align="left">
                        <Chip size="small" label={row.state} color={stateColor(row.state)} variant="outlined" />
                    </TableCellStyled>
                    <TableCellStyled align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Tooltip title="Editar">
                            <IconButton
                                aria-label='Editar'
                                onClick={() => onClickEditUser(row)} >
                                <EditOutlined />
                            </IconButton>
                        </Tooltip>
                    </TableCellStyled>
                </ItemRow>
            ))}
        </SharedDataTable>
    );
}
