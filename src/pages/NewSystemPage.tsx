import React, { useEffect} from "react";
import { Loading } from "../components";
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Computer as ComputerIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useSystem, useForm } from "../hooks";
import { System } from "../types";
import { removeSystemActive } from "../store/system";



const initialForm: System = {
    id: "",
    system: "",
    version: "",
    technicalDetails: "",
};

export const NewSystemPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, createSystem, updateSystem } = useSystem();
  const { systemActive } = useAppSelector((state) => state.system); 
  



  const {
    id,
    system,
    version,
    technicalDetails,
    formulario,
    setFormulario,
    handleInputChange,
    reset,
  } = useForm<System>(initialForm);

  console.log("Datos de system", system);


  const handleAddSystem = () => {
    console.log("Datos a guardar:", formulario);
    createSystem(formulario);
    reset();
  };

  const handleUpdateSystem = () => {
    console.log("Datos a actualizar:", formulario);
    if (!formulario._id) return;
    updateSystem(formulario);
  };

  const onClickCancel = () => {
    dispatch(removeSystemActive());
    navigate("/system");
  };

  useEffect(() => {
    if (systemActive) {
      setFormulario(systemActive); 
    } else {
      setFormulario(initialForm);
      
    }
  }, [systemActive, setFormulario]);



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
          <ComputerIcon />
          <Typography variant="h5" sx={{ ml: { sm: 2 } }}>
            System
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
            {systemActive ? "Editar" : "Nuevo"} System
          </Typography>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={2}>
              <TextField
                label="ID"
                variant="outlined"
                type="text"
                name="id"
                value={id}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }} 
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
                <Box sx={{ display: 'block', mt: 2 }}>
                <TextField
                    label="System"
                    variant="outlined"
                    type="text"
                    name="system"
                    value={system}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }} 
                    InputProps={{
                    startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth
                />
                </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Version"
                variant="outlined"
                type="text"
                name="version"
                value={version}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }} 
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                label="Detalles Tecnicos"
                variant="outlined"
                type="text"
                name="technicalDetails"
                value={technicalDetails}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }} 
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sx={{ height: '20px' }} />
            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: { sm: 5 } }}>
              <Grid item xs={12} sm={3}>
                <Button onClick={onClickCancel}>Cancelar</Button>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={systemActive ? handleUpdateSystem : handleAddSystem}
                >
                  {!systemActive ? "Guardar" : "Actualizar"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
  
  
};
