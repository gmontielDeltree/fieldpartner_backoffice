import React, { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Button, IconButton, Tooltip } from "@mui/material";
import { AddRounded, DeleteOutline, DisplaySettingsOutlined, EditOutlined } from "@mui/icons-material";
import { useAppDispatch, useForm, useLicences } from "../../hooks";
import { setLicencesACtive } from "../../store/licences";
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
import { ColumnProps, Licences } from "../../types";

const columns: ColumnProps[] = [
  { text: "ID", align: "left", field: "id", sortable: true },
  { text: "Sistema", align: "left", field: "systemType", sortable: true },
  { text: "Descripción", align: "left", field: "description", sortable: true },
  { text: "Tipo", align: "left", field: "licenceType", sortable: true },
  { text: "Máx. unidades", align: "right", field: "maximumUnitAllowed", sortable: true },
  { text: "Usuarios permitidos", align: "right", field: "allowedUsersCount", sortable: true },
];

export const ListLicencesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, licences, getLicences, removeLicences } = useLicences();
  const { filterText, handleInputChange } = useForm({ filterText: "" });

  const [sortField, setSortField] = React.useState<keyof Licences>("systemType");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field as keyof Licences);
      setSortDirection("asc");
    }
  };

  const compareValues = (a: Licences, b: Licences, field: keyof Licences) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const normalizeText = (text?: string | number) =>
    String(text ?? "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();

  const matchesFilter = (item: Licences, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    return [item.id, item.systemType, item.description, item.licenceType].some((field) =>
      normalizeText(field).includes(normalizedFilter)
    );
  };

  const filterLicences = (items: Licences[], filter: string): Licences[] => {
    const filtered = items.filter((item) => matchesFilter(item, filter));
    return [...filtered].sort((a, b) => {
      const primary = compareValues(a, b, sortField);
      const result = sortDirection === "asc" ? primary : -primary;
      if (result === 0 && sortField !== "id") return compareValues(a, b, "id");
      return result;
    });
  };

  const onClickUpdateLicences = (item: Licences) => {
    dispatch(setLicencesACtive(item));
    navigate(`/licences/${item._id}`);
  };

  const handleDeleteLicences = (item: Licences) => {
    if (item._id && item._rev) {
      removeLicences(item._id, item._rev);
    }
  };

  useEffect(() => {
    getLicences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = filterLicences(licences, filterText);

  return (
    <>
      {isLoading && <Loading loading />}
      <PageContainer>
        <PageHeader
          icon={<DisplaySettingsOutlined />}
          title="Licencias"
          meta={
            !isLoading ? (
              <ValuePill>
                <RollingNumber value={rows.length} />
              </ValuePill>
            ) : undefined
          }
          actions={
            <Button variant="contained" component={RouterLink} to="/licences/new" startIcon={<AddRounded />}>
              Nueva licencia
            </Button>
          }
        />
        <ListCard>
          <ListToolbar aside={filterText ? <FilteredCount shown={rows.length} total={licences.length} /> : undefined}>
            <SearchField
              value={filterText}
              onChange={handleInputChange}
              placeholder="Buscar por ID, sistema o descripción…"
              onSubmit={getLicences}
            />
          </ListToolbar>
          {!isLoading && rows.length === 0 ? (
            filterText ? (
              <EmptyState title="Sin resultados" hint="Probá con otra búsqueda" />
            ) : (
              <EmptyState icon={<DisplaySettingsOutlined />} title="No se encontraron licencias" hint="Cargá la primera con «Nueva licencia»." />
            )
          ) : (
            <DataTable
              key="datatable-licences"
              columns={columns}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              {rows.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left" sx={{ fontWeight: 500 }}>{row.id}</TableCellStyled>
                  <TableCellStyled align="left">{row.systemType}</TableCellStyled>
                  <TableCellStyled align="left">{row.description}</TableCellStyled>
                  <TableCellStyled align="left">{row.licenceType}</TableCellStyled>
                  <TableCellStyled align="right">{row.maximumUnitAllowed}</TableCellStyled>
                  <TableCellStyled align="right">{row.allowedUsersCount ?? "—"}</TableCellStyled>
                  <TableCellStyled align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Editar">
                      <IconButton aria-label="Editar" onClick={() => onClickUpdateLicences(row)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton aria-label="Eliminar" onClick={() => handleDeleteLicences(row)}>
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
