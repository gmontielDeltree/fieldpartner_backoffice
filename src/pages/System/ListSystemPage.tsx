import React, { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Button, IconButton, Tooltip } from "@mui/material";
import { AddRounded, ComputerOutlined, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { useAppDispatch, useForm, useSystem } from "../../hooks";
import { setSystemACtive } from "../../store/system";
import {
  DataTable,
  EmptyState,
  FilteredCount,
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
import { ColumnProps, System } from "../../types";

const columns: ColumnProps[] = [
  { text: "ID", align: "left", field: "id", sortable: true },
  { text: "Sistema", align: "left", field: "system", sortable: true },
  { text: "Versión", align: "left", field: "version", sortable: true },
];

export const ListSystemPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, system, getSystem, removeSystem} = useSystem();
  const { filterText, handleInputChange } = useForm({ filterText: "" });

  const [sortField, setSortField] = React.useState<keyof System>("system");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field as keyof System);
      setSortDirection("asc");
    }
  };

  const compareValues = (a: System, b: System, field: keyof System) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const filterSystems = (list: System[], filterText: string): System[] => {
    const filteredBySearch = list.filter(system => matchesFilter(system, filterText));
    return [...filteredBySearch].sort((a, b) => {
      const primary = compareValues(a, b, sortField);
      const result = sortDirection === "asc" ? primary : -primary;
      // Desempate: dentro de un mismo valor, ordenar por ID
      if (result === 0 && sortField !== "id") {
        return compareValues(a, b, "id");
      }
      return result;
    });
  };

  const normalizeText = (text?: string | number) => {
    return String(text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const matchesFilter = (system: System, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      system.id,
      system.version,
      system.system,
    ];
  
    return searchableFields.some(field => normalizeText(field).includes(normalizedFilter));
  };

  const onClickSearch = () => {
    if (filterText === "") {
      getSystem();
      return;
    }
  };

  const onClickUpdateSystem = (item: System) => {
    dispatch(setSystemACtive(item));
    navigate(`/system/${item._id}`);
  };

  const handleDeleteSystem = (item:  System) => {
    if (item._id && item._rev) {
      removeSystem(item._id, item._rev);
      getSystem();
    }
  };

  useEffect(() => {
    getSystem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const rows = filterSystems(system, filterText);

  return (
    <>
      {isLoading && <Loading loading />}
      <PageContainer>
        <PageHeader
          icon={<ComputerOutlined />}
          title="Sistemas"
          meta={
            !isLoading ? (
              <ValuePill>
                <RollingNumber value={rows.length} />
              </ValuePill>
            ) : undefined
          }
          actions={
            <Button variant="contained" component={RouterLink} to="/system/new" startIcon={<AddRounded />}>
              Nuevo
            </Button>
          }
        />
        <ListCard>
          <ListToolbar aside={filterText ? <FilteredCount shown={rows.length} total={system.length} /> : undefined}>
            <SearchField
              value={filterText}
              onChange={handleInputChange}
              placeholder="Buscar por ID, sistema o versión…"
              onSubmit={() => onClickSearch()}
            />
          </ListToolbar>
          {!isLoading && rows.length === 0 ? (
            filterText ? (
              <EmptyState title="Sin resultados" hint="Probá con otra búsqueda" />
            ) : (
              <EmptyState icon={<ComputerOutlined />} title="No se encontraron sistemas" hint="Cargá el primero con «Nuevo»." />
            )
          ) : (
            <DataTable
              key="datatable-system"
              columns={columns}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              {rows.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left" sx={{ fontWeight: 500 }}>{row.id}</TableCellStyled>
                  <TableCellStyled align="left">{row.system}</TableCellStyled>
                  <TableCellStyled align="left">{row.version}</TableCellStyled>
                  <TableCellStyled align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Editar">
                      <IconButton aria-label="Editar" onClick={() => onClickUpdateSystem(row)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton aria-label="Eliminar" onClick={() => handleDeleteSystem(row)}>
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
