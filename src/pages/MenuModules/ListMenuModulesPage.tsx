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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  List as ListIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
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

const columns: ColumnProps[] = [
  { text: 'Ícono', align: 'center' },
  { text: 'Modulo', align: 'left' },
  { text: 'System', align: 'center' },
  { text: 'ID', align: 'center' },
  { text: 'Menu', align: 'center' },
  { text: 'Orden', align: 'center' },
  { text: 'Ruta', align: 'center' },
  { text: '', align: 'center' },
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

  // Anchor para el menú del “título selector”
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

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
      <Container maxWidth='md' sx={{ ml: 0 }}>
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
          <Box component='div' sx={{ mt: 7 }}>
            <Grid
              container
              spacing={0}
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              sx={{ p: 2, mt: { sm: 2 } }}
            >
              <Grid item xs={6} sm={2}>
                <Button
                  variant='contained'
                  color='primary'
                  component={RouterLink}
                  to='/menus-modules/new'
                  startIcon={<AddIcon />}
                  sx={{ mb: 2 }}
                >
                  Nuevo
                </Button>
              </Grid>
              <Grid item xs={12} sm={10}>
                <Grid container justifyContent='flex-end'>
                  <Grid item xs={8} sm={5}>
                    <SearchInput
                      value={filterText}
                      placeholder='Menu / Modulo'
                      handleInputChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <SearchButton text='Buscar' onClick={() => onClickSearch()} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box component='div' sx={{ p: 1 }}>
              <TableContainer
                key='table-menu-modules'
                sx={{
                  minHeight: '120px',
                  maxHeight: '540px',
                  overflow: 'auto',
                  mb: 5,
                }}
                component={Paper}
              >
                <DataTable key='datatable-menu-modules' columns={columns} isLoading={isLoading}>
                  {filterMenuModules(menuModules, filterText).map(row => (
                    <ItemRow key={row._id} hover>
                      <TableCellStyled align='center'>
                        {row.icon && <DynamicIcon iconName={row.icon} />}
                      </TableCellStyled>
                      <TableCellStyled align='left'>
                        {row.module?.moduleNameEs ?? ''}
                      </TableCellStyled>
                      <TableCellStyled align='center'>{row.systemType}</TableCellStyled>
                      <TableCellStyled align='center'>{row.id}</TableCellStyled>
                      <TableCellStyled align='center'>{row.menuOption}</TableCellStyled>
                      <TableCellStyled align='center'>{row.order}</TableCellStyled>
                      <TableCellStyled align='center'>{row.route}</TableCellStyled>
                      <TableCellStyled align='right'>
                        <Tooltip title='Editar'>
                          <IconButton
                            aria-label='Editar'
                            onClick={() => onClickUpdateMenuModules(row)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCellStyled>
                      <TableCellStyled align='left'>
                        <Tooltip title='Eliminar'>
                          <IconButton
                            onClick={() => handleDeleteMenuModules(row)}
                            style={{ fontSize: '1rem' }}
                            color='default'
                          >
                            <DeleteIcon name='trash alternate' />
                          </IconButton>
                        </Tooltip>
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
