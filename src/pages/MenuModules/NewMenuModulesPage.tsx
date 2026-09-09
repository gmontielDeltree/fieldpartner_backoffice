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
  Paper,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
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
  orden: 0,
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
  parentId: null,
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

  // Submenú padre: sólo menús SideBar del mismo módulo (o de cualquiera si
  // todavía no se eligió módulo), excluyendo el propio menú.
  type ParentOption = { id: number; label: string };
  const parentOptions: ParentOption[] = menuModules
    .filter(m => String(m.menuType) === MenuOptionType.SideBar)
    .filter(m => Number(m.id) !== Number(formValues.id))
    .filter(m => {
      const mod = (Array.isArray(m.module) ? m.module[0] : m.module) as Modules | undefined;
      return !selectedModule?._id || !mod?._id || mod._id === selectedModule._id;
    })
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map(m => ({
      id: Number(m.id),
      label: `${m.id} · ${m.menuOption}${m.route ? '' : ' (submenú)'}`,
    }));
  const selectedParent =
    parentOptions.find(o => o.id === Number(formValues.parentId)) ?? null;
  const isContainer = !formValues.route && !formValues.parentId;

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
          <Typography component='h1' variant='h4' align='center' sx={{ mb: 4 }}>
            {menuModulesActive ? 'Editar' : 'Nuevo'} Menú / Módulo
          </Typography>

          {/* SECCIÓN 1: CONFIGURACIÓN BÁSICA */}
          <Box sx={{ mb: 4 }}>
            <Typography variant='h6' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
              📋 Configuración Básica
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <NumericTextField
                  label='ID *'
                  name='id'
                  value={id}
                  onChange={newValue => {
                    setFormValues(prev => ({
                      ...prev,
                      id: newValue === null ? 0 : newValue,
                    }));
                  }}
                  onBlur={handleVerifyId}
                  inputProps={{ maxLength: 30 }}
                  fullWidth
                  variant='outlined'
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label='Orden *'
                  variant='outlined'
                  type='text'
                  name='order'
                  value={order}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder='1, 2, 3...'
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <AutoCompleteSelect
                  options={menuTypeOptions}
                  label='Tipo de Menú *'
                  value={selectedMenuType}
                  onChange={handleMenuTypeChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl fullWidth variant='outlined'>
                  <Autocomplete
                    options={system.map(sys => `${sys.system}: ${sys.version}`)}
                    fullWidth
                    renderInput={params => <TextField {...params} label='Sistema *' />}
                    value={formValues.systemType}
                    onChange={handleSystemChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* SECCIÓN 2: MÓDULO E ICONO */}
          <Box sx={{ mb: 4 }}>
            <Typography variant='h6' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
              🎨 Módulo e Icono
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
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
                  renderInput={params => <TextField {...params} label='Módulo *' />}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete<ParentOption, false, false, false>
                  options={parentOptions}
                  getOptionLabel={opt => opt?.label ?? ''}
                  value={selectedParent}
                  onChange={(_, opt) => {
                    setFormValues(prev => ({ ...prev, parentId: opt ? opt.id : null }));
                  }}
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  noOptionsText='Sin menús de este módulo'
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Submenú padre (opcional)'
                      helperText='Para anidar este menú debajo de otro. El padre es un menú SideBar sin ruta.'
                    />
                  )}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <IconSelector
                  value={formValues.icon}
                  onChange={newValue => {
                    setFormValues(prev => ({
                      ...prev,
                      icon: newValue,
                    }));
                  }}
                  label='Ícono del Menú *'
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECCIÓN 3: TEXTOS MULTILENGUAJE */}
          <Box sx={{ mb: 4 }}>
            <Typography variant='h6' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
              🌐 Textos del Menú (Multilenguaje)
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label='Español (ES) *'
                  variant='outlined'
                  type='text'
                  name='menuOption'
                  value={menuOptionEs}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder='Ej: Menús y Módulos'
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label='Inglés (EN) *'
                  variant='outlined'
                  type='text'
                  name='menuOptionEn'
                  value={menuOptionEn}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder='Ej: Menus and Modules'
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label='Portugués (PT) *'
                  variant='outlined'
                  type='text'
                  name='menuOptionPt'
                  value={menuOptionPt}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder='Ej: Menus e Módulos'
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label={isContainer ? 'Ruta / Path (vacía: es un submenú contenedor)' : 'Ruta / Path *'}
                  variant='outlined'
                  placeholder='/init/overview/menus-modules'
                  type='text'
                  name='route'
                  value={route}
                  onChange={handleInputChange}
                  fullWidth
                  helperText='Dejala vacía para crear un submenú que agrupe otros menús (por ejemplo "Reportes").'
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label='Detalles / Descripción'
                  variant='outlined'
                  type='text'
                  name='details'
                  value={details}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder='Información adicional sobre este menú...'
                />
              </Grid>
            </Grid>
          </Box>

          {/* SECCIÓN 4: CONFIGURACIÓN ADICIONAL */}
          <Box sx={{ mb: 4 }}>
            <Typography variant='h6' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
              ⚙️ Configuración Adicional
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'background.default',
                  }}
                >
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
                </Box>
              </Grid>
            </Grid>
          </Box>

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
