import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PRODUCTS_URL } from '../constants'; // Importa as constantes para manter a organização

export const apiSlice = createApi({
    // 1. O LINK CERTO (Render)
    baseQuery: fetchBaseQuery({ baseUrl: 'https://ecommerceportifolio.onrender.com' }),

    tagTypes: ['Product', 'Order', 'User'],

    // 2. A LÓGICA DOS PRODUTOS (Que estava faltando)
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ keyword, pageNumber }) => ({
                url: '/api/products', // Endpoint direto
                params: { keyword, pageNumber },
            }),
            keepUnusedDataFor: 5,
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `/api/products/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

// 3. EXPORTAÇÃO OBRIGATÓRIA DOS HOOKS
// Sem isso, o HomeScreen não consegue usar a função
export const { useGetProductsQuery, useGetProductDetailsQuery } = apiSlice;