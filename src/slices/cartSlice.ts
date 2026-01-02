import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../types/types";

// Definimos como será o item do carrinho (Produto + Quantidade)
export interface CartItem extends Product {
    qty: number;
}

interface CartState {
    cartItems: CartItem[];
    itemsPrice: string;
    shippingPrice: string;
    taxPrice: string;
    totalPrice: string;
}

// Tenta pegar do LocalStorage ou começa vazio
const initialState: CartState = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")!)
    : { cartItems: [], itemsPrice: "0", shippingPrice: "0", taxPrice: "0", totalPrice: "0" };

// --- FUNÇÕES AUXILIARES ---

// 1. Arredonda para 2 casas decimais
const addDecimals = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

// 2. O PULO DO GATO: Função centralizada de cálculo de preço
// Sempre que o carrinho mudar, chamamos essa função para atualizar totais e localStorage
const updateCartPrices = (state: CartState) => {
    // A. Preço dos itens
    const itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );
    state.itemsPrice = addDecimals(itemsPrice);

    // B. Frete: Se pedido > R$ 100, frete grátis. Senão R$ 10.
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    state.shippingPrice = addDecimals(shippingPrice);

    // C. Imposto (exemplo 15%)
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    state.taxPrice = addDecimals(taxPrice);

    // D. Total Final
    state.totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    // E. Salva no LocalStorage
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
                // Se já existe, atualiza apenas a quantidade
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                // Se não existe, adiciona no array
                state.cartItems = [...state.cartItems, item];
            }

            // Chama a função auxiliar para recalcular tudo
            updateCartPrices(state);
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            // Filtra o array removendo o item com o ID recebido
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

            // Chama a função auxiliar para recalcular tudo
            updateCartPrices(state);
        },
    },
});

// Exportamos as duas ações
export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;