import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '../../types';

export interface CustomerState {
    customerActive: Customer | null;
}

const initialState: CustomerState = {
    customerActive: null,
}

export const customerSlice = createSlice({
    name: 'Customer',
    initialState,
    reducers: {
        setCustomerActive: (state, action: PayloadAction<Customer>) => {
            state.customerActive = action.payload;
        },
        removeCustomerActive: (state) => {
            state.customerActive = null;
        }
    },
})

export const {
    setCustomerActive,
    removeCustomerActive } = customerSlice.actions
