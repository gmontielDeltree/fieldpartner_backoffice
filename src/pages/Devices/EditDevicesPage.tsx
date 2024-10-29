import React, { useEffect } from "react";
import { Loading } from "../../components";
import {
  Box,
  Button,
  Container,
  Grid,
  //InputAdornment,
  Paper,
  //Switch,
  TextField,
  Typography,
} from "@mui/material";
import {SettingsInputAntenna as SettingsInputAntennaIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useForm, useTypeDevices,  } from "../../hooks";
import { DeviceStatus, TypeDevices } from "../../types";
import { removeTypeDevicesActive } from "../../store/typedevices";
import Swal from "sweetalert2";
import StatusButton from "../../components/StatusButton/StatusButton";

const initialForm: TypeDevices = {
  model: "",
  description: "",
  family: "",
  subFamily: "",
  available: DeviceStatus.Inactivo,
};

export const EditDevicesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, createTypeDevices, updateTypeDevices, typeDevices, getTypeDevices } = useTypeDevices();
  const { typeDevicesActive } = useAppSelector((state) => state.typeDevices);

  const handleSwitchChange = () => {
    setFormValues((prevFormulario) => ({
      ...prevFormulario,
      available: prevFormulario.available === DeviceStatus.Activo ? DeviceStatus.Inactivo : DeviceStatus.Activo,
    }));
  };


  const {
    model,
    description,
    family,
    subFamily,
    available,
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<TypeDevices>(initialForm);



  useEffect(() => {
    getTypeDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Activar despues de Agregar los estados

  useEffect(() => {
    if (typeDevicesActive) {
      setFormValues(typeDevicesActive);
    } else {
      setFormValues(initialForm);
    }
  }, [typeDevicesActive, setFormValues]);

  // useEffect(() => {
  //   if (typeDevicesActive) setFormulario(typeDevicesActive);
  //   else setFormulario(initialForm);
  // }, [typeDevicesActive]);


  const handleVerifyId = () => {
    const idExists = typeDevices.some(type => type.model === model);
    if (idExists) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El Modelo ya existe',
      }).then(() => {
        setFormValues(prevForm => ({
          ...prevForm,
          model: "",
        }));
      });
    }
    return idExists;
  };

 


  const handleAddTypeDevices = () => {
    createTypeDevices(formValues);
    dispatch(removeTypeDevicesActive());
    reset();
  };

  const handleUpdateTypeDevices = () => {
    if (!formValues._id) return;
    updateTypeDevices(formValues);
    dispatch(removeTypeDevicesActive());
    reset();
  };

  const onClickCancel = () => {
    dispatch(removeTypeDevicesActive());
    navigate("/type-of-devices");
    reset();
  };

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
          <SettingsInputAntennaIcon />
          <Typography variant="h5" sx={{ ml: { sm: 2 } }}>
            Tipo de dispositivos
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
            {typeDevicesActive ? "Editar" : "Nuevo"} Tipo de Dispositivo
          </Typography>
  
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Modelo"
                variant="outlined"
                type="text"
                name="model"
                value={model}
                onBlur={handleVerifyId}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <TextField
                label="Descripcion"
                variant="outlined"
                type="text"
                name="description"
                value={description}
                onChange={handleInputChange}
                inputProps={{ maxLength: 200 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Familia"
                variant="outlined"
                type="text"
                name="family"
                value={family}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Subfamilia"
                variant="outlined"
                type="text"
                name="subFamily"
                value={subFamily}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatusButton available={available} onSwitchChange={handleSwitchChange} />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Grid item xs={12} sm={3}>
              <Button onClick={onClickCancel}>Cancelar</Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={typeDevicesActive ? handleUpdateTypeDevices : handleAddTypeDevices}
              >
                {!typeDevicesActive ? "Guardar" : "Actualizar"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
  
};
