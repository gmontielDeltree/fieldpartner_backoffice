import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ColumnProps, Movement } from "../../types";
import React, { useEffect } from "react";
import { useAppDispatch, useMovements, useForm } from "../../hooks";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import {
  DataTable,
  ItemRow,
  Loading,
  SearchButton,
  SearchInput,
  TableCellStyled,
} from "../../components";
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
// import { Icon } from "semantic-ui-react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { setMovementACtive } from "../../store/movements";

const columns: ColumnProps[] = [
  { text: "Concepto", align: "left", field: "name", sortable: true },
  { text: "Descripcion", align: "center", field: "description", sortable: true },
  { text: "Tipo de Movimiento", align: "right", field: "manual", sortable: true },
  { text: "Suma o Descuenta Stock", align: "right", field: "sumaStock", sortable: true },
];

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
      <Container maxWidth="md" sx={{ ml: 0 }}>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <SyncAltIcon />
          <Typography component="h4" variant="h4" sx={{ ml: { sm: 2 } }}>
            Tipos Movimientos insumos
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
                  to="/type-movement/new"
                  startIcon={<AddIcon />}
                >
                  Nuevo Movimiento
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
                      placeholder="Buscar Movimiento"
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
                      {rows.length} {rows.length === 1 ? "movimiento" : "movimientos"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box component="div" sx={{ p: 1 }}>
            <DataTable
              key="datatable-movements"
              columns={columns}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              {!isLoading && rows.length === 0 && (
                <ItemRow>
                  <TableCellStyled align="center" colSpan={5}>
                    No se encontraron movimientos
                  </TableCellStyled>
                </ItemRow>
              )}
              {rows.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left">{row.name}</TableCellStyled>
                  <TableCellStyled align="center">
                    {row.description}
                  </TableCellStyled>
                  <TableCellStyled align="center">
                    {row.manual ? "Manual" : "Automático"}
                  </TableCellStyled>
                  <TableCellStyled align="center">
                    {row.sumaStock}
                  </TableCellStyled>
                  <TableCellStyled align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        aria-label="Editar"
                        onClick={() => onClickUpdateMovement(row)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleDeleteMovement(row)}
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

