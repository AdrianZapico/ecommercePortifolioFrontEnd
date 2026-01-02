import { configureStore } from '@reduxjs/toolkit';
import cartSliceReducer from './slices/cartSlice';

const store = configureStore({
    reducer: {
        cart: cartSliceReducer,
    },
});

// Tipos para usar no TypeScript depois
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;