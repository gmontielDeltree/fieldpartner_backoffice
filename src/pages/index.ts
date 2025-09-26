export * from './LoginPage';
export * from './SettingsPage';
export * from './HomePage';
export * from './User/ListUserPage';
// export * from './Customer/CustomerPage';
export * from './User/UserPage';
export * from './Category/ListCategory';
export * from './Category/CategoryPage';
export * from './Movement/ListMovementPage';
export * from './Movement/MovementPage';
export * from './ListSuppliesPage';
export * from './SuppliesTypePage';
export * from './Crops/ListCropsPage';
export * from './Crops/NewCropsPage';
export * from './Country/LisCountryPage';
export * from './Country/NewCountryPage';
export * from './System/ListSystemPage';
export * from './System/NewSystemPage';
// Módulo de Licencias Legacy (deprecado)
// export * from './Licences/ListLicencesPage';
// export * from './Licences/NewLicencesPage';

// Nuevo módulo de Licencias (español + backend integrado) - Arquitectura organizada
export * from '../licencias/pages';

// Nuevo módulo de Cuentas (español + backend integrado) - Reemplaza Accounts
export * from '../cuentas/pages';

// Nuevo módulo de Países (español + backend integrado) - Reemplaza Country legacy
export * from '../paises/pages';

// Módulos restantes
export * from './MenuModules/ListMenuModulesPage';
export * from './MenuModules/NewMenuModulesPage';

// Módulo Accounts (DEPRECADO - usar módulo Cuentas)
export * from './Accounts/AccountPage';
export * from './Accounts/ListAccountsPage';

export * from './TypeOfDevices/ListTypeDevicesPage';
export * from './TypeOfDevices/NewTypeDevicesPage';

