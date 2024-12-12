import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import { Devices } from "../types";
import { dbContext } from "../services/pouchdbService";


export const useDevices = () => {

    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [devices, setDevices] = useState<Devices[]>([]);



    const createDevices= async (newDevices: Devices) => {
        setIsLoading(true);
        try {
            console.log("Iniciando creacion de dispositivo: ", newDevices )
            const response = await dbContext.devices.post(newDevices);
            console.log("Respuesta de creación:", response);

            setIsLoading(false);
            if (response.ok)
                Swal.fire('Dispocitivo', 'Nuevo Dispocitivo  agregado.', 'success');
            else
                Swal.fire('Cliente', 'Verificar campos obligatorios.', 'error');

            navigate('/devices');
        } catch (error) {
            console.log(error)
            console.error("Error al actualizar devices:", error);
            Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const getDevices = async () => {
        setIsLoading(true);
        try {
          const response = await dbContext.devices.allDocs({ include_docs: true });
    
          setIsLoading(false);
    
          if (response.rows.length) {
            const documents: Devices[] = response.rows.map(row => row.doc as Devices);
            setDevices(documents);
          }
          else
            setDevices([]);
    
        } catch (error) {
          console.log(error)
          Swal.fire('Error', 'No se encontraron dispositivos.', 'error');
          setIsLoading(false);
          if (error) setError(error);
        }
      }

    const updateDevices = async (updateDevices:Devices) => {
        setIsLoading(true);

        try {
            const response = await dbContext.devices.put(updateDevices);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Dispositivo', 'Actualizado.', 'success');

            navigate('/devices');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron licenes.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const removeDevices = async (devicesId: string, revDevices : string) => {
        setIsLoading(true);

        try {
            const response = await dbContext.devices.remove(devicesId, revDevices);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Dispositivo', 'Eliminado.', 'success');

            navigate('/devices');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron Dispositivo.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }



    return {
        //* Propiedades
        error,
        isLoading,
        devices,

        //* Métodos
        createDevices,
        getDevices,
        setDevices,
        updateDevices,
        removeDevices,
    };
};