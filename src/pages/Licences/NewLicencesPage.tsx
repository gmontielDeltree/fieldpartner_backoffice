import React, { useEffect} from "react";
import { Loading } from "../../components";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { DisplaySettings as DisplaySettingsIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useLicences, useForm, useSystem } from "../../hooks";
import { Licences,System } from "../../types";
import { removeLicencesActive } from "../../store/licences";



const initialForm: Licences = {
  id: "",
  description: "",
  licenceType: "",
  maximumUnitAllowed: 0,
  systemType: ""
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
    // systemType,
    maximumUnitAllowed,
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<Licences>(initialForm);

  const handleSystemChange = (_: React.ChangeEvent<object>, newValue: System | null) => {
    if (newValue) {
      setFormValues({ ...formValues, systemType: newValue.system });
    } else {
      setFormValues({ ...formValues, systemType: '' });
    }
  };
  useEffect(() => {
    getSystem();
  }, [getSystem]);
  const systemSeleccionado = system.find((sys) => sys.system === formValues.systemType);

  
  
  const licenceOptions = ['Campo', 'Licencia', 'Hectárea'];

  const handleAddLicences = () => {
    console.log("Datos a guardar:", formValues);
    createLicences(formValues);
    reset();
  };

  const handleUpdateLicences = () => {
    console.log("Datos a actualizar:", formValues);
    if (!formValues._id) return;
    updateLicences(formValues);
  };

  const onClickCancel = () => {
    dispatch(removeLicencesActive());
    navigate("/licences");
  };

  useEffect(() => {
    if (licencesActive) {
      setFormValues(licencesActive); 
    } else {
      setFormValues(initialForm);
      
    }
  }, [licencesActive, setFormValues]);

  const handleLicenceTypeChange = (
    event: SelectChangeEvent<string>,
  ) => {
    const value = event.target.value;
    setFormValues(prevState => ({
      ...prevState,
      licenceType: value
    }));
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
          <DisplaySettingsIcon />
          <Typography variant="h5" sx={{ ml: { sm: 2 } }}>
            Licences
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
            {licencesActive ? "Editar" : "Nueva"} Licencia uso
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
                    label="Descripción"
                    variant="outlined"
                    type="text"
                    name="description"
                    value={description}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }} 
                    InputProps={{
                    startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth
                />
                </Box>
            </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={3} sx={{ width: '200%' }}>
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <Autocomplete
                options={system}
                getOptionLabel={(system) => system.system}
                fullWidth
                renderInput={(params) => <TextField {...params} label="System" />}
                value={systemSeleccionado || null} // Usa systemSeleccionado o null si no se encuentra
                onChange={handleSystemChange}
              />
              </FormControl>
            </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel id="licence-type-label">Licence type</InputLabel>
          <Select
            labelId="licence-type-label"
            id="licence-type"
            value={licenceType}
            onChange={handleLicenceTypeChange}
            label="Licence type"
            inputProps={{ maxLength: 20 }}
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
            <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={2.6}>
              <TextField
                label="Unidad máxima permitida"
                variant="outlined"
                type="text"
                name="maximumUnitAllowed"
                value={maximumUnitAllowed}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }} 
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: { sm: 5 } }}>
              <Grid item xs={12} sm={3}>
                <Button onClick={onClickCancel}>Cancelar</Button>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={licencesActive ? handleUpdateLicences : handleAddLicences}
                >
                  {!licencesActive ? "Guardar" : "Actualizar"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
  
  
};
