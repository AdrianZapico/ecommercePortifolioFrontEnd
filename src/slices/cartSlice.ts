import { createSlice } from '@reduxjs/toolkit';

// Tenta pegar do localStorage ou inicia vazio
const initialState = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart') as string)
    : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x: any) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x: any) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            // Recalcula totais (Lógica simplificada)
            state.itemsPrice = state.cartItems.reduce((acc: any, item: any) => acc + item.price * item.qty, 0);
            state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
            state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2));
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            ).toFixed(2);

            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x: any) => x._id !== action.payload);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        // AQUI ESTÁ A FUNÇÃO QUE FALTAVA:
        clearCartItems: (state) => {
            state.cartItems = [];
            localStorage.setItem('cart', JSON.stringify(state));
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems // <--- Agora ela existe!
} = cartSlice.actions;

export default cartSlice.reducer;