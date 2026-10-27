import React, { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Button, IconButton, Tooltip } from "@mui/material";
import { AddRounded, DeleteOutline, EditOutlined, SettingsInputAntennaOutlined } from "@mui/icons-material";
import { useAppDispatch, useForm, useTypeDevices } from "../../hooks";
import { setTypeDevicesACtive } from "../../store/typedevices";
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
  StatusPill,
  TableCellStyled,
  ValuePill,
} from "../../components";
import { ColumnProps, DeviceStatus, TypeDevices } from "../../types";

const columns: ColumnProps[] = [
  { text: "Familia", align: "left", field: "family", sortable: true },
  { text: "Subfamilia", align: "left", field: "subFamily", sortable: true },
  { text: "Modelo", align: "left", field: "model", sortable: true },
  { text: "Estado", align: "left", field: "available", sortable: true },
];

export const ListTypeDevicesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, typeDevices, getTypeDevices, removeTypeDevices} = useTypeDevices();
  const { filterText, handleInputChange } = useForm({ filterText: "" });

  const [sortField, setSortField] = React.useState<keyof TypeDevices>("family");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field as keyof TypeDevices);
      setSortDirection("asc");
    }
  };

  const compareValues = (a: TypeDevices, b: TypeDevices, field: keyof TypeDevices) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const filterTypeDevices = (typeDevices: TypeDevices[], filterText: string): TypeDevices[] => {
    const filteredBySearch = typeDevices.filter(typeDevices => matchesFilter(typeDevices, filterText));
    return [...filteredBySearch].sort((a, b) => {
      const primary = compareValues(a, b, sortField);
      const result = sortDirection === "asc" ? primary : -primary;
      // Desempate: dentro de un mismo valor, ordenar por family por defecto
      if (result === 0 && sortField !== "family") {
        return compareValues(a, b, "family");
      }
      return result;
    });
  };



  const normalizeText = (text?: string | number) => {
    return String(text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const matchesFilter = (typeDevices: TypeDevices, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      typeDevices.model,
      typeDevices.description,
      typeDevices.family,
      typeDevices.subFamily,
      typeDevices.available,
    ];
  
    return searchableFields.some(field => normalizeText(String(field)).includes(normalizedFilter));
  };
  
  
 
  const onClickSearch = () => {
    if (filterText === "") {
      getTypeDevices();
      return;
    }
  };

//   const handleFilterButtonClick = () => {
//     setShowOptions(!showOptions); // Invertir el estado de showOptions
//   };

//   const handleSelectChange = (value: string) => {
//     console.log("Tipo seleccionado:", value);
//     setSelectedType(value);
//     setShowOptions(false); // Ocultar las opciones cuando se seleccione una
//   };

  const onClickUpdateTypeDevices = (item: TypeDevices) => {
    console.log("Item ID:", item._id);
    dispatch(setTypeDevicesACtive(item));
    navigate(`/type-of-devices/${item._id}`);
  };

  const handleDeleteTypeDevices = (item:  TypeDevices) => {
    if (item._id && item._rev) {
        removeTypeDevices(item._id, item._rev);
      getTypeDevices();
    }
  };

  useEffect(() => {
    getTypeDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = filterTypeDevices(typeDevices, filterText);

  return (
    <>
      {isLoading && <Loading loading />}
      <PageContainer>
        <PageHeader
          icon={<SettingsInputAntennaOutlined />}
          title="Tipos de dispositivos"
          meta={
            !isLoading ? (
              <ValuePill>
                <RollingNumber value={rows.length} />
              </ValuePill>
            ) : undefined
          }
          actions={
            <Button variant="contained" component={RouterLink} to="/type-of-devices/new" startIcon={<AddRounded />}>
              Nuevo
            </Button>
          }
        />
        <ListCard>
          <ListToolbar aside={filterText ? <FilteredCount shown={rows.length} total={typeDevices.length} /> : undefined}>
            <SearchField
              value={filterText}
              onChange={handleInputChange}
              placeholder="Buscar por familia, modelo o estado…"
              onSubmit={() => onClickSearch()}
            />
          </ListToolbar>
          {!isLoading && rows.length === 0 ? (
            filterText ? (
              <EmptyState title="Sin resultados" hint="Probá con otra búsqueda" />
            ) : (
              <EmptyState icon={<SettingsInputAntennaOutlined />} title="No se encontraron dispositivos" hint="Cargá el primero con «Nuevo»." />
            )
          ) : (
            <DataTable
              key="datatable-type-devices"
              columns={columns}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              {rows.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left" sx={{ fontWeight: 500 }}>{row.family}</TableCellStyled>
                  <TableCellStyled align="left">{row.subFamily}</TableCellStyled>
                  <TableCellStyled align="left">{row.model}</TableCellStyled>
                  <TableCellStyled align="left">
                    {row.available ? (
                      <StatusPill status={row.available === DeviceStatus.Activo ? "done" : "neutral"} size="sm" dot>
                        {row.available}
                      </StatusPill>
                    ) : null}
                  </TableCellStyled>
                  <TableCellStyled align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Editar">
                      <IconButton aria-label="Editar" onClick={() => onClickUpdateTypeDevices(row)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton aria-label="Eliminar" onClick={() => handleDeleteTypeDevices(row)}>
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
