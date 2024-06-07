import React, { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Box,
   Button,
    Container,
     Grid,
      IconButton,
       Tooltip,
       Typography,
        TableContainer,
         Paper,
              } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Public as PublicIcon } from "@mui/icons-material";
import { useAppDispatch, useCountry, useForm } from "../../hooks";
import { setCountryACtive } from "../../store/country";
import { DataTable, ItemRow, Loading, SearchButton, SearchInput, TableCellStyled } from "../../components";
import { ColumnProps, Country } from "../../types";

const columns: ColumnProps[] = [
  { text: "Codigo", align: "left" },
  { text: "Descripcion ES", align: "center" },
  { text: "Descripcion PT", align: "center" },
  { text: "Descripcion EN", align: "center" },
];

export const ListCountryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const [selectedType, setSelectedType] = useState("");
//   const [showInactive,] = useState(false);
//   const [selectedType, setSelectedType] = React.useState('');
  const { isLoading, country, getCountry, removeCountry } = useCountry();
  const { filterText, handleInputChange } = useForm({ filterText: "" });
//   const [showOptions, setShowOptions] = React.useState(false);

  

  const filterCountry = (country: Country[], filterText: string): Country[] => {
    const filteredBySearch = country.filter(country => matchesFilter(country, filterText));
    console.log("Cultivos filtrados por búsqueda:", filteredBySearch);
    return filteredBySearch;
  };
  
  

  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const matchesFilter = (country: Country, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      country.descriptionES,
      country.descriptionPT,
      country.descriptionEN,
      country.code
    ];
  
    return searchableFields.some(field => normalizeText(field).includes(normalizedFilter));
  };

  
  // const handleFilter = () => {
  //   setFilteredType(selectedType);
  // };
  const onClickSearch = () => {
    if (filterText === "") {
      getCountry();
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

  const onClickUpdateCountry = (item: Country) => {
    console.log("Item ID:", item._id);
    dispatch(setCountryACtive(item));
    navigate(`/country/${item._id}`);
  };

  const handleDeleteCountry = (item:  Country) => {
    if (item._id && item._rev) {
      removeCountry(item._id, item._rev);
      getCountry();
    }
  };

  useEffect(() => {
    getCountry();
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
          <PublicIcon/>
          <Typography component="h4" variant="h4" sx={{ ml: { sm: 2 } }}>
            Paises
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
                to="/country/new"
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
                    placeholder="Pais /Descripcion"
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
              key="table-country"
              sx={{
                minHeight: "120px",
                maxHeight: "540px",
                overflow: "scroll",
                mb: 5
              }}
              component={Paper}
            >
              <DataTable
                key="datatable-country"
                columns={columns}
                isLoading={isLoading}
              >
                {filterCountry(country, filterText).map((row) => (
                  <ItemRow key={row._id} hover>
                    <TableCellStyled align="left">{row.code}</TableCellStyled>
                    <TableCellStyled align="center">{row.descriptionES}</TableCellStyled>
                    <TableCellStyled align="center">{row.descriptionPT}</TableCellStyled>
                    <TableCellStyled align="center">{row.descriptionEN}</TableCellStyled>
                    <TableCellStyled align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label="Editar"
                          onClick={() => onClickUpdateCountry(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleDeleteCountry(row)}
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
