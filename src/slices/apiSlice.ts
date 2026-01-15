import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://ecommerceportifolio.onrender.com',
        // 👇 AQUI ESTÁ A MÁGICA:
        // Isso obriga o navegador a enviar o cookie de login para o Render
        credentials: 'include',
    }),
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

        // 3. Busca destaques
        getTopProducts: builder.query({
            query: () => ({
                url: '/api/products/top',
            }),
            keepUnusedDataFor: 5,
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useGetTopProductsQuery
} = apiSlice;