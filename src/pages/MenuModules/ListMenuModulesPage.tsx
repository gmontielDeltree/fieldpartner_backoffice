import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  TableContainer,
  Paper,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  List as ListIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { useAppDispatch, useForm, useMenuModules } from '../../hooks';
import { setMenuModulesACtive } from '../../store/menumodules/menuModulesSlice';
import {
  DataTable,
  ItemRow,
  Loading,
  SearchButton,
  SearchInput,
  TableCellStyled,
  DynamicIcon,
} from '../../components';
import { ColumnProps, MenuModules } from '../../types';
import { ListModulesPage } from './ListModulesPage';
import { exportMenuModules, ExportFormat } from '../../utils/excelExport';
import Swal from 'sweetalert2';

const columns: ColumnProps[] = [
  { text: 'Ícono', align: 'center' },
  { text: 'Modulo', align: 'left' },
  { text: 'System', align: 'center' },
  { text: 'ID', align: 'center' },
  { text: 'Menu', align: 'center' },
  { text: 'Orden', align: 'center' },
  { text: 'Tipo', align: 'center' },
  { text: 'Ruta', align: 'left' },
  { text: 'Acciones', align: 'center' },
];

export const ListMenuModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, menuModules, getMenuModules, removeMenuModules } = useMenuModules();
  const { filterText, handleInputChange } = useForm({ filterText: '' });
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = (searchParams.get('view') === 'modules' ? 'modules' : 'menus') as
    | 'menus'
    | 'modules';
  const [view, setView] = useState<'menus' | 'modules'>(initialView);

  // Anchor para el menú del "título selector"
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  // Anchor para el menú de exportación
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const exportMenuOpen = Boolean(exportAnchorEl);
  const openExportMenu = (e: React.MouseEvent<HTMLElement>) => setExportAnchorEl(e.currentTarget);
  const closeExportMenu = () => setExportAnchorEl(null);

  const filterMenuModules = (menuModules: MenuModules[], filterText: string): MenuModules[] => {
    // Primero filtramos por el texto de búsqueda
    const filteredBySearch = menuModules.filter(menuModules =>
      matchesFilter(menuModules, filterText),
    );

    // Luego ordenamos por el campo order
    return filteredBySearch.sort((a, b) => {
      // order viene como string: ordena numéricamente, vacíos al final
      const orderA = Number(a.order);
      const orderB = Number(b.order);
      const aVal = Number.isFinite(orderA) ? orderA : Infinity;
      const bVal = Number.isFinite(orderB) ? orderB : Infinity;
      return aVal - bVal;
    });
  };

  const normalizeText = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const matchesFilter = (menuModules: MenuModules, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      menuModules.systemType,
      menuModules.module?.moduleNameEs ?? '',
      menuModules.menuOption,
      String(menuModules.id),
    ];

    return searchableFields.some(field => normalizeText(String(field)).includes(normalizedFilter));
  };

  const onClickSearch = () => {
    if (filterText === '') {
      getMenuModules();
      return;
    }
  };

  const onClickUpdateMenuModules = (item: MenuModules) => {
    console.log('Item ID:', item._id);
    dispatch(setMenuModulesACtive(item));
    navigate(`/menus-modules/${item._id}`);
  };

  const handleDeleteMenuModules = (item: MenuModules) => {
    if (item._id && item._rev) {
      removeMenuModules(item._id, item._rev);
      getMenuModules();
    }
  };

  // Handler para exportar (respeta filtro de búsqueda)
  const handleExport = (format: ExportFormat) => {
    // Obtener datos filtrados si hay búsqueda activa
    const dataToExport = filterText
      ? filterMenuModules(menuModules, filterText)
      : menuModules;

    // Exportar
    exportMenuModules(dataToExport, format);

    // Cerrar menú
    closeExportMenu();

    // Mostrar confirmación
    const formatName = format === 'excel' ? 'Excel (.xlsx)' : 'CSV (.csv)';
    Swal.fire({
      icon: 'success',
      title: 'Exportación exitosa',
      text: `${dataToExport.length} registro${dataToExport.length !== 1 ? 's' : ''} exportado${dataToExport.length !== 1 ? 's' : ''} a ${formatName}`,
      timer: 2500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  useEffect(() => {
    getMenuModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const v = searchParams.get('view');
    if ((v === 'menus' || v === 'modules') && v !== view) setView(v);
  }, [searchParams, view]);

  const handleViewChange = (_: React.SyntheticEvent | null, next: 'menus' | 'modules' | null) => {
    if (!next) return;
    setView(next);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('view', next);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <>
      {isLoading && <Loading loading />}
      <Container maxWidth='lg' sx={{ ml: 0 }}>
        <Box
          component='div'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <Box display='flex' alignItems='center' gap={1}>
            <ListIcon />
            <Button
              onClick={openMenu}
              endIcon={<KeyboardArrowDownIcon />}
              disableRipple
              sx={{
                p: 0,
                textTransform: 'none',
                color: 'text.primary',
                '& .MuiButton-endIcon': { ml: 1 },
              }}
              aria-haspopup='menu'
              aria-expanded={menuOpen ? 'true' : undefined}
              aria-controls='title-menu'
            >
              <Typography component='h4' variant='h4' sx={{ ml: { sm: 1 } }}>
                {view === 'menus' ? 'Menús' : 'Módulos'}
              </Typography>
            </Button>
            <Menu
              id='title-menu'
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={closeMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <MenuItem
                selected={view === 'menus'}
                onClick={() => {
                  handleViewChange(null, 'menus');
                  closeMenu();
                }}
              >
                Menús
              </MenuItem>
              <MenuItem
                selected={view === 'modules'}
                onClick={() => {
                  handleViewChange(null, 'modules');
                  closeMenu();
                }}
              >
                Módulos
              </MenuItem>
            </Menu>
          </Box>
          <Box />
        </Box>

        {view === 'menus' ? (
          <Box component='div' sx={{ mt: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <Grid
                container
                spacing={2}
                direction='row'
                alignItems='center'
                justifyContent='space-between'
              >
                <Grid item xs={12} sm={3}>
                  <Button
                    variant='contained'
                    color='primary'
                    component={RouterLink}
                    to='/menus-modules/new'
                    startIcon={<AddIcon />}
                    fullWidth
                    sx={{
                      py: 1.2,
                      fontWeight: 600,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      },
                    }}
                  >
                    Nuevo Menú
                  </Button>
                </Grid>

                <Grid item xs={12} sm={9}>
                  <Grid container spacing={1} justifyContent='flex-end' alignItems='center'>
                    {/* Botón de Exportar */}
                    <Grid item xs={12} sm={2}>
                      <Button
                        variant='outlined'
                        color='success'
                        startIcon={<FileDownloadIcon />}
                        onClick={openExportMenu}
                        fullWidth
                        sx={{
                          py: 1.2,
                          fontWeight: 600,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            bgcolor: 'success.light',
                            color: 'white',
                          },
                        }}
                      >
                        Exportar
                      </Button>
                      <Menu
                        anchorEl={exportAnchorEl}
                        open={exportMenuOpen}
                        onClose={closeExportMenu}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        <MenuItem onClick={() => handleExport('excel')}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FileDownloadIcon fontSize='small' color='success' />
                            <Typography>Excel (.xlsx)</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem onClick={() => handleExport('csv')}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FileDownloadIcon fontSize='small' color='info' />
                            <Typography>CSV (.csv)</Typography>
                          </Box>
                        </MenuItem>
                      </Menu>
                    </Grid>

                    {/* Buscador */}
                    <Grid item xs={12} sm={6}>
                      <SearchInput
                        value={filterText}
                        placeholder='Buscar por menú, módulo, sistema o ID...'
                        handleInputChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <SearchButton text='Buscar' onClick={() => onClickSearch()} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Stats rápidos */}
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`Total de menús: ${menuModules.length}`}
                  color='primary'
                  variant='outlined'
                  size='small'
                />
              </Box>
            </Paper>

            <Box component='div' sx={{ p: 1 }}>
              <TableContainer
                key='table-menu-modules'
                sx={{
                  minHeight: '120px',
                  maxHeight: '650px',
                  overflow: 'auto',
                  mb: 5,
                  boxShadow: 2,
                  borderRadius: 1,
                }}
                component={Paper}
              >
                <DataTable key='datatable-menu-modules' columns={columns} isLoading={isLoading}>
                  {filterMenuModules(menuModules, filterText).map(row => (
                    <ItemRow
                      key={row._id}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      {/* Ícono */}
                      <TableCellStyled align='center' sx={{ width: '60px' }}>
                        {row.icon && (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              p: 0.5,
                            }}
                          >
                            <DynamicIcon iconName={row.icon} />
                          </Box>
                        )}
                      </TableCellStyled>

                      {/* Módulo */}
                      <TableCellStyled align='left' sx={{ fontWeight: 500, minWidth: '150px' }}>
                        {row.module?.moduleNameEs ?? '-'}
                      </TableCellStyled>

                      {/* Sistema */}
                      <TableCellStyled align='center' sx={{ minWidth: '120px' }}>
                        <Typography variant='caption' sx={{ fontSize: '0.75rem' }}>
                          {row.systemType || '-'}
                        </Typography>
                      </TableCellStyled>

                      {/* ID */}
                      <TableCellStyled align='center' sx={{ width: '60px' }}>
                        <Chip
                          label={row.id}
                          size='small'
                          variant='outlined'
                          sx={{ fontSize: '0.7rem', height: '22px', fontWeight: 600 }}
                        />
                      </TableCellStyled>

                      {/* Menu Option */}
                      <TableCellStyled align='center' sx={{ minWidth: '150px' }}>
                        <Typography variant='body2' sx={{ fontSize: '0.85rem' }}>
                          {row.menuOption || '-'}
                        </Typography>
                      </TableCellStyled>

                      {/* Orden */}
                      <TableCellStyled align='center' sx={{ width: '70px' }}>
                        <Chip
                          label={row.order || '-'}
                          size='small'
                          color='info'
                          variant='outlined'
                          sx={{ fontSize: '0.7rem', height: '22px', minWidth: '35px' }}
                        />
                      </TableCellStyled>

                      {/* Tipo de Menú */}
                      <TableCellStyled align='center' sx={{ minWidth: '100px' }}>
                        <Chip
                          label={row.menuType || '-'}
                          size='small'
                          color='secondary'
                          variant='outlined'
                          sx={{ fontSize: '0.65rem', height: '22px' }}
                        />
                      </TableCellStyled>

                      {/* Ruta */}
                      <TableCellStyled align='left' sx={{ minWidth: '200px', maxWidth: '300px' }}>
                        <Tooltip title={row.route || 'Sin ruta'} arrow>
                          <Typography
                            variant='caption'
                            sx={{
                              fontSize: '0.75rem',
                              color: 'text.secondary',
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {row.route || '-'}
                          </Typography>
                        </Tooltip>
                      </TableCellStyled>

                      {/* Acciones */}
                      <TableCellStyled align='center' sx={{ width: '120px' }}>
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Tooltip title='Editar menú' arrow>
                            <IconButton
                              aria-label='Editar'
                              onClick={() => onClickUpdateMenuModules(row)}
                              size='small'
                              color='primary'
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'white',
                                },
                              }}
                            >
                              <EditIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title='Eliminar menú' arrow>
                            <IconButton
                              onClick={() => handleDeleteMenuModules(row)}
                              size='small'
                              color='error'
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'error.light',
                                  color: 'white',
                                },
                              }}
                            >
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCellStyled>
                    </ItemRow>
                  ))}
                </DataTable>
              </TableContainer>
            </Box>
          </Box>
        ) : (
          <Box component='div' sx={{ mt: 4 }}>
            {/* Lista de Módulos dentro de la misma vista */}
            <ListModulesPage />
          </Box>
        )}
      </Container>
    </>
  );
};
