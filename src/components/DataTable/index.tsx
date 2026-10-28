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
import { tableHeadCell } from "../../themes/tokens";

/* ─────────────────────────────────────────────────────────
 * TABLA COMPARTIDA (la de FieldPartner)
 * Encabezado con el tratamiento común de las tablas (banda
 * apenas teñida, rótulos 12/600; ver tableHeadCell), líneas
 * finas de grilla, hover suave y números tabulares. El
 * contenedor es una card (radio 12 + --shadow-card); dentro de
 * ListCard pierde el marco. Se mantiene el orden por columna.
 * Las acciones por fila (editar/borrar) quedan quietas hasta el
 * hover, como en las grillas de FieldPartner.
 * ───────────────────────────────────────────────────────── */

const headCell = {
  ...tableHeadCell,
  lineHeight: 1.3,
  padding: "10px 12px",
  borderBottom: "1px solid var(--table-head-line)",
  whiteSpace: "nowrap" as const,
};

const bodyCell = {
  fontSize: 13,
  color: "var(--ink)",
  padding: "9px 12px",
  borderBottom: "1px solid var(--grid-line)",
  fontVariantNumeric: "tabular-nums" as const,
};

export const TableCellStyled = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: headCell,
  [`&.${tableCellClasses.body}`]: bodyCell,
}));

export const ItemRow = styled(TableRow)(() => ({
  transition: "background-color 120ms ease",
  "&.MuiTableRow-hover:hover": {
    backgroundColor: "var(--hover)",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  // acciones por fila: íconos chicos y quietos hasta el hover
  "& td .MuiIconButton-root": {
    padding: 6,
    color: "var(--ink-3)",
    "& .MuiSvgIcon-root": { fontSize: 18 },
    "&:hover": { color: "var(--ink)", backgroundColor: "var(--hover-2)" },
  },
  '& td .MuiIconButton-root[aria-label*="limin" i]:hover, & td .MuiIconButton-root[aria-label*="borrar" i]:hover, & td .MuiIconButton-root[aria-label*="delete" i]:hover':
    { color: "var(--red)", backgroundColor: "var(--red-tint)" },
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
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: 540,
        borderRadius: "12px",
        boxShadow: "var(--shadow-card)",
        background: "var(--surface)",
        "&.MuiPaper-root": { borderRadius: "12px", boxShadow: "var(--shadow-card)" },
      }}
    >
      {isLoading ? (
        <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
          <Skeleton variant="rounded" sx={{ width: "100%", height: 36 }} />
          <Skeleton variant="text" sx={{ width: "100%", height: 28 }} />
          <Skeleton variant="text" sx={{ width: "100%", height: 28 }} />
          <Skeleton variant="text" sx={{ width: "100%", height: 28 }} />
        </Box>
      ) : (
        <Table stickyHeader sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow>
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
                        sx={{
                          color: "inherit",
                          "&:hover": { color: "var(--ink)" },
                          "&.Mui-active": { color: "var(--ink)" },
                          "& .MuiTableSortLabel-icon": { fontSize: 15 },
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
              <TableCellStyled />
            </TableRow>
          </TableHead>
          <TableBody>{children}</TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default DataTable;
