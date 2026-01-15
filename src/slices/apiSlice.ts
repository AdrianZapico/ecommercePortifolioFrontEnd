import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants'; // Pode deixar o import, mas não vamos usar

export const apiSlice = createApi({
    // AQUI ESTÁ O SEGREDO: O link completo e direto ("Hardcoded")
    baseQuery: fetchBaseQuery({ baseUrl: 'https://ecommerceportifolio.onrender.com' }),

    tagTypes: ['Product', 'Order', 'User'],
    endpoints: (builder) => ({}),
});