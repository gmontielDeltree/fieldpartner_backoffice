import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '../../interfaces/account';

export interface AccountState {
    accountActive: Account | null;
}

const initialState: AccountState = {
    accountActive: null,
}

export const accountSlice = createSlice({
    name: 'Accounts',
    initialState,
    reducers: {
        setAccountActive: (state, action: PayloadAction<Account>) => {
            state.accountActive = action.payload;
        },
        removeAccountActive: (state) => {
            state.accountActive = null;
        }
    },
})

export const {
    setAccountActive,
    removeAccountActive } = accountSlice.actions
