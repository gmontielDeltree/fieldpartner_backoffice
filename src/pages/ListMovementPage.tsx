import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ColumnProps, Movement } from "../types";
import React, { useEffect } from "react";
import { useAppDispatch, useMovements, useForm } from "../hooks";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
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
import 'semantic-ui-css/semantic.min.css';
import {Icon} from "semantic-ui-react";
import {
  Add as AddIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { setMovementACtive } from "../store/movements";

const columns: ColumnProps[] = [
  { text: "Concepto", align: "left" },
  { text: "Descripcion", align: "center" },
  { text: "Tipo de Movimiento", align: "right" },
  { text: "Suma o Descuenta Stock", align: "right" },
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

  const onClickSearch = () => {
    if (filterText === "") {
      alert("Por favor, ingrese un término de búsqueda");
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
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box component="div" sx={{ p: 1 }}>
            <DataTable
              key="datatable-movements"
              columns={columns}
              isLoading={isLoading}
            >
              {movements.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left">{row.name}</TableCellStyled>
                  <TableCellStyled align="center">
                    {row.description}
                  </TableCellStyled>
                  <TableCellStyled align="center">
                    {row.manual ? "Manual" : "Automático"}
                  </TableCellStyled>
                  <TableCellStyled align="center">
                    {row.stockOperation}
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
                      >
                        <Icon name="trash alternate" />
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

