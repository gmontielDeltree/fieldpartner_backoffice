import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ColumnProps, SupplyType } from "../types";
import React, { useEffect } from "react";
import { useAppDispatch, useSupplies, useForm } from "../hooks";
import { Inventory as InventoryIcon } from "@mui/icons-material";
import {
  DataTable,
  ItemRow,
  Loading,
  SearchButton,
  SearchInput,
  TableCellStyled,
} from "../components";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
// import 'semantic-ui-css/semantic.min.css';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { setSupplieActive } from "../store/supplie";


const columns: ColumnProps[] = [
  { text: "Tipo", align: "left", field: "name", sortable: true },
  { text: "Descripcion", align: "right", field: "description", sortable: true },
  { text: "Cultivo", align: "center", field: "cultivo", sortable: true },
  { text: "Fitosanitario", align: "right", field: "fitosanitario", sortable: true },
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
      <Container maxWidth="md" sx={{ ml: 0 }}>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <InventoryIcon />
          <Typography component="h4" variant="h4" sx={{ ml: { sm: 2 } }}>
            Tipos de Insumos
          </Typography>
        </Box>
        <Box component="div" sx={{ mt: 7 }}>
          <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, mt: { sm: 2 } }}
          >
            <Grid
              container
              spacing={0}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ p: 2, mt: { sm: 2 } }}
            >
              <Grid item xs={6} sm={4}>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/type-supplies/new"
                  startIcon={<AddIcon />}
                >
                  Nuevo Insumo
                </Button>
              </Grid>
              <Grid item xs={6} sm={8}>
                <Grid
                  container
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Grid item xs={8} sm={5}>
                    <SearchInput
                      value={filterText}
                      placeholder="Buscar Insumo"
                      handleInputChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <SearchButton
                      text="Buscar"
                      onClick={() => onClickSearch()}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, textAlign: "right" }}
                    >
                      {rows.length} {rows.length === 1 ? "insumo" : "insumos"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box component="div" sx={{ p: 1 }}>
            <DataTable
              key="datatable-supplies"
              columns={columns}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              {!isLoading && rows.length === 0 && (
                <ItemRow>
                  <TableCellStyled align="center" colSpan={5}>
                    No se encontraron insumos
                  </TableCellStyled>
                </ItemRow>
              )}
              {rows.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left">
                    {row.name}
                  </TableCellStyled>
                  <TableCellStyled align="right">
                    {row.description}
                  </TableCellStyled>
                  <TableCellStyled align="center">
                    {row.cultivo ? "Cultivo" : "No Cultivo"}
                  </TableCellStyled>
                  <TableCellStyled align="right">
                    {row.fitosanitario ? "SI" : "NO"}
                  </TableCellStyled>
                  <TableCellStyled align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        aria-label="Editar"
                        onClick={() => onClickUpdateSupplie(row)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleDeleteSupplie(row)}
                        style={{ fontSize: '1rem' }}
                        color="default"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCellStyled>
                </ItemRow>
              ))}
            </DataTable>
          </Box>
        </Box>
      </Container>
    </>
  );
};

