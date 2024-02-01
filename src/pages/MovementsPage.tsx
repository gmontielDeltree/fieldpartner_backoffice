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
} from "@mui/material";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useCategory, useForm } from "../hooks";
import { Category } from "../types";
import { removeCategoryActive } from "../store/category";

const initialForm: Category = {
  name: "",
  description: "",
  manual: false,
  stockOperation: "sumar",
  tipoMovimiento: "manual", // Agregar el campo tipoMovimiento con valor predeterminado "manual"
};

export const MovementList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categoryActive } = useAppSelector((state) => state.category);

  const {
    name,
    description,
    manual,
    stockOperation,
    formulario,
    setFormulario,
    handleInputChange,
    reset,
  } = useForm<Category>(initialForm);

  const { isLoading, createCategory, updateCategory } = useCategory();

  const handleAddCategory = () => {
    createCategory({
      ...formulario,
      manual,
    });
    reset();
  };

  const handleUpdateCategory = () => {
    if (!formulario._id) return;
    updateCategory({
      ...formulario,
      manual,
    });
  };

  const onClickCancel = () => {
    dispatch(removeCategoryActive());
    navigate("/typemovements");
  };

  useEffect(() => {
    if (categoryActive) setFormulario(categoryActive);
    else setFormulario(initialForm);

    return () => {
      dispatch(removeCategoryActive());
    };
  }, [categoryActive, setFormulario, dispatch]);

  return (
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
          {categoryActive ? "Editar" : "Nuevo"} Movimiento
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Concepto"
              variant="outlined"
              type="text"
              name="name"
              value={name}
              onChange={handleInputChange}
              InputProps={{ startAdornment: <InputAdornment position="start" /> }}
              fullWidth
            />
          </Grid>
                      <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={manual}
                    onChange={(e) => handleInputChange(e)}
                    name="manual"
                    color="primary"
                  />
                }
                label={manual ? "Manual" : "Automático"}
              />
            </Grid>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="stockOperation"
                name="stockOperation"
                value={stockOperation}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="suma"
                  control={<Radio />}
                  label="Suma Stock"
                />
                <FormControlLabel
                  value="Descuenta"
                  control={<Radio />}
                  label="Descuenta Stock"
                />
                <FormControlLabel
                  value="ambas"
                  control={<Radio />}
                  label="Ambas"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={6} sm={3}>
              <Button variant="contained" onClick={() => onClickCancel()}>
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={
                  categoryActive ? handleUpdateCategory : handleAddCategory
                }
              >
                {!categoryActive ? "Guardar" : "Actualizar"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MovementList;