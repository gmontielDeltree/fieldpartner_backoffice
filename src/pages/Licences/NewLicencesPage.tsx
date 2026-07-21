import React, { useEffect } from "react";
import { Loading } from "../../components";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import {
  DisplaySettings as DisplaySettingsIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useLicences, useForm, useSystem } from "../../hooks";
import { NumericTextField } from "../../components/NumericTextField/NumericTextField";
import { EnumLicenceType, Licences, System } from "../../types";
import { removeLicencesActive } from "../../store/licences";

const initialForm: Licences = {
  id: "",
  description: "",
  licenceType: EnumLicenceType.L,
  maximumUnitAllowed: 0,
  allowedUsersCount: 0,
  systemType: "",
};

export const NewLicencesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, createLicences, updateLicences } = useLicences();
  const { licencesActive } = useAppSelector((state) => state.licences);
  const { system, getSystem } = useSystem();

  const {
    id,
    description,
    licenceType,
    maximumUnitAllowed,
    allowedUsersCount,
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<Licences>(initialForm);

  const handleSystemChange = (_: React.ChangeEvent<object>, newValue: System | null) => {
    setFormValues({ ...formValues, systemType: newValue ? newValue.system : "" });
  };

  const handleLicenceTypeChange = (event: SelectChangeEvent<string>) => {
    setFormValues((prev) => ({ ...prev, licenceType: event.target.value }));
  };

  const handleMaximumUnitChange = (value: number | null) => {
    setFormValues((prev) => ({ ...prev, maximumUnitAllowed: value ?? 0 }));
  };

  const handleAllowedUsersChange = (value: number | null) => {
    setFormValues((prev) => ({ ...prev, allowedUsersCount: value ?? 0 }));
  };

  const handleAddLicences = () => {
    createLicences(formValues);
    reset();
  };

  const handleUpdateLicences = () => {
    if (!formValues._id) return;
    updateLicences(formValues);
  };

  const onClickCancel = () => {
    dispatch(removeLicencesActive());
    navigate("/licences");
  };

  useEffect(() => {
    getSystem();
  }, [getSystem]);

  useEffect(() => {
    if (licencesActive) {
      setFormValues(licencesActive);
    } else {
      setFormValues(initialForm);
    }
  }, [licencesActive, setFormValues]);

  const systemSeleccionado = system.find((sys) => sys.system === formValues.systemType) ?? null;
  const licenceOptions = Object.values(EnumLicenceType);
  const isEditing = Boolean(licencesActive);

  return (
    <>
      <Loading key="loading-new-licence" loading={isLoading} />
      <Container maxWidth="md" sx={{ mb: 6 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" sx={{ pt: 3, pb: 1 }}>
          <DisplaySettingsIcon color="primary" sx={{ mr: 1.5, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={600}>
            Licencias
          </Typography>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            mt: 2,
            p: { xs: 3, md: 4 },
            borderRadius: 2,
          }}
        >
          {/* Título del formulario */}
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {isEditing ? "Editar licencia" : "Nueva licencia"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isEditing
              ? "Modificá los datos de la licencia seleccionada."
              : "Completá los campos para dar de alta una nueva licencia."}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Formulario */}
          <Grid container spacing={3}>
            {/* Fila 1: ID + Descripción */}
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
                label="Descripción"
                variant="outlined"
                type="text"
                name="description"
                value={description}
                onChange={handleInputChange}
                inputProps={{ maxLength: 100 }}
                fullWidth
              />
            </Grid>

            {/* Fila 2: Sistema */}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={system}
                getOptionLabel={(option) => option.system}
                value={systemSeleccionado}
                onChange={handleSystemChange}
                renderInput={(params) => (
                  <TextField {...params} label="Sistema" variant="outlined" />
                )}
                fullWidth
              />
            </Grid>

            {/* Fila 2: Tipo de licencia */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="licence-type-label">Tipo de licencia</InputLabel>
                <Select
                  labelId="licence-type-label"
                  id="licence-type"
                  value={licenceType}
                  onChange={handleLicenceTypeChange}
                  label="Tipo de licencia"
                >
                  {licenceOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Fila 3: Unidad máxima + Cantidad de usuarios permitidos */}
            <Grid item xs={12} sm={6}>
              <NumericTextField
                label="Unidad máxima permitida"
                variant="outlined"
                value={maximumUnitAllowed || null}
                onChange={handleMaximumUnitChange}
                maxLength={10}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NumericTextField
                label="Cantidad de usuarios permitidos"
                variant="outlined"
                value={allowedUsersCount || null}
                onChange={handleAllowedUsersChange}
                maxLength={10}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mt: 4, mb: 3 }} />

          {/* Acciones */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={onClickCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={isEditing ? handleUpdateLicences : handleAddLicences}
            >
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};
