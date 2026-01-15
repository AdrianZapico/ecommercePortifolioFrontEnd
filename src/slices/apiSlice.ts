import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';




export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'https://ecommerceportifolio.onrender.com' }),
    tagTypes: ['Product', 'Order', 'User'], // Define os tipos de dados para cache
    endpoints: (builder) => ({}), // Os endpoints serão injetados pelos outros arquivos
});