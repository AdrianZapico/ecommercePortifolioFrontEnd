import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://ecommerceportifolio.onrender.com',
        credentials: 'include',
    }),
    tagTypes: ['Product', 'Order', 'User'],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ keyword, pageNumber }) => ({
                url: '/api/products',
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