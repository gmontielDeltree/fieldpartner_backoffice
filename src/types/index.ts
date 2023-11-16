
export interface ColumnProps {
    text: string;
    align: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

export interface UserDto {
    id?: string;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    previousPassword?: string;
    newPassword?: string;
    isAdmin?: boolean;
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
    usuario: UserDto;
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

export interface Authenticate {
    accessToken: string;
    refreshToken: string;
    expiration: number;
}

export interface User {
    username: string;
    isAdmin: boolean;
}

export interface ResponseAuthLogin {
    username: string;
    isAdmin: boolean;
    auth: Authenticate;
}

export interface ResponseAuthRenew {
    accessToken: string;
    refreshToken: string;
}

export interface UserRegister {
    email: string;
    password: string;
    name: string;
}

export interface UserLogin {
    email: string;
    password: string;
}


export interface Document {
    _id?: string;
    _rev?: string;
}

export interface Category extends Document {
    name: string;
    description: string;
}
export interface Movement extends Document {
    manual: boolean;
    stockOperation: string;
    name: string;
    description: string;
    typeMovement: string;
}