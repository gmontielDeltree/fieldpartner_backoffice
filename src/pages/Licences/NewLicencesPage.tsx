import React, { useEffect } from "react";
import { FormActions, FormCard, Loading, PageContainer, PageHeader } from "../../components";
import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DisplaySettingsOutlined, TuneOutlined } from "@mui/icons-material";
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

  // Solo al montar: getSystem es una función nueva en cada render, con [getSystem]
  // el efecto se re-disparaba con cada respuesta y pedía la lista en bucle.
  useEffect(() => {
    getSystem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <PageContainer maxWidth={980}>
        <PageHeader
          icon={<DisplaySettingsOutlined />}
          eyebrow="Licencias · Licencias"
          title={isEditing ? "Editar licencia" : "Nueva licencia"}
          description={
            isEditing
              ? "Modificá los datos de la licencia seleccionada."
              : "Completá los campos para dar de alta una nueva licencia."
          }
          onBack={onClickCancel}
        />
        <FormCard title="Datos de la licencia" icon={<DisplaySettingsOutlined />}>
          <Grid container spacing={2}>
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
          </Grid>
        </FormCard>

        <FormCard title="Límites" icon={<TuneOutlined />} delay={100}>
          <Grid container spacing={2}>
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
        </FormCard>

        <FormActions>
          <Button variant="outlined" onClick={onClickCancel}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={isEditing ? handleUpdateLicences : handleAddLicences}
          >
            {isEditing ? "Actualizar" : "Guardar"}
          </Button>
        </FormActions>
      </PageContainer>
    </>
  );
};
