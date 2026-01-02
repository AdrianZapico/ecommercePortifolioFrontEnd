import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/types";

interface AuthState {
    userInfo: User | null;
}

// Tenta pegar o usuário do LocalStorage ao iniciar
const initialState: AuthState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')!)
        : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Ação de Login: Salva no Redux e no LocalStorage
        setCredentials: (state, action: PayloadAction<User>) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        // Ação de Logout: Limpa tudo
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;