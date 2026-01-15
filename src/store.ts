import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authReducer from './slices/authSlice'; // Se tiver authSlice
import cartSliceReducer from './slices/cartSlice'; // Se tiver cartSlice

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        // Adicione seus outros reducers aqui se existirem:
        auth: authReducer,
        cart: cartSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;