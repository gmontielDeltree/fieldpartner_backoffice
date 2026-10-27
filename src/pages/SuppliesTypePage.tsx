import React, { useEffect } from "react";
import { FormActions, FormCard, Loading, PageContainer, PageHeader } from "../components";
import {
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Inventory2Outlined, LabelOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
  useSupplies,
  useForm,
} from "../hooks";
import { SupplyType } from "../types";
import { removeSupplieActive } from "../store/supplie";

/** Rótulo chico arriba de un grupo de radios. */
const FieldCaption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography component="div" sx={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-2)", mb: 0.5 }}>
    {children}
  </Typography>
);

const initialForm: SupplyType = {
  name: "",
  description: "",
  tipoPT:"",
  tipoEN:"",
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
    tipoPT,
    tipoEN,
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<SupplyType>(initialForm);

  const { isLoading, createSupplies, updateSupplie, conceptoError } = useSupplies();

  const handleAddSupplie = () => {
    createSupplies(formValues);
    reset();
  };

  const handleUpdateSupplie = () => {
    if (!formValues._id) return;
    updateSupplie(formValues);
  };

  const onClickCancel = () => {
    dispatch(removeSupplieActive());
    navigate("/type-supplies");
  };

  useEffect(() => {
    if (supplieActive) setFormValues(supplieActive);
    else setFormValues(initialForm);
  }, [supplieActive, setFormValues]);

  useEffect(() => {
    return () => {
      dispatch((removeSupplieActive));
    };
  }, [dispatch]);

  return (
    <>
      <Loading key="loading-new-customer" loading={isLoading} />
      <PageContainer maxWidth={980}>
        <PageHeader
          icon={<Inventory2Outlined />}
          eyebrow="Maestros · Tipos de insumos"
          title={supplieActive ? "Editar tipo de insumo" : "Nuevo tipo de insumo"}
          onBack={onClickCancel}
        />
        <FormCard title="Tipo de insumo" icon={<Inventory2Outlined />}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Tipo ES"
                variant="outlined"
                type="text"
                name="name"
                value={name}
                onChange={handleInputChange}
                error={conceptoError}
                helperText={conceptoError ? "Este campo es obligatorio" : ""}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Tipo PT"
                variant="outlined"
                type="text"
                name="tipoPT"
                value={tipoPT}
                onChange={handleInputChange}
                error={conceptoError}
                helperText={conceptoError ? "Este campo es obligatorio" : ""}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Tipo EN"
                variant="outlined"
                type="text"
                name="tipoEN"
                value={tipoEN}
                onChange={handleInputChange}
                error={conceptoError}
                helperText={conceptoError ? "Este campo es obligatorio" : ""}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                variant="outlined"
                type="text"
                name="description"
                value={description}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </FormCard>
        <FormCard title="Clasificación" icon={<LabelOutlined />} delay={100}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FieldCaption>Fitosanitario</FieldCaption>
              <RadioGroup
                row
                name="fitosanitario"
                value={formValues.fitosanitario.toString()}
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
                  label="No fitosanitario"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldCaption>Cultivo</FieldCaption>
              <RadioGroup
                row
                name="cultivo"
                value={formValues.cultivo.toString()}
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
                  label="No cultivo"
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </FormCard>
        <FormActions>
          <Button variant="outlined" onClick={() => onClickCancel()}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={
              supplieActive ? handleUpdateSupplie : handleAddSupplie
            }
          >
            {!supplieActive ? "Guardar" : "Actualizar"}
          </Button>
        </FormActions>
      </PageContainer>
    </>
  );
};
