import { configureStore } from '@reduxjs/toolkit';

import { uiSlice } from './ui';
import { authSlice } from './auth';
import { accountSlice } from './account';
import { userSlice } from './user';
import { categorySlice } from './category';
import { movementSlice } from './movements';
import { supplieSlice } from './supplie';
import { cropsSlice } from './crops';
import { countrySlice } from './country';
import { systemSlice } from './system';
import { licencesSlice } from './licences';
import { licenciasReducer } from './licencias'; // Nuevo módulo de licencias
import { menuModulesSlice } from './menumodules/menuModulesSlice';
import { typeDevicesSlice } from './typedevices';

export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        auth: authSlice.reducer,
        account: accountSlice.reducer,
        user: userSlice.reducer,
        category: categorySlice.reducer,
        movement: movementSlice.reducer,
        supplie: supplieSlice.reducer,
        crop: cropsSlice.reducer,
        country: countrySlice.reducer,
        system: systemSlice.reducer,
        licences:licencesSlice.reducer, // Legacy (deprecado)
        licencias: licenciasReducer, // Nuevo módulo integrado con backend
        menuModules:menuModulesSlice.reducer,
        typeDevices:typeDevicesSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
