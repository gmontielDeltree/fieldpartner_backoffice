
interface PublicDeviceDetalles {
  _id: string;
  _rev: string;
  device_id: string;
  nombre: string;
  fotos: string[]; 
  tipo?: string;
  installation_date: string;
  comentario: string;
  detalles_instalacion: {
    profundidad_1: number;
    profundidad_2: number;
  };
  device_name: string;
}



interface DailyTelemetryCard {
  device_id: string;
  latitud: number;
  longitud: number;
  timestamp: string;
}

interface DataPoints {
  mag: string;
  value: number;
  unit: string;
  ts?: number;
}


interface PublicDevices {
  _id: string;
  _rev: string;
  public_devices: string[];
}


interface DeviceRow {
  doc: {
    device_name: string;
    _id: string;
    _rev: string;
  };
}



export type { 
  DailyTelemetryCard, 
  DataPoints, 
  PublicDevices, 
  DeviceRow, 
  PublicDeviceDetalles, 
};
