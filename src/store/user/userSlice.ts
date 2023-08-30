import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDto } from '../../types';

export interface UserState {
    userActive: UserDto | null;
}

const initialState: UserState = {
    userActive: null,
}

export const userSlice = createSlice({
    name: 'Users',
    initialState,
    reducers: {
        setUserActive: (state, action: PayloadAction<UserDto>) => {
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
