import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authSliceReducer from './slices/authSlice';
import cartSliceReducer from './slices/cartSlice';

const store = configureStore({
    reducer: {
        // 1. AQUI: Conectamos a API no Redux
        [apiSlice.reducerPath]: apiSlice.reducer,

        // Seus outros reducers (Login, Carrinho)
        auth: authSliceReducer,
        cart: cartSliceReducer,
    },
    // 2. AQUI: O Middleware é OBRIGATÓRIO para o useGetProductsQuery funcionar
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;