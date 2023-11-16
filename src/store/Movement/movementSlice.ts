import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movement } from '../../types';

export interface MovementState {
    movementActive: Movement | null;
}

const initialState: MovementState = {
    movementActive: null,
}


export const movementSlice = createSlice({
    name: 'Movimientos',
    initialState,
    reducers: {
        setMovementACtive: (state, action: PayloadAction<Movement>) => {
            state.movementActive = action.payload;
        },
        removeMovementActive: (state) => {
            state.movementActive = null;
        }
    },
})

export const {
    setMovementACtive,
    removeMovementActive } = movementSlice.actions