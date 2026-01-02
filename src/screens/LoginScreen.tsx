import { useState, useEffect, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../slices/authSlice';
import type { RootState } from '../store';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Para mostrar erros na tela

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Lógica para saber para onde ir depois de logar (ex: voltar pro carrinho)
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    // Pega o usuário atual do Redux
    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // Se já estiver logado, redireciona imediatamente
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        setError(''); // Limpa erros antigos

        try {
            // 1. Faz o POST para o backend
            const { data } = await axios.post('/api/users/auth', { email, password });

            // 2. Se der certo, salva no Redux
            dispatch(setCredentials(data));

            // 3. Redireciona
            navigate(redirect);
        } catch (err: any) {
            // Pega a mensagem de erro do backend ou usa uma genérica
            const message = err.response?.data?.message || err.message;
            setError(message);
        }
    };

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">Login</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800 transition"
                    >
                        Entrar
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Novo cliente?{' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-slate-900 font-bold hover:underline">
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;