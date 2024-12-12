/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal from 'sweetalert2';
import { useState } from "react";
import {  PublicDevices, PublicDeviceDetalles,DailyTelemetryCard  } from '../interfaces/devices';




export const useDeviceDetalles = () => {
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
   // const [deviceDetalles, setDeviceDetalles] = useState<DeviceDetalles[]>([]);
    const [publicDevices, setPublicDevices] = useState<PublicDevices[]>([]); 
    const [publicDetalles, setPublicDetalles] = useState<PublicDeviceDetalles[]>([]); 
    const [deviceLocations, setDeviceLocations] = useState<DailyTelemetryCard[]>([]);

   
 
    
     
    const loadGoogleMapsScript = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (document.getElementById("google-maps-script")) {
            resolve();
            return;
          }
      
          const script = document.createElement("script");
          script.src =
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&libraries=places&v=beta";
          script.id = "google-maps-script";
          script.defer = true;
      
          script.onload = () => resolve();
          script.onerror = (error) => reject(error);
      
          document.head.appendChild(script);
        });
      };



   
    
    const getPublicDevices = async () => {
        setIsLoading(true);
        const BASE_URL = "https://ab6ed2ec-b5b6-4976-995e-39b79e891d70-bluemix.cloudantnosqldb.appdomain.cloud";
        const DB_NAME = "processed_device_telemetry";
    
        const url = `${BASE_URL}/${DB_NAME}/lista_public_devices%3Aunico?`;
    
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
            },
          });
    
          const responseBody = await response.json();
    
          setIsLoading(false);
    
          if (response.ok && responseBody && Array.isArray(responseBody.public_devices)) {
           
            const devices = responseBody.public_devices.map((deviceId: string) => ({
              _id: deviceId,
              _rev: responseBody._rev, 
              descripcion: "Descripción no disponible", 
              identificacion: "Identificación no disponible",
              fecha_instalacion: "Sin fecha",
              licencias: "No asignadas",
              status: "Desconocido",
            }));
          
            
            setPublicDevices(devices);  
          } else {
            console.error("Estructura de la respuesta no válida:", responseBody);
            Swal.fire("Error", "No se encontraron dispositivos públicos.", "error");
          }
          
        } catch (error) {
          console.error("Error al obtener los datos:", error);
          Swal.fire("Error", "Ocurrió un problema al consultar dispositivos públicos.", "error");
          setError(error as Error);
          setPublicDevices([]);
          setIsLoading(false);
        } finally {
          
          console.log("Fin de getPublicDevices");
        }
    };

    const getPublicDetalles = async (deviceId: string) => {
      //  console.log(`Consultando detalles para el dispositivo ${deviceId}`);
        setIsLoading(true);
    
        const BASE_URL = "https://ab6ed2ec-b5b6-4976-995e-39b79e891d70-bluemix.cloudantnosqldb.appdomain.cloud";
        const DB_NAME = "processed_device_telemetry";
    
        const url = `${BASE_URL}/${DB_NAME}/${deviceId}:detalles`;
    
        try {
           // console.log(`Consultando API para obtener detalles del dispositivo ${deviceId}...`);
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                },
            });
    
            const responseBody = await response.json();
           // console.log(`Respuesta completa de la API para el dispositivo ${deviceId}:`, responseBody);
    
            setIsLoading(false);
    
            if (response.ok && responseBody) {
             //  console.log(`Detalles recibidos para el dispositivo ${deviceId}:`, responseBody);
                setPublicDetalles(prevDetalles => {
                    const existingDeviceIds = new Set(prevDetalles.map(device => device.device_id));
    
                    if (!existingDeviceIds.has(responseBody.device_id)) {
                        return [...prevDetalles, responseBody];
                    }
                 
                    return prevDetalles;
                });
            } else {
                console.error(`Error al obtener los detalles del dispositivo ${deviceId}:`, responseBody);
                Swal.fire("Error", `No se encontraron detalles para el dispositivo ${deviceId}.`, "error");
            }
    
        } catch (error) {
            console.error(`Error al obtener los detalles para el dispositivo ${deviceId}:`, error);
            Swal.fire("Error", `Ocurrió un problema al consultar los detalles del dispositivo ${deviceId}.`, "error");
            setError(error as Error);
        } finally {
            setIsLoading(false);
        }
    };
    

    const getLocationsDevice = async (deviceId: string, date: string) => {
        const BASE_URL = "https://ab6ed2ec-b5b6-4976-995e-39b79e891d70-bluemix.cloudantnosqldb.appdomain.cloud";
        const DB_NAME = "processed_device_telemetry";
    
     
        const url = `${BASE_URL}/${DB_NAME}/${deviceId}:daily:${date}`;
    
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                },
            });
    
            const responseBody = await response.json();
    
            if (response.ok) {
                const data = responseBody.data; 
    
                if (Array.isArray(data) && data.length > 0) {
                   
                  
                    const latitud = data.find((d: any) => d.mag === "latitud")?.value || null;
                    const longitud = data.find((d: any) => d.mag === "longitud")?.value || null;
                    const timestamp = responseBody.ts_last || new Date().getTime();
    
                    if (latitud && longitud) {
                        const newCard = {
                            device_id: deviceId,
                            latitud,
                            longitud,
                            timestamp,
                        };
    

                        setDeviceLocations((prev) => [...prev, newCard]);

                       console.log("Datos encontrados:", newCard);
                       console.log("Datos recibidos:", responseBody);
                       console.log("Datos procesados:", data);
                       console.log("Ubicaciones actuales:", deviceLocations);
                    } else {
                        console.log(`El dispositivo ${deviceId} no tiene datos de latitud/longitud.`);
                     
                    }
                } else {
                   // console.log(`No se encontraron datos relevantes para el dispositivo ${deviceId}.`);
                }
            } else {
                console.error(`Error en la respuesta del servidor para el dispositivo ${deviceId}:`, response.statusText);
            }
        } catch (error) {
            console.error(`Error al consultar los detalles del dispositivo ${deviceId}:`, error);
        }
    };
    
    

        return {
            //* Propiedades
            error,
            isLoading,
            publicDevices,
            publicDetalles,
            deviceLocations,

            //* Métodos
        // getDeviceDetalles,
            getLocationsDevice,
            getPublicDevices,
            getPublicDetalles,
            loadGoogleMapsScript,
        };
};
