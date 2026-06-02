import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountDto } from '../../interfaces/account';

export interface AccountState {
    accountActive: AccountDto | null;
}

const initialState: AccountState = {
    accountActive: null,
}

export const accountSlice = createSlice({
    name: 'Accounts',
    initialState,
    reducers: {
        setAccountActive: (state, action: PayloadAction<AccountDto>) => {
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
