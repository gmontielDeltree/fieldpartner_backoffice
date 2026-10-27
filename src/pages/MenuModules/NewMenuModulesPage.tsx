import React, { useEffect } from 'react';
import {
  Loading,
  AutoCompleteSelect,
  OptionType,
  NumericTextField,
  IconSelector,
  FormActions,
  FormCard,
  PageContainer,
  PageHeader,
} from '../../components';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  ListAltOutlined,
  TranslateOutlined,
  TuneOutlined,
  ViewModuleOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
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
      <PageContainer maxWidth={1180}>
        <PageHeader
          icon={<ListAltOutlined />}
          eyebrow='Menús y módulos · Menús'
          title={menuModulesActive ? 'Editar menú' : 'Nuevo menú'}
          onBack={onClickCancel}
        />

        {/* SECCIÓN 1: CONFIGURACIÓN BÁSICA */}
        <FormCard
          title='Configuración básica'
          subtitle='El ID no se puede repetir.'
          icon={<TuneOutlined />}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
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

            <Grid item xs={12} sm={6} md={3}>
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

            <Grid item xs={12} sm={6} md={3}>
              <AutoCompleteSelect
                options={menuTypeOptions}
                label='Tipo de menú *'
                value={selectedMenuType}
                onChange={handleMenuTypeChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
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
        </FormCard>

        {/* SECCIÓN 2: MÓDULO E ÍCONO */}
        <FormCard
          title='Módulo e ícono'
          icon={<ViewModuleOutlined />}
          delay={100}
        >
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
                    {option.value.icon && (
                      <Box
                        component='span'
                        sx={{
                          display: 'inline-flex',
                          color: 'var(--ink-2)',
                          '& .MuiSvgIcon-root': { fontSize: 18 },
                          '& > span': { width: 18, height: 18 },
                        }}
                      >
                        <DynamicIcon iconName={option.value.icon} />
                      </Box>
                    )}
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
                label='Ícono del menú *'
              />
            </Grid>
          </Grid>
        </FormCard>

        {/* SECCIÓN 3: TEXTOS MULTILENGUAJE */}
        <FormCard
          title='Textos del menú'
          icon={<TranslateOutlined />}
          delay={140}
        >
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
        </FormCard>

        {/* SECCIÓN 4: CONFIGURACIÓN ADICIONAL */}
        <FormCard title='Configuración adicional' icon={<VisibilityOutlined />} delay={180}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 3, rowGap: 1 }}>
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
        </FormCard>

        <FormActions>
          <Button onClick={onClickCancel} variant='outlined'>
            Cancelar
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={menuModulesActive ? handleUpdateMenuModules : handleAddMenuModules}
          >
            {!menuModulesActive ? 'Guardar' : 'Actualizar'}
          </Button>
        </FormActions>
      </PageContainer>
    </>
  );
};
