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
import Swal from "sweetalert2";

const initialForm: MenuModules = {
  id: 0,
  module: "",
  menuOption: "",
  systemType: "",
  details: "",
  order: 0,
};

export const NewMenuModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, createMenuModules, updateMenuModules, menuModules, getMenuModules } = useMenuModules();
  const { menuModulesActive } = useAppSelector((state) => state.menuModules);
  const { system, getSystem } = useSystem();


  const {
    id,
    module,
    menuOption,
    order,
    details,
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<MenuModules>(initialForm);

  useEffect(() => {
    getSystem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getMenuModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleVerifyId = () => {
    const idExists = menuModules.some(module => module.id === id);
    if (idExists) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El ID ya existe',
      }).then(() => {
        setFormValues(prevForm => ({
          ...prevForm,
          id: 0
        }));
      });
    }
    return idExists;
  };

  // const logIdData = async (menuModules: MenuModules[]) => {
  //   try {
  //     const mappedData = menuModules.map((sys: MenuModules) => `${sys.id}: ${sys.module}`);
  //     console.log("Mapeado",mappedData);
  //   } catch (error) {
  //     console.error('Error al obtener los módulos:', error);
  //   }
  // };

  // const handleClickId = () => {
  //   logIdData(menuModules);
  // };


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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined" >
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
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Orden"
                variant="outlined"
                type="number"
                name="order"
                value={order}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ID"
                variant="outlined"
                type="text"
                name="id"
                value={id}
                onBlur={handleVerifyId}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Opcion de menu"
                variant="outlined"
                type="text"
                name="menuOption"
                value={menuOption}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Detalles"
                variant="outlined"
                type="text"
                name="details"
                value={details}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Grid>
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
        </Paper>
      </Container >
    </>
  );
};
