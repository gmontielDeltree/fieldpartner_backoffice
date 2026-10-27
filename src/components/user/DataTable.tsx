import { ColumnProps, UserDto } from '../../types';
import { Tooltip, IconButton } from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { useAppDispatch } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { setUserActive } from '../../store/user';
import SharedDataTable, { ItemRow, TableCellStyled } from '../DataTable';

export interface DataTableProps {
    columns: ColumnProps[];
    rows: UserDto[];
    isLoading: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
    columns,
    isLoading,
    rows
}) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onClickEditUser = (item: UserDto): void => {
        dispatch(setUserActive(item));
        navigate(`/user/${item._id}`);
    }

    return (
        <SharedDataTable columns={columns} isLoading={isLoading}>
            {rows.map((row) => (
                <ItemRow key={row._id} hover>
                    <TableCellStyled component="th" scope="row" sx={{ fontWeight: 500 }}>
                        {row.username}
                    </TableCellStyled>
                    <TableCellStyled align="left">{row.email}</TableCellStyled>
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
