import React, { useEffect, useState } from "react";
import { Loading } from "../components";
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Checkbox
} from "@mui/material";
import { Yard as YardIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useCrops, useForm } from "../hooks";
import { Crops } from "../types";
import { removeCropsActive } from "../store/crops";

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
  harvest: false
};

export const NewCropsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [prepared, setPrepared] = useState(false);
  const [sowing, setSowing] = useState(false);
  const [application, setApplication] = useState(false);
  const [germination, setGermination] = useState(false);
  const [harvest, setHarvest] = useState(false);

  const cropTypes = ["Tubérculo", "Gramínea", "Textil", "Legumbres", "Oleaginosa", "Industrial", "Cereal"];
  const cropVarieties = [
    "Ajo",
    "Alfalfa",
    "Algodon",
    "Alpiste",
    "Arroz",
    "Arveja",
    "Avena",
    "Batata",
    "Canola",
    "Caña",
    "Cebada",
    "Cebolla",
    "Centeno",
    "Colza",
    "Esparrago",
    "Espelta",
    "Garbanzo",
    "Girasol",
    "Haba",
    "Kamut",
    "Lenteja",
    "Linaza",
    "Maiz",
    "Maiz 2da",
    "Mandioca",
    "Mani",
    "Mijo",
    "Papa",
    "Pastura",
    "Raigras",
    "Poroto",
    "Quinoa",
    "Rabanito",
    "Remolacha",
    "Sésamo",
    "Soja",
    "Soja 2da",
    "Sorgo",
    "Trigo",
    "Trigo Candeal",
    "Triticale",
    "Zanahora"
  ];

  useEffect(() => {
    switch (selectedCrop) {
      case "Ajo":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Alfalfa":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Algodon":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Alpiste":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Arroz":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Arveja":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Avena":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Batata":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Canola":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Caña":
        setPrepared(true);
        setSowing(false);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Cebada":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Cebolla":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Centeno":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Colza":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Esparrago":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Espelta":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Garbanzo":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Girasol":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Haba":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Kamut":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Lenteja":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Linaza":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Maiz":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Maiz 2da":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Mandioca":
        setPrepared(true);
        setSowing(false);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Mani":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(true);
        setHarvest(true);
        break;
      case "Mijo":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Papa":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Pastura":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Raigras":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Poroto":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Quinoa":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Rabanito":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Remolacha":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Sésamo":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Soja":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Soja 2da":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Sorgo":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Trigo":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Trigo Candeal":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Triticale":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      case "Zanahora":
        setPrepared(true);
        setSowing(true);
        setApplication(true);
        setGermination(false);
        setHarvest(true);
        break;
      default:
        setPrepared(false);
        setSowing(false);
        setApplication(false);
        setGermination(false);
        setHarvest(false);
        break;
    }
  }, [selectedCrop]);



  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    switch (name) {
      case "prepared":
        setPrepared(checked);
        break;
      case "sowing":
        setSowing(checked);
        break;
      case "application":
        setApplication(checked);
        break;
      case "germination":
        setGermination(checked);
        break;
      case "harvest":
        setHarvest(checked);
        break;
      default:
        break;
    }
  };

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

  const { isLoading, createCrops, updateCrops } = useCrops();

  const obtenerDescripcion = (selectedCrop: string) => {
    const descripciones: Record<string, string> = {
      "Ajo": "Ajo",
      "Alfalfa": "Alfalfa",
      "Algodon": "Algodon",
      "Alpiste": "Alpiste",
      "Arroz": "Arroz",
      "Arveja": "Arveja",
      "Avena": "Avena",
      "Batata": "Batata",
      "Canola": "Canola",
      "Caña": "Caña",
      "Cebada": "Cebada",
      "Cebolla": "Cebolla",
      "Centeno": "Centeno",
      "Colza": "Colza",
      "Esparrago": "Esparrago",
      "Espelta": "Espelta",
      "Garbanzo": "Garbanzo",
      "Girasol": "Girasol",
      "Haba": "Haba",
      "Kamut": "Kamut",
      "Lenteja": "Lenteja",
      "Linaza": "Linaza",
      "Maiz": "Maiz",
      "Maiz 2da": "Maiz 2da",
      "Mandioca": "Mandioca",
      "Mani": "Mani",
      "Mijo": "Mijo",
      "Papa": "Papa",
      "Pastura": "Pastura",
      "Raigras": "Raigras",
      "Poroto": "Poroto",
      "Quinoa": "Quinoa",
      "Rabanito": "Rabanito",
      "Remolacha": "Remolacha",
      "Sésamo": "Sésamo",
      "Soja": "Soja",
      "Soja 2da": "Soja 2da",
      "Sorgo": "Sorgo",
      "Trigo": "Trigo",
      "Trigo Candeal": "Trigo Candeal",
      "Triticale": "Triticale",
      "Zanahora": "Zanahora"
    };
    return descripciones[selectedCrop] || "";
  };

  const obtenerDescripcionPT = (selectedCrop: string) => {
    const descripcionesPT: Record<string, string> = {
      "Ajo": "Alho",
      "Alfalfa": "Alfalfa",
      "Algodon": "Algodão",
      "Alpiste": "Alpiste",
      "Arroz": "Arroz",
      "Arveja": "Ervilha",
      "Avena": "Aveia",
      "Batata": "Batata doce",
      "Canola": "Canola",
      "Caña": "Cana-de-açúcar",
      "Cebada": "Cevada",
      "Cebolla": "Cebola",
      "Centeno": "Centeio",
      "Colza": "Colza",
      "Esparrago": "Aspargo",
      "Espelta": "Espelta",
      "Garbanzo": "Grão-de-bico",
      "Girasol": "Girassol",
      "Haba": "Feijão",
      "Kamut": "Kamut",
      "Lenteja": "Lentilha",
      "Linaza": "Linhaça",
      "Maiz": "Milho",
      "Maiz 2da": "Milho 2",
      "Mandioca": "Mandioca",
      "Mani": "Amendoim",
      "Mijo": "Milheto",
      "Papa": "Batata",
      "Pastura": "Pastagem",
      "Raigras": "Azevém",
      "Poroto": "Feijão",
      "Quinoa": "Quinoa",
      "Rabanito": "Rabanete",
      "Remolacha": "Beterraba",
      "Sésamo": "Gergelim",
      "Soja": "Soja",
      "Soja 2da": "Soja 2",
      "Sorgo": "Sorgo",
      "Trigo": "Trigo",
      "Trigo Candeal": "Trigo Duro",
      "Triticale": "Triticale",
      "Zanahora": "Cenoura"
    };
    return descripcionesPT[selectedCrop] || "";
  };

  const obtenerDescripcionEN = (selectedCrop: string) => {
    const descripcionesEN: Record<string, string> = {
      "Ajo": "Garlic",
      "Alfalfa": "Alfalfa",
      "Algodon": "Cotton",
      "Alpiste": "Birdseed",
      "Arroz": "Rice",
      "Arveja": "Pea",
      "Avena": "Oat",
      "Batata": "Sweet potato",
      "Canola": "Canola",
      "Caña": "Sugar cane",
      "Cebada": "Barley",
      "Cebolla": "Onion",
      "Centeno": "Rye",
      "Colza": "Rape",
      "Esparrago": "Asparagus",
      "Espelta": "Spelt",
      "Garbanzo": "Chickpea",
      "Girasol": "Sunflower",
      "Haba": "Bean",
      "Kamut": "Kamut",
      "Lenteja": "Lentil",
      "Linaza": "Flax",
      "Maiz": "Corn",
      "Maiz 2da": "Corn 2nd",
      "Mandioca": "Cassava",
      "Mani": "Peanut",
      "Mijo": "Millet",
      "Papa": "Potato",
      "Pastura": "Pasture",
      "Raigras": "Ryegrass",
      "Poroto": "Bean",
      "Quinoa": "Quinoa",
      "Rabanito": "Radish",
      "Remolacha": "Beet",
      "Sésamo": "Sesame",
      "Soja": "Soybean",
      "Soja 2da": "Soybean 2nd",
      "Sorgo": "Sorghum",
      "Trigo": "Wheat",
      "Trigo Candeal": "Hard wheat",
      "Triticale": "Triticale",
      "Zanahora": "Carrot"
    };
    return descripcionesEN[selectedCrop] || "";
  };
  const obtenerTipoCultivo = (selectedCrop: string) => {
    const tipoCultivoPorVariedad: Record<string, string> = {

      "Ajo": "Tubérculo",
      "Alfalfa": "Gramínea",
      "Algodon": "Textil",
      "Alpiste": "Gramínea",
      "Arroz": "Gramínea",
      "Arveja": "Legumbres",
      "Avena": "Gramínea",
      "Batata": "Tubérculo",
      "Canola": "Oleaginosa",
      "Caña": "Industrial",
      "Cebada": "Cereal",
      "Cebolla": "Industrial",
      "Centeno": "Cereal",
      "Colza": "Oleaginosa",
      "Esparrago": "Oleaginosa",
      "Espelta": "Cereal",
      "Garbanzo": "Oleaginosa",
      "Girasol": "Gramínea",
      "Haba": "Gramínea",
      "Kamut": "Gramínea",
      "Lenteja": "Legumbres",
      "Linaza": "Textil",
      "Maiz": "Cereal",
      "Maiz 2da": "Cereal",
      "Mandioca": "Tubérculo",
      "Mani": "Oleaginoso",
      "Mijo": "Gramínea",
      "Papa": "Tubérculo",
      "Pastura": "Gramínea",
      "Raigras": "Gramínea",
      "Poroto": "Oleaginosa",
      "Quinoa": "Cereal",
      "Rabanito": "Tubérculo",
      "Remolacha": "Tubérculo",
      "Sésamo": "Oleaginosa",
      "Soja": "Oleaginosa",
      "Soja 2da": "Oleaginosa",
      "Sorgo": "Cereal",
      "Trigo": "Cereal",
      "Trigo Candeal": "Cereal",
      "Triticale": "Cereal",
      "Zanahora": "Tubérculo"

    };
    return tipoCultivoPorVariedad[selectedCrop] || "";
  };

  const handleAddCrops = () => {
    createCrops(formulario);
    reset();
  };

  const handleUpdateCrops = () => {
    if (!formulario._id) return;
    updateCrops(formulario);
  };

  const onClickCancel = () => {
    dispatch(removeCropsActive());
    navigate("/crops");
  };

  useEffect(() => {
    if (cropsActive) setFormulario(cropsActive);
    else setFormulario(initialForm);
  }, [cropsActive, setFormulario]);

  useEffect(() => {
    return () => {
      dispatch(removeCropsActive());
    };
  }, [dispatch]);

  useEffect(() => {
    if (cropVariety) {
      const defaultCropType = obtenerTipoCultivo(cropVariety);
      setFormulario(prevState => ({
        ...prevState,
        cropType: defaultCropType
      }));
    }
  }, [cropVariety]);

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
              <FormControl fullWidth>
                <InputLabel id="Cultivos">Cultivos</InputLabel>
                <Select
                  labelId="cropVariety"
                  name="cropVariety"
                  value={cropVariety}
                  label="Cultivos"
                  onChange={(event: SelectChangeEvent<string>) => {
                    const selectedCrop = event.target.value || "";
                    setSelectedCrop(selectedCrop); // Aquí estableces el cultivo seleccionado
                    const cropDescription = obtenerDescripcion(selectedCrop);
                    const cropDescriptionPT = obtenerDescripcionPT(selectedCrop);
                    const cropDescriptionEN = obtenerDescripcionEN(selectedCrop);
                    setFormulario({ ...formulario, cropVariety: selectedCrop, descriptionES: cropDescription, descriptionPT: cropDescriptionPT, descriptionEN: cropDescriptionEN });
                  }}
                >
                  {cropVarieties.map((cropType) => (
                    <MenuItem key={cropType} value={cropType}>
                      {cropType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={cropTypes}
                value={cropType}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleInputChange(event);
                    setFormulario({ ...formulario, cropType: newValue });
                    setSelectedCrop(newValue); // Aquí estableces el cultivo seleccionado
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
                <Checkbox checked={prepared} name="prepared" onChange={handleCheckboxChange} />
                <Typography>Preparado</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
                <Checkbox checked={sowing} name="sowing" onChange={handleCheckboxChange} />
                <Typography>Siembra</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
                <Checkbox checked={application} name="application" onChange={handleCheckboxChange} />
                <Typography>Aplicacion</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: '20px' }}>
                <Checkbox checked={germination} name="germination" onChange={handleCheckboxChange} />
                <Typography>Arrancado</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox checked={harvest} name="harvest" onChange={handleCheckboxChange} />
                <Typography>Cosecha</Typography>
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