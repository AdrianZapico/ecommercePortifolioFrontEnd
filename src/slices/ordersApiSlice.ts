import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants'; // Ou use as strings diretas se preferir

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: '/api/orders',
                method: 'POST',
                body: { ...order },
            }),
        }),
        getOrderDetails: builder.query({
            query: (id) => ({
                url: `/api/orders/${id}`,
            }),
            keepUnusedDataFor: 5,
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `/api/orders/${orderId}/pay`,
                method: 'PUT',
                body: { ...details },
            }),
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: '/api/orders/myorders',
            }),
            keepUnusedDataFor: 5,
        }),
        // 👇 ADICIONE ESTA PARTE NOVA 👇
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `/api/orders/${orderId}/deliver`,
                method: 'PUT',
            }),
        }),
        // 👆 FIM DA PARTE NOVA 👆
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetMyOrdersQuery,
    useDeliverOrderMutation, // <--- Não esqueça de exportar o hook novo
} = ordersApiSlice;