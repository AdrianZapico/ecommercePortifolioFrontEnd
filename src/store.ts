import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authSliceReducer from './slices/authSlice'; // Se tiver auth, mantenha

const store = configureStore({
    reducer: {
        // 1. AQUI: Conecta a API no Redux
        [apiSlice.reducerPath]: apiSlice.reducer,

        // Seus outros reducers
        cart: cartSliceReducer,
        auth: authSliceReducer,
    },
    // 2. AQUI ESTÁ O SEGREDO QUE FALTA:
    // Sem isso, o isLoading nunca funciona e o data vem vazio
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;