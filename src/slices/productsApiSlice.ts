import { apiSlice } from './apiSlice';
import { PRODUCTS_URL, UPLOAD_URL } from '../constants'; // Certifique-se que constants existe, ou use strings diretas

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Busca todos os produtos (já existia, mas reforçamos aqui)
        getProducts: builder.query({
            query: ({ keyword, pageNumber }) => ({
                url: '/api/products',
                params: {
                    keyword,
                    pageNumber,
                },
            }),
            providesTags: ['Product'],
            keepUnusedDataFor: 5,
        }),
        // 👇 CRIAÇÃO DE PRODUTO (ADMIN)
        createProduct: builder.mutation({
            query: () => ({
                url: '/api/products',
                method: 'POST',
            }),
            invalidatesTags: ['Product'], // Força a lista a atualizar sozinha
        }),
        // 👇 DELETAR PRODUTO (ADMIN)
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `/api/products/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
        // 👇 UPLOAD DE IMAGEM
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `/api/upload`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
    useUploadProductImageMutation,
} = productsApiSlice;