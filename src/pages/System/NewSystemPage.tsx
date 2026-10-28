import React, { useEffect} from "react";
import { FormActions, FormCard, Loading, PageContainer, PageHeader } from "../../components";
import { Button, Grid, TextField } from "@mui/material";
import { ComputerOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useSystem, useForm } from "../../hooks";
import { System } from "../../types";
import { removeSystemActive } from "../../store/system";


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
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<System>(initialForm);

  const handleAddSystem = () => {
    createSystem(formValues);
    reset();
  };

  const handleUpdateSystem = () => {
    if (!formValues._id) return;
    updateSystem(formValues);
  };

  const onClickCancel = () => {
    dispatch(removeSystemActive());
    navigate("/system");
  };

  useEffect(() => {
    if (systemActive) {
      setFormValues(systemActive); 
    } else {
      setFormValues(initialForm);
      
    }
  }, [systemActive, setFormValues]);



  return (
    <>
      <Loading key="loading-new-customer" loading={isLoading} />
      <PageContainer maxWidth={980}>
        <PageHeader
          icon={<ComputerOutlined />}
          eyebrow="Licencias · Sistemas"
          title={systemActive ? "Editar sistema" : "Nuevo sistema"}
          onBack={onClickCancel}
        />
        <FormCard title="Datos del sistema" icon={<ComputerOutlined />}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="ID"
                variant="outlined"
                type="text"
                name="id"
                value={id}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                label="Sistema"
                variant="outlined"
                type="text"
                name="system"
                value={system}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Versión"
                variant="outlined"
                type="text"
                name="version"
                value={version}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                label="Detalles técnicos"
                variant="outlined"
                type="text"
                name="technicalDetails"
                value={technicalDetails}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }}
                fullWidth
              />
            </Grid>
          </Grid>
        </FormCard>
        <FormActions>
          <Button variant="outlined" onClick={onClickCancel}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={systemActive ? handleUpdateSystem : handleAddSystem}
          >
            {!systemActive ? "Guardar" : "Actualizar"}
          </Button>
        </FormActions>
      </PageContainer>
    </>
  );
};
