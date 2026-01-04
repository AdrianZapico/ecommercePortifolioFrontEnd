import { useState, useEffect, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setCredentials } from '../slices/authSlice';
import type { RootState } from '../store';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state: RootState) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    // Se já estiver logado, redireciona
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();

        // Validação básica de senha
        if (password !== confirmPassword) {
            toast.error('As senhas não conferem');
            return;
        }

        try {
            // Faz o POST para criar o usuário
            const { data } = await axios.post('/api/users', { name, email, password });

            // Salva os dados do usuário (e o token) no Redux/LocalStorage
            dispatch(setCredentials({ ...data }));

            navigate(redirect);
            toast.success('Cadastro realizado com sucesso!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="container mx-auto mt-10 px-4 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">Criar Conta</h1>

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Nome</label>
                        <input
                            type="text"
                            placeholder="Digite seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Confirmar Senha</label>
                        <input
                            type="password"
                            placeholder="Confirme sua senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white font-bold py-3 px-4 rounded hover:bg-slate-700 transition"
                    >
                        Registrar
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Já tem uma conta?{' '}
                        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-slate-800 font-bold hover:underline">
                            Faça Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;