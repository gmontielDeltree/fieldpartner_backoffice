import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import { TypeDevices } from "../types";
import { dbContext } from "../services/pouchdbService";


export const useTypeDevices = () => {

    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [typeDevices, setTypeDevices] = useState<TypeDevices[]>([]);



    const createTypeDevices= async (newTypeDevices: TypeDevices) => {
        setIsLoading(true);
        try {
            const response = await dbContext.typeDevices.post(newTypeDevices);

            setIsLoading(false);
            if (response.ok)
                Swal.fire('Tipo Dispocitivo', 'Nuevo Tipo de Dispocitivo  agregado.', 'success');
            else
                Swal.fire('Cliente', 'Verificar campos obligatorios.', 'error');

            navigate('/type-of-devices');
        } catch (error) {
            console.log(error)
            Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const getTypeDevices = async () => {
        setIsLoading(true);
        try {
          const response = await dbContext.typeDevices.allDocs({ include_docs: true });
    
          setIsLoading(false);
    
          if (response.rows.length) {
            const documents: TypeDevices[] = response.rows.map(row => row.doc as TypeDevices);
            setTypeDevices(documents);
          }
          else
            setTypeDevices([]);
    
        } catch (error) {
          console.log(error)
          Swal.fire('Error', 'No se encontraron dispositivos.', 'error');
          setIsLoading(false);
          if (error) setError(error);
        }
      }

    const updateTypeDevices = async (updateTypeDevices:TypeDevices) => {
        setIsLoading(true);

        try {
            const response = await dbContext.typeDevices.put(updateTypeDevices);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Tipos Dispositivo', 'Actualizado.', 'success');

            navigate('/type-of-devices');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron licenes.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const removeTypeDevices = async (typeDevicesId: string, revTypeDevices : string) => {
        setIsLoading(true);

        try {
            const response = await dbContext.typeDevices.remove(typeDevicesId, revTypeDevices);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Tipos Dispositivo', 'Eliminado.', 'success');

            navigate('/type-of-devices');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron Tipos de Dispositivo.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }



    return {
        //* Propiedades
        error,
        isLoading,
        typeDevices,

        //* Métodos
        createTypeDevices,
        getTypeDevices,
        setTypeDevices,
        updateTypeDevices,
        removeTypeDevices,
    };
};