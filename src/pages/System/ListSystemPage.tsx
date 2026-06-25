import React, { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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
} from "@mui/material";
import {
Add as AddIcon,
Edit as EditIcon,
Delete as DeleteIcon,
Computer as ComputerIcon,
} from "@mui/icons-material";
import { useAppDispatch, useForm, useSystem } from "../../hooks";
import { setSystemACtive } from "../../store/system";
import { DataTable, ItemRow, Loading, SearchButton, SearchInput, TableCellStyled } from "../../components";
import { ColumnProps, System } from "../../types";

const columns: ColumnProps[] = [
  { text: "ID", align: "left", field: "id", sortable: true },
  { text: "System", align: "center", field: "system", sortable: true },
  { text: "Version", align: "center", field: "version", sortable: true },
];

export const ListSystemPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, system, getSystem, removeSystem} = useSystem();
  const { filterText, handleInputChange } = useForm({ filterText: "" });

  const [sortField, setSortField] = React.useState<keyof System>("system");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field as keyof System);
      setSortDirection("asc");
    }
  };

  const compareValues = (a: System, b: System, field: keyof System) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const filterSystems = (list: System[], filterText: string): System[] => {
    const filteredBySearch = list.filter(system => matchesFilter(system, filterText));
    return [...filteredBySearch].sort((a, b) => {
      const primary = compareValues(a, b, sortField);
      const result = sortDirection === "asc" ? primary : -primary;
      // Desempate: dentro de un mismo valor, ordenar por ID
      if (result === 0 && sortField !== "id") {
        return compareValues(a, b, "id");
      }
      return result;
    });
  };

  const normalizeText = (text?: string | number) => {
    return String(text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const matchesFilter = (system: System, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      system.id,
      system.version,
      system.system,
    ];
  
    return searchableFields.some(field => normalizeText(field).includes(normalizedFilter));
  };

  const onClickSearch = () => {
    if (filterText === "") {
      getSystem();
      return;
    }
  };

  const onClickUpdateSystem = (item: System) => {
    dispatch(setSystemACtive(item));
    navigate(`/system/${item._id}`);
  };

  const handleDeleteSystem = (item:  System) => {
    if (item._id && item._rev) {
      removeSystem(item._id, item._rev);
      getSystem();
    }
  };

  useEffect(() => {
    getSystem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const rows = filterSystems(system, filterText);

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
          <ComputerIcon/>
          <Typography component="h4" variant="h4" sx={{ ml: { sm: 2 } }}>
            System
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
                to="/system/new"
                startIcon={<AddIcon />}
                sx={{ mb: 2 }}
              >
                Nuevo
              </Button>
              <Box display="flex" alignItems="left" sx={{ ml: 2, mt: 2, position: "relative" }}>
              {/* <Tooltip title="Filtrar">
                <IconButton onClick={handleFilterButtonClick}>
                  <FilterList />
                </IconButton>
              </Tooltip> */}
              {/* {showOptions && (
              <Paper elevation={3} sx={{ position: "absolute", top: 40, zIndex: 1, backgroundColor: "white" }}>
                <List>
                  <ListItem button onClick={() => handleSelectChange("")}>
                    <ListItemText primary="Todos" />
                  </ListItem>
                  {cropTypes.map((type, index) => (
                    <ListItem button key={index} onClick={() => handleSelectChange(type)}>
                      <ListItemText primary={type} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )} */}
            </Box>
            </Grid>
            <Grid item xs={12} sm={10}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={5}>
                  <SearchInput
                    value={filterText}
                    placeholder="System /Descripcion"
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
                    sx={{ mt: 1, textAlign: "right" }}
                  >
                    {rows.length} {rows.length === 1 ? "sistema" : "sistemas"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box component="div" sx={{ p: 1 }}>
            <TableContainer
              key="table-system"
              sx={{
                minHeight: "120px",
                maxHeight: "540px",
                overflow: "scroll",
                mb: 5
              }}
              component={Paper}
            >
              <DataTable
                key="datatable-system"
                columns={columns}
                isLoading={isLoading}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {!isLoading && rows.length === 0 && (
                  <ItemRow>
                    <TableCellStyled align="center" colSpan={4}>
                      No se encontraron sistemas
                    </TableCellStyled>
                  </ItemRow>
                )}
                {rows.map((row) => (
                  <ItemRow key={row._id} hover>
                    <TableCellStyled align="left">{row.id}</TableCellStyled>
                    <TableCellStyled align="center">{row.system}</TableCellStyled>
                    <TableCellStyled align="center">{row.version}</TableCellStyled>
                    <TableCellStyled align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label="Editar"
                          onClick={() => onClickUpdateSystem(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleDeleteSystem(row)}
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
  );
  
  
  
};
