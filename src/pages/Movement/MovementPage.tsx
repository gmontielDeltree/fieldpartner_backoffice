import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Switch,
  Typography,
  TextField
} from "@mui/material";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useMovements, useForm } from "../../hooks";
import { Movement } from "../../types";
import { removeMovementActive } from "../../store/movements";
import { Loading } from "../../components";


const initialForm: Movement = {
  name: "",
  conceptoEN:"",
  conceptoPT:"",
  description: "",
  manual: false,
  sumaStock: "suma",
  typeMovement: "manual",
  concepto: ""
};


export const MovementPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movementActive } = useAppSelector((state) => state.movement);

  const handleSwitchChange = () => { setFormValues((prevFormulario) => ({ ...prevFormulario, manual: !prevFormulario.manual, })) }

  const {
    name,
    conceptoEN,
    conceptoPT,
    description,
    manual,
    sumaStock,
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<Movement>(initialForm);

  const { isLoading, createMovement, updateMovement, conceptoError, } = useMovements();

  const handleAddMovement = () => {
    createMovement({
      ...formValues,
      manual,
    });
    reset();
  };

  const handleUpdateMovement = () => {
    if (!formValues._id) return;
    updateMovement({
      ...formValues,
      manual,
    });
  };

  const onClickCancel = () => {
    dispatch(removeMovementActive());
    navigate("/type-movement");
  };

  useEffect(() => {
    if (movementActive) setFormValues(movementActive);
    else setFormValues(initialForm);

  }, [movementActive, setFormValues, dispatch]);

  useEffect(() => {

    return () => {
      dispatch(removeMovementActive());
    };
  }, [dispatch])


  return (
    <>
      <Loading key="New movement" loading={isLoading} />
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <SyncAltIcon />
          <Typography variant="h5" sx={{ ml: { sm: 2 } }}>
            Tipos Movimientos Insumos
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center" sx={{ my: 3, mb: 5 }}>
            {movementActive ? "Editar" : "Nuevo"} Movimiento
          </Typography>
          <Grid container spacing={2}>
          <Box sx={{ width: '45%', margin: 'auto' }}>
          <Grid container spacing={2} >
            <Grid item xs={12} >
              <TextField
                label="Concepto ES"
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
            <Grid item xs={12} >
              <TextField
                label="Concepto PT"
                variant="outlined"
                type="text"
                name="conceptoPT"
                value={conceptoPT}
                onChange={handleInputChange}
                error={conceptoError}
                helperText={conceptoError ? "Este campo es obligatorio" : ""}
                InputProps={{ startAdornment: <InputAdornment position="start" /> }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} >
              <TextField
                label="Concepto EN"
                variant="outlined"
                type="text"
                name="conceptoEN"
                value={conceptoEN}
                onChange={handleInputChange}
                error={conceptoError}
                helperText={conceptoError ? "Este campo es obligatorio" : ""}
                InputProps={{ startAdornment: <InputAdornment position="start" /> }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripcion"
                variant="outlined"
                type="text"
                name="description"
                value={description}
                onChange={handleInputChange}
                InputProps={{ startAdornment: <InputAdornment position="start" /> }}
                fullWidth
              />
            </Grid>
            </Grid>
            </Box>
            <Box sx={{ marginLeft: 'auto' }}>
            <Grid item xs={12} sm={6} container alignItems="center">
            <Typography variant="body2" color="textSecondary" sx={{ mr: 1, width: 245 }}>
              Tipo de Movimiento: {manual ? 'Manual' : 'Automático'}
            </Typography>
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="textPrimary">
              Automático
              </Typography>
              <Switch
                checked={manual}
                onChange={handleSwitchChange}
                name="manual"
                color="primary"
              />
              <Typography variant="body2" color="textPrimary">
                Manual
              </Typography>
            </Grid>
          </Grid>
          <Box mt={3}></Box>
            <Grid item xs={12} sm={9}>
            <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row' }}>
                <RadioGroup
                  row
                  aria-label="stockOperation"
                  name="sumaStock"
                  value={sumaStock}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="Suma"
                    control={<Radio />}
                    label="Suma Stock"
                  />
                  <FormControlLabel
                    value="Descuenta"
                    control={<Radio />}
                    label="Descuenta Stock"
                  />
                  <FormControlLabel
                    value="Ambas"
                    control={<Radio />}
                    label="Ambas"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            </Box>
            <Grid item container spacing={2} justifyContent="center">
              <Grid item xs={6} sm={3}>
                <Button variant="contained" onClick={() => onClickCancel()}>
                  Cancelar
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={movementActive ? handleUpdateMovement : handleAddMovement}
                >
                  {!movementActive ? "Guardar" : "Actualizar"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

