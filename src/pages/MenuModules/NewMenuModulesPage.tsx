import React, { useEffect } from "react";
import { Loading } from "../../components";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { List as ListIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useForm, useMenuModules, useSystem } from "../../hooks";
import { MenuModules } from "../../types";
import { removeMenuModulesActive } from "../../store/menumodules/menuModulesSlice";

const initialForm: MenuModules = {
  id: 0,
  module: "",
  menuOption: "",
  systemType: "",
  details: "",
};

export const NewMenuModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, createMenuModules, updateMenuModules } = useMenuModules();
  const { menuModulesActive } = useAppSelector((state) => state.menuModules);
  const { system, getSystem } = useSystem();

  const {
    id,
    module,
    menuOption,
    // systemType,
    details,
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<MenuModules>(initialForm);

  useEffect(() => {
    getSystem();
  }, [getSystem]);

  useEffect(() => {
    if (menuModulesActive) {
      setFormValues(menuModulesActive);
    } else {
      setFormValues(initialForm);
    }
  }, [menuModulesActive, setFormValues]);

  const handleSystemChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    if (newValue) {
      setFormValues((prevForm) => ({
        ...prevForm,
        systemType: newValue,
      }));
    } else {
      setFormValues((prevForm) => ({
        ...prevForm,
        systemType: "",
      }));
    }
  };


  const handleAddMenuModules = () => {
    createMenuModules(formValues);
    dispatch(removeMenuModulesActive());
    reset();
  };

  const handleUpdateMenuModules = () => {
    if (!formValues._id) return;
    updateMenuModules(formValues);
    dispatch(removeMenuModulesActive());
    reset();
  };

  const onClickCancel = () => {
    dispatch(removeMenuModulesActive());
    navigate("/menus-modules");
    reset();
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
          <ListIcon />
          <Typography variant="h5" sx={{ ml: { sm: 2 } }}>
            Menus y Modulos
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
            {menuModulesActive ? "Editar" : "Nuevo"} Menus y Modulos
          </Typography>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={3.3} sx={{ width: '200%' }}>
              <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <Autocomplete
                  options={system.map((sys) => `${sys.system}: ${sys.version}`)}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="System" />}
                  value={formValues.systemType}
                  onChange={handleSystemChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'block', mt: 2 }}>
                <TextField
                  label="Modulo"
                  variant="outlined"
                  type="text"
                  name="module"
                  value={module}
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
            <Grid item xs={6} sm={2}>
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
            <Grid item xs={12} sm={5}>
              <TextField
                label="Opcion de menu"
                variant="outlined"
                type="text"
                name="menuOption"
                value={menuOption}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                label="Detalles"
                variant="outlined"
                type="text"
                name="details"
                value={details}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }}
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
                  onClick={menuModulesActive ? handleUpdateMenuModules : handleAddMenuModules}
                >
                  {!menuModulesActive ? "Guardar" : "Actualizar"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};
