import React, { useEffect} from "react";
import { Loading } from "../../components";
import {
    Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Public as PublicIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useCountry, useForm } from "../../hooks";
import { Country } from "../../types";
import { removeCountryActive } from "../../store/country";



const initialForm: Country = {
    code: "",
    descriptionES: "",
    descriptionPT: "",
    descriptionEN: "",
    language: "",
    currency: "",
    taxKey: "",
    taxKeyFormat: ""
};

export const NewCountryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, createCountry, updateCountry } = useCountry();
  const { countryActive } = useAppSelector((state) => state.country); 
  const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch'},
    { code: 'fr', label: 'Français' },
    { code: 'it', label: 'Italiano' },
    { code: 'ja', label: '日本語 JP' }
  ];

  const {
    code,
    currency,
    taxKey,
    taxKeyFormat,
    descriptionES,
    descriptionEN,
    descriptionPT,
    language,
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<Country>(initialForm);

  const handleLanguageChange = (_event: React.SyntheticEvent, value: { code: string; label: string } | null) => {
    if (value) {
      const selectedLanguageCode = value.code;
      setFormValues(prevState => ({
        ...prevState,
        language: selectedLanguageCode
      }));
    }
  };


  const handleAddCountry = () => {
    console.log("Datos a guardar:", formValues);
    createCountry(formValues);
    reset();
  };

  const handleUpdateCountry = () => {
    console.log("Datos a actualizar:", formValues);
    if (!formValues._id) return;
    updateCountry(formValues);
  };

  const onClickCancel = () => {
    dispatch(removeCountryActive());
    navigate("/country");
  };

  useEffect(() => {
    if (countryActive) {
      setFormValues(countryActive); 
    } else {
      setFormValues(initialForm);
      
    }
  }, [countryActive, setFormValues]);



  return (
    <>
      <Loading key="loading-new-customer" loading={isLoading} />
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <PublicIcon />
          <Typography variant="h5" sx={{ ml: { sm: 2 } }}>
            Pais
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
            {countryActive ? "Editar" : "Nuevo"} Pais
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2}>
              <TextField
                label="ID pais"
                variant="outlined"
                type="text"
                name="code"
                value={code}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }} 
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
    <Box sx={{ display: 'block', mt: 2 }}>
      <TextField
        label="Descripción ES"
        variant="outlined"
        type="text"
        name="descriptionES"
        value={descriptionES}
        onChange={handleInputChange}
        inputProps={{ maxLength: 30 }} 
        InputProps={{
          startAdornment: <InputAdornment position="start" />,
        }}
        fullWidth
      />
    </Box>
  </Grid>
  <Grid item xs={12} sm={3}>
    <Box sx={{ display: 'block', mt: 2 }}>
      <TextField
        label="Descripción PT"
        variant="outlined"
        type="text"
        name="descriptionPT"
        value={descriptionPT}
        onChange={handleInputChange}
        inputProps={{ maxLength: 30 }} 
        InputProps={{
          startAdornment: <InputAdornment position="start" />,
        }}
        fullWidth
      />
    </Box>
  </Grid>
  <Grid item xs={12} sm={3}>
    <Box sx={{ display: 'block', mt: 2 }}>
      <TextField
        label="Descripción EN"
        variant="outlined"
        type="text"
        name="descriptionEN"
        value={descriptionEN}
        onChange={handleInputChange}
        inputProps={{ maxLength: 30 }} 
        InputProps={{
          startAdornment: <InputAdornment position="start" />,
        }}
        fullWidth
      />
    </Box>
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Moneda"
                variant="outlined"
                type="text"
                name="currency"
                value={currency}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }} 
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Clave Fiscal"
                variant="outlined"
                type="text"
                name="taxKey"
                value={taxKey}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }} 
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Formato Clave Fiscal"
                variant="outlined"
                type="text"
                name="taxKeyFormat"
                value={taxKeyFormat}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }} 
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
            <Autocomplete
                value={languageOptions.find(option => option.code === language) || null}
                onChange={handleLanguageChange}
                options={languageOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Idioma" variant="outlined" />
                )}
                fullWidth
                sx={{ mt: 2 }}
              />
              </Grid>
            <Grid item xs={12} sx={{ height: '20px' }} />
            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: { sm: 5 } }}>
              <Grid item xs={12} sm={3}>
                <Button onClick={onClickCancel}>Cancelar</Button>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={countryActive ? handleUpdateCountry : handleAddCountry}
                >
                  {!countryActive ? "Guardar" : "Actualizar"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
  
  
};
