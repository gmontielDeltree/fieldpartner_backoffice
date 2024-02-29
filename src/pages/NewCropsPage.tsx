import React, { useEffect, useState } from "react";
import { Loading } from "../components";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  // FormControl,
  Grid,
  InputAdornment,
  // InputLabel,
  // MenuItem,
  Paper,
  // Select,
  // SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Yard as YardIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useCrops, useForm } from "../hooks";
import { Crops } from "../types";
import { removeCropsActive  } from "../store/crops";


const initialForm: Crops = {
  crop: "",
  descriptionES: "",
  descriptionPT: "",
  descriptionEN: "",
  cropType: "",
  cropVariety: "",
  prepared: false,
  sowing: false,
  application: false,
  germination: false,
  harvest: false,
};

export const NewCropsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const [setSelectedCrop] = useState<string>("");
  const [prepared, setPrepared] = useState(false);
  const [sowing, setSowing] = useState(false);
  const [application, setApplication] = useState(false);
  const [germination, setGermination] = useState(false);
  const [harvest, setHarvest] = useState(false);
  const { isLoading, createCrops, updateCrops } = useCrops();
  const cropTypes = ["Tubérculo", "Gramínea", "Textil", "Legumbres", "Oleaginosa", "Industrial", "Cereal"];
  const { cropsActive } = useAppSelector((state) => state.crop); 

  const {
    descriptionES,
    descriptionEN,
    descriptionPT,
    cropType,
    cropVariety,
    formulario,
    setFormulario,
    handleInputChange,
    reset,
  } = useForm<Crops>(initialForm);

  const handlePreparedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Prepared checkbox value:", event.target.checked);
    setPrepared(event.target.checked);
    setFormulario({ ...formulario, prepared: event.target.checked });
  };
  
  const handleSowingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Sowing checkbox value:", event.target.checked);
    setSowing(event.target.checked);
    setFormulario({ ...formulario, sowing: event.target.checked });
  };
  
  const handleApplicationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Application checkbox value:", event.target.checked);
    setApplication(event.target.checked);
    setFormulario({ ...formulario, application: event.target.checked });
  };
  
  const handleGerminationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Germination checkbox value:", event.target.checked);
    setGermination(event.target.checked);
    setFormulario({ ...formulario, germination: event.target.checked });
  };
  
  const handleHarvestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Harvest checkbox value:", event.target.checked);
    setHarvest(event.target.checked);
    setFormulario({ ...formulario, harvest: event.target.checked });
  };

  const handleAddCrops = () => {
    console.log("Datos a guardar:", formulario);
    createCrops(formulario);
    reset();
  };

  const handleUpdateCrops = () => {
    console.log("Datos a actualizar:", formulario);
    if (!formulario._id) return;
    updateCrops(formulario);
  };

  const onClickCancel = () => {
    dispatch(removeCropsActive());
    navigate("/crops");
  };

  useEffect(() => {
    if (cropsActive) {
      setFormulario(cropsActive); 
      setPrepared(cropsActive.prepared);
      setSowing(cropsActive.sowing);
      setApplication(cropsActive.application);
      setGermination(cropsActive.germination);
      setHarvest(cropsActive.harvest);
    } else {
      setFormulario(initialForm);
      
    }
  }, [cropsActive, setFormulario]);

  useEffect(() => {
    return () => {
      dispatch(removeCropsActive());
    };
  }, [dispatch]);

  ( [cropVariety]);

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
          <YardIcon />
          <Typography variant="h5" sx={{ ml: { sm: 2 } }}>
            Cultivo
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
            {cropsActive ? "Editar" : "Nuevo"} Cultivo
          </Typography>
          <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="outlined"
              type="text"
              name="descriptionES"
              value={descriptionES}
              onChange={handleInputChange}
              inputProps={{ maxLength: 20 }} 
              InputProps={{
                startAdornment: <InputAdornment position="start" />,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}> 
          <Autocomplete
              options={cropTypes}
              value={cropType} 
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  handleInputChange(event as React.ChangeEvent<HTMLInputElement>); 
                  setFormulario({ ...formulario, cropType: newValue });
                  
                }
              }}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tipo de Cultivo"
                  variant="outlined"
                  name="cropType"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <InputAdornment position="start" />,
                  }}
                  fullWidth
                />
                )}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Descripción ES"
                variant="outlined"
                type="text"
                name="descriptionES"
                value={descriptionES}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }} 
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2, width: '50%' }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Descripción PT"
                variant="outlined"
                type="text"
                name="descriptionPT"
                value={descriptionPT}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }} 
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2, width: '50%' }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Descripción EN"
                variant="outlined"
                type="text"
                name="descriptionEN"
                value={descriptionEN}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }} 
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2, width: '50%' }} 
              />
            </Grid>
            <Grid></Grid>
            <Grid item xs={12} sx={{ height: '20px' }} />
            <Box>
            <Typography component="h4" variant="h4" align="center" sx={{ my: 1, mb: 5 }}>
              Labores que aplica
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
    <label htmlFor="preparedCheckbox">
      <Checkbox id="preparedCheckbox" checked={prepared} onChange={handlePreparedChange} name="prepared" />
      Preparado
    </label>
  </div>
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
    <label htmlFor="sowingCheckbox">
      <Checkbox id="sowingCheckbox" checked={sowing} onChange={handleSowingChange} name="sowing" />
      Siembra
    </label>
  </div>
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
    <label htmlFor="applicationCheckbox">
      <Checkbox id="applicationCheckbox" checked={application} onChange={handleApplicationChange} name="application" />
      Aplicacion
    </label>
  </div>
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
    <label htmlFor="germinationCheckbox">
      <Checkbox id="germinationCheckbox" checked={germination} onChange={handleGerminationChange} name="germination" />
      Arrancado
    </label>
  </div>
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    <label htmlFor="harvestCheckbox">
      <Checkbox id="harvestCheckbox" checked={harvest} onChange={handleHarvestChange} name="harvest" />
      Cosecha
    </label>
  </div>
</div>

          </Box>
          <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: { sm: 5 } }}>
            <Grid item xs={12} sm={3}>
              <Button onClick={onClickCancel}>Cancelar</Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={cropsActive ? handleUpdateCrops : handleAddCrops}
              // fullWidth
              >
                {!cropsActive ? "Guardar" : "Actualizar"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};
