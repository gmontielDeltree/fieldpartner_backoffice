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
  TableSortLabel,
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
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  isLoading,
  columns,
  children,
  sortField,
  sortDirection = "asc",
  onSort,
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
              {columns.map(({ text, align, field, sortable }) => {
                const isSortable = Boolean(onSort && sortable && field);
                const isActive = isSortable && sortField === field;
                return (
                  <TableCellStyled
                    key={text}
                    align={align}
                    sortDirection={isActive ? sortDirection : false}
                  >
                    {isSortable ? (
                      <TableSortLabel
                        active={isActive}
                        direction={isActive ? sortDirection : "asc"}
                        onClick={() => onSort!(field!)}
                      >
                        {text}
                      </TableSortLabel>
                    ) : (
                      text
                    )}
                  </TableCellStyled>
                );
              })}
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
