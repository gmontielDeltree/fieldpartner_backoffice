import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Crops } from '../../types';

export interface CropsState {
    cropsActive: Crops | null;
}

const initialState: CropsState = {
    cropsActive: null,
}

export const cropsSlice = createSlice({
    name: 'Crops',
    initialState,
    reducers: {
        setCropsACtive: (state, action: PayloadAction<Crops>) => {
            state.cropsActive = action.payload;
        },
        removeCropsActive: (state) => {
            state.cropsActive = null;
        }
    },
})

export const {
    setCropsACtive,
    removeCropsActive } = cropsSlice.actions
