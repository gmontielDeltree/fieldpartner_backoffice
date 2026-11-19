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
  code: "",
  descriptionES: "",
  descriptionPT: "",
  descriptionEN: "",
  phytosanitary: false,
  isCrop: false,
};

export const SuppliesTypePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { supplieActive } = useAppSelector((state) => state.supplie);

  const {
    code,
    descriptionES,
    descriptionPT,
    descriptionEN,
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
    if (formValues.id === undefined) return;
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
      dispatch(removeSupplieActive());
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
            <Grid item xs={12} sm={3}>
              <TextField
                label="Código"
                variant="outlined"
                type="text"
                name="code"
                value={code}
                onChange={handleInputChange}
                error={conceptoError}
                helperText={conceptoError ? "Este campo es obligatorio" : ""}
                disabled={!!supplieActive}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Tipo ES"
                variant="outlined"
                type="text"
                name="descriptionES"
                value={descriptionES}
                onChange={handleInputChange}
                error={conceptoError}
                helperText={conceptoError ? "Este campo es obligatorio" : ""}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Tipo PT"
                variant="outlined"
                type="text"
                name="descriptionPT"
                value={descriptionPT}
                onChange={handleInputChange}
                error={conceptoError}
                helperText={conceptoError ? "Este campo es obligatorio" : ""}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Tipo EN"
                variant="outlined"
                type="text"
                name="descriptionEN"
                value={descriptionEN}
                onChange={handleInputChange}
                error={conceptoError}
                helperText={conceptoError ? "Este campo es obligatorio" : ""}
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
                name="phytosanitary"
                value={formValues.phytosanitary.toString()}
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
                name="isCrop"
                value={formValues.isCrop.toString()}
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
