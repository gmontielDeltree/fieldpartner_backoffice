import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Country } from '../../types';

export interface CountryState {
    countryActive: Country | null;
}

const initialState: CountryState = {
    countryActive: null,
}

export const countrySlice = createSlice({
    name: 'Country',
    initialState,
    reducers: {
        setCountryACtive: (state, action: PayloadAction<Country>) => {
            state.countryActive = action.payload;
        },
        removeCountryActive: (state) => {
            state.countryActive = null;
        }
    },
})

export const {
    setCountryACtive,
    removeCountryActive } = countrySlice.actions
