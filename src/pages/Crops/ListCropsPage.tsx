import React, { useEffect, useState } from "react";
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
         List,
         ListItem,
         ListItemText,

           
              } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Yard as YardIcon , FilterList} from "@mui/icons-material";
import { useAppDispatch, useCrops, useForm } from "../../hooks";
import { setCropsACtive } from "../../store/crops";
import { DataTable, ItemRow, Loading, SearchButton, SearchInput, TableCellStyled } from "../../components";
import { ColumnProps, Crops } from "../../types";

const columns: ColumnProps[] = [
  { text: "Nombre", align: "left" },
  { text: "Descripcion PT", align: "center" },
  { text: "Descripcion EN", align: "center" },
  { text: "Tipo", align: "center" },
];

export const ListCropsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const [selectedType, setSelectedType] = useState("");
  const [showInactive,] = useState(false);
  const [selectedType, setSelectedType] = React.useState('');
  const { isLoading, crops, getCrops, removeCrops } = useCrops();
  const { filterText, handleInputChange } = useForm({ filterText: "" });
  const [showOptions, setShowOptions] = React.useState(false);

  

  const filterCrops = (crops: Crops[], filterText: string) => {
    const filteredBySearch = crops.filter(crop => matchesFilter(crop, filterText));
    console.log("Cultivos filtrados por búsqueda:", filteredBySearch);
    
    const filteredByType = filteredBySearch.filter(crop => {
      if (selectedType && crop.cropType !== selectedType) return false; // Filtrar por tipo seleccionado
      if (!showInactive && !crop.descriptionES) return false;
      return true;
    });
    console.log("Cultivos filtrados por tipo:", filteredByType);
    
    return filteredByType;
  };
  
  

  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const matchesFilter = (crop: Crops, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      crop.descriptionES,
      crop.descriptionPT,
      crop.descriptionEN,
      crop.cropType
    ];
  
    return searchableFields.some(field => normalizeText(field).includes(normalizedFilter));
  };
  const cropTypes = ['Oleaginosa', 'Legumbres', 'Tubérculo', 'Cereal', 'Gramínea', 'Textil', 'Industrial'];
  
  // const handleFilter = () => {
  //   setFilteredType(selectedType);
  // };
  const onClickSearch = () => {
    if (filterText === "") {
      getCrops();
      return;
    }
  };

  const handleFilterButtonClick = () => {
    setShowOptions(!showOptions); // Invertir el estado de showOptions
  };

  const handleSelectChange = (value: string) => {
    console.log("Tipo seleccionado:", value);
    setSelectedType(value);
    setShowOptions(false); // Ocultar las opciones cuando se seleccione una
  };

  const onClickUpdateCrops = (item: Crops) => {
    console.log("Item ID:", item._id);
    dispatch(setCropsACtive(item));
    navigate(`/crops/${item._id}`);
  };

  const handleDeleteCrops = (item: Crops) => {
    if (item._id && item._rev) {
      removeCrops(item._id, item._rev);
      getCrops();
    }
  };

  useEffect(() => {
    getCrops();
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
          <YardIcon />
          <Typography component="h4" variant="h4" sx={{ ml: { sm: 2 } }}>
            Cultivos
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
                to="/crops/new"
                startIcon={<AddIcon />}
                sx={{ mb: 2 }}
              >
                Nuevo
              </Button>
              <Box display="flex" alignItems="left" sx={{ ml: 2, mt: 2, position: "relative" }}>
              <Tooltip title="Filtrar">
                <IconButton onClick={handleFilterButtonClick}>
                  <FilterList />
                </IconButton>
              </Tooltip>
              {showOptions && (
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
            )}
            </Box>
            </Grid>
            <Grid item xs={12} sm={10}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={5}>
                  <SearchInput
                    value={filterText}
                    placeholder="Cultivo /Descripcion"
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
              key="table-crops"
              sx={{
                minHeight: "120px",
                maxHeight: "540px",
                overflow: "scroll",
                mb: 5
              }}
              component={Paper}
            >
              <DataTable
                key="datatable-crops"
                columns={columns}
                isLoading={isLoading}
              >
                {filterCrops(crops, filterText).map((row) => (
                  <ItemRow key={row._id} hover>
                    <TableCellStyled align="left">{row.descriptionES}</TableCellStyled>
                    <TableCellStyled align="center">{row.descriptionPT}</TableCellStyled>
                    <TableCellStyled align="center">{row.descriptionEN}</TableCellStyled>
                    <TableCellStyled align="center">{row.cropType}</TableCellStyled>
                    <TableCellStyled align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label="Editar"
                          onClick={() => onClickUpdateCrops(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleDeleteCrops(row)}
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
