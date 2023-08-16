import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

export interface UserState {
    userActive: User | null;
}

const initialState: UserState = {
    userActive: null,
}

export const userSlice = createSlice({
    name: 'Users',
    initialState,
    reducers: {
        setUserActive: (state, action: PayloadAction<User>) => {
            state.userActive = action.payload;
        },
        removeUserActive: (state) => {
            state.userActive = null;
        }
    },
})

export const {
    setUserActive,
    removeUserActive } = userSlice.actions
