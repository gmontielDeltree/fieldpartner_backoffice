import React, { useEffect } from 'react';
import {
  Loading,
  AutoCompleteSelect,
  OptionType,
  NumericTextField,
  IconSelector,
} from '../../components';
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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { List as ListIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
  useForm,
  useMenuModules,
  useSystem,
  useModules,
} from '../../hooks';
import { MenuModules, MenuOptionType, Modules } from '../../types';
import { removeMenuModulesActive } from '../../store/menumodules/menuModulesSlice';
import Swal from 'sweetalert2';
import type { ModuleOption } from '../../hooks/useModules';
import { DynamicIcon } from '../../components/DynamicIcon/DynamicIcon';

const blankModule: Modules = {
  moduleNameEs: '',
  moduleNameEn: '',
  moduleNamePt: '',
  icon: '',
};

const initialForm: MenuModules = {
  id: 0,
  module: blankModule,
  menuOption: '',
  systemType: '',
  details: '',
  order: '',
  menuOptionEn: '',
  menuOptionPt: '',
  full: 'X',
  light: 'X',
  menuType: '',
  icon: '',
  route: '',
};

export const NewMenuModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Usa UNA sola instancia del hook
  const { options, getModules, isLoading: isLoadingModules } = useModules();
  const { isLoading, createMenuModules, updateMenuModules, menuModules, getMenuModules } =
    useMenuModules();
  const { menuModulesActive } = useAppSelector(state => state.menuModules);
  const { system, getSystem } = useSystem();

  // Eliminado: segunda instancia duplicada de useModules

  const {
    id,
    menuOption: menuOptionEs,
    menuOptionPt,
    menuOptionEn,
    order,
    details,
    route,
    full,
    light,
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<MenuModules>(initialForm);

  const handleCheckboxChange =
    (field: 'full' | 'light') => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues(prev => ({
        ...prev,
        [field]: event.target.checked ? 'X' : '',
      }));
    };

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
    newValue: string | null,
  ) => {
    if (newValue) {
      setFormValues(prevForm => ({
        ...prevForm,
        systemType: newValue,
      }));
    } else {
      setFormValues(prevForm => ({
        ...prevForm,
        systemType: '',
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
          id: 0,
        }));
      });
    }
    return idExists;
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
    navigate('/menus-modules');
    reset();
  };

  const menuTypeOptions: OptionType[] = Object.values(MenuOptionType).map(value => ({
    id: value,
    label: value,
  }));

  const selectedMenuType =
    menuTypeOptions.find(option => option.id === formValues.menuType) || null;

  const handleMenuTypeChange = (value: OptionType | null) => {
    setFormValues(prev => ({
      ...prev,
      menuType: value ? (value.id as MenuOptionType) : '',
    }));
  };

  // Normaliza por si viene un array desde datos viejos
  const selectedModule = (
    Array.isArray(formValues.module) ? formValues.module[0] : formValues.module
  ) as Modules | undefined;

  useEffect(() => {
    getModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Loading key='loading-new-customer' loading={isLoading || isLoadingModules} />
      <Container maxWidth='md' sx={{ mb: 4 }}>
        <Box component='div' display='flex' alignItems='center' sx={{ ml: { sm: 2 }, pt: 2 }}>
          <ListIcon />
          <Typography variant='h5' sx={{ ml: { sm: 2 } }}>
            Menus y Modulos
          </Typography>
        </Box>

        <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component='h1' variant='h4' align='center' sx={{ my: 3, mb: 5 }}>
            {menuModulesActive ? 'Editar' : 'Nuevo'} Menus y Modulos
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant='outlined'>
                <Autocomplete
                  options={system.map(sys => `${sys.system}: ${sys.version}`)}
                  fullWidth
                  renderInput={params => <TextField {...params} label='System' />}
                  value={formValues.systemType}
                  onChange={handleSystemChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Autocomplete<ModuleOption, false, false, false>
                options={options}
                getOptionLabel={opt => opt?.label ?? ''}
                loading={isLoadingModules}
                noOptionsText={isLoadingModules ? 'Cargando...' : 'Sin módulos'}
                value={
                  options.find(o => o.value._id && o.value._id === selectedModule?._id) ??
                  options.find(o => o.label === selectedModule?.moduleNameEs) ??
                  null
                }
                onChange={(_, opt) => {
                  setFormValues(prev => ({
                    ...prev,
                    module: opt?.value ?? blankModule,
                    icon: prev.icon || (opt?.value?.icon ?? ''),
                  }));
                }}
                isOptionEqualToValue={(opt, val) =>
                  (opt.id && val.id && opt.id === val.id) ||
                  (opt.value._id && val.value._id && opt.value._id === val.value._id) ||
                  opt.label === val.label
                }
                renderOption={(props, option) => (
                  <li
                    {...props}
                    key={option.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    {option.value.icon && <DynamicIcon iconName={option.value.icon} />}
                    <span>{option.label}</span>
                  </li>
                )}
                renderInput={params => <TextField {...params} label='Módulo' />}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <IconSelector
                value={formValues.icon}
                onChange={newValue => {
                  setFormValues(prev => ({
                    ...prev,
                    icon: newValue,
                  }));
                }}
                label='Ícono del Menú'
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label='Orden'
                variant='outlined'
                type='text'
                name='order'
                value={order}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position='start' />,
                }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <NumericTextField
                label='ID'
                name='id'
                value={id}
                onChange={newValue => {
                  // Actualiza el formulario manteniendo el tipo number
                  setFormValues(prev => ({
                    ...prev,
                    id: newValue === null ? 0 : newValue,
                  }));
                }}
                onBlur={handleVerifyId} // Tu validación existente
                inputProps={{ maxLength: 30 }}
                InputProps={{
                  startAdornment: <InputAdornment position='start' />,
                }}
                fullWidth
                variant={'outlined'}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <AutoCompleteSelect
                options={menuTypeOptions}
                label='Tipo de Menú'
                value={selectedMenuType}
                onChange={handleMenuTypeChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Opcion de menu ES'
                variant='outlined'
                type='text'
                name='menuOption'
                value={menuOptionEs}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position='start' />,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Opcion de menu EN'
                variant='outlined'
                type='text'
                name='menuOptionEn'
                value={menuOptionEn}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position='start' />,
                }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label='Opcion de menu PT'
                variant='outlined'
                type='text'
                name='menuOptionPt'
                value={menuOptionPt}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position='start' />,
                }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={7}>
              <TextField
                label='Ruta / path'
                variant='outlined'
                placeholder='/init/overview/menus-modules'
                type='text'
                name='route'
                value={route}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position='start' />,
                }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label='Detalles'
                variant='outlined'
                type='text'
                name='details'
                value={details}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position='start' />,
                }}
                fullWidth
              />
            </Grid>
          </Grid>

          {/* Checkboxes antes de los botones */}
          <Grid
            container
            spacing={2}
            sx={{ mt: 3, mb: 3 }}
            justifyContent='center'
            alignItems='center'
          >
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={full === 'X'}
                    onChange={handleCheckboxChange('full')}
                    color='primary'
                  />
                }
                label='Full'
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={light === 'X'}
                    onChange={handleCheckboxChange('light')}
                    color='primary'
                  />
                }
                label='Light'
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} justifyContent='center' alignItems='center' sx={{ mt: 2 }}>
            <Grid item xs={12} sm={3}>
              <Button onClick={onClickCancel} fullWidth variant='outlined'>
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={menuModulesActive ? handleUpdateMenuModules : handleAddMenuModules}
              >
                {!menuModulesActive ? 'Guardar' : 'Actualizar'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};
