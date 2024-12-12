interface SensorConfig {
    sensores: string[];
    sensores_reales: string[];
    ubicacion: string; 
  }
  
  export const Modelos: Record<string, SensorConfig> = {
    "WMM-05S": {
      sensores: ["temperatura", "humedad", "presion", "viento_velocidad", "viento_direccion", "sensacion_termica", "punto_de_rocio", "inversion_termica_chacabuco_baja", "stress_termico"],
      sensores_reales: ["temperatura", "humedad", "presion", "velocidad", "direccion"],
      ubicacion: "Chacabuco Altura",
    },
    "LMM-03S": {
      sensores: ["temperatura", "humedad", "presion", "rssi", "punto_de_rocio", "stress_termico"],
      sensores_reales: ["temperatura", "humedad", "presion"],
      ubicacion: "Chacabuco Baja",
    },
    "LSMH01-1": {
      sensores: ["temperatura", "humedad", "humedad_suelo"],
      sensores_reales: ["temperatura", "humedad", "humedad_suelo"],
      ubicacion: "Santiago",
    },
    "GWMM05": {
      sensores: ["temperatura", "humedad", "presion", "viento_velocidad", "viento_direccion", "pluviometro", "radiacion_solar", "sensacion_termica", "punto_de_rocio", "stress_termico"],
      sensores_reales: ["temperatura", "humedad", "presion", "viento_velocidad", "viento_direccion", "pluviometro", "radiacion_solar"],
      ubicacion: "GW Santiago",
    },
    "AGTRACK01": {
      sensores: ["rssi"],
      sensores_reales: [],
      ubicacion: "GW Santiago",
    },
  };
  