
export interface Usuario {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
}

export interface Customer {
    nombreCompleto?: string;
    documento?: string;
    telefono: string;
    email: string;
    tipoEntidad: string;
    razonSocial?: string;
    tipoLicencia: string;
    descripcion?: string;
    inicioLicencia: string;
    finLicencia: string;
    lenguaje: string;
    cuit?: string;
    contactoPrincipal?: string;
    contactoSecundario?: string;
    sitioWeb?: string;
    domicilio: string;
    localidad: string;
    cp: string;
    provincia: string;
    pais: string;
    usuario: Usuario;
}


export enum TipoEntidad {
    FISICA = 'fisica',
    JURIDICA = 'juridica',
}

export enum TipoLicencia {
    LFPC05 = "LFPC05",
    LFPC10 = "LFPC10",
    LFPCPLUS = "LFPCPLUS",
    LFPINT = "LFPINT",
    LFPDEM = "LFPDEM",
    LFPFREE = "LFPFREE",
}