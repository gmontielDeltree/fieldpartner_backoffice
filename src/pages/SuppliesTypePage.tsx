import React, { useEffect } from "react";
import { Loading } from "../components";
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Inventory as InventoryIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
  useSupplies,
  useForm,
} from "../hooks";
import { SupplyType } from "../types";
import { removeSupplieActive } from "../store/supplie";

const initialForm: SupplyType = {
  name: "",
  description: "",
  fitosanitario: false,
  cultivo: false,
};

export const SuppliesTypePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { supplieActive } = useAppSelector((state) => state.supplie);

  const {
    name,
    description,
    formulario,
    setFormulario,
    handleInputChange,
    reset,
  } = useForm<SupplyType>(initialForm);

  const { isLoading, createSupplies, updateSupplie, conceptoError } = useSupplies();

  const handleAddSupplie = () => {
    createSupplies(formulario);
    reset();
  };

  const handleUpdateSupplie = () => {
    if (!formulario._id) return;
    updateSupplie(formulario);
  };

  const onClickCancel = () => {
    dispatch(removeSupplieActive());
    navigate("/type-supplies");
  };

  useEffect(() => {
    if (supplieActive) setFormulario(supplieActive);
    else setFormulario(initialForm);
  }, [supplieActive, setFormulario]);

  useEffect(() => {
    return () => {
      dispatch((removeSupplieActive));
    };
  }, [dispatch]);

  return (
    <>
      <Loading key="loading-new-customer" loading={isLoading} />
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <InventoryIcon />
          <Typography variant="h5" sx={{ ml: { sm: 2 } }}>
            Tipos de Insumos
          </Typography>
        </Box>

        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            sx={{ my: 3, mb: 5 }}
          >
            {supplieActive ? "Editar" : "Nuevo"} Insumo
          </Typography>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="space-around"
          >
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tipo"
                variant="outlined"
                type="text"
                name="name"
                value={name}
                onChange={handleInputChange}
                error={conceptoError}
                helperText={conceptoError ? "Este campo es obligatorio" : ""}
                InputProps={{ startAdornment: <InputAdornment position="start" /> }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Descripción"
                variant="outlined"
                type="text"
                name="description"
                value={description}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <RadioGroup
                row
                name="fitosanitario"
                value={formulario.fitosanitario.toString()}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Fitosanitario"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="No Fitosanitario"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={6}>
              <RadioGroup
                row
                name="cultivo"
                value={formulario.cultivo.toString()}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Cultivo"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="No Cultivo"
                />
              </RadioGroup>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="space-around"
            sx={{ mt: { sm: 5 } }}
          >
            <Grid item xs={12} sm={3} key="grid-back">
              <Button onClick={() => onClickCancel()}>Cancelar</Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={
                  supplieActive ? handleUpdateSupplie : handleAddSupplie
                }
              >
                {!supplieActive ? "Guardar" : "Actualizar"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};