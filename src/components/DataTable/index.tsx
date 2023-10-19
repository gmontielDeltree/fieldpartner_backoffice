import React, { ReactNode } from "react";
import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import { ColumnProps } from "../../types";

export const TableCellStyled = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    color: "#000000c7",
    fontSize: 14,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const ItemRow = styled(TableRow)(() => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export interface DataTableProps {
  isLoading: boolean;
  columns: ColumnProps[];
  children?: ReactNode | ReactNode[];
}

const DataTable: React.FC<DataTableProps> = ({
  isLoading,
  columns,
  children,
}) => {
  return (
    <TableContainer component={Paper}>
      {isLoading ? (
        <Box sx={{ p: 1 }}>
          <Skeleton variant="rounded" sx={{ width: "100%", height: 60 }} />
          <Skeleton variant="text" sx={{ width: "100%", height: 30 }} />
          <Skeleton variant="text" sx={{ width: "100%", height: 30 }} />
          <Skeleton variant="text" sx={{ width: "100%", height: 30 }} />
        </Box>
      ) : (
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgb(0 0 0 / 25%)" }}>
              {columns.map(({ text, align }) => (
                <TableCellStyled key={text} align={align}>
                  {text}
                </TableCellStyled>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default DataTable;
