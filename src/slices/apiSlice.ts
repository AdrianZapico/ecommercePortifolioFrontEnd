import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const baseQuery = fetchBaseQuery({ baseUrl: 'https://ecommerceportifolio.onrender.com' });

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Product', 'Order', 'User'], // Define os tipos de dados para cache
    endpoints: (builder) => ({}), // Os endpoints serão injetados pelos outros arquivos
});