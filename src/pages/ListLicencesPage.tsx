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
DisplaySettings as DisplaySettingsIcon,
} from "@mui/icons-material";
import { useAppDispatch, useForm, useLicences } from "../hooks";
import { setLicencesACtive } from "../store/licences";
import { DataTable, ItemRow, Loading, SearchButton, SearchInput, TableCellStyled } from "../components";
import { ColumnProps, Licences } from "../types";

const columns: ColumnProps[] = [
  { text: "ID", align: "left" },
  { text: "System", align: "center" },
  { text: "Descripcion", align: "center" },
  { text: "Tipo", align: "center" },
  { text: "Max Und", align: "center" },
];

export const ListLicencesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, licences, getLicences, removeLicences} = useLicences();
  const { filterText, handleInputChange } = useForm({ filterText: "" });

  

  const filterLicences = (licences: Licences[], filterText: string): Licences[] => {
    const filteredBySearch = licences.filter(licences => matchesFilter(licences, filterText));
    console.log("Cultivos filtrados por búsqueda:", filteredBySearch);
    return filteredBySearch;
  };
  
  

  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const matchesFilter = (licences: Licences, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      licences.id,
      licences.description,
      licences.system,
      licences.licenceType,
    ];
  
    return searchableFields.some(field => normalizeText(field).includes(normalizedFilter));
  };

  
  // const handleFilter = () => {
  //   setFilteredType(selectedType);
  // };
 
  const onClickSearch = () => {
    if (filterText === "") {
      getLicences();
      return;
    }
  };

//   const handleFilterButtonClick = () => {
//     setShowOptions(!showOptions); // Invertir el estado de showOptions
//   };

//   const handleSelectChange = (value: string) => {
//     console.log("Tipo seleccionado:", value);
//     setSelectedType(value);
//     setShowOptions(false); // Ocultar las opciones cuando se seleccione una
//   };

  const onClickUpdateLicences = (item: Licences) => {
    console.log("Item ID:", item._id);
    dispatch(setLicencesACtive(item));
    navigate(`/licences/${item._id}`);
  };

  const handleDeleteLicences = (item:  Licences) => {
    if (item._id && item._rev) {
      removeLicences(item._id, item._rev);
      getLicences();
    }
  };

  useEffect(() => {
    getLicences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



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
          <DisplaySettingsIcon/>
          <Typography component="h4" variant="h4" sx={{ ml: { sm: 2 } }}>
            Licences
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
                to="/licences/new"
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
                    placeholder="Licences /Descripcion"
                    handleInputChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={4} sm={3}>
                  <SearchButton text="Buscar" onClick={() => onClickSearch()} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box component="div" sx={{ p: 1 }}>
            <TableContainer
              key="table-licences"
              sx={{
                minHeight: "120px",
                maxHeight: "540px",
                overflow: "scroll",
                mb: 5
              }}
              component={Paper}
            >
              <DataTable
                key="datatable-licences"
                columns={columns}
                isLoading={isLoading}
              >
                {filterLicences(licences, filterText).map((row) => (
                  <ItemRow key={row._id} hover>
                    <TableCellStyled align="left">{row.id}</TableCellStyled>
                    <TableCellStyled align="center">{row.system}</TableCellStyled>
                    <TableCellStyled align="center">{row.description}</TableCellStyled>
                    <TableCellStyled align="center">{row.licenceType}</TableCellStyled>
                    <TableCellStyled align="center">{row.maximumUnitAllowed}</TableCellStyled>
                    <TableCellStyled align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label="Editar"
                          onClick={() => onClickUpdateLicences(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleDeleteLicences(row)}
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
