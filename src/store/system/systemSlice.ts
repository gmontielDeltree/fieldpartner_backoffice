import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { System } from '../../types';

export interface SystemState {
    systemActive: System | null;
}

const initialState: SystemState = {
    systemActive: null,
}

export const systemSlice = createSlice({
    name: 'System',
    initialState,
    reducers: {
        setSystemACtive: (state, action: PayloadAction<System>) => {
            state.systemActive = action.payload;
        },
        removeSystemActive: (state) => {
            state.systemActive = null;
        }
    },
})

export const {
    setSystemACtive,
    removeSystemActive } = systemSlice.actions
