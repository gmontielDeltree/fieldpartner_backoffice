import React, { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  TableContainer,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DisplaySettings as DisplaySettingsIcon,
} from "@mui/icons-material";
import { useAppDispatch, useForm, useLicences } from "../../hooks";
import { setLicencesACtive } from "../../store/licences";
import { DataTable, ItemRow, Loading, SearchButton, SearchInput, TableCellStyled } from "../../components";
import { ColumnProps, Licences } from "../../types";

const columns: ColumnProps[] = [
  { text: "ID", align: "left", field: "id", sortable: true },
  { text: "Sistema", align: "center", field: "systemType", sortable: true },
  { text: "Descripción", align: "center", field: "description", sortable: true },
  { text: "Tipo", align: "center", field: "licenceType", sortable: true },
  { text: "Máx. unidades", align: "center", field: "maximumUnitAllowed", sortable: true },
  { text: "Usuarios permitidos", align: "center", field: "allowedUsersCount", sortable: true },
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
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" sx={{ pt: 3, pb: 1 }}>
          <DisplaySettingsIcon color="primary" sx={{ mr: 1.5, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={600}>
            Licencias
          </Typography>
        </Box>

        {/* Toolbar */}
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: 2, mb: 1 }}
        >
          <Grid item xs={12} sm="auto">
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/licences/new"
              startIcon={<AddIcon />}
            >
              Nueva licencia
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}>
                <SearchInput
                  value={filterText}
                  placeholder="Buscar por ID, sistema o descripción..."
                  handleInputChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <SearchButton text="Buscar" onClick={getLicences} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "right" }}>
              {rows.length} {rows.length === 1 ? "licencia" : "licencias"}
            </Typography>
          </Grid>
        </Grid>

        {/* Tabla */}
        <TableContainer
          key="table-licences"
          sx={{ minHeight: 120, maxHeight: 540, overflow: "auto", mb: 5 }}
          component={Paper}
          variant="outlined"
        >
          <DataTable
            key="datatable-licences"
            columns={columns}
            isLoading={isLoading}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          >
            {!isLoading && rows.length === 0 && (
              <ItemRow>
                <TableCellStyled align="center" colSpan={7}>
                  No se encontraron licencias
                </TableCellStyled>
              </ItemRow>
            )}
            {rows.map((row) => (
              <ItemRow key={row._id} hover>
                <TableCellStyled align="left">{row.id}</TableCellStyled>
                <TableCellStyled align="center">{row.systemType}</TableCellStyled>
                <TableCellStyled align="center">{row.description}</TableCellStyled>
                <TableCellStyled align="center">{row.licenceType}</TableCellStyled>
                <TableCellStyled align="center">{row.maximumUnitAllowed}</TableCellStyled>
                <TableCellStyled align="center">{row.allowedUsersCount ?? "—"}</TableCellStyled>
                <TableCellStyled align="right">
                  <Tooltip title="Editar">
                    <IconButton aria-label="Editar" onClick={() => onClickUpdateLicences(row)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      aria-label="Eliminar"
                      color="default"
                      onClick={() => handleDeleteLicences(row)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCellStyled>
              </ItemRow>
            ))}
          </DataTable>
        </TableContainer>
      </Container>
    </>
  );
};
