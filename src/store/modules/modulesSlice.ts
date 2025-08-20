import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Modules } from '../../types';

export interface ModulesState {
  modulesActive: Modules | null;
}

const initialState: ModulesState = {
  modulesActive: null,
};

export const modulesSlice = createSlice({
  name: 'Modules',
  initialState,
  reducers: {
    setModulesActive: (state, action: PayloadAction<Modules>) => {
      state.modulesActive = action.payload;
    },
    removeModulesActive: state => {
      state.modulesActive = null;
    },
  },
});

export const { setModulesActive, removeModulesActive } = modulesSlice.actions;
