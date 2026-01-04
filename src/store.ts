import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice'; // <--- Importe isso
import authSliceReducer from './slices/authSlice';
import cartSliceReducer from './slices/cartSlice'; // Assumindo que você tem esse

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer, // <--- Adicione isso
        cart: cartSliceReducer,
        auth: authSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware), // <--- Adicione isso
    devTools: true,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;