import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // --- AUTENTICAÇÃO BÁSICA ---
        login: builder.mutation({
            query: (data) => ({
                url: '/api/users/auth',
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: '/api/users',
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
        // Atualizar o PRÓPRIO perfil
        profile: builder.mutation({
            query: (data) => ({
                url: '/api/users/profile',
                method: 'PUT',
                body: data,
            }),
        }),

        // --- ÁREA ADMINISTRATIVA (NOVO) ---

        // 1. Buscar todos os usuários (Resolve o erro do .map na tabela)
        getUsers: builder.query({
            query: () => ({
                url: '/api/users',
            }),
            providesTags: ['User'], // Cria uma "etiqueta" para o cache
            keepUnusedDataFor: 5,
        }),

        // 2. Deletar usuário
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/api/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'], // Força a atualização da lista após deletar
        }),

        // 3. Pegar detalhes de um usuário (para edição)
        getUserDetails: builder.query({
            query: (userId) => ({
                url: `/api/users/${userId}`,
            }),
            keepUnusedDataFor: 5,
        }),

        // 4. Atualizar usuário (como Admin)
        updateUser: builder.mutation({
            query: (data) => ({
                url: `/api/users/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'], // Atualiza lista e detalhes
        }),
    }),
});

// Exportando TODOS os hooks (Básicos + Admin)
export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useProfileMutation,
    useGetUsersQuery,       // <--- Novo
    useDeleteUserMutation,  // <--- Novo
    useGetUserDetailsQuery, // <--- Novo
    useUpdateUserMutation,  // <--- Novo
} = usersApiSlice;