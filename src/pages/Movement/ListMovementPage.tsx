import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ColumnProps, Movement } from "../../types";
import React, { useEffect } from "react";
import { useAppDispatch, useMovements, useForm } from "../../hooks";
import {
  DataTable,
  EmptyState,
  ItemRow,
  ListCard,
  ListToolbar,
  Loading,
  PageContainer,
  PageHeader,
  RollingNumber,
  SearchField,
  TableCellStyled,
  ValuePill,
} from "../../components";
import type { Tone } from "../../components";
import { Button, IconButton, Tooltip } from "@mui/material";
import {
  AddRounded,
  DeleteOutline,
  EditOutlined,
  SearchRounded,
  SyncAltOutlined,
} from "@mui/icons-material";
import { setMovementACtive } from "../../store/movements";

const columns: ColumnProps[] = [
  { text: "Concepto", align: "left", field: "name", sortable: true },
  { text: "Descripción", align: "left", field: "description", sortable: true },
  { text: "Tipo de movimiento", align: "left", field: "manual", sortable: true },
  { text: "Suma o descuenta stock", align: "left", field: "sumaStock", sortable: true },
];

/** Color de la píldora de stock según el valor guardado (solo presentación; el texto se muestra tal cual). */
const stockTone = (value?: string): Tone => {
  const v = String(value ?? "").toLowerCase();
  if (v.startsWith("suma")) return "green";
  if (v.startsWith("descuenta")) return "orange";
  if (v === "ambas" || v === "both") return "blue";
  return "neutral";
};

export const ListMovementPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    isLoading,
    movements,
    getMovements,
    removeMovement,
    searchMovements,
  } = useMovements();
  const { filterText, handleInputChange } = useForm({ filterText: "" });

  const [sortField, setSortField] = React.useState<keyof Movement>("name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field as keyof Movement);
      setSortDirection("asc");
    }
  };

  const compareValues = (a: Movement, b: Movement, field: keyof Movement) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const sortMovements = (list: Movement[]) => {
    return [...list].sort((a, b) => {
      const primary = compareValues(a, b, sortField);
      const result = sortDirection === "asc" ? primary : -primary;
      if (result === 0 && sortField !== "name") {
        return compareValues(a, b, "name");
      }
      return result;
    });
  };

  const onClickSearch = () => {
    if (filterText === "") {
      getMovements();
      return;
    }
    searchMovements(filterText);
  };

  const onClickUpdateMovement = (item: Movement) => {
    dispatch(setMovementACtive(item));
    navigate(`/type-movement/${item._id}`);
  };

  const handleDeleteMovement = (item: Movement) => {
    if (item._id && item._rev) {
      removeMovement(item._id, item._rev);
      getMovements();
      navigate(`/type-movement/${item._id}`);
    }
  };

  useEffect(() => {
    getMovements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = sortMovements(movements);

  return (
    <>
      {isLoading && <Loading loading />}
      <PageContainer>
        <PageHeader
          icon={<SyncAltOutlined />}
          title="Tipos de movimientos de insumos"
          meta={
            !isLoading ? (
              <ValuePill>
                <RollingNumber value={rows.length} />
              </ValuePill>
            ) : undefined
          }
          actions={
            <Button variant="contained" component={RouterLink} to="/type-movement/new" startIcon={<AddRounded />}>
              Nuevo
            </Button>
          }
        />
        <ListCard>
          <ListToolbar>
            <SearchField
              value={filterText}
              onChange={handleInputChange}
              placeholder="Buscar movimiento…"
              onSubmit={onClickSearch}
            />
            <Button variant="outlined" size="small" startIcon={<SearchRounded />} onClick={() => onClickSearch()} sx={{ height: 34 }}>
              Buscar
            </Button>
          </ListToolbar>
          {!isLoading && rows.length === 0 ? (
            filterText ? (
              <EmptyState title="Sin resultados" hint="Probá con otra búsqueda" />
            ) : (
              <EmptyState icon={<SyncAltOutlined />} title="No se encontraron movimientos" hint="Cargá el primero con «Nuevo»." />
            )
          ) : (
            <DataTable
              key="datatable-movements"
              columns={columns}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              {rows.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left" sx={{ fontWeight: 500 }}>{row.name}</TableCellStyled>
                  <TableCellStyled align="left">{row.description}</TableCellStyled>
                  <TableCellStyled align="left">
                    <ValuePill tone={row.manual ? "neutral" : "accent"}>
                      {row.manual ? "Manual" : "Automático"}
                    </ValuePill>
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    {row.sumaStock ? <ValuePill tone={stockTone(row.sumaStock)}>{row.sumaStock}</ValuePill> : null}
                  </TableCellStyled>
                  <TableCellStyled align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Editar">
                      <IconButton aria-label="Editar" onClick={() => onClickUpdateMovement(row)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton aria-label="Eliminar" onClick={() => handleDeleteMovement(row)}>
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </TableCellStyled>
                </ItemRow>
              ))}
            </DataTable>
          )}
        </ListCard>
      </PageContainer>
    </>
  );
};
