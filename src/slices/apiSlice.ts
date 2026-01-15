import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

export const apiSlice = createApi({
    // Conexão com o Render
    baseQuery: fetchBaseQuery({ baseUrl: 'https://ecommerceportifolio.onrender.com' }),

    tagTypes: ['Product', 'Order', 'User'],

    endpoints: (builder) => ({
        // 1. Busca lista de produtos
        getProducts: builder.query({
            query: ({ keyword, pageNumber }) => ({
                url: '/api/products',
                params: { keyword, pageNumber },
            }),
            keepUnusedDataFor: 5,
        }),

        // 2. Busca detalhes
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `/api/products/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),

        // 3. NOVO: Busca os produtos em destaque (Isso corrige o erro vermelho)
        getTopProducts: builder.query({
            query: () => ({
                url: '/api/products/top',
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

// Exportamos o hook novo 'useGetTopProductsQuery' aqui embaixo
export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useGetTopProductsQuery
} = apiSlice;