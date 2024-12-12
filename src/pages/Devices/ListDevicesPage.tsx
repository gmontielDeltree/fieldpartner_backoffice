import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { 
  Box,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  TableContainer,
  Paper,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  SatelliteAlt as SatelliteAltIcon,
} from "@mui/icons-material";
import { useForm, useDeviceDetalles, useTypeDevices, useAppDispatch, useDevices } from "../../hooks";
import { DataTable, ItemRow, Loading, SearchButton, SearchInput, TableCellStyled } from "../../components";
import { ColumnProps, Devices, DeviceStatus,} from "../../types";
import { ModalPage } from "./ModalPage";
import { EditDevicesPage } from "./EditDevicesPage";
import {  PublicDeviceDetalles } from "../../interfaces/devices";
import { setDevicesACtive } from "../../store/devices";


const initialForm: Devices = {
  idDevice: "",
  model: "",
  description: "",
  identificacion: "",
  installationDate: "",
  licence: "",
  status: DeviceStatus.Inactivo,
  name: "",
  campaña: "",
  account: ""
};

const columns: ColumnProps[] = [
  { text: "ID", align: "left" },
  { text: "Modelo", align: "center" },
  { text: "Descripcion", align: "center" },
  { text: "Identificacion", align: "center" },
  { text: "Fecha Instalacion", align: "center" },
  { text: "Licencias", align: "center"},
  { text: "Status", align: "center"},
];

export const ListDevicesPage: React.FC = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const {isLoading,  getPublicDevices, publicDevices, publicDetalles,deviceLocations, getPublicDetalles, getLocationsDevice } = useDeviceDetalles();
  const {devices, getDevices, setDevices, createDevices} = useDevices();
  const { typeDevices, getTypeDevices } = useTypeDevices();
  const { filterText  } = useForm({ filterText: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
 

  const {
    //model,
    name,
    description,
    status,
    formValues,
   // account,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<Devices>(initialForm);


  useEffect(() => {
    getPublicDevices();
    getTypeDevices();
    getDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (publicDevices.length > 0) {
      publicDevices.forEach(device => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
        getPublicDetalles(device._id); 
        getLocationsDevice(device._id, formattedDate); 
        
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicDevices]);

 
  

  useEffect(() => {
    getDevices();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);








  const buscarDescripcion = () => {
    if (typeDevices && publicDetalles) {
      return publicDetalles.map((detalle) => {
        
        const device = typeDevices.find((device) => device.model === detalle.tipo);
        return device ? device.description : "Sin descripción"; 
      });
    }
    return [];
  };

  const coincidencias = buscarDescripcion();




const filterDeviceDetalles = (publicDetalles: PublicDeviceDetalles[], filterText: string): PublicDeviceDetalles[] => {
  const filteredBySearch = publicDetalles.filter(publicDetalles => matchesFilter(publicDetalles, filterText));
  return filteredBySearch;
};

 

  const matchesFilter = (device: PublicDeviceDetalles, filter: string): boolean => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [device._id, device._rev, device.tipo];
    return searchableFields.some(field => normalizeText(String(field)).includes(normalizedFilter));
  };

  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const onClickSearch = () => {
    if (filterText === "") {
      getPublicDevices();
      return;
    }
  };



  const handleEditDeviceClick = (device_id: string) => {
    console.log("Intentando abrir modal con device_id:", device_id);
    const device = publicDetalles.find((detalle) => detalle.device_id === device_id);
    console.log("Dispositivo encontrado:", device);
  
    if (device) {
      const deviceLocation = deviceLocations.find((location) => location.device_id === device_id);
      console.log("Ubicación encontrada:", deviceLocation);
  
      // Asigna valores de latitud y longitud solo si existen, de lo contrario usa 'undefined'
      const deviceToDispatch: Devices = {
        idDevice: device?._id ?? '',
        model: device?.tipo,
        description: device?.installation_date ?? '',
        identificacion: device?.comentario,
        installationDate: device?.installation_date,
        licence: "",
        status: DeviceStatus.Activo,
        campaña: "",
        name: "",
        latitud: deviceLocation?.latitud ?? undefined,  // Permite latitud vacía
        longitud: deviceLocation?.longitud ?? undefined, // Permite longitud vacía
      };
  
      dispatch(setDevicesACtive(deviceToDispatch));
      setSelectedDeviceId(device.device_id);
      setIsModalOpen(true);
    } else {
      console.log("No se encontró el dispositivo");
    }
  };
  

  
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDeviceId(null); 
  };


  



  useEffect(() => {
    // Verificar si los datos están listos
    if (publicDevices.length > 0 && publicDetalles.length > 0 && deviceLocations.length > 0) {
      const combinedDevices = publicDevices.map((device) => {
        const detail = publicDetalles.find((detalle) => detalle.device_id === device._id);
        const location = deviceLocations.find((loc) => loc.device_id === device._id);
  
        return {
          idDevice: device._id,
          model: detail?.tipo || "No especificado",
          description: detail?.comentario || "Sin descripción",
          identificacion: detail?.nombre || "Sin identificación",
          installationDate: detail?.installation_date || "Desconocida",
          licence: "Sin licencia",
          status: DeviceStatus.Activo,
          name: detail?.nombre || "Sin nombre",
          campaña: "General",
          account: device.public_devices?.join(", ") || "Sin cuenta asociada",
          latitud: location?.latitud,
          longitud: location?.longitud,
        };
      });
      const uniqueDevices = combinedDevices.filter(
        (newDevice) => !devices.some((device) => device.idDevice === newDevice.idDevice)
      );
      if (uniqueDevices.length > 0) {
        setDevices((prevDevices) => [...prevDevices, ...uniqueDevices]);
        uniqueDevices.forEach(createDevices); 
      }
  
      // Marcar los datos como cargados
      setLoading(false);
    }
  }, [publicDevices, publicDetalles, deviceLocations, devices]);
  
  
  
  useEffect(() => {
    console.log("Dispositivos públicos:", publicDevices);
    console.log("Detalles públicos:", publicDetalles);
    console.log("Ubicaciones de dispositivos:", deviceLocations);
  }, [publicDevices, publicDetalles, deviceLocations]);

  

  useEffect(() => {
    console.log("Estado actualizado de devices2:", devices);
  }, [devices]);

  return (
    <>
      {isLoading && <Loading loading />}
      <Container maxWidth="md" sx={{ ml: 1 }}>
        <Box component="div" display="flex" alignItems="center" sx={{ ml: { sm: 2 }, pt: 2 }}>
          <SatelliteAltIcon />
          <Typography component="h4" variant="h4" sx={{ ml: { sm: 2 } }}>
            Dispositivos
          </Typography>
        </Box>
        <Box component="div" sx={{ mt: 7 }}>
          <Grid container spacing={0} direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, mt: { sm: 2 } }}>
            <Grid item xs={6} sm={2}>
              <Button variant="contained" color="primary" component={RouterLink} to="/devices/new" sx={{ mb: 2 }}>
                Nuevo
              </Button>
            </Grid>
            <Grid item xs={12} sm={10}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={5}>
                  <SearchInput value={filterText} placeholder="Dispositivo" handleInputChange={handleInputChange} />
                </Grid>
                <Grid item xs={4} sm={3}>
                  <SearchButton text="Buscar" onClick={onClickSearch} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box component="div" sx={{ p: 1 }}>
            <TableContainer sx={{ minHeight: "120px", maxHeight: "540px", overflow: "scroll", mb: 5 }} component={Paper}>
            <DataTable columns={columns} isLoading={isLoading}>
            {filterDeviceDetalles(publicDetalles, filterText).map((row, index) => { 
                const descripcion = coincidencias[index] || "Sin descripción";
                const profundidad1 = row.detalles_instalacion?.profundidad_1 || "No especificado";
                const profundidad2 = row.detalles_instalacion?.profundidad_2 || "No especificado";
                return (
                  <ItemRow key={row._id} hover>
                    <TableCellStyled align="left">{row.device_id}</TableCellStyled>
                    <TableCellStyled align="center">{row.tipo || "No especificado"}</TableCellStyled>
                    <TableCellStyled align="center">{descripcion}</TableCellStyled> 
                    <TableCellStyled align="center">{row.nombre}</TableCellStyled>
                    <TableCellStyled align="center">{row.installation_date}</TableCellStyled>
                    <TableCellStyled align="center">{profundidad1}</TableCellStyled>
                    <TableCellStyled align="center">{profundidad2}</TableCellStyled>
                    <TableCellStyled align="right">
                      <Tooltip title="Editar">
                      <IconButton aria-label="Editar" onClick={() => handleEditDeviceClick(row.device_id)}>
                        <EditIcon />
                      </IconButton>
                      </Tooltip>
                    </TableCellStyled>
                  </ItemRow>
                );
              })}
              </DataTable>
            </TableContainer>
          </Box>
        </Box>
      </Container>
      <ModalPage isOpen={isModalOpen} onClose={handleCloseModal} deviceId={selectedDeviceId}>
      <EditDevicesPage
      formValues={formValues}
      setFormValues={setFormValues}
      onClose={handleCloseModal}
    />
      </ModalPage>
    </>
  );

  
};


