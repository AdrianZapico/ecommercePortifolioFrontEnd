import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../types/types";

export interface CartItem extends Product {
    qty: number;
}

// 1. Definimos o tipo do Endereço
export interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

interface CartState {
    cartItems: CartItem[];
    shippingAddress: ShippingAddress; // <--- 2. Adicionado aqui
    paymentMethod: string;
    itemsPrice: string;
    shippingPrice: string;
    taxPrice: string;
    totalPrice: string;
}

const initialState: CartState = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")!)
    : {
        cartItems: [],
        shippingAddress: {}, // Começa vazio
        paymentMethod: 'PayPal',
        itemsPrice: "0", shippingPrice: "0", taxPrice: "0", totalPrice: "0"
    };

const addDecimals = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

const updateCartPrices = (state: CartState) => {
    const itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );
    state.itemsPrice = addDecimals(itemsPrice);

    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    state.shippingPrice = addDecimals(shippingPrice);

    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    state.taxPrice = addDecimals(taxPrice);

    state.totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    localStorage.setItem("cart", JSON.stringify(state));
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            updateCartPrices(state);
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            updateCartPrices(state);
        },
        // 3. Nova ação para salvar endereço
        saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
            state.shippingAddress = action.payload;
            updateCartPrices(state); // Salva no LocalStorage
        }
    },
});

export const { addToCart, removeFromCart, saveShippingAddress } = cartSlice.actions;
export default cartSlice.reducer;