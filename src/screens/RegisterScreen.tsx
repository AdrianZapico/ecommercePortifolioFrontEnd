import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useRegisterMutation } from '../slices/usersApiSlice'; // <--- Hook de Registro
import { setCredentials } from '../slices/authSlice';       // <--- Ação de salvar login

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading, error }] = useRegisterMutation();

    const { userInfo } = useSelector((state: any) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e: any) => {
        e.preventDefault();

        // 1. Validação local: Senhas conferem?
        if (password !== confirmPassword) {
            setMessage('As senhas não conferem');
            return;
        } else {
            setMessage(null);
        }

        try {
            // 2. Tenta registrar no servidor Render
            const res = await register({ name, email, password }).unwrap();

            // 3. Se der certo, já faz o login automático
            dispatch(setCredentials({ ...res }));
            navigate(redirect);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[50vh] mt-10">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-6">Cadastrar</h1>

                {/* Exibe erro de senhas diferentes OU erro do servidor */}
                {message && <Message variant='danger'>{message}</Message>}
                {error && (
                    <Message variant='danger'>
                        {(error as any)?.data?.message || (error as any)?.error || 'Erro no registro'}
                    </Message>
                )}

                {isLoading && <Loader />}

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="name">
                            Nome
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Digite seu nome"
                            className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-slate-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Digite seu email"
                            className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-slate-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">
                            Senha
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Digite sua senha"
                            className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-slate-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirmar Senha
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirme sua senha"
                            className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-slate-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded hover:bg-slate-700 transition duration-300"
                        disabled={isLoading}
                    >
                        Registrar
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-slate-600">
                        Já tem uma conta?{' '}
                        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-blue-600 hover:text-blue-800 font-bold">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;