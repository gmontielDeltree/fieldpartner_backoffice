export interface ColumnProps {
  text: string;
  align: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

export interface Document {
  _id?: string;
  _rev?: string;
}

export interface UserDto extends Document {
  username: string;
  email: string;
  password: string;
  previousPassword?: string;
  newPassword?: string;
  isAdmin?: boolean;
}

/** Shape returned by the back's GET /users (users grouped by account). */
export interface AccountUsersResponse {
  account: { id: string; denomination: string; category: string };
  users: Array<{
    id: string;
    email: string;
    username: string;
    role: string | null;
    state: string;
  }>;
}

/** Payload for POST /users — alineado al CreateUserDto del back (sin campos extra). */
export interface CreateUserPayload {
  email: string;
  username: string;
  password: string;
  language?: string;
  accountId?: string;
  role?: 'USER' | 'ADMIN' | 'GENERAL_ADMIN';
}

/** Flattened row for the system-wide users listing (one user + its account context). */
export interface SystemUser {
  id: string;
  username: string;
  email: string;
  role: string | null;
  state: string;
  accountId: string;
  accountDenomination: string;
  accountCategory: string;
}

export interface Authenticate {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  language: string;
  photoName?: string;
  accountId: string;
  accountName: string;
  countryCode: string;
  currency: string;
}

export interface ResponseAuthLogin {
  user: User;
  auth: Authenticate;
}

export interface AuthChallenge {
  challengeName: 'NEW_PASSWORD_REQUIRED';
  session: string;
  email: string;
}

export interface ResponseAuthRenew {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
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

export interface Category extends Document {
  id?: string;
  categoryType: string;
  descriptionES: string;
  descriptionPT: string;
  descriptionEN: string;
}

export interface SupplieState {
  supplieActive: SupplyType | null;
  supplies: SupplyType[];
}

/** Valores del enum StockSumType del back. */
export type StockSum = 'BOTH' | 'ADD' | 'SUBTRACT';

export const StockSumLabels: Record<StockSum, string> = {
  ADD: 'Suma',
  SUBTRACT: 'Descuenta',
  BOTH: 'Ambas',
};

export interface Movement extends Document {
  id?: string;
  name: string;
  conceptES: string;
  conceptPT: string;
  conceptEN: string;
  description: string;
  typeMovement: string;
  manual: boolean;
  stockSum: StockSum;
}

/** Valores del enum CropType del back, con su rótulo en ES para la UI. */
export const CropTypeLabels: Record<string, string> = {
  TUBER: 'Tubérculo',
  GRAMINEAE: 'Gramínea',
  TEXTILE: 'Textil',
  LEGUME: 'Legumbres',
  OILSEED: 'Oleaginosa',
  INDUSTRIAL: 'Industrial',
  CEREAL: 'Cereal',
};

export interface Crops extends Document {
  id?: string;
  descriptionES: string;
  descriptionPT: string;
  descriptionEN: string;
  cropType: string;
  variety: string;
  prepared: boolean;
  sowing: boolean;
  application: boolean;
  germination: boolean;
  harvest: boolean;
}

export interface System extends Document {
  id: string;
  system: string;
  version: string;
  technicalDetails: string;
}

// export interface SystemState {
//     systemActive: SystemType | null;
//     system: SystemType[];
// }

export interface Licences extends Document {
  id: string;
  description: string;
  licenceType: string;
  systemType: string;
  maximumUnitAllowed: number;
  allowedUsersCount: number;
}

export interface MenuModules extends Document {
  id: number;
  module: Modules; // <- antes: Modules[]
  order: string;
  menuOption: string;
  menuOptionEn: string;
  menuOptionPt: string;
  systemType: string;
  menuType: string;
  details: string;
  full: string;
  light: string;
  icon: string;
  route: string;
  /**
   * Submenú: `id` de otro menú SideBar del mismo módulo que actúa de
   * contenedor (un menú sin ruta). null/undefined = ítem de primer nivel.
   */
  parentId?: number | null;
}

export interface Modules extends Document {
  moduleNameEs: string; // NOMBRE DEL MENU EN ESPAÑOL
  moduleNameEn: string; // NOMBRE DEL MENU EN INGLES
  moduleNamePt: string; // NOMBRE DEL MENU EN PORTUGUES
  icon: string;
  orden: number;
}

export interface TypeDevices extends Document {
  model: string;
  description: string;
  family: string;
  subFamily: string;
  available: DeviceStatus;
}

export enum DeviceStatus {
  Activo = 'Activo',
  Inactivo = 'Inactivo',
}

export enum MenuOptionType {
  SideBar = 'SideBar',
  NavBar = 'NavBar',
  Modal = 'Modal',
}

export interface Country extends Document {
  id?: string;
  code: string;
  descriptionES: string;
  descriptionPT: string;
  descriptionEN: string;
  language: string;
  currency: string;
  taxKey: string;
  taxKeyFormat: string;
}

export interface NavBarProps {
  drawerWidth: number;
  open: boolean;
  handleSideBarOpen: () => void;
}

export interface SideBarProps {
  drawerWidth: number;
  open: boolean;
  handleSideBarClose: () => void;
}

export interface MenuOptions {
  text: string;
  icon: React.ReactNode;
}

export interface TypeVehicle {
  _id: string;
  name: string;
}

export enum TipoCombustible {
  Diesel = 'Diesel',
  Nafta = 'Nafta',
}

export interface EspecificacionTecnica {
  especificacion: string;
  descripcion: string;
}

export interface Vehiculo {
  _id: string;
  tipoVehiculo: string;
  marca: string;
  modelo: string;
  año: string;
  patente: string;
  tara: number;
  neto: number;
  bruto: number;
  tipoCombustible: string;
  capacidadCombustible: number;
  unidadMedida: string;
  conectividad?: string;
  propietario?: string;
  ultimoMantenimiento?: string;
  seguro: string;
  tipoCobertura: string;
  nroPoliza: string;
  seguroFechaInicio: string;
  seguroFechaVencimiento: string;
  ubicacion: string;
  especificacionesTecnicas: RowData[];
}

export interface ColumnProps {
  text: string;
  align: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  field?: string;
  sortable?: boolean;
}

export interface RowData {
  name: string;
  description: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Document {
  _id?: string;
  _rev?: string;
}

export interface ResponseAuthRenew {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserRegister {
  email: string;
  password: string;
  name: string;
}

export interface ErrorResponseAuth {
  code: 'UserNotConfirmedException' | 'NotAuthorizedException' | 'UsernameExistsException';
  message: string;
}

export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated';
  user: User | null;
  errorMessage: string;
  isLoading: boolean;
}

export interface Business extends Document {
  // id?: string;
  nombreCompleto?: string;
  documento?: string;
  telefono: string;
  email: string;
  tipoEntidad: string;
  razonSocial?: string;
  cuit?: string;
  contactoPrincipal?: string;
  contactoSecundario?: string;
  sitioWeb?: string;
  domicilio: string;
  localidad: string;
  cp: string;
  provincia: string;
  pais: string;
  estado?: boolean;
  esEmpleado?: boolean;
  legajo?: string;
  matricula?: string;
  categorias: string[];
}

export interface BusinessState {
  businessActive: Business | null;
  businesses: Business[];
}

export interface SupplieState {
  supplieActive: SupplyType | null;
  supplies: SupplyType[];
}

export interface SupplyType extends Document {
  id?: number;
  code: string;
  descriptionES: string;
  descriptionPT: string;
  descriptionEN: string;
  phytosanitary: boolean;
  isCrop: boolean;
}

export const LaboresItems = ['Preparado', 'Siembra', 'Aplicacion', 'Arrancado', 'Cosecha'];

export const UnidadesDeMedida = [
  'KILOGRAMO',
  'METROS',
  'METRO CUADRADO',
  'METRO CUBICO',
  'LITROS',
  'UNIDAD',
  'PAR',
  'DOCENA',
  'GRAMO',
  'MILIMETRO',
  'MMCUBICO',
  'KILOMETRO',
  'HECTOLITRO',
  'CENTIMETRO',
  'JGO.PQT.MAZO NAIPES',
  'CMCUBICO',
  'TONELADA',
  'HMCUBICO',
  'KMCUBICO',
  'MICROGRAMO',
  'NANOGRAMO',
  'MILIGRAMO',
  'MILILITRO',
  'GRUESA',
  'KG.BRUTO',
  'SEMILLAS',
  'BOLSAS',
  'QUINTAL',
];

export const TypeSupplies = [
  'Varios',
  'Semillas',
  'Cultivo',
  'Fertilizantes',
  'Fitosanitarios',
  'Repuestos',
  'Materiales',
  'Combustible',
];

export const TypeMovements = [
  'Ajustes',
  'Compra',
  'Ventas Varias',
  'Transferencia entre depositos',
  'Prestamos',
];

export interface Lot {
  nro: string;
  location: string;
}

export interface DepositState {
  depositActive: Deposit | null;
  deposits: Deposit[];
}

export interface Deposit extends Document {
  accountId: string;
  description: string;
  owner: string;
  isVirtual: boolean;
  geolocation: string;
  isNegative: boolean;
  address: string;
  zipCode: string;
  locality: string;
  province: string;
  country: string;
  lots: Lot[];
}

export interface ItemZipCode extends Document {
  CP: string;
  locality: string;
  state: string;
}


export interface StockMovement extends Document {
  accountId: string;
  movement: string;
  supplieId: string;
  // supply: string;
  // typeSupply: string;
  depositId: string;
  // ubication: string;
  nroLot: string;
  creationDate: string;
  dueDate: string;
  typeMovement: TypeMovement;
  isIncome: boolean;
  detail: string;
  operationDate: string;
  // unitMeasurement: string;
  amount: number;
  voucher: string;
  currency: string;
  totalValue: number;
  hours: string;
  campaign: number;
  // depositIdDestination?: string
}

export interface StockMovementItem extends StockMovement {
  supplie?: SupplyType;
  deposit?: Deposit;
}

export interface SupplieByLot {
  lot: Lot;
  currentStock: number;
  reservedStock: number;
}

export interface SupplieByDeposits {
  deposit: Deposit;
  supplie?: SupplyType;
  movements?: StockMovement[];
  unitMeasurement: string;
  lot?: Lot;
  dueDate: string;
  currentStock: number;
  reservedStock: number;
  lotsStock?: SupplieByLot[];
}

// #region ENUMS

export enum TipoInsumo {
  CULTIVO = 'CuLtivo',
}

export enum TipoVehiculo {
  Cosechadora = 'Cosechadora',
  Pulverizadora = 'Pulverizadora',
  Tractor = 'Tractor',
  Camioneta = 'Camioneta',
  Tolva = 'Tolva',
  Otros = 'Otros',
}

export enum TipoEntidad {
  FISICA = 'fisica',
  JURIDICA = 'juridica',
}

export enum CountryCode {
  ARGENTINA = 'ARG',
  BRASIL = 'BRA',
  CHILE = 'CHL',
}

export enum CurrencyCode {
  ARG = 'ARS',
  BRA = 'BRL',
  CHL = 'CLP',
  USA = 'USD',
  EURO = 'EUR',
}

export enum TypeMovement {
  Ajustes = 'Ajustes',
  Compra = 'Compra',
  VentasVarias = 'Ventas Varias',
  TransferenciaDeposito = 'Transferencia entre depositos',
  Prestamos = 'Prestamos',
}

export enum DisplayModals {
  SupplieByDeposits = 'SupplieByDeposits',
  SupplieByLots = 'SupplieByLots',
}

export enum EnumClaveTributaria {
  CUIT = 'CUIT',
  CNPJ = 'CNPJ',
  RUC = 'RUC',
}

export enum EnumLicenceType {
  C = 'Campo',
  L = 'Licencia',
  H = 'Hectarea',
}

export enum EnumStatusAccount {
  Activa = 'ACTIVE',
  Inactiva = 'INACTIVE',
  Suspendida = 'SUSPENDED',
  Pendiente = 'PENDING',
  Cancelada = 'CANCELLED',
}

export enum EnumCategoryCod {
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum EnumCategoryAccount {
  A = 'Productores Agropecuarios - Empresas',
  B = 'Ingenieros Agronomos - Cooperativas - Asociaciones',
  C = 'Bancos - Seguros',
}

// #endregion ENUMS
