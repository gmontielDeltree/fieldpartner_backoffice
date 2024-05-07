import { configureStore } from '@reduxjs/toolkit';

import { uiSlice } from './ui';
import { authSlice } from './auth';
import { customerSlice } from './customer';
import { userSlice } from './user';
import { categorySlice } from './category';
import { movementSlice } from './movements';
import { supplieSlice } from './supplie';
import { cropsSlice } from './crops';
import { countrySlice } from './country';
import { systemSlice } from './system';
import { licencesSlice } from './licences';

export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        auth: authSlice.reducer,
        customer: customerSlice.reducer,
        user: userSlice.reducer,
        category: categorySlice.reducer,
        movement: movementSlice.reducer,
        supplie: supplieSlice.reducer,
        crop: cropsSlice.reducer,
        country: countrySlice.reducer,
        system: systemSlice.reducer,
        licences:licencesSlice.reducer,

    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
