import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SupplyType , SupplieState} from '../../types';


const initialState: SupplieState = {
    supplieActive: null,
    supplies: [],
}

export const supplieSlice = createSlice({
    name: 'Insumos',
    initialState: initialState,
    reducers: {
        setSupplieActive: (state, action: PayloadAction<SupplyType>) => {
            state.supplieActive = action.payload;
        },
        removeSupplieActive: (state) => {
            state.supplieActive = null
        },
        loadSupplies: (state, action: PayloadAction<SupplyType[]>) => {
            state.supplies = action.payload;
        },
        removeSupplies: (state) => {
            state.supplies = [];
        }
    }
});


export const {
    loadSupplies,
    removeSupplies,
    removeSupplieActive,
    setSupplieActive
} = supplieSlice.actions;
