import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Licences } from '../../types';

export interface LicencesState {
    licencesActive: Licences | null;
}

const initialState: LicencesState = {
    licencesActive: null,
}

export const licencesSlice = createSlice({
    name: 'Licences',
    initialState,
    reducers: {
        setLicencesACtive: (state, action: PayloadAction<Licences>) => {
            state.licencesActive = action.payload;
        },
        removeLicencesActive: (state) => {
            state.licencesActive = null;
        }
    },
})

export const {
    setLicencesACtive,
    removeLicencesActive } = licencesSlice.actions
