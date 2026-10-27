import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ColumnProps, SupplyType } from "../types";
import React, { useEffect } from "react";
import { useAppDispatch, useSupplies, useForm } from "../hooks";
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
} from "../components";
import { Button, IconButton, Tooltip } from "@mui/material";
import {
  AddRounded,
  DeleteOutline,
  EditOutlined,
  Inventory2Outlined,
  SearchRounded,
} from "@mui/icons-material";
import { setSupplieActive } from "../store/supplie";


const columns: ColumnProps[] = [
  { text: "Tipo", align: "left", field: "name", sortable: true },
  { text: "Descripción", align: "left", field: "description", sortable: true },
  { text: "Cultivo", align: "left", field: "cultivo", sortable: true },
  { text: "Fitosanitario", align: "left", field: "fitosanitario", sortable: true },
];

export const ListSuppliesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    isLoading,
    supplies,
    getSupplies,
    removeSupplie,
    searchSupplies,
  } = useSupplies();
  const { filterText, handleInputChange } = useForm({ filterText: "" });

  const [sortField, setSortField] = React.useState<keyof SupplyType>("name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field as keyof SupplyType);
      setSortDirection("asc");
    }
  };

  const compareValues = (a: SupplyType, b: SupplyType, field: keyof SupplyType) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const sortSupplies = (list: SupplyType[]) => {
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
      getSupplies();
      return;
    }
    searchSupplies(filterText);
  };

  const onClickUpdateSupplie = (item: SupplyType) => {
    dispatch(setSupplieActive(item));
    navigate(`/type-supplies/${item._id}`);
  };

  const handleDeleteSupplie = (item: SupplyType) => {
    if (item._id && item._rev) {
      removeSupplie(item._id, item._rev);
      getSupplies();
      navigate(`/type-supplies/${item._id}`);
    }
  };

  useEffect(() => {
    getSupplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = sortSupplies(supplies);

  return (
    <>
      {isLoading && <Loading loading />}
      <PageContainer>
        <PageHeader
          icon={<Inventory2Outlined />}
          title="Tipos de insumos"
          meta={
            !isLoading ? (
              <ValuePill>
                <RollingNumber value={rows.length} />
              </ValuePill>
            ) : undefined
          }
          actions={
            <Button variant="contained" component={RouterLink} to="/type-supplies/new" startIcon={<AddRounded />}>
              Nuevo
            </Button>
          }
        />
        <ListCard>
          <ListToolbar>
            <SearchField
              value={filterText}
              onChange={handleInputChange}
              placeholder="Buscar insumo…"
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
              <EmptyState icon={<Inventory2Outlined />} title="No se encontraron insumos" hint="Cargá el primero con «Nuevo»." />
            )
          ) : (
            <DataTable
              key="datatable-supplies"
              columns={columns}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              {rows.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left" sx={{ fontWeight: 500 }}>
                    {row.name}
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    {row.description}
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    <ValuePill tone={row.cultivo ? "accent" : "neutral"}>
                      {row.cultivo ? "Cultivo" : "No cultivo"}
                    </ValuePill>
                  </TableCellStyled>
                  <TableCellStyled align="left">
                    <ValuePill tone={row.fitosanitario ? "orange" : "neutral"}>
                      {row.fitosanitario ? "Sí" : "No"}
                    </ValuePill>
                  </TableCellStyled>
                  <TableCellStyled align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Editar">
                      <IconButton aria-label="Editar" onClick={() => onClickUpdateSupplie(row)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton aria-label="Eliminar" onClick={() => handleDeleteSupplie(row)}>
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
