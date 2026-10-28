import React, { useEffect } from "react";
import { FormActions, FormCard, Loading, PageContainer, PageHeader } from "../../components";
import { Button, Grid, TextField } from "@mui/material";
import { SettingsInputAntennaOutlined, ToggleOnOutlined } from "@mui/icons-material";
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

export const NewTypeDevicesPage: React.FC = () => {
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
      <PageContainer maxWidth={980}>
        <PageHeader
          icon={<SettingsInputAntennaOutlined />}
          eyebrow="Maestros · Tipos de dispositivos"
          title={typeDevicesActive ? "Editar tipo de dispositivo" : "Nuevo tipo de dispositivo"}
          onBack={onClickCancel}
        />
        <FormCard
          title="Datos del tipo de dispositivo"
          subtitle="El modelo no se puede repetir."
          icon={<SettingsInputAntennaOutlined />}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={8}>
              <TextField
                label="Descripción"
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
            <Grid item xs={12} sm={6}>
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
          </Grid>
        </FormCard>
        <FormCard title="Disponibilidad" icon={<ToggleOnOutlined />} delay={100}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StatusButton available={available} onSwitchChange={handleSwitchChange} />
            </Grid>
          </Grid>
        </FormCard>
        <FormActions>
          <Button variant="outlined" onClick={onClickCancel}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={typeDevicesActive ? handleUpdateTypeDevices : handleAddTypeDevices}
          >
            {!typeDevicesActive ? "Guardar" : "Actualizar"}
          </Button>
        </FormActions>
      </PageContainer>
    </>
  );
};
