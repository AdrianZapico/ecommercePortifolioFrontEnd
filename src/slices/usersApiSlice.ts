import { apiSlice } from './apiSlice';
// Não precisamos mais importar a constante, pois vamos escrever direto para evitar erros
// import { USERS_URL } from '../constants'; 

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: '/api/users/auth', // Caminho direto e seguro
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: '/api/users', // Caminho direto
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/api/users/logout',
                method: 'POST',
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: '/api/users/profile',
                method: 'PUT',
                body: data,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useProfileMutation,
} = usersApiSlice;