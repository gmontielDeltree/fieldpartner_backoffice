import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
Box,
//Button,
Container,
Grid,
IconButton,
Tooltip,
Typography,
TableContainer,
Paper,
} from "@mui/material";
import {
//Add as AddIcon,
Edit as EditIcon,
//Delete as DeleteIcon,
SatelliteAlt as SatelliteAltIcon,
} from "@mui/icons-material";
import { useAppDispatch, useForm, useTypeDevices } from "../../hooks";
import { setTypeDevicesACtive } from "../../store/typedevices";
import { DataTable, ItemRow, Loading, SearchButton, SearchInput, TableCellStyled } from "../../components";
import { ColumnProps, TypeDevices } from "../../types";

const columns: ColumnProps[] = [
  { text: "Familia", align: "left" },
  { text: "Subfamilia", align: "center" },
  { text: "Modelo", align: "center" },
  { text: "Status", align: "center" },
];

export const ListDevicesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, typeDevices, getTypeDevices, } = useTypeDevices();
  const { filterText, handleInputChange } = useForm({ filterText: "" });

  

  const filterDevices = (typeDevices: TypeDevices[], filterText: string): TypeDevices[] => {
    const filteredBySearch = typeDevices.filter(typeDevices => matchesFilter(typeDevices, filterText));
    return filteredBySearch;
  };
  
  

  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const matchesFilter = (typeDevices: TypeDevices, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      typeDevices.model,
      typeDevices.description,
      typeDevices.family,
      typeDevices.subFamily,
      typeDevices.available,
    ];
  
    return searchableFields.some(field => normalizeText(String(field)).includes(normalizedFilter));
  };
  
  
 
  const onClickSearch = () => {
    if (filterText === "") {
      getTypeDevices();
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

  const onClickUpdateTypeDevices = (item: TypeDevices) => {
    console.log("Item ID:", item._id);
    dispatch(setTypeDevicesACtive(item));
    navigate(`/type-of-devices/${item._id}`);
  };

  // const handleDeleteTypeDevices = (item:  TypeDevices) => {
  //   if (item._id && item._rev) {
  //       removeTypeDevices(item._id, item._rev);
  //     getTypeDevices();
  //   }
  // };

  useEffect(() => {
    getTypeDevices();
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
          < SatelliteAltIcon/>
          <Typography component="h4" variant="h4" sx={{ ml: { sm: 2 } }}>
            Dispositivos
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
              {/* <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/type-of-devices/new"
                startIcon={<AddIcon />}
                sx={{ mb: 2 }}
              >
                Nuevo
              </Button>   */}
            </Grid>
            <Grid item xs={12} sm={10}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={5}>
                  <SearchInput
                    value={filterText}
                    placeholder="Tipo / Dispositivo"
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
                key="datatable-devices"
                columns={columns}
                isLoading={isLoading}
              >
                {filterDevices(typeDevices, filterText).map((row) => (
                  <ItemRow key={row._id} hover> 
                  <TableCellStyled align="left">{row.family}</TableCellStyled>
                    <TableCellStyled align="center">{row.subFamily}</TableCellStyled>
                    <TableCellStyled align="center">{row.model}</TableCellStyled>
                    <TableCellStyled align="center">{row.available}</TableCellStyled>
                    <TableCellStyled align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          aria-label="Editar"
                          onClick={() => onClickUpdateTypeDevices(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleDeleteTypeDevices(row)}
                          style={{ fontSize: '1rem' }}
                          color="default"
                        >
                          <DeleteIcon name="trash alternate" />
                        </IconButton>
                      </Tooltip> */}
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
