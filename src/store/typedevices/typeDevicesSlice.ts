import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {TypeDevices } from '../../types';

export interface TypeDevicesState {
    typeDevicesActive: TypeDevices | null;
}

const initialState: TypeDevicesState = {
    typeDevicesActive: null,
}

export const typeDevicesSlice = createSlice({
    name: 'TypeDevices',
    initialState,
    reducers: {
        setTypeDevicesACtive: (state, action: PayloadAction<TypeDevices>) => {
            state.typeDevicesActive = action.payload;
        },
        removeTypeDevicesActive: (state) => {
            state.typeDevicesActive = null;
        }
    },
})

export const {
    setTypeDevicesACtive,
    removeTypeDevicesActive } = typeDevicesSlice.actions
