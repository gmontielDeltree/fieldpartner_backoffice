
export interface ColumnProps {
    text: string;
    align: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

export interface User {
    id?: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    previousPassword?: string;
    newPassword?: string;
}

export interface Account {
    id?: string,
    descripcion: string,
    tipoLicencia: string,
    inicioLicencia: string,
    finLicencia: string,
    estado?: string,
    lenguaje: string
}

export interface Customer {
    id?: string;
    nombreCompleto?: string;
    documento?: string;
    telefono: string;
    email: string;
    tipoEntidad: string;
    razonSocial?: string;
    account: Account;
    cuit?: string;
    contactoPrincipal?: string;
    contactoSecundario?: string;
    sitioWeb?: string;
    domicilio: string;
    localidad: string;
    cp: string;
    provincia: string;
    pais: string;
    usuario: User;
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