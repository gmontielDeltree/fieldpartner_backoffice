import React, { useEffect} from "react";
import { FormActions, FormCard, Loading, PageContainer, PageHeader } from "../../components";
import {
  Autocomplete,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { PaymentsOutlined, PublicOutlined } from "@mui/icons-material";
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
      <PageContainer maxWidth={980}>
        <PageHeader
          icon={<PublicOutlined />}
          eyebrow="Maestros · Países"
          title={countryActive ? "Editar país" : "Nuevo país"}
          onBack={onClickCancel}
        />
        <FormCard title="Datos del país" icon={<PublicOutlined />}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="ID país"
                variant="outlined"
                type="text"
                name="code"
                value={code}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={9} sx={{ display: { xs: "none", sm: "block" } }} />
            <Grid item xs={12} sm={4}>
              <TextField
                label="Descripción ES"
                variant="outlined"
                type="text"
                name="descriptionES"
                value={descriptionES}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Descripción PT"
                variant="outlined"
                type="text"
                name="descriptionPT"
                value={descriptionPT}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Descripción EN"
                variant="outlined"
                type="text"
                name="descriptionEN"
                value={descriptionEN}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }}
                fullWidth
              />
            </Grid>
          </Grid>
        </FormCard>
        <FormCard title="Moneda, fiscal e idioma" icon={<PaymentsOutlined />} delay={100}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Moneda"
                variant="outlined"
                type="text"
                name="currency"
                value={currency}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Clave fiscal"
                variant="outlined"
                type="text"
                name="taxKey"
                value={taxKey}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Formato clave fiscal"
                variant="outlined"
                type="text"
                name="taxKeyFormat"
                value={taxKeyFormat}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Autocomplete
                value={languageOptions.find(option => option.code === language) || null}
                onChange={handleLanguageChange}
                options={languageOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Idioma" variant="outlined" />
                )}
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
            onClick={countryActive ? handleUpdateCountry : handleAddCountry}
          >
            {!countryActive ? "Guardar" : "Actualizar"}
          </Button>
        </FormActions>
      </PageContainer>
    </>
  );


};
