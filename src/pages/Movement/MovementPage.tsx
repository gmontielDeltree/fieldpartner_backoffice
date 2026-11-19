import React, { useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Switch,
  Typography,
  TextField
} from "@mui/material";
import { Inventory2Outlined, SyncAltOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useMovements, useForm } from "../../hooks";
import { Movement } from "../../types";
import { removeMovementActive } from "../../store/movements";
import { FormActions, FormCard, Loading, PageContainer, PageHeader } from "../../components";

/** Rótulo chico arriba de un control que no es un input (switch, radios). */
const FieldCaption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography component="div" sx={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-2)", mb: 0.75 }}>
    {children}
  </Typography>
);


const initialForm: Movement = {
  name: "",
  conceptES: "",
  conceptPT: "",
  conceptEN: "",
  description: "",
  manual: false,
  stockSum: "ADD",
  typeMovement: "manual",
};


export const MovementPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movementActive } = useAppSelector((state) => state.movement);

  const handleSwitchChange = () => { setFormValues((prevFormulario) => ({ ...prevFormulario, manual: !prevFormulario.manual, })) }

  const {
    name,
    conceptEN,
    conceptPT,
    description,
    manual,
    stockSum,
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
    if (!formValues.id) return;
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
      <PageContainer maxWidth={980}>
        <PageHeader
          icon={<SyncAltOutlined />}
          eyebrow="Maestros · Tipos de movimientos de insumos"
          title={movementActive ? "Editar tipo de movimiento" : "Nuevo tipo de movimiento"}
          onBack={onClickCancel}
        />
        <FormCard title="Concepto" icon={<SyncAltOutlined />}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Concepto ES"
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
                label="Concepto PT"
                variant="outlined"
                type="text"
                name="conceptPT"
                value={conceptPT}
                onChange={handleInputChange}
                error={conceptoError}
                helperText={conceptoError ? "Este campo es obligatorio" : ""}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Concepto EN"
                variant="outlined"
                type="text"
                name="conceptEN"
                value={conceptEN}
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
        <FormCard title="Comportamiento" icon={<Inventory2Outlined />} delay={100}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <FieldCaption>Tipo de movimiento: {manual ? 'Manual' : 'Automático'}</FieldCaption>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minHeight: 42 }}>
                <Typography component="span" sx={{ fontSize: 14, color: manual ? "var(--ink-3)" : "var(--ink)" }}>
                  Automático
                </Typography>
                <Switch
                  checked={manual}
                  onChange={handleSwitchChange}
                  name="manual"
                  color="primary"
                />
                <Typography component="span" sx={{ fontSize: 14, color: manual ? "var(--ink)" : "var(--ink-3)" }}>
                  Manual
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={7}>
              <FieldCaption>Stock</FieldCaption>
              <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row' }}>
                <RadioGroup
                  row
                  aria-label="stockOperation"
                  name="stockSum"
                  value={stockSum}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="ADD"
                    control={<Radio />}
                    label="Suma stock"
                  />
                  <FormControlLabel
                    value="SUBTRACT"
                    control={<Radio />}
                    label="Descuenta stock"
                  />
                  <FormControlLabel
                    value="BOTH"
                    control={<Radio />}
                    label="Ambas"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </FormCard>
        <FormActions>
          <Button variant="outlined" onClick={() => onClickCancel()}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={movementActive ? handleUpdateMovement : handleAddMovement}
          >
            {!movementActive ? "Guardar" : "Actualizar"}
          </Button>
        </FormActions>
      </PageContainer>
    </>
  );
};
