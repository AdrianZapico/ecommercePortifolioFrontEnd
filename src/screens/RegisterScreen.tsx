import { useState, useEffect, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setCredentials } from '../slices/authSlice';
import type { RootState } from '../store';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Importando ícones para feedback visual

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // --- NOVOS ESTADOS PARA VALIDAÇÃO DE SENHA ---
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [validations, setValidations] = useState({
        minLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSymbol: false,
    });
    // ---------------------------------------------

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state: RootState) => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    // --- FUNÇÃO QUE VALIDA A SENHA EM TEMPO REAL ---
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);

        setValidations({
            minLength: val.length >= 8,
            hasUpper: /[A-Z]/.test(val),
            hasLower: /[a-z]/.test(val),
            hasNumber: /[0-9]/.test(val),
            hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(val),
        });
    };
    // -----------------------------------------------

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();

        // Verificação Final antes de enviar
        const allValid = Object.values(validations).every(Boolean);

        if (!allValid) {
            toast.error('A senha não atende aos requisitos de segurança');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não conferem');
            return;
        }

        try {
            const { data } = await axios.post('/api/users', { name, email, password });
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

                    {/* --- CAMPO DE SENHA COM VALIDAÇÃO VISUAL --- */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={handlePasswordChange}
                            onFocus={() => setPasswordFocus(true)}
                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-slate-500 ${password && !Object.values(validations).every(Boolean) ? 'border-red-500' : ''
                                }`}
                            required
                        />

                        {/* Lista de requisitos que aparece quando o usuário digita */}
                        {passwordFocus && (
                            <div className="mt-2 text-sm bg-slate-50 p-3 rounded border border-slate-200 transition-all">
                                <p className="font-bold text-gray-600 mb-2">Sua senha deve conter:</p>
                                <ul className="space-y-1">
                                    <li className={`flex items-center ${validations.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                                        {validations.minLength ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />} Mínimo 8 caracteres
                                    </li>
                                    <li className={`flex items-center ${validations.hasUpper ? 'text-green-600' : 'text-gray-500'}`}>
                                        {validations.hasUpper ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />} Letra Maiúscula
                                    </li>
                                    <li className={`flex items-center ${validations.hasLower ? 'text-green-600' : 'text-gray-500'}`}>
                                        {validations.hasLower ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />} Letra Minúscula
                                    </li>
                                    <li className={`flex items-center ${validations.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                                        {validations.hasNumber ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />} Número
                                    </li>
                                    <li className={`flex items-center ${validations.hasSymbol ? 'text-green-600' : 'text-gray-500'}`}>
                                        {validations.hasSymbol ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />} Símbolo (!@#$...)
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    {/* ------------------------------------------- */}

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
                        // Desabilita o botão se a senha não for forte
                        disabled={!Object.values(validations).every(Boolean)}
                        className={`w-full font-bold py-3 px-4 rounded transition
                ${Object.values(validations).every(Boolean)
                                ? 'bg-slate-800 text-white hover:bg-slate-700'
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
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