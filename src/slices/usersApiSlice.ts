import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
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
        profile: builder.mutation({
            query: (data) => ({
                url: '/api/users/profile',
                method: 'PUT',
                body: data,
            }),
        }),

        getUsers: builder.query({
            query: () => ({
                url: '/api/users',
            }),
            providesTags: ['User'],
            keepUnusedDataFor: 5,
        }),

        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/api/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),

        getUserDetails: builder.query({
            query: (userId) => ({
                url: `/api/users/${userId}`,
            }),
            keepUnusedDataFor: 5,
        }),

        updateUser: builder.mutation({
            query: (data) => ({
                url: `/api/users/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} = usersApiSlice;