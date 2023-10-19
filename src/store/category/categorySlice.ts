import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';

export interface CategoryState {
    categoryActive: Category | null;
}

const initialState: CategoryState = {
    categoryActive: null,
}

export const categorySlice = createSlice({
    name: 'Categories',
    initialState,
    reducers: {
        setCategoryACtive: (state, action: PayloadAction<Category>) => {
            state.categoryActive = action.payload;
        },
        removeCategoryActive: (state) => {
            state.categoryActive = null;
        }
    },
})

export const {
    setCategoryACtive,
    removeCategoryActive } = categorySlice.actions
