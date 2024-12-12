import React, { useEffect } from "react";
import { Autocomplete, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useForm, useDevices,useDeviceDetalles } from "../../hooks";
import { DeviceStatus, Devices } from "../../types";
import { useAccount } from "../../hooks";
import { Account } from "../../interfaces/account";
import { DeviceMap } from "./DeviceMap";
//import { PublicDeviceDetalles } from "../../interfaces/devices";








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



interface EditDevicesPageProps {
  formValues: Devices;
  setFormValues: (values: Devices) => void;
  onClose: () => void;
}


 export const EditDevicesPage: React.FC<EditDevicesPageProps> = ({ onClose, deviceId}) => {
  const { devices, createDevices, getDevices  } = useDevices();
  const { publicDevices, publicDetalles,deviceLocations, getLocationsDevice,getPublicDevices  } = useDeviceDetalles();
  const {accounts, } = useAccount();

  


  
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
    
   console.log("Llamada2: ",getPublicDevices() );
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    console.log("Device Locations: ", deviceLocations);  // Asegúrate de que tenga latitud y longitud
  }, [deviceLocations]);

  useEffect(() => {
    if (publicDetalles.length > 0) {
      console.log(publicDetalles);
    }
  }, [publicDetalles]);

  

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  const handleAddTypeDevices = () => {
    createDevices(formValues);
    reset();
    onClose(); 
  };

  const handleGetAllSensors = async () => {
    const allSensorsData = await getPublicDevices();
    console.log("Todos los datos de sensores:", allSensorsData);
};

const handleAccountSelect = (
  _: React.ChangeEvent<object>,
  newValue: Account | null
) => {
  if (newValue) {
    setFormValues({ ...formValues, account: newValue.accountId }); // Usa una propiedad válida
  } else {
    setFormValues({ ...formValues, account: '' });
  }
};



const accountSeleccionado = accounts.find((acc) => acc.accountId === formValues.account);


useEffect(() => {
  if (publicDevices.length > 0) {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`; // Formato YYYYMMDD

    publicDevices.forEach(device => {
      getLocationsDevice(device._id, formattedDate); 
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [publicDevices]);

useEffect(() => {
  console.log("Device Locations: ", deviceLocations); 
}, [deviceLocations]);

useEffect(() => {
  if (deviceId) {
    setFormValues((prevValues) => ({
      ...prevValues,
      id: deviceId, // Asocia el deviceId al formulario
    }));
  }
}, [deviceId, setFormValues]);
const deviceLocation = deviceLocations.length > 0 ? deviceLocations[0] : null;

useEffect(() => {
  if (deviceId) {
    // Completa automáticamente los datos al cargar
    const device = publicDetalles.find((d) => d._id === deviceId);
    if (device) {
      setFormValues((prev) => ({
        ...prev,
        idDevice: device.device_id || "",
        model: device.tipo || "",
        description: device.comentario || "",
        installationDate: device.installation_date || "",
      }));
    }
  }
}, [deviceId, publicDetalles, setFormValues]);

useEffect(() => {
  if (deviceId) {
    // Completa automáticamente los datos al cargar
    const device = devices.find((d) => d._id === deviceId);
    if (device) {
      setFormValues((prev) => ({
        ...prev,
        description: device.description || "",
      }));
    }
  }
}, [deviceId, devices, setFormValues]);

return (
  <Box sx={{ p: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Button color="error" onClick={handleGetAllSensors} fullWidth>
          Imprmir datos
        </Button>
      </Grid>
      <Grid item xs={12} sm={8}>
      <Box
    >
          <DeviceMap
            latitude={deviceLocation?.latitud ?? null}  
            longitude={deviceLocation?.longitud ?? null}  
            address={deviceLocation?.device_id}
          />

    </Box>
      </Grid>
    </Grid>


    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={12}>
      <TextField
          label="Modelo"
          variant="outlined"
          name="id"
          value={formValues.model} // Vincula con el estado del formulario
          onChange={handleInputChange}
          fullWidth
          InputProps={{
            readOnly: true, // Hace que el campo sea de solo lectura
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Descripcion"
          variant="outlined"
          name="description"
          value={description}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Nombre"
          variant="outlined"
          name="name"
          value={name}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
           // onChange={handleSwitchChange}
            label="Status"
            displayEmpty
            inputProps={{ 'aria-label': 'Status' }}
          >
            <MenuItem value={"Activo"}>Activo</MenuItem>
            <MenuItem value={"Inactivo"}>Inactivo</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <Autocomplete
            options={accounts}
            getOptionLabel={(accounts) => accounts.fantasyName || ''}
            fullWidth
            renderInput={(params) => <TextField {...params} label="System" />}
            value={accountSeleccionado || null}
            onChange={handleAccountSelect}
          />
        </FormControl>
      </Grid>
      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: { sm: 5 } }}>
        <Grid item xs={12} sm={3}>
          <Button onClick={handleAddTypeDevices} fullWidth variant="contained" color="primary">
            Guardar
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button onClick={onClose} fullWidth variant="outlined">
            Cancelar
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </Box>
);

};


