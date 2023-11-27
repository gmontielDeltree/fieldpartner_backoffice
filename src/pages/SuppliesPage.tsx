import React, { useEffect, useMemo, useState } from "react";
import { DoseForm, LaborsForm, Loading, StockForm } from "../components";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useForm, useSupplies } from "../hooks";
import {
  Button,
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { Supplie } from "../types";
import { removeSupplieActive } from "../store/supplie/supplieSlice";

const initialForm: Supplie = {
  accountId: "",
  type: "",
  labors: [],
  name: "",
  description: "",
  barCode: "",
  unitMeasurement: "",
  stockByLot: false,
  maximumDose: "",
  minimumDose: "",
  recommendedDose: "",
  mermaVolatile: "",
  activePrincipal: "",
  replenishmentPoint: "",
  currentStock: 0,
  reservedStock: 0,
};


export const SuppliesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { supplieActive } = useAppSelector((state) => state.supplie);
  const [activeStep, setActiveStep] = useState(0);
  const [steps] = useState<string[]>(["Insumos", "Dosis", "Stock"]);
  const {
    formulario,
    setFormulario,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    reset,
  } = useForm(initialForm);

  const { isLoading, createSupplies, updateSupplie } = useSupplies();

  const onClickCancel = () => navigate("/type-supplies");

  const handleUpdateSupplie = () => {
    if (formulario._id) {
      updateSupplie(formulario);
      dispatch(removeSupplieActive());
      navigate("/type-supplies");
    }
  };

  const handleAddSupplie = () => {
    createSupplies(formulario);
    navigate("/type-supplies");
    reset();
  };

  const getStepContent = useMemo(
    () => (step: number) => {
      switch (step) {
        case 0:
          return (
            <LaborsForm
              key="laborsForm"
              formValues={formulario}
              setFormValues={setFormulario}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleCheckboxChange={handleCheckboxChange}
            />
          );
        case 1:
          return (
            <DoseForm
              key="doseForm"
              formValues={formulario}
              handleInputChange={handleInputChange}
            />
          );
        case 2:
          return (
            <StockForm
              key="stockForm"
              formValues={formulario}
              handleSelectChange={handleSelectChange}
              handleInputChange={handleInputChange}
            />
          );
        default:
          throw new Error("Unknown step");
      }
    },
    [
      formulario,
      handleInputChange,
      handleSelectChange,
      handleCheckboxChange,
      setFormulario,
    ]
  );

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    if (supplieActive) setFormulario(supplieActive);
    else setFormulario(initialForm);
  }, [setFormulario, supplieActive]);

  useEffect(() => {
    return () => {
      dispatch(removeSupplieActive());
    };
  }, [dispatch]);

  return (
    <Container maxWidth="md" className="pepe">
      <Loading key="loading-supplie" loading={isLoading} />
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 3 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center" sx={{ mb: 3 }}>
          {supplieActive ? "Editar" : "Nuevo"} Insumo
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 3, mb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <>
          {getStepContent(activeStep)}
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="space-around"
            sx={{ mt: 3 }}
          >
            <Grid item xs={12} sm={3}>
              <Button onClick={activeStep !== 0 ? handleBack : onClickCancel}>
                {activeStep !== 0 ? "Volver" : "Cancelar"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={3} key="grid-next">
              {!(activeStep === steps.length - 1) && (
                <Button variant="outlined" color="primary" onClick={handleNext}>
                  Siguiente
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={supplieActive ? handleUpdateSupplie : handleAddSupplie}
              >
                {!supplieActive ? "Agregar" : "Actualizar"}
              </Button>
            </Grid>
          </Grid>
        </>
      </Paper>
    </Container>
  );
};
