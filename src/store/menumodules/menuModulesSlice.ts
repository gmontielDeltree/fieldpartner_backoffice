import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuModules } from '../../types';

export interface MenuModulesState {
    menuModulesActive: MenuModules | null;
}

const initialState: MenuModulesState = {
   menuModulesActive: null,
}

export const menuModulesSlice = createSlice({
    name: 'MenuModules',
    initialState,
    reducers: {
        setMenuModulesACtive: (state, action: PayloadAction<MenuModules>) => {
            state.menuModulesActive = action.payload;
        },
        removeMenuModulesActive: (state) => {
            state.menuModulesActive = null;
        }
    },
})

export const {
    setMenuModulesACtive,
    removeMenuModulesActive } = menuModulesSlice.actions
