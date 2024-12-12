import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Devices } from '../../types';

export interface DevicesState {
    devicesActive: Devices | null;
}

const initialState: DevicesState = {
    devicesActive: null,
}

export const devicesSlice = createSlice({
    name: 'Devices',
    initialState,
    reducers: {
        setDevicesACtive: (state, action: PayloadAction<Devices>) => {
            state.devicesActive = action.payload;
        },
        removeDevicesActive: (state) => {
            state.devicesActive = null;
        }
    },
})

export const {
    setDevicesACtive,
    removeDevicesActive } = devicesSlice.actions
