import React, { useEffect, useState } from "react";
import { FormActions, FormCard, Loading, PageContainer, PageHeader } from "../../components";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  // FormControl,
  Grid,
  // InputLabel,
  // MenuItem,
  // Select,
  // SelectChangeEvent,
  TextField,
} from "@mui/material";
import { AgricultureOutlined, YardOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useCrops, useForm } from "../../hooks";
import { Crops } from "../../types";
import { removeCropsActive  } from "../../store/crops";


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
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<Crops>(initialForm);

  const handlePreparedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Prepared checkbox value:", event.target.checked);
    setPrepared(event.target.checked);
    setFormValues({ ...formValues, prepared: event.target.checked });
  };
  
  const handleSowingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Sowing checkbox value:", event.target.checked);
    setSowing(event.target.checked);
    setFormValues({ ...formValues, sowing: event.target.checked });
  };
  
  const handleApplicationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Application checkbox value:", event.target.checked);
    setApplication(event.target.checked);
    setFormValues({ ...formValues, application: event.target.checked });
  };
  
  const handleGerminationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Germination checkbox value:", event.target.checked);
    setGermination(event.target.checked);
    setFormValues({ ...formValues, germination: event.target.checked });
  };
  
  const handleHarvestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Harvest checkbox value:", event.target.checked);
    setHarvest(event.target.checked);
    setFormValues({ ...formValues, harvest: event.target.checked });
  };

  const handleAddCrops = () => {
    console.log("Datos a guardar:", formValues);
    createCrops(formValues);
    reset();
  };

  const handleUpdateCrops = () => {
    console.log("Datos a actualizar:", formValues);
    if (!formValues._id) return;
    updateCrops(formValues);
  };

  const onClickCancel = () => {
    dispatch(removeCropsActive());
    navigate("/crops");
  };

  useEffect(() => {
    if (cropsActive) {
      setFormValues(cropsActive); 
      setPrepared(cropsActive.prepared);
      setSowing(cropsActive.sowing);
      setApplication(cropsActive.application);
      setGermination(cropsActive.germination);
      setHarvest(cropsActive.harvest);
    } else {
      setFormValues(initialForm);
      
    }
  }, [cropsActive, setFormValues]);

  useEffect(() => {
    return () => {
      dispatch(removeCropsActive());
    };
  }, [dispatch]);

  ( [cropVariety]);

  return (
    <>
      <Loading key="loading-new-customer" loading={isLoading} />
      <PageContainer maxWidth={980}>
        <PageHeader
          icon={<YardOutlined />}
          eyebrow="Maestros · Cultivos"
          title={cropsActive ? "Editar cultivo" : "Nuevo cultivo"}
          onBack={onClickCancel}
        />
        <FormCard title="Datos del cultivo" icon={<YardOutlined />}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                variant="outlined"
                type="text"
                name="descriptionES"
                value={descriptionES}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }} 
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
                    setFormValues({ ...formValues, cropType: newValue });
                    
                  }
                }}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo de cultivo"
                    variant="outlined"
                    name="cropType"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Descripción ES"
                variant="outlined"
                type="text"
                name="descriptionES"
                value={descriptionES}
                onChange={handleInputChange}
                inputProps={{ maxLength: 20 }} 
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
                inputProps={{ maxLength: 20 }} 
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
                inputProps={{ maxLength: 20 }} 
                fullWidth
              />
            </Grid>
          </Grid>
        </FormCard>
        <FormCard title="Labores que aplica" icon={<AgricultureOutlined />} delay={100}>
          <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 3, rowGap: 0.5 }}>
            <FormControlLabel
              control={<Checkbox id="preparedCheckbox" checked={prepared} onChange={handlePreparedChange} name="prepared" />}
              label="Preparado"
            />
            <FormControlLabel
              control={<Checkbox id="sowingCheckbox" checked={sowing} onChange={handleSowingChange} name="sowing" />}
              label="Siembra"
            />
            <FormControlLabel
              control={<Checkbox id="applicationCheckbox" checked={application} onChange={handleApplicationChange} name="application" />}
              label="Aplicación"
            />
            <FormControlLabel
              control={<Checkbox id="germinationCheckbox" checked={germination} onChange={handleGerminationChange} name="germination" />}
              label="Arrancado"
            />
            <FormControlLabel
              control={<Checkbox id="harvestCheckbox" checked={harvest} onChange={handleHarvestChange} name="harvest" />}
              label="Cosecha"
            />
          </Box>
        </FormCard>
        <FormActions>
          <Button variant="outlined" onClick={onClickCancel}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={cropsActive ? handleUpdateCrops : handleAddCrops}
          // fullWidth
          >
            {!cropsActive ? "Guardar" : "Actualizar"}
          </Button>
        </FormActions>
      </PageContainer>
    </>
  );
};
