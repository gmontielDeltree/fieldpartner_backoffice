import { configureStore } from '@reduxjs/toolkit';

import { uiSlice } from './ui';
import { authSlice } from './auth';
import { customerSlice } from './customer';
import { userSlice } from './user';
import { categorySlice } from './category';

export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        auth: authSlice.reducer,
        customer: customerSlice.reducer,
        user: userSlice.reducer,
        category: categorySlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
