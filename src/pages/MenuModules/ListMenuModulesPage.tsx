import React, { useEffect } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
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
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  List as ListIcon,
} from '@mui/icons-material'
import { useAppDispatch, useForm, useMenuModules } from '../../hooks'
import { setMenuModulesACtive } from '../../store/menumodules/menuModulesSlice'
import {
  DataTable,
  ItemRow,
  Loading,
  SearchButton,
  SearchInput,
  TableCellStyled,
} from '../../components'
import { ColumnProps, MenuModules } from '../../types'

const columns: ColumnProps[] = [
  { text: 'Modulo', align: 'left', field: 'module', sortable: true },
  { text: 'System', align: 'center', field: 'systemType', sortable: true },
  { text: 'ID', align: 'center', field: 'id', sortable: true },
  { text: 'Menu', align: 'center', field: 'menuOption', sortable: true },
  { text: 'Orden', align: 'center', field: 'order', sortable: true },
]

export const ListMenuModulesPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    isLoading,
    menuModules,
    getMenuModules,
    removeMenuModules,
  } = useMenuModules()
  const { filterText, handleInputChange } = useForm({ filterText: '' })

  const [sortField, setSortField] = React.useState<keyof MenuModules>('order')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field as keyof MenuModules)
      setSortDirection('asc')
    }
  }

  const compareValues = (
    a: MenuModules,
    b: MenuModules,
    field: keyof MenuModules,
  ) => {
    const av = a[field]
    const bv = b[field]
    if (typeof av === 'number' && typeof bv === 'number') return av - bv
    return String(av ?? '').localeCompare(String(bv ?? ''), undefined, {
      numeric: true,
      sensitivity: 'base',
    })
  }

  const filterMenuModules = (
    menuModules: MenuModules[],
    filterText: string,
  ): MenuModules[] => {
    // Primero filtramos por el texto de búsqueda
    const filteredBySearch = menuModules.filter((menuModules) =>
      matchesFilter(menuModules, filterText),
    )

    // Luego ordenamos segun el campo seleccionado (por defecto "order")
    return [...filteredBySearch].sort((a, b) => {
      const primary = compareValues(a, b, sortField)
      const result = sortDirection === 'asc' ? primary : -primary
      // Desempate: dentro de un mismo valor, ordenar por "order"
      if (result === 0 && sortField !== 'order') {
        return compareValues(a, b, 'order')
      }
      return result
    })
  }

  const normalizeText = (text?: string | number) => {
    return String(text ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  }

  const matchesFilter = (menuModules: MenuModules, filter: string) => {
    const normalizedFilter = normalizeText(filter)
    const searchableFields = [
      menuModules.systemType,
      menuModules.module,
      menuModules.menuOption,
      String(menuModules.id),
    ]

    return searchableFields.some((field) =>
      normalizeText(String(field)).includes(normalizedFilter),
    )
  }

  const onClickSearch = () => {
    if (filterText === '') {
      getMenuModules()
      return
    }
  }

  const onClickUpdateMenuModules = (item: MenuModules) => {
    console.log('Item ID:', item._id)
    dispatch(setMenuModulesACtive(item))
    navigate(`/menus-modules/${item._id}`)
  }

  const handleDeleteMenuModules = (item: MenuModules) => {
    if (item._id && item._rev) {
      removeMenuModules(item._id, item._rev)
      getMenuModules()
    }
  }

  useEffect(() => {
    getMenuModules()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rows = filterMenuModules(menuModules, filterText)

  return (
    <>
      {isLoading && <Loading loading />}
      <Container maxWidth="md" sx={{ ml: 0 }}>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <ListIcon />
          <Typography component="h4" variant="h4" sx={{ ml: { sm: 2 } }}>
            Menus y Modulos
          </Typography>
        </Box>
        <Box component="div" sx={{ mt: 7 }}>
          <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, mt: { sm: 2 } }}
          >
            <Grid item xs={6} sm={2}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/menus-modules/new"
                startIcon={<AddIcon />}
                sx={{ mb: 2 }}
              >
                Nuevo
              </Button>
            </Grid>
            <Grid item xs={12} sm={10}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={5}>
                  <SearchInput
                    value={filterText}
                    placeholder="Menu / Modulo"
                    handleInputChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={4} sm={3}>
                  <SearchButton text="Buscar" onClick={() => onClickSearch()} />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, textAlign: 'right' }}
                  >
                    {rows.length} {rows.length === 1 ? 'módulo' : 'módulos'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box component="div" sx={{ p: 1 }}>
            <TableContainer
              key="table-licences"
              sx={{
                minHeight: '120px',
                maxHeight: '540px',
                overflow: 'scroll',
                mb: 5,
              }}
              component={Paper}
            >
              <DataTable
                key="datatable-licences"
                columns={columns}
                isLoading={isLoading}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {!isLoading && rows.length === 0 && (
                  <ItemRow>
                    <TableCellStyled align="center" colSpan={6}>
                      No se encontraron módulos
                    </TableCellStyled>
                  </ItemRow>
                )}
                {rows.map((row) => (
                  <ItemRow key={row._id} hover>
                    <TableCellStyled align="left">{row.module}</TableCellStyled>
                    <TableCellStyled align="center">
                      {row.systemType}
                    </TableCellStyled>
                    <TableCellStyled align="center">{row.id}</TableCellStyled>
                    <TableCellStyled align="center">
                      {row.menuOption}
                    </TableCellStyled>
                    <TableCellStyled align="center">
                      {row.order}
                    </TableCellStyled>
                    <TableCellStyled align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label="Editar"
                          onClick={() => onClickUpdateMenuModules(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleDeleteMenuModules(row)}
                          style={{ fontSize: '1rem' }}
                          color="default"
                        >
                          <DeleteIcon name="trash alternate" />
                        </IconButton>
                      </Tooltip>
                    </TableCellStyled>
                  </ItemRow>
                ))}
              </DataTable>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </>
  )
}